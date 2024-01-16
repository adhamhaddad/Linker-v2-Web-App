import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PageStatusType } from '../interfaces/page.interface';

export class CreatePageDto {
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(PageStatusType)
  status: PageStatusType;

  // @IsArray()
  // tags: string;
}
