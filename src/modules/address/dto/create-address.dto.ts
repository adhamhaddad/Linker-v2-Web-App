import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @Expose({ name: 'country' })
  country: string;

  @IsString()
  @Expose({ name: 'city' })
  city: string;
}
