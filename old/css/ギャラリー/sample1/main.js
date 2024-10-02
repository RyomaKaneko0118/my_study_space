//lightbox オプションの設定※https://lokeshdhakar.com/projects/lightbox2/#options参照

//ふわっと見せるためのJS。3-5-3 ページが読み込まれたらすぐに動かしたい&画面をスクロールをしたら動かしたい場合内のソースコード使用

const fadeAnime = () => {
	const liClassGalleryElements = document.querySelectorAll('.gallery li')
	liClassGalleryElements.forEach(element => {
		const elementPosition = element.offsetTop
		const scrollY = Math.round(window.scrollY)
		const windowHeight = window.innerHeight
		if (scrollY >= elementPosition - windowHeight) {
			element.classList.add('flipLeft')
		} else {
			element.classList.remove('flipLeft')	
		}
	})

}

// 画面をスクロールをしたら動かしたい場合の記述
window.addEventListener('scroll', function() {
	fadeAnime()
})

// ページが読み込まれたらすぐに動かしたい場合の記述
window.addEventListener('load', function () {
	fadeAnime()
})