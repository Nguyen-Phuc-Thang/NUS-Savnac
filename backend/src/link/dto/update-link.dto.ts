import { IsNotEmpty, IsUrl, IsString, IsUUID } from 'class-validator';

export default class UpdateLinkDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  linkId!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  url!: string;
}
