export interface IPostComment {
  id: number;
  uuid: string;
  comment: string;
  images: string[] | [];
  videos: string[] | [];
  created_at: Date;
  updated_at: Date;
}
