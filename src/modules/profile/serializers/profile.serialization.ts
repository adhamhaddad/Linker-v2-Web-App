import { Expose, Transform, Type, plainToClass } from 'class-transformer';
import { GetUserSerialization } from 'src/modules/user/serializers/get-user.serialization';
import { AboutSerialization } from 'src/modules/about/serializers/about.serialization';
import { AddressSerialization } from 'src/modules/address/serializers/address.serialization';
import { ProfileConnectionSerialization } from './profile-connection.serialization';
import { ProfileHeaderSerialization } from './profile-header.serialization';
import { ProfileSettingsSerialization } from './profile-settings.serialization';

export class ProfileSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'isMe' })
  isMe: boolean;

  @Type(() => ProfileConnectionSerialization)
  @Expose({ name: 'connection' })
  connection: ProfileConnectionSerialization;

  @Type(() => ProfileHeaderSerialization)
  @Transform(({ obj }) =>
    ProfileSerialization.serializeHeader({
      profilePicture: obj.profilePicture,
      coverPicture: obj.coverPicture,
    }),
  )
  @Expose({ name: 'header' })
  header: ProfileHeaderSerialization;

  @Type(() => GetUserSerialization)
  @Expose({ name: 'user' })
  user: GetUserSerialization;

  @Type(() => AboutSerialization)
  @Expose({ name: 'about' })
  about: AboutSerialization;

  @Type(() => AddressSerialization)
  @Expose({ name: 'address' })
  location: AddressSerialization;

  @Type(() => ProfileSettingsSerialization)
  @Expose({ name: 'settings' })
  settings: ProfileSettingsSerialization;

  @Expose({ name: 'created_at' })
  joined: Date;

  static serializeHeader(header) {
    return plainToClass(ProfileHeaderSerialization, header, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
