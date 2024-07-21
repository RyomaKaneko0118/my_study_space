// area2を以下までスクロールをするとヘッダーが消える
// 画面の一番上が０で下にいくつれて数値が上がる
// id area-2の座標を取得(elemTop)
// 現在の座標を取得
// 現在の座標がelemTopより下の場合、
// DownMoveクラスを付与しヘッダーを下に移動させ表示する
// 上の場合、
// UpMoveクラスを付与し、
// ヘッダーを上に移動させ非表示にする



let beforePos = 0//スクロールの値の比較用の設定
const headerElement = document.getElementById('header')
//スクロール途中でヘッダーが消え、上にスクロールすると復活する設定を関数にまとめる
function ScrollAnime() {
	const area2Element = document.getElementById('area-2')
	const elemTop = area2Element.offsetTop
	const scroll = window.scrollY

  //ヘッダーの出し入れをする
  if(scroll === beforePos) {
	//IE11対策で処理を入れない
  } else if(elemTop > scroll || 0 > scroll - beforePos) {
	//ヘッダーが上から出現する

	headerElement.classList.remove('UpMove')
	headerElement.classList.add('DownMove')
  } else {
	//ヘッダーが上に消える
	headerElement.classList.remove('DownMove')
	headerElement.classList.add('UpMove')
  }
  beforePos = scroll//現在のスクロール値を比較用のbeforePosに格納
}

// 画面をスクロールをしたら動かしたい場合の記述
window.addEventListener('scroll', () => {
	ScrollAnime();/* ナビゲーションに現在地のクラスをつけるための関数を呼ぶ*/
});

// ページが読み込まれたらすぐに動かしたい場合の記述
window.addEventListener('load', function () {
	ScrollAnime();/* ナビゲーションに現在地のクラスをつけるための関数を呼ぶ*/
});

document.querySelectorAll('#g-navi li a').forEach( (aElement) => {
  aElement.addEventListener('click', (e) => {
    e.preventDefault();

    const targetElement = document.querySelector(aElement.getAttribute('href'))
    const headerH = headerElement.offsetHeight
    const pos = Math.round(targetElement.offsetTop - headerH)

    window.scrollTo({
      top: pos,
      behavior: 'smooth'
    });
  });
});