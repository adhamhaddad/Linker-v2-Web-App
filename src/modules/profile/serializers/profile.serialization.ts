import { Expose, Type } from 'class-transformer';
import { GetUserSerialization } from 'src/modules/user/serializers/get-user.serialization';
import { AboutSerialization } from 'src/modules/about/serializers/about.serialization';
import { AddressSerialization } from 'src/modules/address/serializers/address.serialization';
import { EducationSerialization } from 'src/modules/education/serializers/education.serialization';
import { JobSerialization } from 'src/modules/job/serializers/job.serialization';
import { RelationshipSerialization } from 'src/modules/relationships/serializers/relationship.serialization';
import { ProfileConnectionSerialization } from './profile-connection.serialization';
import { ProfileHeaderSerialization } from './profile-header.serialization';
import { ProfileSettingsSerialization } from './profile-settings.serialization';

export class ProfileSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Type(() => ProfileConnectionSerialization)
  @Expose({ name: 'connection' })
  connection: ProfileConnectionSerialization;

  @Type(() => ProfileHeaderSerialization)
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

  @Type(() => RelationshipSerialization)
  @Expose({ name: 'relations' })
  relations: RelationshipSerialization;

  @Type(() => EducationSerialization)
  @Expose({ name: 'education' })
  education: EducationSerialization;

  @Type(() => JobSerialization)
  @Expose({ name: 'jobs' })
  jobs: JobSerialization;

  @Type(() => ProfileSettingsSerialization)
  @Expose({ name: 'settings' })
  settings: ProfileSettingsSerialization;

  @Expose({ name: 'created_at' })
  joined: Date;
}
