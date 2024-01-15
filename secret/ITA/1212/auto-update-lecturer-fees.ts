import { PrismaClient } from '@prisma/client'
import * as dayjs from 'dayjs'
import * as timezone from 'dayjs/plugin/timezone'
import * as utc from 'dayjs/plugin/utc'

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.tz.setDefault('Asia/Tokyo')

const current = dayjs(new Date()).tz()
const prisma = new PrismaClient()

const isOctoberFirst = (current: dayjs.Dayjs): boolean =>
  current.month() === 9 && current.date() === 1

const getTargetLecturers = async () => {
  const result = await prisma.lecturer.findMany({
    where: {
      archived: false,
      lecturerDetails: {
        some: {
          current: true
        }
      }
    },
    include: {
      lecturerDetails: {
        include: {
          lecturerFees: true
        }
      }
    }
  })

  const currentLecturerDetails = result.map((lecturer) => {
    return lecturer.lecturerDetails[0]
  })
  const currentLecturerFees = currentLecturerDetails
    .map((lecturerDetail) => {
      return lecturerDetail.lecturerFees.map((lecturerFee) => {
        return {
          lecturerDetailId: lecturerDetail.id,
          label: lecturerFee.label,
          fee: lecturerFee.fee,
          note: lecturerFee.note
        }
      })
    })
    .flat()

  return {
    currentLecturerDetails,
    currentLecturerFees
  }
}

const main = async () => {
  console.log('----------------------------------------------------------')
  console.log(
    `Run auto-update-lecturer-fees on: ${current.format('YYYY-MM-DD HH:mm')}`
  )

  const octoberFirst = dayjs().month(9).date(1)

  if (!isOctoberFirst(octoberFirst)) {
    console.log('Not October 1st. Skip.')
    console.log('----------------------------------------------------------')
    return
  }

  const { currentLecturerDetails, currentLecturerFees } =
    await getTargetLecturers()

  let createdLecturerDetailCount = 0
  let createdLecturerFeeCount = 0
  let createLecturerDetailErrorCount = 0

  for (const lecturerDetail of currentLecturerDetails) {
    const specificLecturerFees = currentLecturerFees
      .filter((lecturerFee) => {
        return lecturerFee.lecturerDetailId === lecturerDetail.id
      })
      .map((lecturerFee) => {
        return {
          label: lecturerFee.label,
          fee: lecturerFee.fee,
          note: lecturerFee.note
        }
      })

    try {
      await prisma.lecturer.update({
        where: {
          id: lecturerDetail.lecturerId
        },
        data: {
          lecturerDetails: {
            update: {
              where: {
                id: lecturerDetail.id
              },
              data: {
                current: false
              }
            },
            create: {
              current: true,
              financialYear: current.year() + 1,
              lecturerFees: {
                createMany: {
                  data: specificLecturerFees
                }
              }
            }
          }
        }
      })

      createdLecturerDetailCount++
      createdLecturerFeeCount += specificLecturerFees.length
    } catch (e) {
      console.error(`*** Error lecturerDetail id: ${lecturerDetail.id} ***`)
      console.error(e)

      createLecturerDetailErrorCount++
    }
  }

  console.log('【result】')
  console.log(`Created lecturerDetail count: ${createdLecturerDetailCount}`)
  console.log(`Created lecturerFee count: ${createdLecturerFeeCount}`)
  console.log(`Error lecturerDetail count: ${createLecturerDetailErrorCount}`)
  console.log('----------------------------------------------------------')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
