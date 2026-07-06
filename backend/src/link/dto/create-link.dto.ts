import { IsNotEmpty, IsString, IsUrl, IsUUID } from 'class-validator';

export default class CreateLinkDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  folderId!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  url!: string;
}
