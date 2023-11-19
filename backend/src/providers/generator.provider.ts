import { config } from 'dotenv';

config();

export class GeneratorProvider {
  static parsePhoneNumber(phoneNumber: string) {
    if (/^\d+$/.test(phoneNumber)) {
      const countryCode = '+20';
      const phoneCountryCode = phoneNumber && phoneNumber.slice(0, 4);
      if (countryCode != phoneCountryCode && phoneNumber.slice(0, 3) != '20')
        phoneNumber = countryCode + phoneNumber;
      else if (
        countryCode != phoneCountryCode &&
        phoneNumber.slice(0, 3) == '20'
      )
        phoneNumber = countryCode + phoneNumber.slice(3);
    }
    return phoneNumber;
  }
}
