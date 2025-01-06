const createSection1 = () => {
  const wrapperDiv = document.querySelector('div.wrapper')

  const pTag = document.createElement('p')
  pTag.textContent = 'アニメーション1回分の時間の長さを指定したい'
  
  wrapperDiv.appendChild(pTag)
  
  const container = document.createElement('div')
  container.classList.add('flex')
  
  const div1 = document.createElement('div');
  div1.classList.add('change-time05', 'box', 'fadeUp');
  div1.textContent = '0.5秒かけて変化';
  
  const div2 = document.createElement('div');
  div2.classList.add('change-time1', 'box', 'fadeUp');
  div2.textContent = '1秒かけて変化';
  
  const div3 = document.createElement('div');
  div3.classList.add('change-time15', 'box', 'fadeUp');
  div3.textContent = '1.5秒かけて変化';
  
  container.appendChild(div1)
  container.appendChild(div2)
  container.appendChild(div3)
  
  wrapperDiv.appendChild(container)
}

document.addEventListener('DOMContentLoaded', () => {
  createSection1()
})

// 動きのきっかけの起点となるアニメーションの名前を定義
const fadeAnime = () => {
  const fadeUpTriggers = document.querySelectorAll('.fadeUpTrigger')

	// ふわっ
	fadeUpTriggers.forEach((fadeUpTrigger) => { //fadeUpTriggerというクラス名が
    let scroll = window.scrollY
		let elemPos = fadeUpTrigger.getBoundingClientRect().top + scroll -50//要素より、50px上の
		let windowHeight = window.innerHeight

		if (scroll >= elemPos - windowHeight){
		  fadeUpTrigger.classList.add('fadeUp');// 画面内に入ったらfadeUpというクラス名を追記
		} else {
		  fadeUpTrigger.classList.remove('fadeUp');// 画面外に出たらfadeUpというクラス名を外す
		}
	})
}
const mouseAnimation = () => {
  const rotateXHoverTriggers = document.querySelectorAll('.rotateXHoverTrigger')

  rotateXHoverTriggers.forEach((rotateXHoverTrigger) => {
    rotateXHoverTrigger.addEventListener('mouseenter', () => {
      rotateXHoverTrigger.classList.add('rotateX')
      rotateXHoverTrigger.classList.remove('fadeUp')
    })
    rotateXHoverTrigger.addEventListener('touchstart', () => {
      rotateXHoverTrigger.classList.add('rotateX')
      rotateXHoverTrigger.classList.remove('fadeUp')
    })

    rotateXHoverTrigger.addEventListener('mouseleave', () => {
      rotateXHoverTrigger.classList.remove('rotateX')
      rotateXHoverTrigger.classList.add('fadeUp')
    })
    rotateXHoverTrigger.addEventListener('touchend', () => {
      rotateXHoverTrigger.classList.remove('rotateX')
      rotateXHoverTrigger.classList.add('fadeUp')
    })
  })  
}

const btnAnimation = () => {
  const btnSelectors = document.querySelectorAll('.btn')

  btnSelectors.forEach((btnSelector) => {
    btnSelector.addEventListener('click', () => {
      const hideArea = document.querySelector('.hide_area')
      hideArea.classList.add('fadeUp')
      btnSelector.classList.add('disp_none')
    })
  })
}

// 画面をスクロールをしたら動かしたい場合の記述
window.addEventListener('scroll', () => {
  fadeAnime();/* アニメーション用の関数を呼ぶ*/
  mouseAnimation()
  btnAnimation()
})// ここまで画面をスクロールをしたら動かしたい場合の記述

// ページが読み込まれたらすぐに動かしたい場合の記述
window.addEventListener('load', () => {
  fadeAnime();/* アニメーション用の関数を呼ぶ*/
  mouseAnimation()
  btnAnimation()
});// ここまでページが読み込まれたらすぐに動かしたい場合の記述