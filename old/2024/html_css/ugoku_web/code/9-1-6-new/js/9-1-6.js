//線が伸びるための設定を関数でまとめる
function ScrollTimelineAnime(){
	let timelineItems = document.querySelectorAll('.timeline li')
	timelineItems.forEach((item) => {
		console.log(item)
	})
	$('.timeline li').each(function() {
		let elemPos = this.getBoundingClientRect().top + window.pageYOffset;
		console.log("clientRect: " + this.getBoundingClientRect().top)
		console.log(window.pageYOffset)
		console.log(elemPos)
		console.log("innerHeight: " + window.innerHeight)
		let scroll = window.pageYOffset;
		let windowHeight = window.innerHeight
		let startPoint = 100; //線をスタートさせる位置を指定※レイアウトによって調整してください

		if (scroll >= elemPos - windowHeight - startPoint) {
		  let style = window.getComputedStyle(this)
			console.log("style: " + style)
			console.log("height: " + this.height) // null
			console.log("offsetHeight: " + this.offsetHeight)
      let marginTop = parseInt(style.marginTop)
      let marginBottom = parseInt(style.marginBottom)
      let H = this.offsetHeight + marginTop + marginBottom;
			console.log("H: " + H)				
			let percent = (scroll + startPoint - elemPos) / (H / 2) * 100//liの余白と高さの半分で線を100％に伸ばす
			console.log("percent: " + percent)

			// 100% を超えたらずっと100%を入れ続ける
			if(percent  > 100){
				percent  = 100;
			}
			let borderLine = this.querySelector('.border-line')
			borderLine.style.height = percent + '%'
			if (percent <= 0) {
				borderLine.style.height = 0 + '%'
			}
		} 
	});
}

// 画面をスクロールをしたら動かしたい場合の記述
$(window).on('scroll', function(){
	ScrollTimelineAnime();// 線が伸びる関数を呼ぶ
});

// ページが読み込まれたらすぐに動かしたい場合の記述
$(window).on('load', function(){
	ScrollTimelineAnime();// 線が伸びる関数を呼ぶ
});
