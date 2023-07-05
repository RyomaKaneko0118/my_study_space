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

const invoices = JSON.stringify(invoicesObject)

const statement = (invoice) => {
  return renderPlainText(createStatementData(invoice))
}
const createStatementData = (invoice) => {
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

  function amountFor(aPerfomance) {
    let result = 0
    switch(aPerfomance.play.type) {
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
        throw new Error(`unknown type: ${aPerfomance.play.type}`)
    } 
    return result
  }
  
  function playFor(aPerfomance) {
    const parsedPlays = JSON.parse(plays)
    return parsedPlays[aPerfomance.playID]
  }
  
  function volumeCreditsFor(aPerfomance) {
    let result = 0
    result += Math.max(aPerfomance.audience - 30, 0)
    if ("comedy" === aPerfomance.play.type) result += Math.floor(aPerfomance.audience / 5)
    return result
  }
  
  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0)
  }
  
  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0)
  }
}

const renderPlainText = (data) => {
  let result = `Statement for ${data.customer}\n`
  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats) \n`
  }

  result += `Amount owed is ${usd(data.totalAmount)}\n`
  result += `You earned ${data.totalVolumeCredits} credits \n`
  return result

  function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
      style: "currency", currency: "USD",
      minimumFractionDigits: 2
    }).format(aNumber / 100)
  }
}

console.log(statement(JSON.parse(invoices)[0], JSON.parse(plays)))

// リファクタリングによって、playを取得するコードはループにつき1回取得していたが、3回になった。
// →　リファクタリングとパフォーマンスの相互作用
// しかし、パフォーマンスに大きな影響を与えないし、コードが整然としていた方がチューニングが容易になる
// ローカル変数を削除することのメリットは、扱うべきローカルスコープが減り、メソッドの抽出が楽になる