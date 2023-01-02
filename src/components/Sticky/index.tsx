import throttle from 'lodash/fp/throttle'
import React, { useEffect, useRef } from 'react'
import styles from './index.module.scss'

type Props = {
  // 吸顶位置的 top 值
  offset?: number
  // 本组件的子元素
  children: React.ReactElement | string
}

const Sticky = ({ children, offset = 0 }: Props) => {
  const placeholderRef = useRef<HTMLDivElement>(null)
  const childrenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // top/375 = x/当前屏幕宽度
    let realOffset = (offset / 375) * document.documentElement.clientWidth
    const placeholderEl = placeholderRef.current!
    const childrenEl = childrenRef.current!

    const onScroll = throttle(100, () => {
      // 滚动监听事件必须监听占位元素的top值，childrenRef元素固定定位之后继续滚动时，其top值就固定不变了
      const rect = placeholderEl.getBoundingClientRect()
      // 方式滚动过程中突然离开页面组件销毁导致获取到的rect为undefined
      if (rect && rect.top <= realOffset) {
        childrenEl.style.position = 'fixed'
        childrenEl.style.top = realOffset + 'px'
        placeholderEl.style.height = childrenEl.offsetHeight + 'px'
      } else {
        // 不固定定位，就跟没设置一样，默认就是不固定定位
        childrenEl.style.position = 'static'
        // static设定后，auto的定义不是必须的
        childrenEl.style.top = 'auto'
        placeholderEl.style.height = '0px'
      }
    })

    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [offset])

  return (
    <div className={styles.root}>
      {/* 占位元素 */}
      <div ref={placeholderRef} className="sticky-placeholder" />
      {/* 吸顶显示的元素 */}
      <div className="sticky-container" ref={childrenRef}>
        {children}
      </div>
    </div>
  )
}

export default Sticky
