import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { ProfileStatus } from '../interfaces/profile.interface';

export class UpdateProfileDto {
  @IsOptional()
  @IsEnum(ProfileStatus)
  @Expose({ name: 'postsStatus' })
  posts_status: ProfileStatus;

  @IsOptional()
  @IsEnum(ProfileStatus)
  @Expose({ name: 'friendsStatus' })
  friends_status: ProfileStatus;

  @IsOptional()
  @IsEnum(ProfileStatus)
  @Expose({ name: 'pagesStatus' })
  pages_status: ProfileStatus;

  @IsOptional()
  @IsEnum(ProfileStatus)
  @Expose({ name: 'groupsStatus' })
  groups_status: ProfileStatus;
}
