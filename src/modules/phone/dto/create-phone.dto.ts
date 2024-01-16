import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreatePhoneDto {
  @IsString()
  @IsNotEmpty()
  // @Matches(/^(00201|201|\+201|01)(0|1|2|5)([0-9]{7})$/, {
  //   message: 'Please enter a valid Egyptian phone number',
  // })
  @Matches(/^(01)(0|1|2|5)([0-9]{8})$/, {
    message: 'Please enter a valid Egyptian phone number',
  })
  phone: string;
}
