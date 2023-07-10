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
    const play = plays[perf.playID]
    let thisAmount = 0
    switch(play.type) {
      case "tragedy":
        thisAmount = 40000
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30)
        }
        break
      case "comedy":
        thisAmount = 30000
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20)
        }
        thisAmount += 300 * perf.audience
        break
      default:
        throw new Error(`unknown type: ${play.type}`)
    }

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