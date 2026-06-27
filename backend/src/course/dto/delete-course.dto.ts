import { IsNotEmpty, IsString } from 'class-validator';

export default class DeleteCourseDto {
    @IsNotEmpty()
    @IsString()
    courseId!: string;
}