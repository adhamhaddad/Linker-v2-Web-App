import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GroupStatusType } from '../interfaces/group.interface';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  rules: string;

  @IsEnum(GroupStatusType)
  status: GroupStatusType;

  // @IsArray()
  // tags: string;
}
