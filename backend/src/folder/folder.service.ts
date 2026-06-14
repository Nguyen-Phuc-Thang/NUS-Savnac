import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FolderService {
    constructor(private prisma: PrismaService) { }


    async getAllFolders(courseId: string) {
        return await this.prisma.client.folder.findMany({
            where: {
                courseId: courseId
            }
        });
    }

    async createFolder(courseId: string, folderName: string, folderDescription: string) {
        return await this.prisma.client.folder.create({
            data: {
                courseId: courseId,
                name: folderName,
                description: folderDescription,
                createdAt: new Date(),
            }
        });
    }

    async updateFolder(folderId: string, folderName: string, folderDescription: string) {
        return await this.prisma.client.folder.update({
            where: {
                folderId: folderId
            },
            data: {
                name: folderName,
                description: folderDescription,
            }
        });
    }

    async deleteFolder(folderId: string) {
        return await this.prisma.client.folder.delete({
            where: {
                folderId: folderId
            }
        });
    }

}
