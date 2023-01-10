const path = require('path')
const {
  override,
  fixBabelImports,
  addWebpackAlias,
  addPostcssPlugins,
  addWebpackExternals,
} = require('customize-cra')

// 按需加载，antd-mobile v5不需要配置
const babelPlugins = fixBabelImports('import', {
  libraryName: 'antd-mobile',
  style: 'css',
})

const px2viewport = require('postcss-px-to-viewport')

const webpackAlias = addWebpackAlias({
  '@': path.resolve(__dirname, 'src'),
  '@scss': path.resolve(__dirname, 'src', 'assets', 'styles'),
})

// 配置 PostCSS 样式转换插件
const postcssPlugins = addPostcssPlugins([
  // 移动端布局 viewport 适配方案
  px2viewport({
    // 视口宽度：可以设置为UI设计稿的宽度
    viewportWidth: 375,
    // 白名单：不需对其中的 px 单位转成 vw 的样式类类名，hairlines头发丝，移动端1px问题
    // selectorBlackList: ['.ignore', '.hairlines']
  }),
])

// 排除第三方的依赖包
const obj =
  // 只有生产环境才会剔除（yarn build之后的项目就是生产环境，yarn start的项目就是develop开发环境）
  process.env.NODE_ENV === 'production'
    ? {
        // key为项目中的包名，value为全局变量名，表示从全局变量里面导入
        react: 'React',
        'react-dom': 'ReactDOM',
      }
    : {}

const externals = addWebpackExternals(obj)

// 导出要进行覆盖的 webpack 配置
module.exports = override(externals, babelPlugins, webpackAlias, postcssPlugins)
