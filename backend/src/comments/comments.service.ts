import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(private db: DatabaseService) {}

  async createComment(dto: CommentDto, userId: string, twitId: string) {
    const twit = await this.db.twit.findUnique({
      where: { id: twitId }
    });
    if (!twit) throw new NotFoundException('Twit not found');

    return this.db.comment.create({
      data: {
        content: dto.content,
        twitId,
        userId
      }
    });
  }

  async updateComment(dto: CommentDto, id: string, userId: string) {
    await this.validateCommentActions(id, userId);
    return this.db.comment.update({
      where: { id },
      data: {
        content: dto.content
      }
    });
  }

  async deleteComment(id: string, userId: string) {
    await this.validateCommentActions(id, userId);
    await this.db.comment.delete({ where: { id } });
    return { message: 'Comment deleted successfully' };
  }

  private async validateCommentActions(id: string, userId: string) {
    const comment = await this.db.comment.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId)
      throw new UnauthorizedException('You are not the owner of this comment');

    return;
  }
}
