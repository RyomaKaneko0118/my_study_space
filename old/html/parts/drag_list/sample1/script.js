document.querySelectorAll('.drag-list li').forEach (elm => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 50;
  
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 4;
    ctx.moveTo(0, 0);
    ctx.lineTo(50, 50);
    ctx.moveTo(0, 50);
    ctx.lineTo(50, 0);
    ctx.stroke();

	elm.ondragstart = function () {
		event.dataTransfer.setData('text/plain', event.target.id);
        event.dataTransfer.setDragImage(canvas, 25, 25)
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