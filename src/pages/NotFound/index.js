import { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

const NotFound = () => {
  const [second, setSecond] = useState(3)
  const history = useHistory()
  const timerRef = useRef(-1)

  //
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (second === 1) {
        history.replace('/home')
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
        {second} 秒后，返回<Link to="/home">首页</Link>
      </p>
    </div>
  )
}

export default NotFound
