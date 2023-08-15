// 関数呼び出しのオプショナルチェイニング
export {}
type GetTimeFunc = () => Date
function useTime(getTimeFunc: GetTimeFunc | undefined) {
  const timeOrUndefined = getTimeFunc?.()
}

type UserType = {
  age: number
  isAdult(): boolean
}

function checkForAdultUser(user: UserType | null) {
  if(user?.isAdult()) {
    console.log(`user is adult`)
  } else {
    console.log(`user is child`)
  }
}

class User {
  constructor(age: number) {
    this.age = age
  }
  age
  isAdult(): boolean {
    return this.age > 18
  }
}

const sampleUser1: UserType = new User(45)
console.log(sampleUser1.age, sampleUser1.isAdult())
checkForAdultUser(sampleUser1)
checkForAdultUser(null)