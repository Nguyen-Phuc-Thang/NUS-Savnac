import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export default class AddFolderDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  courseId!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;
}
