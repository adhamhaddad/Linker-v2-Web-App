export interface IPhone {
  id: number;
  uuid: string;
  phone: string;
  phone_verified_at: Date;
  created_at: Date;
  updated_at: Date | null;
}
