import { Expose, Transform } from 'class-transformer';
import { RequestStatus } from 'src/constants/request-status';
import { UserSerialization } from 'src/modules/user/serializers/user.serialization';

export class GetFriendRequestSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'status' })
  status: RequestStatus;

  @Expose({ name: 'user' })
  @Transform(({ obj }) => {
    const user = obj.recipient || obj.requester;
    const userSerialization = new UserSerialization();
    userSerialization.id = user.id;
    userSerialization.profile = user.profilePicture[0]?.image_url || null;
    userSerialization.fullName = `${user.first_name} ${user.last_name}`;
    userSerialization.username = user.username;
    return userSerialization;
  })
  user: UserSerialization;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
