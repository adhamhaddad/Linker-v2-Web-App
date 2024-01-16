import {
  IsString,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsEmail,
  IsDateString,
  IsOptional,
  Matches,
  Validate,
} from 'class-validator';
import { Gender } from 'src/constants';
import { Match } from 'src/decorators/match.decorator';
import { BeforeDateValidator } from '../validators/dateRange.validator';
import { Expose } from 'class-transformer';

export class RegistrationDto {
  @IsString()
  @Expose({ name: 'firstName' })
  first_name: string;

  @IsString()
  @Expose({ name: 'lastName' })
  last_name: string;

  @IsString()
  @Expose({ name: 'username' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Expose({ name: 'email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z]).*$/, {
    message: 'Password must contain alphabet,numbers and special characters',
  })
  @Expose({ name: 'password' })
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Match('password')
  @Expose({ name: 'confirmPassword' })
  confirm_password: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'birthDate must be in YYYY-MM-DD format',
  })
  @Validate(BeforeDateValidator, ['2007-01-01'])
  @Expose({ name: 'birthDate' })
  birth_date: Date;

  @IsString()
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @IsOptional()
  salt: string;
}
