//ドロップダウンの設定を関数でまとめる
function mediaQueriesWin(){
	// var width = $(window).width();
	let width = window.innerWidth
	if(width <= 768) {//横幅が768px以下の場合
		// $(".has-child>a").off('click');	//has-childクラスがついたaタグのonイベントを複数登録を避ける為offにして一旦初期状態へ

		const elements = document.querySelectorAll('.has-child > a')
		elements.forEach(element => {
			element.removeEventListener('click', {})
		})

		const anchors = document.querySelectorAll('.has-child > a')
		anchors.forEach(anchor => {
			anchor.addEventListener('click', (event) =>  {
				event.preventDefault() // リンクの無効化
				const parentElem = anchor.parentElement // aタグから見た親要素の<li>を取得
				parentElem.classList.toggle('active'); // 矢印方向を変えるためのクラス名を付与
				const childUl = parentElem.querySelector('ul'); // liの子要素の<ul>を取得
				if (childUl) {
					const isExpanded = window.getComputedStyle(childUl).display === 'block'
					if (isExpanded) {
						childUl.style.display = 'none'; // スライドを閉じる
					} else {
						childUl.style.display = 'block'; // スライドを開く
					}
				}
			})
		})
	} else {//横幅が768px以上の場合
		const elements = document.querySelectorAll('.has-child > a')
		elements.forEach(element => {
			element.removeEventListener('click', {})
			element.style.display = ''
		})
		// $('.has-child').children('ul').css("display","");//スライドトグルで動作したdisplayも無効化にする
	}
}

// ページが読み込まれたらすぐに動かしたい場合の記述
window.addEventListener('load', () => {
	mediaQueriesWin()	
})

window.addEventListener('resize', () => {
	mediaQueriesWin()	
})