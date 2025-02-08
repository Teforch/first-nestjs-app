import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { DatabaseService } from '../database/database.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    public configService: ConfigService,
    private db: DatabaseService
  ) {
    const options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET')
    };
    super(options);
  }

  async validate({ id }: Pick<User, 'id'>) {
    return this.db.user.findUnique({ where: { id } });
  }
}
