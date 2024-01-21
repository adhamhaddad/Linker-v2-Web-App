export interface IJob {
  id: number;
  uuid: string;
  provider: string;
  title: string;
  start_date: Date;
  end_date: Date | null;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}
