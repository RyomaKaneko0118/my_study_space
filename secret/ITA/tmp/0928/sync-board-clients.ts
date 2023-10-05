import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import * as dayjs from 'dayjs'
import * as timezone from 'dayjs/plugin/timezone'
import * as utc from 'dayjs/plugin/utc'

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.tz.setDefault('Asia/Tokyo')

const getCurrentFinancialYear = () => {
  const current = dayjs(new Date()).tz()
  if (current.month() >= 3) {
    return current.year()
  } else {
    return current.year() - 1
  }
}

const createAxiosClient = async () => {
  return axios.create({
    baseURL: `${process.env.BOARD_API_URL}/v1`,
    headers: {
      Authorization: `Bearer ${process.env.BOARD_API_TOKEN}`,
      'x-api-key': process.env.BOARD_API_KEY
    }
  })
}

const fetcheClients = async () => {
  const axiosClient = await createAxiosClient()
  return await axiosClient.get('/clients')
}

const getClients = async () => {
  const fetchedClientsData = await fetcheClients()
  return fetchedClientsData.data.map((clientData) => {
    return {
      id: clientData.id,
      detailData: {
        name: clientData.name,
        nameDisp: clientData.name_disp,
        zip: clientData.zip,
        pref: clientData.pref,
        address1: clientData.address1,
        address2: clientData.address2
      }
    }
  })
}

const fetcheAnalyseData = async (year: number) => {
  const axiosClient = await createAxiosClient()
  const params = {
    'order_status_in[]': '4, 5',
    report_ym_gteq: `${year}-04`,
    report_ym_lteq: `${year + 1}-03`
  }
  return await axiosClient.get('/analyses', {
    params
  })
}

const calculateSales = async (fetchedAnalyseData, syncedCustomer) => {
  const selectedClientAnalyseDate = fetchedAnalyseData.data.filter(
    (data) => data.client.id === syncedCustomer.boardClientId
  )
  return selectedClientAnalyseDate.reduce((accumulator, data) => {
    return accumulator + data.total_jpy
  }, 0)
}

const prisma = new PrismaClient()

const updateCurrentCustomerDetails = async (
  currentCustomerDetails,
  syncedCustomer,
  syncedClient,
  sales
) => {
  await prisma.$transaction([
    prisma.customer.update({
      where: {
        id: syncedCustomer.id
      },
      data: {
        sales
      }
    }),
    prisma.customerDetail.update({
      where: {
        id: currentCustomerDetails.id
      },
      data: {
        sales,
        current: true,
        ...syncedClient.detailData
      }
    })
  ])
}

const createCurrentCustomerDetails = async (
  currentCustomerDetails,
  syncedClient,
  syncedCustomer,
  currentFinancialYear,
  sales
) => {
  const coordinatorsData = []
  if (currentCustomerDetails.coordinators.length >= 1) {
    for (const coordinator of currentCustomerDetails.coordinators) {
      coordinatorsData.push({
        saUserId: coordinator.saUserId,
        role: coordinator.role
      })
    }
  }

  await prisma.$transaction([
    prisma.customer.update({
      where: {
        id: syncedCustomer.id
      },
      data: {
        sales,
        customerDetails: {
          create: {
            current: true,
            financialYear: currentFinancialYear,
            affiliate: currentCustomerDetails.affiliate,
            parent: currentCustomerDetails.parent,
            link: currentCustomerDetails.link,
            note: currentCustomerDetails.note,
            sales,
            ...syncedClient.detailData,
            coordinators: {
              createMany: {
                data: [...coordinatorsData]
              }
            }
          }
        }
      }
    }),
    prisma.customerDetail.update({
      where: {
        id: currentCustomerDetails.id
      },
      data: {
        current: false
      }
    })
  ])
}

const main = async () => {
  const currentFinancialYear = getCurrentFinancialYear()
  const clients = await getClients()
  const syncedCustomers = await prisma.customer.findMany({
    where: {
      boardClientId: {
        in: clients.map((client) => client.id)
      }
    },
    select: {
      id: true,
      boardClientId: true,
      customerDetails: {
        include: {
          coordinators: true
        }
      },
      archived: true
    }
  })

  const fetchedAnalyseData = await fetcheAnalyseData(currentFinancialYear)

  for (const syncedCustomer of syncedCustomers) {
    if (syncedCustomer.archived) {
      continue
    }
    // syncedCustomerに紐づく契約の配列を取得(契約終了日があるもの)
    // 更新日数があるものと、ないものでフィルターをかける
    // ないもので、終了日が現在の日付より過ぎている契約は契約終了とする
    // あるもので、終了日が現在の日付より過ぎている契約は更新済みとする
    // かつ、新たに契約を作成する
    // 契約開始日はoriginと同じ
    // 契約終了日は契約終了日に更新月数を足したもの
    const syncedClient = clients.filter(
      (client) => client.id === syncedCustomer.boardClientId
    )[0]
    const currentCustomerDetails =
      syncedCustomer.customerDetails[syncedCustomer.customerDetails.length - 1]
    const sales = await calculateSales(fetchedAnalyseData, syncedCustomer)

    if (currentCustomerDetails.financialYear === currentFinancialYear) {
      await updateCurrentCustomerDetails(
        currentCustomerDetails,
        syncedCustomer,
        syncedClient,
        sales
      )
    } else {
      await createCurrentCustomerDetails(
        currentCustomerDetails,
        syncedClient,
        syncedCustomer,
        currentFinancialYear,
        sales
      )
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
