import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentDto } from './dto/comment.dto';
import { CurrentUser } from '../utils/decorators/user.decorator';
import { Auth } from '../utils/decorators/auth.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post('new/:twitId')
  async createComment(
    @Param('twitId') twitId: string,
    @Body() dto: CommentDto,
    @CurrentUser('id') userId: string
  ) {
    return this.commentsService.createComment(dto, userId, twitId);
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @Patch(':id')
  async updateComment(
    @Param('id') id: string,
    @Body() dto: CommentDto,
    @CurrentUser('id') userId: string
  ) {
    return this.commentsService.updateComment(dto, id, userId);
  }

  @Auth()
  @Delete(':id')
  async deleteComment(
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
    return this.commentsService.deleteComment(id, userId);
  }
}
