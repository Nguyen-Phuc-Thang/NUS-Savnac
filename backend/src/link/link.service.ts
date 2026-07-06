import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import GetLinkDto from './dto/get-link.dto';
import CreateLinkDto from './dto/create-link.dto';
import DeleteLinkDto from './dto/delete-link.dto';
import UpdateLinkDto from './dto/update-link.dto';

@Injectable()
export class LinkService {
  constructor(private prisma: PrismaService) {}

  async checkFolderExist(folderId: string) {
    const folder = await this.prisma.client.folder.findUnique({
      where: {
        folderId: folderId,
      },
    });
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }
  }

  async checkLinkExist(linkId: string) {
    const link = await this.prisma.client.link.findUnique({
      where: {
        linkId: linkId,
      },
    });
    if (!link) {
      throw new NotFoundException('Link not found');
    }
  }

  async getLinks(dto: GetLinkDto) {
    await this.checkFolderExist(dto.folderId);
    return await this.prisma.client.link.findMany({
      where: {
        folderId: dto.folderId,
      },
    });
  }

  async createLink(dto: CreateLinkDto) {
    await this.checkFolderExist(dto.folderId);
    return await this.prisma.client.link.create({
      data: {
        folderId: dto.folderId,
        title: dto.title,
        url: dto.url,
      },
    });
  }

  async deleteLink(dto: DeleteLinkDto) {
    await this.checkLinkExist(dto.linkId);
    return await this.prisma.client.link.delete({
      where: {
        linkId: dto.linkId,
      },
    });
  }

  async updateLink(dto: UpdateLinkDto) {
    await this.checkLinkExist(dto.linkId);
    return await this.prisma.client.link.update({
      where: {
        linkId: dto.linkId,
      },
      data: {
        title: dto.title,
        url: dto.url,
      },
    });
  }
}
