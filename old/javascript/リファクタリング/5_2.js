// format変数の削除
// formatメソッドの作成
// 関数宣言の変更
// formateメソッドをusd
// formatメソッドを修正
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

function playFor(aPerformance) {
  const parsedPlays = JSON.parse(plays)
  return parsedPlays[aPerformance.playID]
}

function volumeCreditsFor(aPerformance) {
  let result = 0
  result += Math.max(aPerformance.audience - 30, 0)
  if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5)
  return result
}

function amountFor(aPerformance, play) {
  let result = 0
  switch(playFor(aPerformance).type) {
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
      throw new Error(`unknown type: ${playFor(aPerformance).type}`)
  } 
  return result
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: 2
  }).format(aNumber / 100)
}

const invoices = JSON.stringify(invoicesObject)
const statement = (invoice) => {
  let totalAmount = 0
  let volumeCredits = 0
  let result = `請求書 ${invoice.customer}\n`

  for (let perf of invoice.performances) {

    volumeCredits += volumeCreditsFor(perf)

    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats) \n`
    totalAmount += amountFor(perf)
  }
  result += `支払額 ${usd(totalAmount)}\n`
  result += `次回使用ポイント ${volumeCredits}\n`
  return result
}

console.log(statement(JSON.parse(invoices)[0], JSON.parse(plays)))

// リファクタリングによって、playを取得するコードはループにつき1回取得していたが、3回になった。
// →　リファクタリングとパフォーマンスの相互作用
// しかし、パフォーマンスに大きな影響を与えないし、コードが整然としていた方がチューニングが容易になる
// ローカル変数を削除することのメリットは、扱うべきローカルスコープが減り、メソッドの抽出が楽になる