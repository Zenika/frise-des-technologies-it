const debounce = <Args = unknown, Result = void>(
  func: (args: Args) => Result,
  ms: number
): ((args: Args) => Promise<Result>) => {
  let timer: ReturnType<typeof setTimeout>

  return (args: Args): Promise<Result> =>
    new Promise((resolve) => {
      if (timer) {
        clearTimeout(timer)
      }

      timer = setTimeout(() => {
        resolve(func(args))
      }, ms)
    })
}

export default debounce
