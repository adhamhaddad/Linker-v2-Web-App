import { Expose, Type } from 'class-transformer';
import { ProfileStatus } from '../interfaces/profile.interface';
import { GetUserSerialization } from 'src/modules/user/serializers/get-user.serialization';
import { ProfilePictureSerialization } from 'src/modules/profile-picture/serializers/profile.serialization';
import { AboutSerialization } from 'src/modules/about/serializers/about.serialization';
import { AddressSerialization } from 'src/modules/address/serializers/address.serialization';
import { EducationSerialization } from 'src/modules/education/serializers/education.serialization';
import { JobSerialization } from 'src/modules/job/serializers/job.serialization';
import { CoverPictureSerialization } from 'src/modules/cover-picture/serializers/cover.serialization';
import { RelationshipSerialization } from 'src/modules/relationships/serializers/relationship.serialization';

export class ProfileHeaderSerialization {
  @Type(() => ProfilePictureSerialization)
  @Expose({ name: 'profilePicture' })
  profileImage: ProfilePictureSerialization | null;

  @Type(() => CoverPictureSerialization)
  @Expose({ name: 'coverPicture' })
  coverImage: CoverPictureSerialization | null;
}

export class ProfileSettingsSerialization {
  @Expose({ name: 'posts_status' })
  postsStatus: ProfileStatus;

  @Expose({ name: 'friends_status' })
  friendsStatus: ProfileStatus;

  @Expose({ name: 'pages_status' })
  pagesStatus: ProfileStatus;

  @Expose({ name: 'groups_status' })
  groupsStatus: ProfileStatus;
}

export class ProfileSerialization {
  @Expose({ name: 'uuid' })
  id: string;

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
