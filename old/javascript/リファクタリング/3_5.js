//play変数の削除 
// 問い合わせによる一時変数の置き換え
// playForメソッドの作成
// play変数のインライン化
// 関数宣言の変更
//amountFor関数の修正
// playパラメータの削除
// 変数のインライン化を適用しthisAmountを削除
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

function amountFor(aPerformance) {
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

const invoices = JSON.stringify(invoicesObject)
const statement = (invoice) => {
  let totalAmount = 0
  let volumeCredits = 0
  let result = `請求書 ${invoice.customer}\n`

  const format = new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: 2
  }).format

  for (let perf of invoice.performances) {

    volumeCredits += Math.max(perf.audience - 30, 0)
    if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5)
    result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience} seats) \n`
    totalAmount += amountFor(perf)
  }
  result += `支払額 ${format(totalAmount / 100)}\n`
  result += `次回使用ポイント ${volumeCredits}\n`
  return result
}

console.log(statement(JSON.parse(invoices)[0], JSON.parse(plays)))

// リファクタリングによって、playを取得するコードはループにつき1回取得していたが、3回になった。
// →　リファクタリングとパフォーマンスの相互作用
// しかし、パフォーマンスに大きな影響を与えないし、コードが整然としていた方がチューニングが容易になる
// ローカル変数を削除することのメリットは、扱うべきローカルスコープが減り、メソッドの抽出が楽になる