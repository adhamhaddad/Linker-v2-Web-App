import { IsEnum, IsString } from 'class-validator';

export enum UpdateRequestStatus {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELED = 'canceled',
}
export class UpdateRequestStatusDto {
  @IsString()
  @IsEnum(UpdateRequestStatus)
  status: UpdateRequestStatus;
}
