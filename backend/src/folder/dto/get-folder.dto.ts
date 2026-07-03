import { IsNotEmpty, IsString, IsUUID } from "class-validator";



export default class GetFolderDto {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    courseId!: string;
}