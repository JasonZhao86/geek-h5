import NavBar from '@/components/NavBar'
import styles from './index.module.scss'
import Input from '@/components/Input'
import { Toast } from 'antd-mobile'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'
import { login, sendValidationCode } from '@/store/actions'
import { useHistory, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Login() {
  const [time, setTime] = useState(0)
  const dispatch = useDispatch()
  const { state } = useLocation()
  const history = useHistory()
  const form = useFormik({
    initialValues: {
      mobile: '13900001111',
      code: '246810',
      //   mobile: '',
      //   code: '',
    },
    validationSchema: Yup.object().shape({
      mobile: Yup.string()
        .required('请输入手机号')
        .matches(/^1[345678]\d{9}$/, '手机号格式错误'),
      code: Yup.string()
        .required('请输入验证码')
        .matches(/^\d{6}$/, '验证码6个数字'),
    }),
    onSubmit: async (values) => {
      await dispatch(login(values))
      if (!state) {
        // 如果不是从其他页面跳到的登录页，则登录后默认进入首页
        history.replace('/home')
      } else {
        // 否则跳回到之前访问的页面
        history.replace(state.from)
      }
    },
  })

  const sendSMSCode = async () => {
    if (time !== 0) {
      return
    }
    const { mobile } = form.values
    if (!/^1[3-9]\d{9}$/.test(mobile)) {
      form.setTouched({
        mobile: true,
      })
      Toast.info('手机号不正确', 1)
      return
    }
    try {
      await dispatch(sendValidationCode(mobile))
      Toast.success('验证码获取成功', 1)

      // 开启倒计时
      setTime(60)
      let timeId = setInterval(() => {
        setTime((time) => {
          if (time === 1) {
            clearInterval(timeId)
          }
          return time - 1
        })
      }, 1000)
    } catch (err) {
      // es6的写法，只有当？前面的变量为true时，才会执行？后面的代码
      Toast.info(err.response?.data.message, 1)
    }
  }

  const onPageNavBack = () => {
    history.go(-1)
  }

  return (
    <div className={styles.root}>
      <NavBar onLeftClick={onPageNavBack}>登录</NavBar>
      <div className="content">
        {/* 标题 */}
        <h3>短信登录</h3>
        <form onSubmit={form.handleSubmit}>
          {/* 手机号输入框 */}
          <div className="input-item">
            <Input
              name="mobile"
              placeholder="请输入手机号"
              maxLength={11}
              autoComplete="off"
              value={form.values.mobile}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            ></Input>
            {form.errors.mobile && form.touched.mobile && (
              <div className="validate">{form.errors.mobile}</div>
            )}
          </div>

          {/* 短信验证码输入框 */}
          <div className="input-item">
            <Input
              name="code"
              placeholder="请输入验证码"
              maxLength={6}
              autoComplete="off"
              extra={time === 0 ? '获取验证码' : `${time}s`}
              value={form.values.code}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              onExtraClick={sendSMSCode}
            ></Input>
            {form.errors.code && form.touched.code && (
              <div className="validate">{form.errors.code}</div>
            )}
          </div>

          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={!form.isValid}
            className={classNames('login-btn', form.isValid ? '' : 'disabled')}
          >
            登录
          </button>
        </form>
      </div>
    </div>
  )
}
