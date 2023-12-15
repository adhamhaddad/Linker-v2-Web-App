import { Expose, plainToClass } from 'class-transformer';
import { UserSerialization } from 'src/modules/auth/serializers/user.serialization';
import { MultiRelationType } from '../interfaces/relationship.interface';

export class RelationshipSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'user' })
  user: UserSerialization;

  @Expose({ name: 'relation' })
  relation: MultiRelationType;

  @Expose({ name: 'start_date' })
  startDate: Date | null;

  @Expose({ name: 'end_date' })
  endDate: Date | null;

  @Expose({ name: 'is_verified' })
  isVerified: boolean;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  static serializeUser(user) {
    return plainToClass(UserSerialization, user, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }

  static getOtherUser(relation: any, uuid: string) {
    return relation.user2
      ? relation.user1.uuid === uuid
        ? this.serializeUser(relation.user2)
        : this.serializeUser(relation.user1)
      : this.serializeUser(relation.user1);
  }
}
