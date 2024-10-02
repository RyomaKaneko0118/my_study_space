// プロミス風に振る舞うクラス
export {}
class  HelloWorldPromise implements PromiseLike<string> {
  readonly #promise: Promise<string>
  constructor({ fails }: {fails: boolean }) {
    if (fails) {
      this.#promise = Promise.reject("ERROR")
    } else {
      this.#promise = Promise.resolve("Hello")
    }
  }

  then<TResult1 = string, TResult2 = never>(
    onfulfilled?:
      | ((value: string) => TResult1 | PromiseLike<TResult1>) 
      | null 
      | undefined, 
    onrejected?: 
      |((reason: any) => TResult2 
      | PromiseLike<TResult2>) 
      | null 
      | undefined
    ): PromiseLike<TResult1 | TResult2> {
      return this.#promise.then(onfulfilled, onrejected)    
  }

  catch<Result = never>(
    onRejected?:
      |((reason: unknown) => Result | PromiseLike<Result>)
      | undefined
      | null
  ): Promise<string | Result> {
    return this.#promise.catch(onRejected)
  }

  finally(onFinallty?: (() => void) | undefined | null): Promise<string> {
    return this.#promise.finally(onFinallty)
  }


}

(async () => {
  try {
    const value: string = await new HelloWorldPromise({ fails: true })
    console.log(value)
  } catch(e) {
    console.log(e)
  } finally {
    console.log("try catch finally")
  } 
})()

new HelloWorldPromise({ fails: false })
  .then(value => value.toUpperCase())
  .then(value => console.log(value))

new HelloWorldPromise({ fails: true })
  .catch((reason) => console.log(reason))
  .finally(() => console.log("finally"))
