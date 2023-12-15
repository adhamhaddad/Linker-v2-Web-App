import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IUser } from '../interfaces/user.interface';
import { Gender } from 'src/constants';
import { Address } from 'src/modules/address/entities/address.entity';
import { About } from 'src/modules/about/entities/about.entity';
import { Phone } from 'src/modules/phone/entities/phone.entity';
import { Education } from 'src/modules/education/entities/education.entity';
import { Job } from 'src/modules/job/entities/job.entity';
import { ProfilePicture } from 'src/modules/profile-picture/entities/profile-picture.entity';
import { FriendRequest } from 'src/modules/friends/entities/friend-request.entity';
import { Friend } from 'src/modules/friends/entities/friend.entity';
import { Relationship } from 'src/modules/relationships/entities/relationship.entity';
import { RelationshipRequest } from 'src/modules/relationships/entities/relationship-request.entity';
import { Visitor } from 'src/modules/visitor/entities/visitor.entity';

@Entity({ name: 'users' })
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middle_name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  last_name: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  gender: Gender;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 96, nullable: true })
  salt: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  email_verified_at: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deleted_at: Date;

  @OneToOne(() => Address, (address) => address.user)
  address: Address;

  @OneToOne(() => About, (about) => about.user)
  about: About;

  @OneToMany(() => Phone, (phone) => phone.user)
  phone: Phone;

  @OneToMany(() => Education, (education) => education.user)
  education: Education;

  @OneToMany(() => Job, (job) => job.user)
  job: Job;

  @OneToMany(() => ProfilePicture, (profilePicture) => profilePicture.user)
  profilePicture: ProfilePicture;

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.requester)
  @JoinColumn({ name: 'requester_id' })
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.recipient)
  @JoinColumn({ name: 'recipient_id' })
  receivedFriendRequests: FriendRequest[];

  @OneToMany(() => Friend, (friend) => friend.user1)
  user1Friends: Friend[];

  @OneToMany(() => Friend, (friend) => friend.user2)
  user2Friends: Friend[];

  @OneToMany(
    () => RelationshipRequest,
    (relationRequest) => relationRequest.requester,
  )
  @JoinColumn({ name: 'requester_id' })
  sentRelationshipRequests: RelationshipRequest[];

  @OneToMany(
    () => RelationshipRequest,
    (relationRequest) => relationRequest.recipient,
  )
  @JoinColumn({ name: 'recipient_id' })
  receivedRelationshipRequests: RelationshipRequest[];

  @OneToMany(() => Relationship, (relationship) => relationship.user1)
  user1Relations: Relationship[];

  @OneToMany(() => Relationship, (relationship) => relationship.user2)
  user2Relations: Relationship[];

  @OneToMany(() => Visitor, (visitor) => visitor.visitor)
  visitors: Visitor[];

  @OneToMany(() => Visitor, (visitor) => visitor.recipient)
  recipients: Visitor[];
}
