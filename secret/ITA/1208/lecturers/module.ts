import { Module } from '@nestjs/common'

import { AuthModule } from '@src/lib/auth/module'
import { DateModule } from '@src/lib/date/module'
import { LoggerModule } from '@src/lib/logger/module'
import { PrismaModule } from '@src/lib/prisma/module'
import { StorageModule } from '@src/lib/storage/module'

import { LecturersResolver } from '@src/www/graphql/lecturers/resolver'
import { LecturersService } from '@src/www/graphql/lecturers/service'

@Module({
  imports: [AuthModule, DateModule, LoggerModule, PrismaModule, StorageModule],
  providers: [LecturersResolver, LecturersService]
})
export class LecturersModule {}
