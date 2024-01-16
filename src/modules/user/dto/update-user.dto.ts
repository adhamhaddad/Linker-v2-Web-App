import { Expose } from 'class-transformer';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { Gender } from 'src/constants';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Expose({ name: 'firstName' })
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Expose({ name: 'middleName' })
  middle_name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Expose({ name: 'lastName' })
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Expose({ name: 'gender' })
  gender: Gender;
}
