import { Injectable } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client';
import type { AuthUser } from '../auth/auth.types';

type Tx = Prisma.TransactionClient;

/** Append-only audit trail. Always call inside the transaction that makes the change. */
@Injectable()
export class AuditService {
  async record(
    tx: Tx,
    actor: AuthUser,
    entry: { entity: string; entityId: string; action: string; before?: unknown; after?: unknown },
  ): Promise<void> {
    await tx.auditLog.create({
      data: {
        orgId: actor.orgId,
        actorId: actor.id,
        entity: entry.entity,
        entityId: entry.entityId,
        action: entry.action,
        before: toJson(entry.before),
        after: toJson(entry.after),
      },
    });
  }
}

function toJson(value: unknown): Prisma.InputJsonValue | undefined {
  return value === undefined
    ? undefined
    : (JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue);
}
