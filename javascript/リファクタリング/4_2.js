// 計算部分における2つのローカル変数の削除
// volumeCreditsForメソッドの作成
// volumeCreditsFor内の変数名を分かりやすい名前に修正
// 引数名の修正
// 結果を返す変数の修正
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

const invoices = JSON.stringify(invoicesObject)
const statement = (invoice) => {
  let totalAmount = 0
  let volumeCredits = 0
  let result = `Statement for ${invoice.customer}\n`

  const format = new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: 2
  }).format

  for (let perf of invoice.performances) {

    volumeCredits += volumeCreditsFor(perf)

    result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience} seats) \n`
    totalAmount += amountFor(perf)
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`
  result += `You earned ${volumeCredits} credits \n`
  return result
}

console.log(statement(JSON.parse(invoices)[0], JSON.parse(plays)))

// リファクタリングによって、playを取得するコードはループにつき1回取得していたが、3回になった。
// →　リファクタリングとパフォーマンスの相互作用
// しかし、パフォーマンスに大きな影響を与えないし、コードが整然としていた方がチューニングが容易になる
// ローカル変数を削除することのメリットは、扱うべきローカルスコープが減り、メソッドの抽出が楽になる