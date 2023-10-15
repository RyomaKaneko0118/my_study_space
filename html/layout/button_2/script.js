var button = document.querySelector('input');
var button1 = document.getElementById('button_1');
console.log(button1);
button.addEventListener('click', disableButton);
function disableButton() {
    button.disabled = true;
    button.value = 'Disabled';
    setTimeout(function () {
        button.disabled = false;
        button.value = 'Enabled';
    }, 2000);
}
