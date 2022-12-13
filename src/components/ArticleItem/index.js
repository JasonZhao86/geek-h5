import classnames from 'classnames'
import Icon from '@/components/Icon'
import styles from './index.module.scss'
import { useSelector } from 'react-redux'
import relativeTime from 'dayjs/plugin/relativeTime'
import Image from '@/components/Image'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const ArticleItem = ({ article, onClose }) => {
  //   const type = 3
  // const images = ['http://geek.itheima.net/resources/images/3.jpg']
  //   const images = [
  //     'http://geek.itheima.net/resources/images/91.jpg',
  //     'http://geek.itheima.net/resources/images/3.jpg',
  //     'http://geek.itheima.net/resources/images/52.jpg',
  //   ]

  const {
    cover: { type, images },
    title,
    aut_name,
    comm_count,
    pubdate,
    art_id,
  } = article

  // 双感叹号强制转换为bool值
  const isLogin = useSelector((state) => !!state.login.token)

  return (
    <div className={styles.root}>
      <div
        className={classnames(
          'article-content',
          type === 3 ? 't3' : '',
          type === 0 ? 'none-mt' : ''
        )}
      >
        <h3>{title}</h3>
        {type !== 0 && (
          <div className="article-imgs">
            {images.map((item, i) => (
              <div className="article-img-wrapper" key={i}>
                {/* <img src={item} alt="" /> */}
                <Image src={item} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={classnames('article-info', type === 0 ? 'none-mt' : '')}>
        <span>{aut_name}</span>
        <span>{comm_count} 评论</span>
        <span>{dayjs().from(pubdate)}</span>

        {/* 只有登录用户可以举报反馈 */}
        {isLogin && (
          <span
            className="close"
            onClick={(e) => {
              // 防止事件穿透
              e.stopPropagation()
              // 调用传入的回调函数，公共组件不负责处理具体的业务逻辑
              onClose(art_id)
            }}
          >
            <Icon type="iconbtn_essay_close" />
          </span>
        )}
      </div>
    </div>
  )
}

export default ArticleItem
