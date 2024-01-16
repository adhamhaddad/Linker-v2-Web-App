import { Expose } from 'class-transformer';
import {
  SettingLangType,
  SettingThemeType,
} from '../interfaces/setting.interface';

export class SettingSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'lang' })
  lang: SettingLangType;

  @Expose({ name: 'theme' })
  theme: SettingThemeType;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
