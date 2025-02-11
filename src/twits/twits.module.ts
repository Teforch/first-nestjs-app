import { Module } from '@nestjs/common';
import { TwitsService } from './twits.service';
import { TwitsController } from './twits.controller';
import { DatabaseService } from '../database/database.service';
import { RedisService } from '../redis/redis.service';

@Module({
  controllers: [TwitsController],
  providers: [TwitsService, DatabaseService, RedisService],
  imports: []
})
export class TwitsModule {}
