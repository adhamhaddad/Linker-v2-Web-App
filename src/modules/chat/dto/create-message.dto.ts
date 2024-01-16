import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IReplyTo } from '../interfaces/message-reply-to.interface';
import { IForwardedFrom } from '../interfaces/message-forwarded-from.interface';

export class CreateMessageDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(3000)
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsString()
  replyTo: IReplyTo;

  @IsOptional()
  @IsString()
  forwardedFrom: IForwardedFrom;

  @IsOptional()
  attachments?: {
    imageUrl?: string[];
    videoUrl?: string[];
    fileUrl?: string[];
    audioUrl?: string[];
  };
}
