import { Expose, plainToClass } from 'class-transformer';
import { GetUserSerialization } from 'src/modules/user/serializers/get-user.serialization';

export class FriendSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'user' })
  user: GetUserSerialization;

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

  static getOtherUser(friend: any, uuid: string) {
    return friend.user1.uuid === uuid
      ? this.serializeUser(friend.user2)
      : this.serializeUser(friend.user1);
  }
}
