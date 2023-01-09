import React from 'react'
import { Route, RouteProps } from 'react-router-dom'
import style from './index.module.scss'

// RouteProps类型带有React组件的所有属性
interface Props extends RouteProps {
  // 需要缓存的URI前缀
  alivePath: string
  component: React.ComponentType<any>
}

const KeepAlive = ({ alivePath, component: Component, ...rest }: Props) => {
  return (
    /**
     * Route组件的children props特性：无论path是否匹配location，都会渲染该Route对应的组件
     * 对应于Route组件的render props特性（常规用法）：只有path匹配了location，才会渲染该
     * Route对应的组件
     */
    <Route {...rest}>
      {(props) => {
        const { location } = props
        // 要访问的URL是否以需要缓存的URI开头
        const matched = location.pathname.startsWith(alivePath)
        return (
          <div
            className={style.root}
            /**
             * 因为无论如何都要渲染该组件，因此path不匹配location，说明访问的不是该组件，
             * 就隐藏该组件，否则就显示该组件
             */
            style={{ display: matched ? 'block' : 'none' }}
          >
            <Component {...props} />
          </div>
        )
      }}
    </Route>
  )
}

export default KeepAlive
