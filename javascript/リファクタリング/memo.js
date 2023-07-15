//volumeCredits変数の削除 
// ループの分離
// volumeCreditsを集計しているループを分離し、新たなループを作成
// ステートメントのスライド
// 変数のインライン化
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

function playFor(aPerformance) {
  const parsedPlays = JSON.parse(plays)
  return parsedPlays[aPerformance.playID]
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

const statement = (invoice) => {
  const statementData = {}
  statementData.customer = invoice.customer
  statementData.performances = invoice.performances.map(enrichPerformance)
  statementData.totalAmount = totalAmount(statementData)
  statementData.totalVolumeCredits = totalVolumeCredits(statementData)
  return renderPlainText(statementData)
}

function enrichPerformance(aPerformance) {
  const result = Object.assign({}, aPerformance)
  result.play = playFor(aPerformance)
  result.amount = amountFor(result)
  return result
}

function totalAmount(data) {
  let result = 0
  for (let perf of data.performances) {
    result += perf.amount
  }
  return result
}

function totalVolumeCredits(data) {
  let result = 0
  for (let perf of data.performances) {
    result += volumeCreditsFor(perf)
  }
  return result
}

function volumeCreditsFor(aPerformance) {
  let result = 0
  result += Math.max(aPerformance.audience - 30, 0)
  if ("comedy" === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5)
  return result
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

// リファクタリングによって、playを取得するコードはループにつき1回取得していたが、3回になった。
// →　リファクタリングとパフォーマンスの相互作用
// しかし、パフォーマンスに大きな影響を与えないし、コードが整然としていた方がチューニングが容易になる
// ローカル変数を削除することのメリットは、扱うべきローカルスコープが減り、メソッドの抽出が楽になる