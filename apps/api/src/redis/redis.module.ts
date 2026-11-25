import { Global, Module } from '@nestjs/common';
import { RedisJanitorService } from './redis-janitor.service';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService, RedisJanitorService],
  exports: [RedisService],
})
export class RedisModule {}
