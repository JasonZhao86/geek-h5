// import Icon from '@/components/Icon'
// import Input from '@/components/Input'

import TextArea from '@/components/Textarea'
// import { useRef } from 'react'

// 联合类型
// type MyType = number | string
// let a: MyType = '123'
// a = 123
// console.log(a)
// 交叉类型
// type User = {
//   name: string
//   age: number
// }

// type Demo = {
//   gender: string
//   age: string
// }

// 交叉类型，可以合并多个类型，，但是需要注意冲突的问题 Omit
// type Type = User & Omit<Demo, 'age'>

// const t: Type = {
//   name: 'zs',
//   age: 18,
//   gender: '女',
// }

const Question = () => {
  // 使用useRef的注意点：
  // 1. useRef一般需要配合非空断言来一起使用 ref初始值给了null
  // 2. 使用useRef需要配合 泛型来执行useRef的类型
  // const aRef = useRef<HTMLImageElement>(null)
  // console.log(aRef.current!.src)
  return (
    <div>
      {/* <NavBar onLeftClick={() => console.log('123')} extra={<span>123</span>}>
        登录
      </NavBar>
      <a href="#/123">哈哈哈</a>
      <img src="1.jpg" alt="" />
      <button>按钮</button> */}
      {/* <input type="text" /> */}
      {/* <TextArea value="123" placeholder="哈哈哈"></TextArea> */}
      {/* <Input
        autoFocus
        extra="获取验证码"
        onExtraClick={() => {
          console.log('哈哈')
        }}
        placeholder="你好啊"
        value={'哈哈哈'}
        type="text"
      ></Input> */}
    </div>
  )
}

export default Question
