import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import App from './App'
import store from '@/store'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import '@scss/index.scss'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
