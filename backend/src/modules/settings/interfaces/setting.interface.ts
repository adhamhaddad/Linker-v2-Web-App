export enum SettingLangType {
  AR = 'ar',
  EN = 'en',
}
export enum SettingThemeType {
  DARK = 'dark',
  LIGHT = 'light',
}

export interface ISetting {
  id: number;
  uuid: string;
  lang: SettingLangType;
  theme: SettingThemeType;
  created_at: Date;
  updated_at: Date;
}
