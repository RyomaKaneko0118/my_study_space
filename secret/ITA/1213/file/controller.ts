import {
  Controller,
  Get,
  Headers,
  Param,
  Res,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common'

import { AuthService } from '@src/lib/auth/service'

import { FileService } from '@src/www/file/service'

import type { Response } from 'express'

@Controller('file')
export class FileController {
  constructor(
    private readonly auth: AuthService,
    private readonly fileService: FileService
  ) {}

  @Get('contracts/:id/file')
  async contractFile(
    @Headers('authorization') authorization: string,
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response
  ) {
    this.verifyAccessToken(authorization)

    if (isNaN(id)) {
      throw new BadRequestException()
    }

    const { fileName, streamableFile } = await this.fileService.contractFile(id)

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${encodeURIComponent(
        fileName
      )}"`
    })
    return streamableFile
  }

  @Get('lecturers/csv')
  async lecturersCsv(
    @Headers('authorization') authorization: string,
    @Res({ passthrough: true }) res: Response
  ) {
    this.verifyAccessToken(authorization)

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(
        'test.csv'
      )}"`
    })

    return this.fileService.convertToShiftJis(
      await this.fileService.createCsvFromLecturerData()
    )
  }

  private verifyAccessToken(authorization: string) {
    try {
      if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new Error()
      }
      this.auth.verifyAccessToken(authorization.replace('Bearer ', ''))
    } catch {
      throw new UnauthorizedException()
    }
  }
}
