import NavBar from '@/components/NavBar'
import Input from '@/components/Input'
import Textarea from '@/components/Textarea'
import classNames from 'classnames'
import style from './index.module.scss'
import { useState } from 'react'
import { useEffect } from 'react'

/**
 * 个人信息项修改表单
 * @param {Object} config 配置信息对象
 * @param {Function} onClose 后退按钮的回调函数
 * @param {Function} onCommit 提交按钮的回调函数
 */
const EditInput = ({ config = {}, onClose, onCommit, className }) => {
  const [value, setValue] = useState(config.value || '')
  const { title, name } = config

  const onValueChange = (e) => setValue(e.target.value)

  // Input和Textarea组件切换时，清空value状态
  useEffect(() => setValue(config.value || ''), [config])

  return (
    <div className={classNames(style.root, className)}>
      <NavBar
        onLeftClick={onClose}
        rightContent={
          <span className="commit-btn" onClick={() => onCommit(name, value)}>
            提交
          </span>
        }
      >
        编辑{title}
      </NavBar>

      <div className="content">
        <h3>{title}</h3>
        {/* 输入框：如果是用户名，则使用单行输入框，否则使用多行输入框 */}
        {name === 'name' ? (
          <div className="input-wrap">
            <Input value={value} onChange={onValueChange}></Input>
          </div>
        ) : (
          <Textarea
            placeholder="请输入"
            value={value}
            onChange={onValueChange}
          ></Textarea>
        )}
      </div>
    </div>
  )
}

export default EditInput
