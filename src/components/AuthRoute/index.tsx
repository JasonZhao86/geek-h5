import React from 'react'
import { hasToken } from '@/utils/storage'
import { Route, Redirect, RouteProps } from 'react-router-dom'

// 下面这一行注释必须加，表示仅在该行禁用eslint语法检测，否则any类型会引发报错提示
interface PrivateRouteProps extends RouteProps {
  // tslint:disable-next-line:no-any
  component: React.ComponentType<any>
}

/**
 * 鉴权路由组件
 * @param {*} component 本来 Route 组件上的 component 属性
 * @param {Array} rest 其他属性
 */
export default function AuthRoute({
  component: Component,
  ...rest
}: PrivateRouteProps) {
  return (
    <Route
      {...rest}
      render={(props) => {
        // 如果有 token，则展示传入的组件
        if (hasToken()) {
          return <Component {...props} />
        }

        // console.log(props.location.pathname)
        // 否则调用 Redirect 组件跳转到登录页
        return (
          /**
           * 如果没有权限，直接重定向到/login页面，根本不会跳转到目标pathname，
           * 因此history的页面历史栈中是没有该路径的任何记录的
           * */
          <Redirect
            to={{
              pathname: '/login',
              /**
               * state为关键词，不能自定义，在其他组件中通过history.location.state
               * 获取这里定义的值
               *  */
              state: {
                from: props.location.pathname,
              },
            }}
          />
        )
      }}
    />
  )
}
