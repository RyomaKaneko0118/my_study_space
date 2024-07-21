// execCommandは非推奨
function copyToClipboard() {
  const textToCopy = "Hello, world!"; // コピーするテキストを指定する
  const textarea = document.createElement("textarea");
  textarea.value = textToCopy;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  alert("Text has been copied to clipboard!");
}
