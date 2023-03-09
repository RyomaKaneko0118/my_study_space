document.querySelectorAll('.drag-list li').forEach (elm => {
	elm.ondragstart = function () {
		event.dataTransfer.setData('text/plain', event.target.id);
	};
	elm.ondragover = function () {
		event.preventDefault();
		this.style.borderTop = '2px solid blue';
	};
	elm.ondragleave = function () {
		this.style.borderTop = '';
	};
	elm.ondrop = function () {
		event.preventDefault();
		let id = event.dataTransfer.getData('text/plain');
		let elm_drag = document.getElementById(id);
		this.parentNode.insertBefore(elm_drag, this);
		this.style.borderTop = '';
	};
});