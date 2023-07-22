//基準点の準備
let elemTop = [];

//現在地を取得するための設定を関数でまとめる
function PositionCheck(){
    //headerの高さを取得
  const headerH = document.getElementById("header").offsetHeight
    //.scroll-pointというクラス名がついたエリアの位置を取得する設定
  const scrollPoints = document.querySelectorAll(".scroll-point")
  scrollPoints.forEach(function(elem, i) { elemTop[i] = Math.round(parseInt(elem.offsetTop - headerH)) })
  console.log(elemTop)
}

//ナビゲーションに現在地のクラスをつけるための設定
function ScrollAnime() {//スクロールした際のナビゲーションの関数にまとめる
  let scroll = Math.round(window.scrollY)
  //ナビゲーションのliの何番目かを定義するための準備
	let NavElem = document.querySelectorAll("#g-nav li")
  NavElem.forEach(function(element) {
    element.classList.remove('current');
  })
	if(scroll >= 0 && scroll < elemTop[1]) {
      NavElem[0].classList.add('current')
    }
	else if(scroll >= elemTop[1] && scroll < elemTop[2]) {
    NavElem[1].classList.add('current')
    } 
  else if(scroll >= elemTop[2] && scroll < elemTop[3]) { 
    NavElem[2].classList.add('current')
  } 
  else if(scroll >= elemTop[3]) {// .scroll-point 3つめ（area-3）以上
    NavElem[3].classList.add('current')
  } 
}

// ナビゲーションをクリックした際のスムーススクロール
// $('#g-nav a').click(function () {
// 	var elmHash = $(this).attr('href'); //hrefの内容を取得
// 	var headerH = $("#header").outerHeight(true);//追従するheader分の高さ（70px）を引く
// 	var pos = Math.round($(elmHash).offset().top-headerH);	//headerの高さを引き小数点を四捨五入
// 	$('body,html').animate({scrollTop: pos}, 500);//取得した位置にスクロール※数値が大きいほどゆっくりスクロール
// 	return false;//リンクの無効化
// });

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
