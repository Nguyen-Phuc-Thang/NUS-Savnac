import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { LinkService } from './link.service';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) { }

  @Get('links-by-folder')
  async getLinksByFolder(@Query('folderId') folderId: string) {
    return this.linkService.getLinksByFolder(folderId);
  }

  @Post('create-link')
  async createLink(@Body() body: any) {
    return this.linkService.createLink(body.folderId, body.title, body.url);
  }
}
