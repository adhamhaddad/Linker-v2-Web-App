import {
  IsString,
  IsNotEmpty,
  IsEmail,
  ValidateIf,
  IsEnum,
} from 'class-validator';
import { EmailSource } from 'src/constants/email-source';

export class EmailPhoneExistDto {
  @IsString()
  @IsEnum(EmailSource)
  @IsNotEmpty()
  source: EmailSource;

  @ValidateIf((object) => object.source === EmailSource.EMAIL)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
