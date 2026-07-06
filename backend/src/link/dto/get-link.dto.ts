import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export default class GetLinkDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  folderId!: string;
}
