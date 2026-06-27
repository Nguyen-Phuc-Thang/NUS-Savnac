import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LinkService {
    constructor(private prisma: PrismaService) { }

    async getLinks(folderId: string) {
        return await this.prisma.client.link.findMany({
            where: {
                folderId: folderId
            }
        });
    }

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


    async deleteLink(linkId: string) {
        return await this.prisma.client.link.delete({
            where: {
                linkId: linkId
            }
        });
    }

    async updateLink(linkId: string, newTitle: string, newUrl: string) {
        return await this.prisma.client.link.update({
            where: {
                linkId: linkId
            },
            data: {
                title: newTitle,
                url: newUrl,
            }
        });
    }
}
