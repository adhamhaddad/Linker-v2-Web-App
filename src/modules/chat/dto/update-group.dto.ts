import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateGroupChatDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  icon: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;
}
