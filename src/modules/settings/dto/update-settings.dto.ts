import { Expose } from "class-transformer";
import { SettingLangType, SettingThemeType } from "../interfaces/setting.interface";
import { IsEnum, IsOptional } from "class-validator";

export class UpdateSettingsDto {
    @IsOptional()
    @IsEnum(SettingLangType)
    @Expose({name: "lang"})
    lang: SettingLangType
    
    @IsOptional()
    @IsEnum(SettingThemeType)
    @Expose({name: "theme"})
    theme: SettingThemeType
}