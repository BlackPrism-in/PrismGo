import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

/** Key families whose second segment is the database name, e.g. `prismgo:<db>:outbox:…`. */
const FAMILIES = ['prismgo', 'live'];

/**
 * Queue and live-state keys are namespaced by database name. When the production
 * database is replaced (Render gives the new one a new name), the old namespace is
 * orphaned and keeps filling Redis. In production, remove every namespace except
 * the current database's, and log memory before and after.
 */
@Injectable()
export class RedisJanitorService implements OnModuleInit {
  private readonly logger = new Logger(RedisJanitorService.name);

  constructor(
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (this.config.get('NODE_ENV') !== 'production') return;
    try {
      await this.removeStaleNamespaces();
    } catch (err) {
      this.logger.warn(`Redis cleanup skipped: ${(err as Error).message}`);
    }
  }

  async removeStaleNamespaces(): Promise<number> {
    const db = new URL(this.config.getOrThrow<string>('DATABASE_URL')).pathname.slice(1);
    const before = await this.usedMemory();
    let removed = 0;
    for (const family of FAMILIES) {
      let cursor = '0';
      do {
        const [next, keys] = await this.redis.scan(cursor, 'MATCH', `${family}:*`, 'COUNT', 1000);
        cursor = next;
        const stale = keys.filter((k) => k.split(':')[1] !== db);
        if (stale.length) removed += await this.redis.unlink(...stale);
      } while (cursor !== '0');
    }
    const after = await this.usedMemory();
    this.logger.log(
      `Redis: removed ${removed} keys from old databases; memory ${before} → ${after}`,
    );
    return removed;
  }

  private async usedMemory(): Promise<string> {
    const info = await this.redis.info('memory');
    return /used_memory_human:(\S+)/.exec(info)?.[1] ?? '?';
  }
}
