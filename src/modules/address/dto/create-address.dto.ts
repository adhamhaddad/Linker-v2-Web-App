import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @IsString()
  @Expose({ name: 'country' })
  @ApiProperty()
  country: string;

  @IsString()
  @Expose({ name: 'city' })
  @ApiProperty()
  city: string;
}
