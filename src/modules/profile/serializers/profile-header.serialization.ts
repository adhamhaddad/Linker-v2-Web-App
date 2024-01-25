import { Expose, Type } from 'class-transformer';
import { CoverPictureSerialization } from 'src/modules/cover-picture/serializers/cover.serialization';
import { ProfilePictureSerialization } from 'src/modules/profile-picture/serializers/profile.serialization';

export class ProfileHeaderSerialization {
  @Type(() => ProfilePictureSerialization)
  @Expose({ name: 'profilePicture' })
  profileImage: ProfilePictureSerialization | null;

  @Type(() => CoverPictureSerialization)
  @Expose({ name: 'coverPicture' })
  coverImage: CoverPictureSerialization | null;
}
