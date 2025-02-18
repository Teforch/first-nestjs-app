import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { TwitsService } from './twits.service';
import { CurrentUser } from '../shared/decorators/user.decorator';
import { TwitDto } from './dto/twits.dto';
import { Auth } from '../shared/decorators/auth.decorator';

@Controller('twits')
export class TwitsController {
  constructor(private readonly twitsService: TwitsService) {}

  @Get()
  async getTwits() {
    return this.twitsService.getTwits();
  }

  @Get(':id')
  async getTwitById(@Param('id') id: string) {
    return this.twitsService.getTwitById(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post('new')
  async createTwit(@Body() dto: TwitDto, @CurrentUser('id') userId: string) {
    return this.twitsService.createTwit(dto, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async deleteTwit(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.twitsService.deleteTwit(id, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Patch(':id')
  async updateTwit(
    @Body() dto: TwitDto,
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
    return this.twitsService.updateTwit(dto, id, userId);
  }
}
