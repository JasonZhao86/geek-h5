import Icon from '@/components/Icon'
import styles from './index.module.scss'
import classNames from 'classnames'
import { ReactNode } from 'react'

type Props = {
  className?: string
  children?: string | ReactNode
  rightContent?: string
  onLeftClick?: () => void
}

/**
 * 顶部导航栏
 * @param {string} props.className 样式类
 * @param {JSX} props.children 是通过组件标签体传递的子元素，用于填充中间标题区域
 * @param {JSX} props.rightContent 是用于填充右侧区域的元素
 * @param {Function} props.onLeftClick 左侧后退按钮的点击事件监听函数
 * @returns
 */
const NavBar = ({ className, children, rightContent, onLeftClick }: Props) => {
  return (
    <div className={classNames(styles.root, className)}>
      {/* 后退按钮 */}
      <div className="left" onClick={onLeftClick}>
        <Icon type="iconfanhui" />
      </div>
      {/* 居中标题 */}
      {children && <div className="title">{children}</div>}
      {/* 右侧内容 */}
      {rightContent && <div className="right">{rightContent}</div>}
    </div>
  )
}

export default NavBar
