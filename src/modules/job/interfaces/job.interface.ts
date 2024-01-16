export class IJob {
  id: number;
  uuid: string;
  provider: string;
  title: string;
  start_date: Date;
  end_date: Date | null;
  created_at: Date;
  updated_at: Date;
}
