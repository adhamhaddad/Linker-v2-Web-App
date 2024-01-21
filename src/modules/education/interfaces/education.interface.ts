export interface IEducation {
  id: number;
  uuid: string;
  name: string;
  title: string;
  degree: string;
  start_date: Date;
  end_date: Date | null;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}
