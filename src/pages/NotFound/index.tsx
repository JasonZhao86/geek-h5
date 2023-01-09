import { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

const NotFound = () => {
  const [second, setSecond] = useState<number>(3)
  const history = useHistory()
  const timerRef = useRef<number>(-1)

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      if (second === 1) {
        history.replace('/home/index')
      } else {
        setSecond(second - 1)
      }
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [second, history])

  return (
    <div>
      <h1>对不起，你访问的内容不存在...</h1>
      <p>
        {second} 秒后，返回<Link to="/home/index">首页</Link>
      </p>
    </div>
  )
}

export default NotFound
