import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FolderService {
    constructor(private prisma: PrismaService) { }


    async getAllFolders(courseId: string) {
        return await this.prisma.client.folder.findMany({
            where: {
                courseId: courseId
            },
            include: {
                links: true
            }
        });
    }

    async addFolder(courseId: string, folderName: string, folderDescription: string) {
        return await this.prisma.client.folder.create({
            data: {
                courseId: courseId,
                name: folderName,
                description: folderDescription,
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
