import { Expose } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ChatType } from '../interfaces/chat.interface';
import { GroupStatus } from '../interfaces/group-details.interface';

export class CreateGroupChatDto {
  @IsArray()
  @IsNotEmpty()
  participants: [{ userId: number }];

  @IsString()
  @IsNotEmpty()
  @IsEnum(ChatType)
  type: ChatType.GROUP;

  @IsString()
  @IsNotEmpty()
  @IsEnum(GroupStatus)
  status: GroupStatus;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  icon: string | null;

  @IsString()
  @IsNotEmpty()
  name: string;
}
