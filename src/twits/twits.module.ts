import { Module } from '@nestjs/common';
import { TwitsService } from './twits.service';
import { TwitsController } from './twits.controller';

@Module({
  controllers: [TwitsController],
  providers: [TwitsService],
  imports: []
})
export class TwitsModule {}
