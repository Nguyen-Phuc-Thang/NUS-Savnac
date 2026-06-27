import { Controller, Post, Body, Get, Query, Delete } from '@nestjs/common';
import { LinkService } from './link.service';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) { }

  @Get('all-links')
  async getLinks(@Query('folderId') folderId: string) {
    return this.linkService.getLinks(folderId);
  }

  @Post('create-link')
  async createLink(@Body() body: any) {
    return this.linkService.createLink(body.folderId, body.title, body.url);
  }

  @Post('update-link')
  async updateLink(@Body() body: any) {
    return this.linkService.updateLink(body.linkId, body.newTitle, body.newUrl);
  }

  @Delete('delete-link')
  async deleteLink(@Body() body: any) {
    return this.linkService.deleteLink(body.linkId);
  }
}
