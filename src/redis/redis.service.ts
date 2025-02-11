import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD || undefined
    });

    this.client.on('error', (err) => console.log('Redis Client Error', err));
    this.client.on('connect', () => console.log('Redis Client Connected'));
  }

  async onModuleInit() {
    console.log('🚀 RedisService initialized');
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async get(key: string): Promise<Array<any> | null> {
    const result = await this.client.get(key);
    return typeof result === 'string' ? JSON.parse(result) : null;
  }

  async set(key: string, value: any, ttl = 3600): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
