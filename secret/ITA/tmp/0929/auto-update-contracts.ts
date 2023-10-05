import { createReadStream, createWriteStream, unlinkSync, existsSync } from 'fs'
import { join } from 'path'
import { pipeline } from 'stream'

import { PrismaClient } from '@prisma/client'
import * as dayjs from 'dayjs'
import * as timezone from 'dayjs/plugin/timezone'
import * as utc from 'dayjs/plugin/utc'
import { v4 as uuidv4 } from 'uuid'

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.tz.setDefault('Asia/Tokyo')

const current = dayjs(new Date()).tz()
const prisma = new PrismaClient()

const getContracts = async () => {
  const result = await prisma.contract.findMany({
    where: {
      status: 'DOING',
      NOT: {
        endDate: null
      }
    },
    include: {
      originContract: true,
      updatedContract: true
    }
  })

  const notAutoUpdateContracts = result.filter(
    (object) => object.autoUpdateCountOfMonths === null
  )
  const autoUpdateContracts = result.filter(
    (object) => object.autoUpdateCountOfMonths !== null
  )

  return {
    notAutoUpdateContracts,
    autoUpdateContracts
  }
}

const updateNotAutoUpdateContracts = async (contracts) => {
  for (const contract of contracts) {
    if (current.isAfter(contract.endDate)) {
      await prisma.contract.update({
        where: {
          id: contract.id
        },
        data: {
          status: 'ENDED'
        }
      })
    }
  }
}

const updateAutoUpdateContracts = async (contracts) => {
  for (const contract of contracts) {
    if (current.isAfter(contract.endDate)) {
      const endDate = new Date(
        dayjs(contract.endDate)
          .add(contract.autoUpdateCountOfMonths, 'month')
          .format('YYYY-MM-DD')
      )

      let copiedFile: {
        path: string
        reset: () => void
      }
      let filePath: string

      try {
        if (contract.filePath) {
          copiedFile = await copyFile(contract)
          filePath = copiedFile?.path
        }

        await prisma.contract.update({
          where: {
            id: contract.id
          },
          data: {
            status: 'UPDATED',
            updatedContract: {
              create: {
                customerId: contract.customerId,
                departmentId: contract.departmentId,
                name: contract.name,
                type: contract.type,
                status: 'DOING',
                startDate: contract.startDate,
                endDate,
                autoUpdateCountOfMonths: contract.autoUpdateCountOfMonths,
                fileName: contract.fileName,
                filePath
              }
            }
          }
        })
      } catch (e) {
        if (copiedFile) {
          copiedFile.reset()
        }
        throw Error(e)
      }
    }
  }
}

const copyFile = async (
  contract
): Promise<{
  path: string
  reset: () => void
}> => {
  const originFilePath = join(process.cwd(), '/', contract.filePath)

  if (!existsSync(originFilePath)) return

  const readStream = await createReadStream(originFilePath)
  const uploadPath = getUploadPath(contract)
  const fileName = createFileName()

  return new Promise((resolve) => {
    const writeStream = createWriteStream(`${uploadPath}/${fileName}`)
    pipeline(readStream, writeStream, (e) => {
      if (e) {
        deleteFile(`${uploadPath.replace(process.cwd() + '/', '')}/${fileName}`)
        resolve(null)
      } else {
        resolve({
          path: `${uploadPath.replace(process.cwd() + '/', '')}/${fileName}`,
          reset: () => {
            deleteFile(
              `${uploadPath.replace(process.cwd() + '/', '')}/${fileName}`
            )
          }
        })
      }
    })
  })
}

const deleteFile = (path) => {
  if (!path.startsWith('uploads')) return

  const filePath = join(process.cwd(), path)
  if (existsSync(filePath)) unlinkSync(filePath)
}

const getUploadPath = (contract) => {
  return `${join(
    process.cwd(),
    'uploads/private/customers/',
    `${contract.customerId}`,
    '/contracts'
  )}`
}

const createFileName = () => {
  return uuidv4() + '.pdf'
}

const main = async () => {
  const { notAutoUpdateContracts, autoUpdateContracts } = await getContracts()
  updateNotAutoUpdateContracts(notAutoUpdateContracts)
  updateAutoUpdateContracts(autoUpdateContracts)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
