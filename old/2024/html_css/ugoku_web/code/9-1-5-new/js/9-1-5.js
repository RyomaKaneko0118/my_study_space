window.addEventListener('scroll', function() {
	let totalHeight = document.body.scrollHeight - window.innerHeight;
	let progress = (window.pageYOffset / totalHeight) * 100;
	document.getElementById('progress-bar').style.width = progress + '%';
});
// window.addEventListener('scroll', function() {
// 	var totalHeight = document.body.scrollHeight - window.innerHeight;
// 	var progress = (window.pageYOffset / totalHeight) * 100;
// 	document.getElementById('progress-bar').style.width = progress + '%';
// });