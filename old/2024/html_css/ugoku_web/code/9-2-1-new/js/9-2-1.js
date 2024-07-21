document.querySelectorAll('.title').forEach( (title) => {
  title.addEventListener('click', () => {
    let findElm = title.nextElementSibling

    findElm.classList.toggle('open')
    title.classList.toggle('close')
  })
})

window.addEventListener('load', () => {
  document.querySelectorAll('.title').forEach( (title) => {
    let findElm = title.nextElementSibling

    findElm.classList.remove('open')
    title.classList.remove('close') 
  })

  let firstAccordionArea = document.querySelector('.accordion-area li:first-of-type section')
  let firstAccordionAreaTitle = firstAccordionArea.querySelector('.title')

  firstAccordionAreaTitle.nextElementSibling.classList.add('open')
  firstAccordionAreaTitle.classList.add('close')
})

//ページが読み込まれた際にopenクラスをつけ、openがついていたら開く動作※不必要なら下記全て削除
// $(window).on('load', function(){
// 	$('.accordion-area li:first-of-type section').addClass("open"); //accordion-areaのはじめのliにあるsectionにopenクラスを追加
// 	$(".open").each(function(index, element){	//openクラスを取得
// 		var Title =$(element).children('.title');	//openクラスの子要素のtitleクラスを取得
// 		$(Title).addClass('close');				//タイトルにクラス名closeを付与し
// 		var Box =$(element).children('.box');	//openクラスの子要素boxクラスを取得
// 		$(Box).slideDown(500);					//アコーディオンを開く
// 	});
// });
