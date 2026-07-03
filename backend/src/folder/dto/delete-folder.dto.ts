import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export default class DeleteFolderDto {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    folderId!: string;
}