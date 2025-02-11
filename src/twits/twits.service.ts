import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TwitDto } from './dto/twits.dto';
import { Prisma } from '@prisma/client';
import { RedisService } from '../redis/redis.service';

const CACHE_TTL = Number(process.env.CACHE_TTL) || 10; // in seconds

const includeFields: Prisma.TwitInclude = {
  user: {
    select: {
      username: true
    }
  }
};

@Injectable()
export class TwitsService {
  constructor(
    private db: DatabaseService,
    private cacheManager: RedisService
  ) {}

  async getTwits() {
    const cacheKey = 'twits';
    const cachedTwits = await this.cacheManager.get(cacheKey);
    if (cachedTwits) return cachedTwits;

    const twits = await this.db.twit.findMany({
      include: includeFields,
      orderBy: [{ likes: 'desc' }, { createdAt: 'desc' }]
    });

    await this.cacheManager.set(cacheKey, twits, CACHE_TTL);
    return twits;
  }

  async getTwitById(id: string) {
    const cacheKey = `twit:${id}`;
    const cachedTwit = await this.cacheManager.get(cacheKey);
    if (cachedTwit) return cachedTwit;

    const twit = await this.db.twit.findUnique({
      include: {
        ...includeFields,
        comments: {
          select: {
            content: true,
            likes: true,
            createdAt: true,
            user: { select: { username: true } }
          }
        }
      },
      where: {
        id
      }
    });

    if (!twit) throw new NotFoundException('Twit not found');

    await this.cacheManager.set(cacheKey, twit, CACHE_TTL);
    return twit;
  }

  async createTwit(dto: TwitDto, userId: string) {
    const twit = this.db.twit.create({
      data: {
        title: dto.title,
        content: dto.content,
        userId
      },
      include: includeFields
    });

    await this.cacheManager.del('twits');
    return twit;
  }

  async updateTwit(dto: TwitDto, id: string, userId: string) {
    await this.validateTwitActions(id, userId);

    await this.cacheManager.del('twits');

    return this.db.twit.update({
      where: { id },
      data: {
        title: dto.title,
        content: dto.content
      }
    });
  }

  async deleteTwit(id: string, userId: string) {
    await this.validateTwitActions(id, userId);

    await this.db.twit.delete({ where: { id } });
    await this.cacheManager.del('twits');

    return { message: 'Twit deleted successfully' };
  }

  private async validateTwitActions(id: string, userId: string) {
    const twit = await this.db.twit.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!twit) throw new NotFoundException('Twit not found');
    if (twit.userId !== userId)
      throw new UnauthorizedException('You are not the owner of this twit');

    return;
  }
}
