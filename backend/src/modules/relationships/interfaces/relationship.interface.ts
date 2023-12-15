export enum MultiRelationType {
  SINGLE = 'SINGLE',
  IN_RELATION = 'IN_RELATION',
  ENGAGED = 'ENGAGED',
  MARRIED = 'MARRIED',
  FRIEND = 'FRIEND',
  FAMILY = 'FAMILY',
  COLLEAGUE = 'COLLEAGUE',
}
export enum SingleRelationshipType {
  SINGLE = 'SINGLE',
  IN_RELATION = 'IN_RELATION',
  ENGAGED = 'ENGAGED',
  MARRIED = 'MARRIED',
}

export class IRelationship {
  id: number;
  uuid: string;
  relation: MultiRelationType | SingleRelationshipType;
  is_verified: boolean;
  start_date: Date;
  end_date: Date | null;
  created_at: Date;
  updated_at: Date;
}
