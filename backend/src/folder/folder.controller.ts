import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import GetFolderDto from './dto/get-folder.dto';
import AddFolderDto from './dto/add-folder.dto';
import UpdateFolderDto from './dto/update-folder.dto';
import DeleteFolderDto from './dto/delete-folder.dto';

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get('all-folders')
  async getAllFolders(@Query() dto: GetFolderDto) {
    return this.folderService.getAllFolders(dto);
  }

  @Post('add-folder')
  async addFolder(@Body() dto: AddFolderDto) {
    return this.folderService.addFolder(dto);
  }

  @Patch('update-folder')
  async updateFolder(@Body() dto: UpdateFolderDto) {
    return this.folderService.updateFolder(dto);
  }

  @Delete('delete-folder')
  async deleteFolder(@Body() dto: DeleteFolderDto) {
    return this.folderService.deleteFolder(dto);
  }
}
