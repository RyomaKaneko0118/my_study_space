// const stringify = require('csv-stringify')
import * as csv from 'csv-stringify'

const main = async () => {
  // サンプルデータ
  // const lecturers = [
  //   { firstName: 'テスト', lastName: '太郎', city: 'New York' },
  //   { firstName: '山下', lastName: '次郎', city: '宗像市' }
  // ]

  // CSV stringifierの設定
  const stringifier = csv.stringify({
    header: true, // ヘッダーを含む
    columns: ['氏名', '住所', '担当領域'] // 列の順番
  })
  const lecturer = {
    firstName: 'テスト',
    lastName: '太郎',
    city: 'New York',
    masterLecturerCategories: [
      {
        id: 1,
        name: 'ビジネス'
      },
      {
        id: 2,
        name: 'プログラミングあり'
      },
      {
        id: 3,
        name: 'プログラミングなし'
      }
    ]
  }

  const modificatedLecturer = {}
  modificatedLecturer['氏名'] = lecturer.firstName + lecturer.lastName
  modificatedLecturer['住所'] = lecturer.city
  modificatedLecturer['担当領域'] = lecturer.masterLecturerCategories
    .map((category) => category.name)
    .join(', ')

  const modificatedLecturers = []
  modificatedLecturers.push(modificatedLecturer)

  // CSVデータを生成
  for (const lecturer of modificatedLecturers) {
    stringifier.write(lecturer)
  }

  // ストリームを閉じる
  stringifier.end()

  const readedRow: string[] = []
  // CSVデータが生成されると 'readable' イベントが発生する
  await stringifier.on('readable', function () {
    let row
    while ((row = stringifier.read()) !== null) {
      console.log(row.toString()) // CSVデータをコンソールに表示
      readedRow.push(row.toString())
    }
  })
  const result = JSON.stringify(readedRow[0])
  console.log(JSON.parse(result))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
// .finally(async () => {
//   await prisma.$disconnect()
// })

//    "csv-stringify": "^6.4.4",
// "task:check-api": "ts-node -r tsconfig-paths/register task/check-api.ts"