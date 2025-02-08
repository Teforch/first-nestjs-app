import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TwitsModule } from './twits/twits.module';

@Module({
  imports: [DatabaseModule, AuthModule, ConfigModule.forRoot(), TwitsModule],
  controllers: [],
  providers: []
})
export class AppModule {}
