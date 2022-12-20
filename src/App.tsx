import React, { Suspense } from 'react'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { history } from './utils/history'
import AuthRoute from '@/components/AuthRoute'
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
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/home" />} />
          {/* <Redirect exact from="/" to="/home"></Redirect> */}
          <Route path="/home" component={Layout}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/article/:id" component={Article}></Route>
          <Route path="/search" component={Search}></Route>
          <Route path="/search/result" component={SearchResult}></Route>

          <AuthRoute path="/profile/edit" component={ProfileEdit}></AuthRoute>
          <AuthRoute
            path="/profile/feedback"
            component={ProfileFeedback}
          ></AuthRoute>
          <AuthRoute path="/profile/chat" component={Chat}></AuthRoute>
          <Route component={NotFound}></Route>
        </Switch>
      </Suspense>
    </div>
  </Router>
)

export default App
