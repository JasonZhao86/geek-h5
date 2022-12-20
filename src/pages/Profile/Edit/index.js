import { DatePicker, List, Drawer, Modal } from 'antd-mobile'
import { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  getUserProfile,
  updateAvatar,
  updateProfile,
} from '@/store/actions/profile'
import styles from './index.module.scss'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import NavBar from '@/components/NavBar'
import EditInput from './components/EditInput'
import EditList from './components/EditList'
import { logout } from '@/store/actions'

const ProfileEdit = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const userProfile = useSelector((state) => state.profile.userProfile)
  // 控制全屏表单抽屉的状态
  const [formDrawerStatus, setFormDrawerStatus] = useState({
    visible: false,
    name: '',
  })
  // 控制菜单列表抽屉的状态
  const [listDrawerStatus, setListDrawerStatus] = useState({
    visible: false,
    name: '',
  })
  const inputRef = useRef()

  useEffect(() => {
    dispatch(getUserProfile())
  }, [dispatch])

  /**
   * 显示和隐藏抽屉的工具函数
   * @param {Boolean} visible 显示或隐藏
   * @param {String} type list 表示列表抽屉；form 表示表单抽屉
   * @param {String} name 用于鉴别抽屉界面上要修改的用户信息字段，比如 photo、gender、name、intro
   */
  const toggleDrawer = (visible, type, name) => {
    if (!visible) {
      setFormDrawerStatus({
        visible: false,
        name: '',
      })
      setListDrawerStatus({
        visible: false,
        name: '',
      })
    } else {
      if (type === 'list') {
        setListDrawerStatus({ visible: true, name })
        setFormDrawerStatus({ visible: false, name: '' })
      } else if (type === 'form') {
        setFormDrawerStatus({ visible: true, name })
        setListDrawerStatus({ visible: false, name: '' })
      }
    }
  }

  const formConfigMap = {
    name: {
      title: '昵称',
      name: 'name',
      value: userProfile.name,
    },
    intro: {
      title: '简介',
      name: 'intro',
      value: userProfile.intro,
    },
  }

  // 头像、性别配置
  const listConfigMap = {
    photo: {
      name: 'photo',
      items: [
        {
          title: '拍照',
          value: 1,
        },
        {
          title: '本地选择',
          value: 2,
        },
      ],
    },
    gender: {
      name: 'gender',
      items: [
        {
          title: '男',
          value: 0,
        },
        {
          title: '女',
          value: 1,
        },
      ],
    },
  }

  // 抽屉表单的数据提交
  const onFormCommit = (name, value) => {
    dispatch(updateProfile(name, value))
    // 关闭抽屉
    toggleDrawer(false)
  }

  // 抽屉列表的数据选择
  const onListSelect = (name, item, index) => {
    if (name === 'gender') {
      dispatch(updateProfile(name, item.value))
    } else if (name === 'photo') {
      // 纯网页端的限制，目前不管选择“拍照”或“本地选择”，统一是选择本地文件上传
      inputRef.current.click()
    }
    toggleDrawer(false)
  }

  const onBirthdayChange = (value) => {
    // 将从 DatePicker 组件获取到的 Date 对象，转成字符串的形式（后台需要字符串）
    const year = value.getFullYear()
    const month = value.getMonth() + 1
    const day = value.getDate()
    const datestr = `${year}-${month}-${day}`
    dispatch(updateProfile('birthday', datestr))
  }

  const onAvatarChange = (e) => {
    // 获取选中的图片文件，如果给input multiple属性，允许上传多个文件
    const file = e.target.files[0]
    // 生成表单数据，上传图片必须用FormData表单数据
    const formData = new FormData()
    formData.append('photo', file)

    dispatch(updateAvatar(formData))
    toggleDrawer(false)
  }

  const onLogout = () => {
    // 弹出确认对话框
    Modal.alert('温馨提示', '确定要退出吗？', [
      // 取消按钮
      { text: '取消' },
      // 确认按钮
      {
        text: '确认',
        style: { color: '#FC6627' },
        onPress: () => {
          // 删除 Token 信息
          dispatch(logout())
          // 跳转到登录页
          history.replace('/login')
        },
      },
    ])
  }

  return (
    <div className={styles.root}>
      <div className="content">
        {/* 顶部导航栏 */}
        <NavBar onLeftClick={() => history.go(-1)}>个人信息</NavBar>

        <div className="wrapper">
          {/* 列表一：显示头像、昵称、简介 */}
          <List className="profile-list">
            <List.Item
              arrow="horizontal"
              extra={
                <span className="avatar-wrapper">
                  <img src={userProfile.photo} alt="" />
                </span>
              }
              onClick={() => {
                setListDrawerStatus({ visible: true, name: 'photo' })
              }}
            >
              头像
            </List.Item>

            <List.Item
              arrow="horizontal"
              extra={userProfile.name}
              onClick={() =>
                setFormDrawerStatus({ visible: true, name: 'name' })
              }
            >
              昵称
            </List.Item>

            <List.Item
              arrow="horizontal"
              extra={
                <span
                  className={classNames(
                    'intro',
                    userProfile.intro ? 'normal' : ''
                  )}
                >
                  {userProfile.intro || '未填写'}
                </span>
              }
              onClick={() =>
                setFormDrawerStatus({ visible: true, name: 'intro' })
              }
            >
              简介
            </List.Item>
          </List>

          {/* 列表二：显示性别、生日 */}
          <List className="profile-list">
            <List.Item
              arrow="horizontal"
              extra={userProfile.gender === 0 ? '男' : '女'}
              onClick={() =>
                setListDrawerStatus({ visible: true, name: 'gender' })
              }
            >
              性别
            </List.Item>
            <DatePicker
              mode="date"
              title="选择年月日"
              value={new Date(userProfile.birthday)}
              minDate={new Date(1900, 1, 1, 0, 0, 0)}
              maxDate={new Date()}
              onChange={onBirthdayChange}
            >
              <List.Item arrow="horizontal" extra={userProfile.birthday}>
                生日
              </List.Item>
            </DatePicker>
          </List>

          {/* 文件选择框，用于头像图片的上传 */}
          <input type="file" hidden ref={inputRef} onChange={onAvatarChange} />
        </div>

        {/* 底部栏：退出登录按钮 */}
        <div className="logout">
          <button className="btn" onClick={onLogout}>
            退出登录
          </button>
        </div>
      </div>
      <Drawer
        position="right"
        className="drawer"
        // 高度占满全屏，配合drawer样式的width: 100%，就可以控制抽屉横竖全屏占满
        style={{ minHeight: document.documentElement.clientHeight }}
        sidebar={
          formDrawerStatus.visible && (
            <EditInput
              config={formConfigMap[formDrawerStatus.name]}
              onClose={() => toggleDrawer(false)}
              onCommit={onFormCommit}
            ></EditInput>
          )
        }
        open={formDrawerStatus.visible}
        onOpenChange={() => toggleDrawer(false)}
      >
        {''}
      </Drawer>
      <Drawer
        position="bottom"
        className="drawer-list"
        sidebar={
          listDrawerStatus.visible && (
            <div style={{ height: '100%', backgroundColor: '#ffffff' }}>
              <EditList
                config={listConfigMap[listDrawerStatus.name]}
                onClose={() => toggleDrawer(false)}
                onSelect={onListSelect}
              ></EditList>
            </div>
          )
        }
        // 为两个抽屉关联控制状态、事件监听，来控制它们的显示和隐藏
        open={listDrawerStatus.visible}
        onOpenChange={() => toggleDrawer(false)}
      >
        {''}
      </Drawer>
    </div>
  )
}

export default ProfileEdit
