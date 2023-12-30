export const handleChangeFile = ({
  payload,
  accept,
  callback
}: {
  payload: Event
  accept?: 'IMAGE' | 'PDF'
  callback: (file: File) => void
}) => {
  const target = <HTMLInputElement>payload.target
  if (target.validity.valid && target.files && target.files[0]) {
    let accepted = false
    switch (accept) {
      case 'IMAGE': {
        if (target.files[0].type?.startsWith('image')) {
          accepted = true
        }
        break
      }
      case 'PDF': {
        if (target.files[0].type === 'application/pdf') {
          accepted = true
        }
        break
      }
      default: {
        accepted = true
      }
    }
    if (accepted) {
      callback(target.files[0])
    }
    target.value = ''
  }
}
