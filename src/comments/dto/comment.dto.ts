import { IsString, MaxLength } from 'class-validator';

export class CommentDto {
  @IsString()
  @MaxLength(150, { message: 'Comment must be at most 150 characters long' })
  content: string;
}
