import { Expose, Transform, Type } from 'class-transformer';

export class ChatParticipantSerialization {
  @Expose({ name: 'uuid' })
  @Transform(({ obj }) => obj.user.uuid)
  id: string;

  @Expose({ name: 'profilePicture' })
  @Transform(({ obj }) => {
    return obj.profilePicture[0]?.image_url || null;
  })
  profile: string;

  @Expose({ name: 'user' })
  @Transform(({ obj }) => `${obj.user.first_name} ${obj.user.last_name}`)
  fullName: string;

  @Expose({ name: 'username' })
  @Transform(({ obj }) => obj.user.username)
  username: string;

  @Expose({ name: 'status' })
  status: string;

  @Expose({ name: 'isArchived' })
  isArchived: boolean;

  @Expose({ name: 'isMuted' })
  isMuted: boolean;
}
