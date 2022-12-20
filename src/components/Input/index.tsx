import classNames from 'classnames'
import { InputHTMLAttributes, useEffect, useRef } from 'react'
import style from './index.module.scss'

// interface Props extends InputHTMLAttributes<HTMLInputElement> {
//   extra?: string
//   className?: string
//   onExtraClick?: () => void
//   autoFocus?: boolean
// }

// type Props = {
//   extra?: string
//   className?: string
//   onExtraClick?: () => void
//   autoFocus?: boolean
//   type?: 'text' | 'password'
// } & InputHTMLAttributes<HTMLInputElement>

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'autoFocus'
> & {
  extra?: string
  className?: string
  onExtraClick?: () => void
  autoFocus?: boolean
  type?: 'text' | 'password'
}

/**
 * 输入组件
 * @param {String} className 样式类
 * @param {String} type 输入类型（即 input 标签支持的所有 type 值）
 * @param {String} name 即 input 标签的 name 属性
 * @param {String} value 即 input 标签的 value 属性
 * @param {String} placeholder 即 input 标签的 placeholder 属性
 * @param {Function} onChange 即 input 标签的 change 事件
 * @param {String} extra 右侧区域显示内容
 * @param {Function} onExtraClick 右侧区域点击事件
 * @param {Array} rest 其他传入的属性
 * @returns
 */
export default function Input({
  extra,
  className,
  onExtraClick,
  autoFocus,
  ...rest
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (autoFocus) {
      inputRef.current!.focus()
    }
  }, [autoFocus])
  return (
    <div className={style.root}>
      <input
        ref={inputRef}
        className={classNames('input', className)}
        {...rest}
      />
      {extra && (
        <div className="extra" onClick={onExtraClick}>
          {extra}
        </div>
      )}
    </div>
  )
}
