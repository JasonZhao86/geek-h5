import React from 'react'
import { Suspense } from 'react'
import { Switch, Route } from 'react-router-dom'
import { useHistory, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import Icon from '@/components/Icon'
import style from './index.module.scss'

const Home = React.lazy(() => import('@/pages/Home'))
const Question = React.lazy(() => import('@/pages/Question'))
const Video = React.lazy(() => import('@/pages/Video'))
const Profile = React.lazy(() => import('@/pages/Profile'))

// - to 点击按钮后切换到的页面路径
const buttons = [
  { id: 1, title: '首页', to: '/home', icon: 'iconbtn_home' },
  { id: 2, title: '回答', to: '/home/question', icon: 'iconbtn_qa' },
  { id: 3, title: '视频', to: '/home/video', icon: 'iconbtn_video' },
  { id: 4, title: '我的', to: '/home/profile', icon: 'iconbtn_mine' },
]

const Layout = () => {
  // 获取路由信息 location 对象
  const location = useLocation()
  // 获取路由历史 history 对象
  const history = useHistory()
  return (
    <div className={style.root}>
      {/* 区域一：点击按钮切换显示内容的区域 */}
      <div className="tab-content">
        <Suspense fallback={<div>loading</div>}>
          <Switch>
            <Route exact path="/home" component={Home}></Route>
            <Route path="/home/question" component={Question}></Route>
            <Route path="/home/video" component={Video}></Route>
            <Route path="/home/profile" component={Profile}></Route>
          </Switch>
        </Suspense>
      </div>
      {/* 区域二：按钮区域，会使用固定定位显示在页面底部 */}
      <div className="tabbar">
        {buttons.map((item) => {
          // 判断当前页面路径和按钮路径是否一致，如果一致则表示该按钮处于选中状态
          const selected = location.pathname === item.to
          return (
            <div
              key={item.id}
              className={classNames(
                'tabbar-item',
                selected ? 'tabbar-item-active' : ''
              )}
              onClick={() => history.push(item.to)}
            >
              <Icon type={selected ? `${item.icon}_sel` : item.icon}></Icon>
              <span>{item.title}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Layout
