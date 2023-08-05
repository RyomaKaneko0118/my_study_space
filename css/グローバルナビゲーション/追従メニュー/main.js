// 実装内容
// セクションごとにscroll-pointクラスとidを設定
// scroll-pointクラスが付与されている座標のリストを設定(elemTopValues)
// elemTopValuesとナビゲーションのリストを対応させる
// スクロールイベントが発生したら、
// スクロールの座標を取得し、
// 座標上のナビゲーションのリストにcurrentクラスを付与する
// 画面が読み込まれたり、画面の幅が変更された場合、elemTopValuesを再設定する
// ナビゲーションを行う処理
// ヘッダーが固定されている場合、ナビゲーション先の上部はヘッダーに隠れてしまう。
// よって、クリックしたhrefのセクションを取得
// ヘッダーの高さを取得
// セクションションからヘッダーの高さを引いた値に、スクロールする


//基準点の準備
let elemTopValues = [];

//現在地を取得するための設定を関数でまとめる
function PositionCheck(){
  const headerH = document.getElementById("header").offsetHeight
  const scrollPoints = document.querySelectorAll(".scroll-point")
  scrollPoints.forEach(function(elem, i) { elemTopValues[i] = Math.round(parseInt(elem.offsetTop - headerH)) })
}

//ナビゲーションに現在地のクラスをつけるための設定
function ScrollAnime() {
  let scroll = Math.round(window.scrollY)
  //ナビゲーションのliの何番目かを定義するための準備
	let NavElem = document.querySelectorAll("#g-nav li")
  NavElem.forEach(function(element) {
    element.classList.remove('current');
  })
	if(scroll >= 0 && scroll < elemTopValues[1]) {
      NavElem[0].classList.add('current')
    }
	else if(scroll >= elemTopValues[1] && scroll < elemTopValues[2]) {
    NavElem[1].classList.add('current')
    } 
  else if(scroll >= elemTopValues[2] && scroll < elemTopValues[3]) { 
    NavElem[2].classList.add('current')
  } 
  else if(scroll >= elemTopValues[3]) {
    NavElem[3].classList.add('current')
  } 
}

document.querySelectorAll('#g-nav a').forEach(function(aElement) {
  aElement.addEventListener('click', function(e) {
    e.preventDefault();

    const targetElement = document.querySelector(this.getAttribute('href'))
    const headerH = document.querySelector("#header").offsetHeight
    const pos = Math.round(targetElement.offsetTop - headerH)

    window.scrollTo({
      top: pos,
      behavior: 'smooth'
    });
  });
});

// 画面をスクロールをしたら動かしたい場合の記述
window.addEventListener('scroll', function() {
	PositionCheck();/* 現在地を取得する関数を呼ぶ*/
	ScrollAnime();/* ナビゲーションに現在地のクラスをつけるための関数を呼ぶ*/
});

// ページが読み込まれたらすぐに動かしたい場合の記述
window.addEventListener('load', function () {
	PositionCheck();/* 現在地を取得する関数を呼ぶ*/
	ScrollAnime();/* ナビゲーションに現在地のクラスをつけるための関数を呼ぶ*/
});

window.addEventListener('resize', function() {
  //リサイズされたときの処理
  PositionCheck()
});
