import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CreateDto } from './dto/create.dto';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwt: JwtService
  ) {}

  async register(dto: CreateDto) {
    const existingUser = await this.db.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }]
      }
    });

    if (existingUser) throw new BadRequestException('User already exists');

    const user = await this.db.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        password: await bcrypt.hash(dto.password, 10)
      }
    });

    const tokens = await this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens
    };
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = await this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens
    };
  }

  async getNewTokens(refreshToken: string) {
    const data = await this.jwt.verifyAsync(refreshToken);
    if (!data) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.db.user.findUnique({
      where: { id: data.id }
    });

    if (!user) throw new NotFoundException('User not found');

    const tokens = await this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens
    };
  }

  private async issueTokens(userId: string) {
    const data = { id: userId };
    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h'
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '14d'
    });

    return { accessToken, refreshToken };
  }

  private returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
      username: user.username
    };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.db.user.findUnique({
      where: { email: dto.email }
    });

    if (!user) throw new NotFoundException('User not found');

    const isValid = await bcrypt.compare(dto.password, user.password);

    if (!isValid) throw new UnauthorizedException('Invalid password');

    return user;
  }
}
