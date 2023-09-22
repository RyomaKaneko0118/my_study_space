import { Module } from '@nestjs/common'

import { AuthModule } from '@src/lib/auth/module'
import { DateModule } from '@src/lib/date/module'
import { LoggerModule } from '@src/lib/logger/module'
import { PrismaModule } from '@src/lib/prisma/module'

import { TrainingClassificationsResolver } from '@src/www/graphql/training-classifications/resolver'
import { TrainingClassificationsService } from '@src/www/graphql/training-classifications/service'

@Module({
  imports: [AuthModule, DateModule, LoggerModule, PrismaModule],
  providers: [TrainingClassificationsResolver, TrainingClassificationsService]
})
export class TrainingClassificationsModule {}
