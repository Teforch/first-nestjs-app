import { IsString, MaxLength, MinLength } from 'class-validator';

export class TwitDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  title: string;

  @IsString()
  @MinLength(5)
  @MaxLength(280)
  text: string;
}
