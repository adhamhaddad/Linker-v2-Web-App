import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Relationship } from '../entities/relationship.entity';
import { Repository } from 'typeorm';
import { CreateRelationshipDto } from '../dto/create-relationship.dto';
import { I18nService } from 'nestjs-i18n';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { User } from 'src/modules/auth/entities/user.entity';
import { UpdateRelationshipDto } from '../dto/update-relationship.dto';
import { RelationshipSerialization } from '../serializers/relationship.serialization';
import { plainToClass } from 'class-transformer';
import { RelationshipRequest } from '../entities/relationship-request.entity';
import { RelationshipRequestService } from './relationship-request.service';

@Injectable()
export class RelationshipService {
  constructor(
    @InjectRepository(Relationship)
    private readonly relationshipRepository: Repository<Relationship>,
    @InjectRepository(RelationshipRequest)
    private readonly relationshipRequestRepository: Repository<RelationshipRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly relationshipRequestService: RelationshipRequestService,
    private readonly i18nService: I18nService,
  ) {}

  async createRelationship(
    createRelationshipDto: CreateRelationshipDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    console.log(createRelationshipDto);

    // Multi Relation if true
    if (createRelationshipDto.recipient_id) {
      console.log('It is a multi relation');
      // Send relationship request
      const { message, data } =
        await this.relationshipRequestService.sendRelationshipRequest(
          createRelationshipDto,
          user,
          lang,
        );
      return { message, data };
    }

    // Single Relation
    const relationshipCreated = this.relationshipRepository.create({
      user1: user,
      relation: createRelationshipDto.relation,
    });
    const relationship = await this.relationshipRepository.save(
      relationshipCreated,
    );

    return {
      message: errorMessage.relationshipCreatedSuccessfully,
      data: this.serializeRelationship(relationship, user.uuid),
    };
  }

  async getRelationships(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const relationships = await this.relationshipRepository.find({
      where: [{ user1: { uuid } }, { user2: { uuid } }],
      relations: ['user1', 'user2'],
    });
    if (relationships.length === 0)
      throw new HttpException(
        errorMessage.noRelationshipsFound,
        HttpStatus.NOT_FOUND,
      );

    return {
      message: 'Relationships Received',
      data: relationships.map((relationship) =>
        this.serializeRelationship(relationship, uuid),
      ),
      total: relationships.length,
      meta: {
        total: relationships.length,
      },
    };
  }

  async updateRelationship(
    uuid: string,
    updateRelationshipDto: UpdateRelationshipDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const relationship = await this.relationshipRepository.findOne({
      where: [
        { uuid, user1: { id: user.id } },
        { uuid, user2: { id: user.id } },
      ],
      relations: ['user1', 'user2'],
    });
    if (!relationship)
      throw new HttpException(errorMessage.userNotFound, HttpStatus.NOT_FOUND);

    // Send a relationship request again
    const { message, data } =
      await this.relationshipRequestService.sendUpdateRelationshipRequest(
        relationship,
        updateRelationshipDto,
        user,
        lang,
      );

    return { message, data };
  }

  async deleteRelationship(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const relationship = await this.relationshipRepository.findOne({
      where: [
        { uuid, user1: { id: user.id } },
        { uuid, user2: { id: user.id } },
      ],
      relations: ['user1', 'user2'],
    });
    if (!relationship)
      throw new HttpException(
        errorMessage.relationshipNotFound,
        HttpStatus.NOT_FOUND,
      );

    const { affected } = await this.relationshipRepository.delete({ uuid });
    if (!affected)
      throw new HttpException(
        errorMessage.failedToDeleteRelationship,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.relationshipDeletedSuccessfully,
      data: this.serializeRelationship(relationship, user.uuid),
    };
  }

  serializeRelationship(relationship, uuid) {
    const relationshipSerialization = plainToClass(
      RelationshipSerialization,
      relationship,
      {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
        strategy: 'excludeAll',
      },
    );

    relationshipSerialization.user = RelationshipSerialization.getOtherUser(
      relationship,
      uuid,
    );
    return relationshipSerialization;
  }
}
