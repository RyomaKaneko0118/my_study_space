async function copyTargetText(e) {
  try {
    await navigator.clipboard.writeText(e.target.innerText);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
}

document.querySelector("button").addEventListener("click", (e) => {
  e.preventDefault();
  copyTargetText(e);
  const copyAlert = document.createElement("span");
  copyAlert.innerText = `"${e.target.innerText}" copied to clipboard`;
  document.body.appendChild(copyAlert);
  setTimeout(() => {
    document.body.removeChild(copyAlert);
  }, 1500);
});
