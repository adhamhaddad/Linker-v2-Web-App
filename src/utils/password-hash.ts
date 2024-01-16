import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PasswordHash {
  generateRandomSalt() {
    return crypto.randomBytes(48).toString('hex');
  }
}
