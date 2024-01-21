export enum MultiRelationType {
  SINGLE = 'single',
  IN_RELATION = 'in relation',
  ENGAGED = 'engaged',
  MARRIED = 'married',
  FRIEND = 'friend',
  FAMILY = 'family',
  COLLEAGUE = 'colleague',
}
export enum SingleRelationshipType {
  SINGLE = 'single',
  IN_RELATION = 'in relation',
  ENGAGED = 'engaged',
  MARRIED = 'married',
}

export interface IRelationship {
  id: number;
  uuid: string;
  relation: MultiRelationType | SingleRelationshipType;
  is_verified: boolean;
  start_date: Date;
  end_date: Date | null;
  created_at: Date;
  updated_at: Date;
}
