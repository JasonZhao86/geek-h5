import { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { useDispatch } from 'react-redux'
import { getUserChannels } from '@/store/actions'
import { useSelector } from 'react-redux'
import Tabs from '@/components/Tabs'
import Icon from '@/components/Icon'
import Channels from './components/Channels'
import ArticleList from './components/ArticleList'
import { Drawer } from 'antd-mobile'
import MoreAction from './components/MoreAction'
import { useHistory } from 'react-router-dom'

export default function Home() {
  const dispatch = useDispatch()
  const tabs = useSelector((state) => state.home.userChannels)
  // 控制抽屉组件，显示和隐藏频道管理组件
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [active, setActive] = useState(0)
  const history = useHistory()

  useEffect(() => {
    dispatch(getUserChannels())
  }, [dispatch])

  const onClose = () => {
    setDrawerVisible(false)
  }

  const changeActive = (index) => setActive(index)

  return (
    <div className={styles.root}>
      <Tabs index={active} tabs={tabs} onChange={changeActive}>
        {/* 频道 Tab 对应的内容 */}
        {tabs.map((ch) => (
          <ArticleList key={ch.id} channelId={ch.id} />
        ))}
        {/* Tabs组件已经提前给Tabs的child组件注入了aid属性，所以这里传不传aid都无所谓了 */}
        {/* tabs.map(ch => <ArticleList key={ch.id} channelId={ch.id} aid={active} />) */}
      </Tabs>
      {/* 频道 Tab 栏右侧的两个图标按钮：搜索、频道管理 */}
      <div className="tabs-opration">
        <Icon type="iconbtn_search" onClick={() => history.push('/search')} />
        <Icon type="iconbtn_channel" onClick={() => setDrawerVisible(true)} />
      </div>

      {/* 频道管理抽屉 */}
      <Drawer
        className="my-drawer"
        position="left"
        children={''}
        sidebar={
          drawerVisible && (
            <Channels
              tabActiveIndex={active}
              onChannelClick={changeActive}
              onClose={onClose}
            />
          )
        }
        open={drawerVisible}
      ></Drawer>

      {/* 举报反馈弹出菜单 */}
      <MoreAction />
    </div>
  )
}
