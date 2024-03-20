import { GetUserSerialization } from '@modules/user/serializers/get-user.serialization';
import { Expose, Transform, Type, plainToClass } from 'class-transformer';
import { RequestStatus } from 'src/constants/request-status';

export class UpdateFriendRequestSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'status' })
  status: RequestStatus;

  user: any;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  static serializeUser(user) {
    return plainToClass(GetUserSerialization, user, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }

  static getOtherUser(request: any, uuid: string) {
    return request.recipient.uuid === uuid
      ? this.serializeUser(request.requester)
      : this.serializeUser(request.recipient);
  }
}
