import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { LinkService } from './link.service';
import GetLinkDto from './dto/get-link.dto';
import CreateLinkDto from './dto/create-link.dto';
import DeleteLinkDto from './dto/delete-link.dto';
import UpdateLinkDto from './dto/update-link.dto';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get('all-links')
  async getLinks(@Query() dto: GetLinkDto) {
    return this.linkService.getLinks(dto);
  }

  @Post('create-link')
  async createLink(@Body() dto: CreateLinkDto) {
    return this.linkService.createLink(dto);
  }

  @Patch('update-link')
  async updateLink(@Body() dto: UpdateLinkDto) {
    return this.linkService.updateLink(dto);
  }

  @Delete('delete-link')
  async deleteLink(@Body() dto: DeleteLinkDto) {
    return this.linkService.deleteLink(dto);
  }
}
