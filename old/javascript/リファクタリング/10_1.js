// パイプラインによるループの置き換え
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

const statement = (invoice) => {
  return renderPlainText(createStatementData(invoice))
}

const renderPlainText = (data) => {
  let result = `請求書 ${data.customer}\n`
  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats) \n`
  }

  result += `支払額 ${usd(data.totalAmount)}\n`
  result += `次回使用ポイント ${data.totalVolumeCredits}\n`
  return result

  function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
      style: "currency", currency: "USD",
      minimumFractionDigits: 2
    }).format(aNumber / 100)
  }
}

console.log(statement(JSON.parse(invoices)[0], JSON.parse(plays)))

// ファイルの分割
// export default createStatementData = (invoice) => {
function createStatementData(invoice) {
  const statementData = {}
  statementData.customer = invoice.customer
  statementData.performances = invoice.performances.map(enrichPerformance)
  statementData.totalAmount = totalAmount(statementData) 
  statementData.totalVolumeCredits = totalVolumeCredits(statementData)
  return statementData

  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance)
    result.play = playFor(result)
    result.amount = amountFor(result)
    result.volumeCredits = volumeCreditsFor(result) 
    return result
  }

  function amountFor(aPerformance) {
    let result = 0
    switch(aPerformance.play.type) {
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
        throw new Error(`unknown type: ${aPerformance.play.type}`)
    } 
    return result
  }
  
  function playFor(aPerformance) {
    const parsedPlays = JSON.parse(plays)
    return parsedPlays[aPerformance.playID]
  }
  
  function volumeCreditsFor(aPerformance) {
    let result = 0
    result += Math.max(aPerformance.audience - 30, 0)
    if ("comedy" === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5)
    return result
  }
  
  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0)
  }
  
  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0)
  }
}
