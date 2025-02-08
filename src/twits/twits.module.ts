import { Module } from '@nestjs/common';
import { TwitsService } from './twits.service';
import { TwitsController } from './twits.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [TwitsController],
  providers: [TwitsService, DatabaseService]
})
export class TwitsModule {}
