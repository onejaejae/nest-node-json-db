import { IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  authorId: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  constructor(authorId: string, title: string, content: string) {
    this.authorId = authorId;
    this.title = title;
    this.content = content;
  }
}
