import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common'
// import * as Encoding from 'encoding-japanese'
import * as csv from 'csv-stringify'
import * as Encoding from 'encoding-japanese'

import { PrismaService } from '@src/lib/prisma/service'
import { StorageService } from '@src/lib/storage/service'

@Injectable()
export class FileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService
  ) {}

  async contractFile(id: number) {
    const specificContract = await this.prisma.contract.findUnique({
      where: {
        id
      }
    })

    if (!specificContract || !specificContract.filePath) {
      throw new NotFoundException()
    }

    const streamableFile = await this.storage.getFile(specificContract.filePath)

    if (!streamableFile) {
      throw new NotFoundException()
    }

    return {
      fileName: specificContract.fileName,
      streamableFile
    }
  }

  convertToShiftJis(utf8String: string) {
    const unicodeList = Array.from(utf8String).map((char) => char.charCodeAt(0))

    const sjisArray = Encoding.convert(unicodeList, {
      to: 'SJIS',
      from: 'UNICODE'
    })

    return new StreamableFile(new Uint8Array(sjisArray))
  }

  async createCsvFromLecturerData() {
    const lecturers = await this.prisma.lecturer.findMany({
      include: {
        masterLecturerCategories: true
      }
    })
    const formattedLecturers = []
    for (const lecturer of lecturers) {
      const formattedLecturer = {}
      formattedLecturer['氏名'] = `${lecturer.lastName} ${lecturer.firstName}`
      formattedLecturer['住所'] = lecturer.city
      formattedLecturer['担当領域'] = lecturer.masterLecturerCategories
        .map((category) => category.name)
        .join(', ')
      formattedLecturers.push(formattedLecturer)
    }

    const csvStringifier = csv.stringify({
      header: true,
      columns: ['氏名', '住所', '担当領域']
    })
    for (const formattedLecturerData of formattedLecturers) {
      csvStringifier.write(formattedLecturerData)
    }

    const result: string[] = []
    await csvStringifier.on('readable', function () {
      let row
      while ((row = csvStringifier.read()) !== null) {
        result.push(row.toString())
      }
    })
    csvStringifier.end()

    console.log(result)
    return result[0]
  }
}
