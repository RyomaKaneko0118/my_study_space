// PerformanceCalculatorをポリモーフィックに
// サブクラスによるタイプコードの置き換え
// ファクトリ関数によりコンストラクタの置き換え
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

class PerformanceCalculator {
  constructor(aPerfomance, aPlay) {
    this.performance = aPerfomance
    this.play = aPlay
  }

  get amount() {
    let result = 0
    switch(this.play.type) {
      case "tragedy":
        result = 40000
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30)
        }
        break
      case "comedy":
        result = 30000
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20)
        }
        result += 300 * this.performance.audience
        break
      default:
        throw new Error(`unknown type: ${this.play.type}`)
    } 
    return result
  }

  get volumeCredits() {
    let result = 0
    result += Math.max(this.performance.audience - 30, 0)
    if ("comedy" === this.play.type) result += Math.floor(this.performance.audience / 5)
    return result
  }
}

const createPerformanceCalculator = (aPerfomance, aPlay) => {
  switch(aPlay.type) {
    case "tragedy": return new TragedyCalculator(aPerfomance, aPlay)
    case "comedy": return new ComedyCalculator(aPerfomance, aPlay)
    default: 
      throw new Error(`未知の演劇の種類: ${aPlay.type}`)
  }
}

class TragedyCalculator extends PerformanceCalculator {

}

class ComedyCalculator extends PerformanceCalculator {

} 

const invoices = JSON.stringify(invoicesObject)

const statement = (invoice) => {
  return renderPlainText(createStatementData(invoice))
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

const htmlStatement = (invoice) => {
  return renderHtml(createStatementData(invoice))
}

const renderHtml = (data) => {
  let result = `<h1>Statement for ${data.customer}</h1>\n`
  result += "<table>\n"
  result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>"
  for (let perf of data.performances) {
    result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`
    result += `<td>${usd(perf.amount)}</td></tr>`
  }

  result += "<table>\n"
  result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`
  result += `<p>You earned <em>${data.totalVolumeCredits} credits</em></p>\n`
  return result

  function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
      style: "currency", currency: "USD",
      minimumFractionDigits: 2
    }).format(aNumber / 100)
  }
}
console.log(htmlStatement(JSON.parse(invoices)[0], JSON.parse(plays)))
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
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance))
    const result = Object.assign({}, aPerformance)
    result.play = calculator.play
    result.amount = calculator.amount
    result.volumeCredits = calculator.volumeCredits 
    return result
  }
  
  function playFor(aPerfomance) {
    const parsedPlays = JSON.parse(plays)
    return parsedPlays[aPerfomance.playID]
  }

  function amountFor(aPerfomance) {
    return new PerformanceCalculator(aPerfomance, playFor(aPerfomance)).amount 
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

