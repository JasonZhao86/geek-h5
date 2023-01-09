import React, { Suspense } from 'react'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { history } from './utils/history'
import AuthRoute from '@/components/AuthRoute'
import KeepAlive from '@/components/KeepAlive'
// import ProfileEdit from './pages/Profile/Edit'

const Login = React.lazy(() => import('@/pages/Login'))
const Layout = React.lazy(() => import('@/pages/Layouts'))
const Article = React.lazy(() => import('@/pages/Article'))
const NotFound = React.lazy(() => import('@/pages/NotFound'))
const Chat = React.lazy(() => import('@/pages/Profile/Chat'))
const ProfileEdit = React.lazy(() => import('@/pages/Profile/Edit'))
const ProfileFeedback = React.lazy(() => import('@/pages/Profile/Feedback'))
const Search = React.lazy(() => import('@/pages/Search'))
const SearchResult = React.lazy(() => import('@/pages/Search/Result'))

const App = () => (
  <Router history={history}>
    <div className="app">
      <Suspense fallback={<div>loading</div>}>
        {/* 无论path是否匹配location，都会渲染该Route对应的组件，所以不能放在Switch中 */}
        <KeepAlive
          alivePath="/home"
          path="/home"
          component={Layout}
          // 必须精确匹配，因为二级路由下的Home组件也是以/home开头的
          exact
        ></KeepAlive>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/home/index" />} />
          {/* <Redirect exact from="/" to="/home/index"></Redirect> */}
          {/* 解决location为/home匹配不到任何组件的bug */}
          <Redirect exact from="/home" to="/home/index"></Redirect>
          <Route path="/login" component={Login}></Route>
          <Route path="/article/:id" component={Article}></Route>
          <Route path="/search" exact component={Search}></Route>
          <Route path="/search/result" component={SearchResult}></Route>

          <AuthRoute path="/profile/edit" component={ProfileEdit}></AuthRoute>
          <AuthRoute
            path="/profile/feedback"
            component={ProfileFeedback}
          ></AuthRoute>
          <AuthRoute path="/profile/chat" component={Chat}></AuthRoute>
          {/* 因为 /home不在Switch内部，所以访问/home开头的路由都会最后匹配404，因为KeepAlive不在
          Switch内部，不受其匹配成功后不继续向后匹配原则的限制 */}
          <Route
            render={(props) => {
              if (!props.location.pathname.startsWith('/home')) {
                return <NotFound />
              }
            }}
          ></Route>
        </Switch>
      </Suspense>
    </div>
  </Router>
)

export default App
