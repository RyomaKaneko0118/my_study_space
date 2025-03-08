const isVisibleUserGender = () => {
  const checkbox = document.querySelector('#is-visible')
  const hiddenInput = document.querySelector('input[type="hidden"][name="is-visible"]')

  checkbox.addEventListener('change', (event) => {
    console.log(event.target)
    const checkbox = event.target
    if (checkbox.checked) {
      console.log("checked")
      hiddenInput.value = "true"
    } else {
      hiddenInput.value = "false"
    }
  })
}

document.addEventListener("DOMContentLoaded", (event) => {
  console.log(`${event} has been fired`)
  isVisibleUserGender()
})
