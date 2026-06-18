import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FolderService } from './folder.service';

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) { }


  @Get('all-folders')
  async getAllFolders(@Query('courseId') courseId: string) {
    return this.folderService.getAllFolders(courseId);
  }

  @Post('create-folder')
  async createFolder(@Body() body: any) {
    return this.folderService.createFolder(body.courseId, body.folderName, body.folderDescription);
  }


}
