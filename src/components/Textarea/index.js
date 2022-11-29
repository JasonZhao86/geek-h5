import classNames from 'classnames'
import { useState } from 'react'
import style from './index.module.scss'

/**
 * 带字数统计的多行文本
 * @param {String} className 样式类
 * @param {String} value 文本框的内容
 * @param {Function} onChange 输入内容变动事件
 * @param {String} maxLength 允许最大输入的字数（默认100个字符）
 */
const Textarea = ({ className, value, onChange, maxLength = 100, ...rest }) => {
  const [count, setCount] = useState(value.length || 0)
  const onValueChange = (e) => {
    const newValue = e.target.value
    setCount(newValue.length)
    // 指定义的Textarea也有受控组件的需求，onChange事件，函数调用也可以支持ES6的？号判断语法
    onChange?.(e)
  }

  return (
    <div className={classNames(style.root, className)}>
      {/* 文本输入框 */}
      <textarea
        {...rest}
        className="textarea"
        maxLength={maxLength}
        value={value}
        onChange={onValueChange}
      />
      {/* 当前字数/最大允许字数 */}
      <div className="count">
        {count}/{maxLength}
      </div>
    </div>
  )
}

export default Textarea
