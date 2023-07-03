// 計算とフォーマットにフェーズを分割
// 中間データ構造を作成
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
  const statementData = {}
  statementData.customer = invoice.customer
  statementData.performances = invoice.performances
  return renderPlainText(statementData)
}

const renderPlainText = (data) => {
  let result = `Statement for ${data.customer}\n`
  for (let perf of data.performances) {
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats) \n`
  }

  result += `Amount owed is ${usd(totalAmount())}\n`
  result += `You earned ${totalVolumeCredits()} credits \n`
  return result

  function totalAmount() {
    let result = 0
    for (let perf of data.performances) {
      result += amountFor(perf)
    }
    return result
  }

  function totalVolumeCredits() {
    let result = 0
    for (let perf of data.performances) {
      result += volumeCreditsFor(perf)
    }
    return result
  }

  function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
      style: "currency", currency: "USD",
      minimumFractionDigits: 2
    }).format(aNumber / 100)
  }
  
  function volumeCreditsFor(aPerfomance) {
    let result = 0
    result += Math.max(aPerfomance.audience - 30, 0)
    if ("comedy" === playFor(aPerfomance).type) result += Math.floor(aPerfomance.audience / 5)
    return result
  }

  function playFor(aPerfomance) {
    const parsedPlays = JSON.parse(plays)
    return parsedPlays[aPerfomance.playID]
  }
  
  function amountFor(aPerfomance) {
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
}

console.log(statement(JSON.parse(invoices)[0], JSON.parse(plays)))

// リファクタリングによって、playを取得するコードはループにつき1回取得していたが、3回になった。
// →　リファクタリングとパフォーマンスの相互作用
// しかし、パフォーマンスに大きな影響を与えないし、コードが整然としていた方がチューニングが容易になる
// ローカル変数を削除することのメリットは、扱うべきローカルスコープが減り、メソッドの抽出が楽になる