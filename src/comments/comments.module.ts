import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, DatabaseService]
})
export class CommentsModule {}
