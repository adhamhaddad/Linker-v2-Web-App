import { PartialType } from '@nestjs/mapped-types';
import { CreateRelationshipDto } from './create-relationship.dto';
import { Exclude } from 'class-transformer';

export class UpdateRelationshipDto extends PartialType(CreateRelationshipDto) {
  @Exclude()
  recipientId: string;

  @Exclude()
  recipient_id: string;
}
