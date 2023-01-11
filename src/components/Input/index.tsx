import { useEffect, useRef } from 'react'
import styles from './index.module.scss'
import classNames from 'classnames'
// 理想效果：Input要和原生的input使用效果一样，，原生input支持的所有属性Inupt都要支持
// Button
// interface Props extends InputHTMLAttributes<HTMLInputElement> {
//   extra?: string
//   onExtraClick?: () => void
//   className?: string
//   autoFocus?: boolean
//   type?: 'text' | 'password'
// }

type Props = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'type'
> & {
  extra?: string
  onExtraClick?: () => void
  className?: string
  autoFocus?: boolean
  type?: 'text' | 'password'
}
export default function Input({
  extra,
  onExtraClick,
  className,
  autoFocus,
  ...rest
}: Props) {
  // focus
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (autoFocus) {
      inputRef.current!.focus()
    }
  }, [autoFocus])
  return (
    <div className={styles.root}>
      <input
        ref={inputRef}
        className={classNames('input', className)}
        {...rest}
      />
      {extra ? (
        <div className="extra" onClick={onExtraClick}>
          {extra}
        </div>
      ) : null}
    </div>
  )
}
