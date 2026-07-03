import { Body, Controller, Get, Post, Query, Patch, Delete } from '@nestjs/common';
import { FolderService } from './folder.service';

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) { }


  @Get('all-folders')
  async getAllFolders(@Query('courseId') courseId: string) {
    return this.folderService.getAllFolders(courseId);
  }

  @Post('add-folder')
  async addFolder(@Body() body: any) {
    return this.folderService.addFolder(body.courseId, body.folderName, body.folderDescription);
  }

  @Patch('update-folder')
  async updateFolder(@Body() body: any) {
    return this.folderService.updateFolder(body.folderId, body.folderName, body.folderDescription);
  }

  @Delete('delete-folder')
  async deleteFolder(@Body() body: any) {
    return this.folderService.deleteFolder(body.folderId);
  }
}
