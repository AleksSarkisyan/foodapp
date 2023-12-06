import { Module } from '@nestjs/common';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      socket: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379'),
      },
      //ttl: 600000 // 10 minutes in miliseconds
      ttl: 30000 // for testing refresh token
    }),
  ],
})
export class RedisModule { }
