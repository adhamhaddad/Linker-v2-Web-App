import {
  IsString,
  IsNotEmpty,
  IsEmail,
  ValidateIf,
  IsEnum,
  Matches,
} from 'class-validator';
import { EmailPhoneSource } from 'src/constants/email-phone-source';

export class EmailPhoneExistDto {
  @IsString()
  @IsEnum(EmailPhoneSource)
  @IsNotEmpty()
  source: EmailPhoneSource;

  @ValidateIf((object) => object.source === EmailPhoneSource.EMAIL)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ValidateIf((object) => object.source === EmailPhoneSource.PHONE)
  @IsNotEmpty()
  @IsString()
  @Matches(/^(00201|201|\+201|01)(0|1|2|5)([0-9]{7})$/, {
    message: 'Please enter a valid Egyptian phone number',
  })
  phone: string;
}
