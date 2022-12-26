import Icon from '@/components/Icon'
import { addChannel, delChannel, getAllChannels } from '@/store/actions'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { differenceBy } from 'lodash'
import styles from './index.module.scss'
import classNames from 'classnames'
import { Toast } from 'antd-mobile'
import { RootState } from '@/store'
import { Channel } from '@/store/types'

type Props = {
  tabActiveIndex: number
  onClose: () => void
  onChannelClick: (index: number) => void
}

/**
 * 频道管理组件
 * @param {Number} props.tabActiveIndex 用户选中的频道的索引
 * @param {Function} props.onClose 关闭频道管理抽屉时的回调函数
 * @param {Function} props.onChannelClick 当点击频道列表中的某个频道时的回调函数
 */
const Channels = ({ tabActiveIndex, onClose, onChannelClick }: Props) => {
  const userChannels = useSelector(
    (state: RootState) => state.home.userChannels
  )
  // 推荐频道 = 所有频道 - 我的频道
  const optionChannels = useSelector((state: RootState) => {
    const { allChannels } = state.home
    // return allChannels.filter(
    //   (item) => userChannels.findIndex((v) => v.id === item.id) === -1
    // )
    return differenceBy(allChannels, userChannels, 'id')
  })
  const [editable, setEditable] = useState(false)

  const dispatch = useDispatch()

  const onAddChannel = (channel: Channel) => {
    dispatch(addChannel(channel))
  }

  const onDeleteChannel = (channel: Channel, i: number) => {
    if (userChannels.length <= 5) {
      Toast.info('至少保留5个频道', 1)
    }
    dispatch(delChannel(channel))
    // 需要处理页面显示的高亮下标
    if (i < tabActiveIndex) {
      onChannelClick(tabActiveIndex - 1)
    }

    if (i === tabActiveIndex) {
      onChannelClick(0)
    }
  }

  useEffect(() => {
    // 获取所有的频道数据
    dispatch(getAllChannels())
  }, [dispatch])

  return (
    <div className={styles.root}>
      {/* 顶部栏：带关闭按钮 */}
      <div className="channel-header">
        <Icon type="iconbtn_channel_close" onClick={onClose} />
      </div>

      {/* 频道列表 */}
      <div className="channel-content">
        {/* 当前已选择的频道列表 */}
        <div className={classNames('channel-item', { edit: editable })}>
          <div className="channel-item-header">
            <span className="channel-item-title">我的频道</span>
            <span className="channel-item-title-extra">
              {editable ? '点击删除频道' : '点击进入频道'}
            </span>
            <span
              className="channel-item-edit"
              onClick={() => setEditable(!editable)}
            >
              {editable ? '保存' : '编辑'}
            </span>
          </div>

          {/* 我的频道 */}
          <div className="channel-list">
            {userChannels.map((item, i) => (
              <span
                className={classNames('channel-list-item', {
                  selected: tabActiveIndex === i,
                })}
                key={item.id}
                onClick={() => {
                  // 编辑状态无法跳转
                  if (editable) return
                  // 子传父，修改高亮
                  onChannelClick(i)
                  // 关闭弹层
                  onClose()
                }}
              >
                {item.name}
                {editable && (
                  <Icon
                    type="iconbtn_tag_close"
                    onClick={() => onDeleteChannel(item, i)}
                  />
                )}
              </span>
            ))}
          </div>
        </div>

        {/* 推荐的频道列表 */}
        <div className="channel-item">
          <div className="channel-item-header">
            <span className="channel-item-title">频道推荐</span>
            <span className="channel-item-title-extra">点击添加频道</span>
          </div>
          <div className="channel-list">
            {optionChannels.map((item) => (
              <span
                className="channel-list-item"
                key={item.id}
                onClick={() => onAddChannel(item)}
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Channels
