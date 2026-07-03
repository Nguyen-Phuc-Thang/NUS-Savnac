import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import GetFolderDto from './dto/get-folder.dto';
import AddFolderDto from './dto/add-folder.dto';
import UpdateFolderDto from './dto/update-folder.dto';
import DeleteFolderDto from './dto/delete-folder.dto';

@Injectable()
export class FolderService {
    constructor(private prisma: PrismaService) { }

    async checkCourseExists(courseId: string) {
        const course = await this.prisma.client.course.findUnique({
            where: {
                courseId: courseId
            }
        });

        if (!course) {
            throw new NotFoundException(`Course not found`);
        }
    }

    async checkFolderExists(folderId: string) {
        const folder = await this.prisma.client.folder.findUnique({
            where: {
                folderId: folderId
            }
        });

        if (!folder) {
            throw new NotFoundException(`Folder not found`);
        }
    }

    async getAllFolders(dto: GetFolderDto) {
        await this.checkCourseExists(dto.courseId);
        return await this.prisma.client.folder.findMany({
            where: {
                courseId: dto.courseId
            },
            include: {
                links: true
            }
        });
    }

    async addFolder(dto: AddFolderDto) {
        await this.checkCourseExists(dto.courseId);
        return await this.prisma.client.folder.create({ data: dto });
    }

    async updateFolder(dto: UpdateFolderDto) {
        await this.checkFolderExists(dto.folderId);
        return await this.prisma.client.folder.update({
            where: {
                folderId: dto.folderId
            },
            data: {
                name: dto.name,
                description: dto.description,
            }
        });
    }

    async deleteFolder(dto: DeleteFolderDto) {
        await this.checkFolderExists(dto.folderId);
        return await this.prisma.client.folder.delete({
            where: {
                folderId: dto.folderId
            }
        });
    }

}
