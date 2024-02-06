import { Expose, Type, plainToClass } from 'class-transformer';
import { GetUserSerialization } from 'src/modules/user/serializers/get-user.serialization';

export class UserFriendsSerialization {
  @Type(() => GetUserSerialization)
  @Expose({ name: 'user' })
  user: GetUserSerialization;

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
