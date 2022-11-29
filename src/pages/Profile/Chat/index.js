import NavBar from '@/components/NavBar'
import Input from '@/components/Input'
import Icon from '@/components/Icon'
import { useHistory } from 'react-router-dom'
import style from './index.module.scss'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import io from 'socket.io-client'
import { getTokenInfo } from '@/utils/storage'

const Chat = () => {
  const history = useHistory()
  const [messageList, setMessageList] = useState([
    // 放两条初始消息
    {
      type: 'robot',
      text: '亲爱的用户您好，小智同学为您服务。',
    },
    {
      type: 'user',
      text: '你好',
    },
  ])
  // 从 Redux 中获取当前用户基本信息
  const user = useSelector((state) => state.profile.user)
  // 用于缓存 socket.io 客户端实例
  const clientRef = useRef(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // 创建客户端实例
    const client = io('http://toutiao.itheima.net', {
      transports: ['websocket'],
      // 在查询字符串参数中传递 token
      query: {
        token: getTokenInfo().token,
      },
    })

    // 监听连接成功的事件
    client.on('connect', () => {
      // 向聊天记录中添加一条消息
      setMessageList((messageList) => [
        ...messageList,
        { type: 'robot', text: '我现在恭候着您的提问。' },
      ])
    })

    // 监听收到消息的事件
    client.on('message', (data) => {
      /**
       * 采用setMessage的第二种写法，避免直接依赖外部的messageList，但是useEffect里面的依赖项必须为空，
       * 不能写messageList，否则每次messageList变更了都会触发useEffect的回调函数执行（断开上一次的ws连接，
       * 然后建立新的ws连接），这完全没有必要，我们只需要在组件初始化的时候建立一次ws连接即可
       */
      setMessageList((messageList) => [
        ...messageList,
        { type: 'robot', text: data.msg },
      ])
      console.log('>>>>收到 socket.io 消息:', data)
    })

    // 将客户端实例缓存到 ref 引用中，方便useEffect外面使用
    clientRef.current = client

    // 在组件销毁时关闭 socket.io 的连接
    return () => {
      client.close()
    }
  }, [])

  // 按回车发送消息
  const onSendMessage = (e) => {
    if (e.keyCode === 13) {
      // 第一个参数message为后端规定的消息事件名称， 第二个参数为后端要求的消息格式
      clientRef.current.emit('message', {
        msg: message,
        timestamp: Date.now(),
      })
      // 向聊天记录中添加当前发送的消息
      setMessageList((messageList) => [
        ...messageList,
        { type: 'user', text: message },
      ])
      // 发送后清空输入框
      setMessage('')
    }
  }

  // 用于操作聊天列表元素的引用
  const chatListRef = useRef(null)
  // 监听聊天数据的变化，改变聊天容器元素的 scrollTop 值让页面滚到最底部
  useEffect(() => {
    chatListRef.current.scrollTop = chatListRef.current.scrollHeight
  }, [messageList])

  return (
    <div className={style.root}>
      {/* 顶部导航栏 */}
      <NavBar className="fixed-header" onLeftClick={() => history.go(-1)}>
        小智同学
      </NavBar>

      {/* 聊天记录列表 */}
      <div className="chat-list" ref={chatListRef}>
        {messageList.map((item, index) => {
          // 机器人的消息
          if (item.type === 'robot') {
            return (
              <div className="chat-item" key={index}>
                <Icon type="iconbtn_xiaozhitongxue" />
                <div className="message">{item.text}</div>
              </div>
            )
          } else {
            // 用户的消息
            return (
              <div className="chat-item user" key={index}>
                <img
                  src={
                    user.photo ||
                    'http://toutiao.itheima.net/images/user_head.jpg'
                  }
                  alt=""
                />
                <div className="message">{item.text}</div>
              </div>
            )
          }
        })}
      </div>

      {/* 底部消息输入框 */}
      <div className="input-footer">
        <Input
          className="no-border"
          placeholder="请描述您的问题"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={onSendMessage}
        />
        <Icon type="iconbianji" />
      </div>
    </div>
  )
}

export default Chat
