//totalAmount変数の削除
const playsObject = {
  hamlet: {
    name: "Hamlet", type: "tragedy"
  },
  "as-like": {
    name: "As you like it", type: "comedy"
  },
  othello: {
    name: "Othello", type: "tragedy"
  }
}

const plays = JSON.stringify(playsObject)

const invoicesObject = [
  {
    customer: "BigCg", performances: [
      {
        playID: "hamlet",
        audience: 55
      },
      {
        playID: "as-like",
        audience: 35
      },
      {
        playID: "othello",
        audience: 40
      }
    ]
  }
]

function playFor(aPerfomance) {
  const parsedPlays = JSON.parse(plays)
  return parsedPlays[aPerfomance.playID]
}

function volumeCreditsFor(aPerfomance) {
  let result = 0
  result += Math.max(aPerfomance.audience - 30, 0)
  if ("comedy" === playFor(aPerfomance).type) result += Math.floor(aPerfomance.audience / 5)
  return result
}

function amountFor(aPerfomance, play) {
  let result = 0
  switch(playFor(aPerfomance).type) {
    case "tragedy":
      result = 40000
      if (aPerfomance.audience > 30) {
        result += 1000 * (aPerfomance.audience - 30)
      }
      break
    case "comedy":
      result = 30000
      if (aPerfomance.audience > 20) {
        result += 10000 + 500 * (aPerfomance.audience - 20)
      }
      result += 300 * aPerfomance.audience
      break
    default:
      throw new Error(`unknown type: ${playFor(aPerfomance).type}`)
  } 
  return result
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: 2
  }).format(aNumber / 100)
}

function totalVolumeCredits(invoice) {
  let result = 0
  for (let perf of invoice.performances) {
    result += volumeCreditsFor(perf)
  }
  return result
}
const invoices = JSON.stringify(invoicesObject)
const statement = (invoice) => {
  let totalAmount = 0
  let result = `Statement for ${invoice.customer}\n`

  for (let perf of invoice.performances) {
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats) \n`
    totalAmount += amountFor(perf)
  }


  result += `Amount owed is ${usd(totalAmount)}\n`
  result += `You earned ${totalVolumeCredits(invoice)} credits \n`
  return result
}

console.log(statement(JSON.parse(invoices)[0], JSON.parse(plays)))

// よく整備されたコードの方が後から整備しやすい
// パフォーマンスのチューニングはリファクタリングの後からでもよい
// ループの分離
// ステートメントのスライド
// 関数の抽出
// 変数のインライン化
// 問題が複雑になり始めたときは作業を細かく分解していく