import { Module } from '@nestjs/common'

import { AuthModule } from '@src/lib/auth/module'
import { PrismaModule } from '@src/lib/prisma/module'
import { StorageModule } from '@src/lib/storage/module'

import { FileController } from '@src/www/file/controller'
import { FileService } from '@src/www/file/service'

@Module({
  imports: [AuthModule, PrismaModule, StorageModule],
  controllers: [FileController],
  providers: [FileService]
})
export class FileServiceModule {}
