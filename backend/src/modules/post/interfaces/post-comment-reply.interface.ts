export interface IPostCommentReply {
  id: number;
  uuid: string;
  reply: string;
  images: string[] | [];
  videos: string[] | [];
  created_at: Date;
  updated_at: Date;
}
