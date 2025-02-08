import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDto {
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsString()
  password: string;

  @MaxLength(16, { message: 'Username must be at most 16 characters long' })
  @IsString()
  username: string;
}
