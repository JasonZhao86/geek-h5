export type Token = {
  token: string
  refresh_token: string
}

/**
 * 推荐的写法，不要合并多个不同的type: 'login/token' | 'login/clear'，
 * 因为不同的type对应的payload类型不同，login时，payload为Token类型，
 * 而logout时，不需要payload属性，此时合并在一起类型就不对了，type和
 * payload是一一对应的
 **/
export type LoginAction =
  | {
      type: 'login/token'
      payload: Token
    }
  | {
      type: 'login/clear'
    }

export type User = {
  id: string
  name: string
  photo: string
  intro: string
  art_count: number
  follow_count: number
  fans_count: number
  like_count: number
}

export type Profile = {
  id: string
  photo: string
  name: string
  mobile: string
  gender: number
  birthday: string
  intro: string
}

export type PartialProfile = Partial<Profile>

export type InitType = {
  user: User
  userProfile: Profile
}

export type ProfileAction =
  | {
      type: 'profile/user'
      payload: User
    }
  | {
      type: 'profile/profile'
      payload: Profile
    }

export type Channel = {
  id: number
  name: string
}

export type MoreAction = {
  visible: boolean
  articleId: string
  // channelId: number
}

export type Article = {
  art_id: string
  title: string
  aut_id: string
  aut_name: string
  comm_count: string
  pubdate: string
  cover: {
    type: number
    images: string[]
  }
}

export type Articles = {
  [index: number]: {
    timestamp: string
    list: Article[]
  }
}

export type HomeType = {
  userChannels: Channel[]
  allChannels: Channel[]
  articles: Articles
  feedbackAction: MoreAction
}

export type ArticleList = {
  channelId: number
  timestamp: string
  list: Article[]
}

export type HomeAction =
  | {
      type: 'home/channel'
      payload: Channel[]
    }
  | {
      type: 'home/allChannel'
      payload: Channel[]
    }
  | {
      type: 'home/articlelist'
      payload: ArticleList
    }
  | {
      type: 'home/more_articlelist'
      payload: ArticleList
    }
  | {
      type: 'home/feedback_action'
      payload: MoreAction
    }

// 依照后端/search接口返回的data数据的格式创建的类型，需要全部存下，后面上拉刷新需要用到page数据
export type SearchResultsType = {
  page: number
  per_page: number
  results: Article[]
  total_count: number
}

export type SearchType = {
  suggestions: string[]
  histories: string[]
  // 保存搜索详情页的文章数据
  searchResults: SearchResultsType
}

export type SearchAction =
  | {
      type: 'search/saveSuggestions'
      payload: string[]
    }
  | {
      type: 'search/clearSuggestions'
    }
  | {
      type: 'search/saveHistories'
      payload: string[]
    }
  | {
      type: 'search/clearHistories'
    }
  | {
      type: 'search/saveSearchResults'
      payload: SearchResultsType
    }
