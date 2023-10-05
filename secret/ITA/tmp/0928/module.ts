import { Module } from '@nestjs/common'

import { AuthModule } from '@src/lib/auth/module'
import { DateModule } from '@src/lib/date/module'
import { LoggerModule } from '@src/lib/logger/module'
import { PrismaModule } from '@src/lib/prisma/module'
import { StorageModule } from '@src/lib/storage/module'

import { ContractsResolver } from '@src/www/graphql/contracts/resolver'
import { ContractsService } from '@src/www/graphql/contracts/service'

@Module({
  imports: [AuthModule, DateModule, LoggerModule, PrismaModule, StorageModule],
  providers: [ContractsResolver, ContractsService]
})
export class ContractsModule {}
