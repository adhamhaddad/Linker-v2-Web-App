export interface IAddress {
  id: number;
  uuid: string;
  country: string;
  city: string;
  created_at: Date;
  updated_at: Date | null;
}
