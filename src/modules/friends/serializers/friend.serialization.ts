import { Expose, Type, plainToClass } from 'class-transformer';
import { UserSerialization } from 'src/modules/user/serializers/user.serialization';

export class FriendSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Type(() => UserSerialization)
  @Expose({ name: 'user' })
  user: UserSerialization;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  static serializeUser(user) {
    return plainToClass(UserSerialization, user, {
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
