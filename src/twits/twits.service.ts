import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TwitDto } from './dto/twits.dto';
import { Prisma } from '@prisma/client';

const includeFields: Prisma.TwitInclude = {
  user: {
    select: {
      username: true
    }
  }
};

@Injectable()
export class TwitsService {
  constructor(private db: DatabaseService) {}

  async getTwits() {
    return this.db.twit.findMany({
      include: includeFields,
      orderBy: [
        {
          likes: 'desc'
        },
        {
          createdAt: 'desc'
        }
      ]
    });
  }

  async getTwitById(id: string) {
    const twit = await this.db.twit.findUnique({
      include: includeFields,
      where: {
        id
      }
    });

    if (!twit) throw new NotFoundException('Twit not found');

    return twit;
  }

  async createTwit(dto: TwitDto, userId: string) {
    return this.db.twit.create({
      data: {
        title: dto.title,
        content: dto.content,
        userId
      },
      include: includeFields
    });
  }

  async updateTwit(dto: TwitDto, id: string, userId: string) {
    const twit = await this.db.twit.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!twit) throw new NotFoundException('Twit not found');
    if (twit.userId !== userId)
      throw new UnauthorizedException('You are not the owner of this twit');

    return this.db.twit.update({
      where: { id },
      data: {
        title: dto.title,
        content: dto.content
      }
    });
  }

  async deleteTwit(id: string, userId: string) {
    const twit = await this.db.twit.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!twit) throw new NotFoundException('Twit not found');
    if (twit.userId !== userId)
      throw new UnauthorizedException('You are not the owner of this twit');

    await this.db.twit.delete({ where: { id } });

    return { message: 'Twit deleted successfully' };
  }
}
