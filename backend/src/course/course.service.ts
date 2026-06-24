import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseService {
    constructor(private prisma: PrismaService) { }

    // NUS Mods API operations
    async getAllNUSCourses() {
        const response = await fetch(`https://api.nusmods.com/v2/2025-2026/moduleList.json`);
        const data = await response.json();
        let modifiedData: Object[] = [];
        for (const course of data) {
            modifiedData.push({
                moduleCode: course.moduleCode,
                title: course.title
            });
        }
        return modifiedData;
    }

    async getNUSCourseData(courseCode: string) {
        const response = await fetch(`https://api.nusmods.com/v2/2025-2026/modules/${courseCode}.json`);
        const data = await response.json();
        return {
            moduleCode: data.moduleCode,
            title: data.title,
            workload: data.workload,
            semesterData: data.semesterData,
            credit: data.moduleCredit,
        }
    }


    // Course table database operations
    async getAllCourses(userId: string) {
        return await this.prisma.client.course.findMany({
            where: {
                userId: userId
            }
        });
    }

    async getAllCoursesWithTasks(userId: string) {
        return await this.prisma.client.course.findMany({
            where: {
                userId: userId
            },
            include: {
                tasks: true,
            }
        });
    }

    async getCourseInfo(userId: string, courseCode: string) {
        return await this.prisma.client.course.findFirst({
            where: {
                courseCode: courseCode,
                userId: userId
            }
        });
    }

    async addCourse(userId: string, courseCode: string, courseTitle: string, courseType: "NUS" | "CUSTOM") {
        try {
            return await this.prisma.client.course.create({
                data: {
                    courseCode: courseCode,
                    courseTitle: courseTitle,
                    courseType: courseType,
                    userId: userId
                }
            });
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new BadRequestException(`${courseCode} have already been added!`);
            }
            throw error;
        }
    }

    async deleteCourse(courseId: string) {
        return await this.prisma.client.course.delete({
            where: {
                courseId: courseId
            }
        });
    }

}
