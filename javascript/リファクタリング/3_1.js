//play変数の削除 
// 問い合わせによる一時変数の置き換え
// playForメソッドの作成
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
    customer: "外山様", performances: [
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

function playFor(aPerformance) {
  const parsedPlays = JSON.parse(plays)
  return parsedPlays[aPerformance.playID]
}

function amountFor(aPerformance, play) {
  let result = 0
  switch(play.type) {
    case "tragedy":
      result = 40000
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30)
      }
      break
    case "comedy":
      result = 30000
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20)
      }
      result += 300 * aPerformance.audience
      break
    default:
      throw new Error(`unknown type: ${play.type}`)
  } 
  return result
}

const invoices = JSON.stringify(invoicesObject)
const statement = (invoice, plays) => {
  let totalAmount = 0
  let volumeCredits = 0
  let result = `請求書 ${invoice.customer}\n`

  const format = new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: 2
  }).format

  for (let perf of invoice.performances) {
    const play = playFor(perf)
    let thisAmount = amountFor(perf, play)

    volumeCredits += Math.max(perf.audience - 30, 0)
    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5)
    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats) \n`
    totalAmount += thisAmount
  }
  result += `支払額 ${format(totalAmount / 100)}\n`
  result += `次回使用ポイント ${volumeCredits}\n`
  return result
}

console.log(statement(JSON.parse(invoices)[0], JSON.parse(plays)))