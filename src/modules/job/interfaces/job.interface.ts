export enum EmploymentType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  SELF_EMPLOYED = 'self-employed',
  FREE_LANCE = 'freelance',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
}

export enum LocationType {
  ON_SITE = 'on-site',
  HYBRID = 'hybrid',
  REMOTE = 'remote',
}

export interface IJob {
  id: number;
  uuid: string;
  provider: string;
  title: string;
  employment_type: string;
  location: string;
  location_type: LocationType;
  start_date: Date;
  end_date: Date | null;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}
