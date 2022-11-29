import React, { Suspense } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

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
  <Router>
    <div className="app">
      <Suspense fallback={<div>loading</div>}>
        <Switch>
          <Redirect exact from="/" to="/home"></Redirect>
          <Route path="/home" component={Layout}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/article/:id" component={Article}></Route>
          <Route path="/search" component={Search}></Route>
          <Route path="/search/result" component={SearchResult}></Route>
          <Route path="/profile/edit" component={ProfileEdit}></Route>
          <Route path="/profile/feedback" component={ProfileFeedback}></Route>
          <Route path="/profile/chat" component={Chat}></Route>
          <Route component={NotFound}></Route>
        </Switch>
      </Suspense>
    </div>
  </Router>
)

export default App
