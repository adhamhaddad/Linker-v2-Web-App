import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../entities/address.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { User } from '../../user/entities/user.entity';
import { plainToClass } from 'class-transformer';
import { AddressSerialization } from '../serializers/address.serialization';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly i18nService: I18nService,
  ) {}

  async createAddress(
    createAddressDto: CreateAddressDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const checkAddress = await this.addressRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (checkAddress)
      throw new HttpException(
        errorMessage.addressExist,
        HttpStatus.NOT_ACCEPTABLE,
      );

    const { profile } = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['profile'],
    });
    if (!profile)
      throw new HttpException(errorMessage.userNotFound, HttpStatus.NOT_FOUND);

    const addressCreated = this.addressRepository.create({
      user: user,
      profile: profile,
      ...createAddressDto,
    });
    const address = await this.addressRepository.save(addressCreated);

    return {
      message: errorMessage.addressCreatedSuccessfully,
      data: this.serializeAddress(address),
    };
  }

  async updateAddress(
    id: string,
    updateAddressDto: UpdateAddressDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const address = await this.getAddressById(user, id, lang);
    if (!address)
      throw new HttpException(
        errorMessage.addressNotFound,
        HttpStatus.NOT_FOUND,
      );

    const { affected } = await this.addressRepository.update(
      {
        uuid: id,
      },
      updateAddressDto,
    );
    if (!affected)
      throw new HttpException(
        errorMessage.failedToUpdateAddress,
        HttpStatus.BAD_REQUEST,
      );

    const updatedAddress = await this.getAddressById(user, id, lang);

    return {
      message: errorMessage.addressCreatedSuccessfully,
      data: this.serializeAddress(updatedAddress),
    };
  }

  async getAddressById(user: User, uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const address = await this.addressRepository.findOne({
      where: { uuid, user: { id: user.id } },
    });
    if (!address)
      throw new HttpException(
        errorMessage.addressNotFound,
        HttpStatus.NOT_FOUND,
      );

    return address;
  }

  serializeAddress(address) {
    return plainToClass(AddressSerialization, address, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
