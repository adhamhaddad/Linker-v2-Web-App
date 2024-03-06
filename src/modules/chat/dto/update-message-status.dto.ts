import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum MessageStatusEnum {
  IS_DELIVERED = 'isDelivered',
  IS_SEEN = 'isSeen',
}

export class UpdateMessageStatusDto {
  @IsNotEmpty()
  @IsEnum(MessageStatusEnum)
  @Expose({ name: 'status' })
  status: MessageStatusEnum;
}
