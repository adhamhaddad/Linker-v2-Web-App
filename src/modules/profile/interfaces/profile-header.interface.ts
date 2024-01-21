import { ICoverPicture } from 'src/modules/cover-picture/interfaces/cover.interface';
import { IProfilePicture } from 'src/modules/profile-picture/interfaces/profile.interface';

export interface IProfileHeader {
  profilePicture: IProfilePicture;
  coverPicture: ICoverPicture;
}
