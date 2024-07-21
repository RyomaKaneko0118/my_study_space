//ドロップダウンの設定を関数でまとめる
function mediaQueriesWin(){
	let width = window.innerWidth
	if(width <= 768) {//横幅が768px以下の場合

		const elements = document.querySelectorAll('.has-child > a')
		elements.forEach(element => {
			element.removeEventListener('click', {})
		})

		const anchors = document.querySelectorAll('.has-child > a')
		anchors.forEach(anchor => {
			anchor.addEventListener('click', (event) =>  {
				event.preventDefault() // リンクの無効化
				const parentElem = anchor.parentElement // aタグから見た親要素の<li>を取得
				console.log(parentElem)
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
	} 
	else {
		const aTagElementsInHasChild = document.querySelectorAll('.has-child > a')
		aTagElementsInHasChild.forEach(element => {
			element.removeEventListener('click', {})
		})
		const elementsHasChild = document.querySelectorAll('.has-child')
		elementsHasChild.forEach(element => {
			element.classList.remove('active')
		})
		const ulElementsInHasChild = document.querySelectorAll('.has-child > ul')
		ulElementsInHasChild.forEach(element => {
			element.style.display = ''
		})
	}
}

// ページが読み込まれたらすぐに動かしたい場合の記述
window.addEventListener('load', () => {
	mediaQueriesWin()	
})

window.addEventListener('resize', () => {
	mediaQueriesWin()	
})