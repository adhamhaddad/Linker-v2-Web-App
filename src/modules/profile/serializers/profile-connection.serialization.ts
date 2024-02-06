import { Expose } from 'class-transformer';

export class ProfileConnectionSerialization {
  @Expose({ name: 'isConnected' })
  isConnected: any;

  @Expose({ name: 'isRequested' })
  isRequested: any;
}
