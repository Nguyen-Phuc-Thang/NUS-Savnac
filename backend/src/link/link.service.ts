import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LinkService {
    constructor(private prisma: PrismaService) { }


    async createLink(folderId: string, linkTitle: string, linkUrl: string) {
        return await this.prisma.client.link.create({
            data: {
                folderId: folderId,
                title: linkTitle,
                url: linkUrl,
                createdAt: new Date(),
            }
        });
    }

    async getLinksByFolder(folderId: string) {
        return await this.prisma.client.link.findMany({
            where: {
                folderId: folderId
            }
        });
    }
}
