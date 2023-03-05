// ドロップダウンメニュー
const buttons = document.querySelectorAll('.dropdown-btn')
buttons.forEach((btn) => {
  btn.addEventListener("mouseover", (event: any) => {
    event.target.children.item(0)?.classList.add("open")
  })
  btn.addEventListener("mouseleave", (event: any) => {
    event.target.children.item(0)?.classList.remove("open")
  })
})

// // グローバルナビの開閉
// $(function() {
//   $('.nav-button-wrap').on('click', function() {
//     if ($(this).hasClass('active')) {
//       // スマホ用メニューが表示されていたとき
//       $(this).removeClass('active');
//       $('.globalnav').addClass('close');
//       $('.globalnav-wrap , body').removeClass('open');
//     } else {
//       // スマホ用メニューが非表示の時
//       $(this).addClass('active');
//       $('.globalnav').removeClass('close');
//       $('.globalnav-wrap , body').addClass('open');
//     }
//   });
// });