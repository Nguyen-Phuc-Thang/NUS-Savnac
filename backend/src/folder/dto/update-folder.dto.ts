import { IsNotEmpty, IsString, IsUUID } from 'class-validator';


export default class UpdateFolderDto {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    folderId!: string;

    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsString()
    description!: string;
}