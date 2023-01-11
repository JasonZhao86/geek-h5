// 获取函数fn的返回值的类型
// let num = 12 as const
// let obj = {
//   name: 'zs',
//   age: 19,
// }
// const fn = (n1: number, n2: number): number => {
//   return n1 + n2
// }
// typeof 可以获取到某个值的类型
// type MyType = typeof obj
// type FnType = typeof fn

// ReturnType: 可以获取某个函数类型的返回值
// type Res = ReturnType<typeof fn>

// type User = {
//   name: string
//   age: number
// }

// const user = {
//   name: 'zs',
//   age: 18
// }

// type A = User['name']

// let str = 'abc'
// const str1 = 'bcd'

// // str = str1
// // console.log(str);

// str1 = str

const Question = () => {
  // 使用useRef的注意点：
  // 1. useRef一般需要配合非空断言来一起使用 ref初始值给了null
  // 2. 使用useRef需要配合 泛型来执行useRef的类型
  // const aRef = useRef<HTMLImageElement>(null)
  // console.log(aRef.current!.src)
  return (
    <div>
      {/* <AuthRoute path="123" exact component={Input}></AuthRoute> */}
    </div>
  )
}

export default Question
