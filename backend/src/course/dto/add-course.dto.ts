import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CourseType } from '@prisma/client';

export default class AddCourseDto {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    userId!: string;

    @IsNotEmpty()
    @IsString()
    courseCode!: string;

    @IsNotEmpty()
    @IsString()
    courseTitle!: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(CourseType)
    courseType!: CourseType;
}