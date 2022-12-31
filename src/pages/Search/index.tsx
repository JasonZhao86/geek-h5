import Icon from '@/components/Icon'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import classnames from 'classnames'
import { useHistory } from 'react-router'
import styles from './index.module.scss'
// 按需导入，只导入debounce方法
import debounce from 'lodash/debounce'
import { DebouncedFunc } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import {
  getSuggestions,
  clearSuggestions,
  addSearchList,
  clearHistories,
} from '@/store/actions'
import { RootState } from '@/store'
import { Dialog } from 'antd-mobile-v5'

let fetData: DebouncedFunc<(text: string) => void>

const Search = () => {
  const history = useHistory()
  const [keyword, setKeyword] = useState('')
  const dispatch = useDispatch()
  // 代表是否正处于搜索操作中
  const [isSearching, setIsSearching] = useState(false)
  // ts中箭头函数单个参数也必须使用括号，因为有类型的指定
  const suggestions = useSelector(
    (state: RootState) => state.search.suggestions
  )

  if (!fetData) {
    fetData = debounce((keyword) => {
      dispatch(getSuggestions(keyword))
    }, 500)
  }

  const onKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.trim()
    setKeyword(text)

    // 仅当输入的关键字不为空时，且后台没有正在执行的搜索任务时，才执行搜索
    if (text && !isSearching) {
      setIsSearching(true)
      fetData(text)
    } else {
      setIsSearching(false)
    }
  }

  const highlight = (str: string, key: string) => {
    return str.replace(new RegExp(key, 'gi'), (match: string) => {
      return `<span style="color: red">${match}</span>`
    })
  }

  const onSuggestionClear = () => {
    // 清空输入框内容
    setKeyword('')
    // 设置为非搜索状态
    setIsSearching(false)
    // 清空Redux中的搜索建议数据
    dispatch(clearSuggestions())
  }

  const onSearch = (key: string) => {
    if (key) {
      dispatch(addSearchList(key))
      history.push(`/search/result?q=${key}`)
    }
  }

  const histories = useSelector((state: RootState) => state.search.histories)

  // 清空搜索历史
  const onClearHistories = () => {
    Dialog.confirm({
      title: '温馨提示',
      content: '你确定要清空记录吗？',
      onConfirm: () => {
        dispatch(clearHistories())
      },
    })
  }

  return (
    <div className={styles.root}>
      {/* 顶部导航栏 */}
      <NavBar
        className="navbar"
        onLeftClick={() => history.go(-1)}
        rightContent={
          <span className="search-text" onClick={() => onSearch(keyword)}>
            搜索
          </span>
        }
      >
        <div className="navbar-search">
          <Icon type="iconbtn_search" className="icon-search" />

          <div className="input-wrapper">
            {/* 输入框 */}
            <input
              type="text"
              placeholder="请输入关键字搜索"
              value={keyword}
              onChange={onKeywordChange}
            />

            {/* 清空输入框按钮，且在输入内容时才显示 */}
            {keyword && (
              <Icon
                type="iconbtn_tag_close"
                className="icon-close"
                onClick={onSuggestionClear}
              />
            )}
          </div>
        </div>
      </NavBar>

      {/* 搜索历史 */}
      <div
        className="history"
        style={{ display: isSearching ? 'none' : 'block' }}
      >
        <div className="history-header">
          <span>搜索历史</span>
          <span onClick={onClearHistories}>
            <Icon type="iconbtn_del" />
            清除全部
          </span>
        </div>

        <div className="history-list">
          {histories.map((item, index) => (
            <span className="history-item" key={index}>
              {item}
              {index !== 9 && <span className="divider"></span>}
            </span>
          ))}
        </div>
      </div>

      {/* 搜素建议结果列表 */}
      <div className={classnames('search-result', isSearching ? 'show' : '')}>
        {suggestions.map((item, index) => (
          <div
            className="result-item"
            key={index}
            onClick={() => onSearch(item)}
          >
            <Icon className="icon-search" type="iconbtn_search" />
            <div
              className="result-value"
              dangerouslySetInnerHTML={{ __html: highlight(item, keyword) }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Search
