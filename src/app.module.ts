import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TwitsModule } from './twits/twits.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ConfigModule.forRoot(),
    TwitsModule,
    RedisModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
