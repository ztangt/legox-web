import { join, resolve } from 'path'
import { defineConfig } from 'umi'

const publicPath =
  process.env.NODE_ENV == 'production'
    ? join(process.env.PUBLIC_PATH || '', '/child/designable/')
        .replace(/\\/g, '/')
        .replace(':/', '://')
    : '/'

export default defineConfig({
  // nodeModulesTransform: {
  //   type: 'none',
  // },
  history: {
    type: 'hash',
  },
  hash: true,
  dva: {
    // immer: true, // 表示是否启用 immer 以方便修改 reducer
    // hmr: false, // 表示是否启用 dva model 的热更新
    // skipModelValidate: true,
  },
  jsMinifierOptions: {
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    drop: ['console', 'debugger'],
  },
  layout: false,
  icons: {},
  antd: {},
  model: {},
  mfsu: false,
  // terserOptions: {
  //   compress: {
  //     drop_console: process.env.NODE_ENV == 'production' ? true : false, //去掉console
  //     drop_debugger: process.env.NODE_ENV == 'production' ? true : false, //去掉debugger
  //   },
  // },
  //extraBabelPlugins: ['transform-remove-strict-mode'],
  outputPath: '../output/child/designable',
  publicPath,
  alias: {
    src: resolve(__dirname, './src/'),
    api: resolve(__dirname, './src/service/'),
    imgs: resolve(__dirname, './src/assets/imgs/'),
    assets: resolve(__dirname, './src/assets/'),
    components: resolve(__dirname, './src/components/'),
    models: resolve(__dirname, './src/models/'),
    utils: resolve(__dirname, './src/utils/'),
    designable: resolve(__dirname, './src/designable/'),
  },
  qiankun: {
    master: {
      apps: [
        {
          name: 'business_controls',
          entry:
            process.env.NODE_ENV == 'production'
              ? '/child/business_controls/'
              : 'http://localhost:8003',
        },
        {
          name: 'business_cma',
          entry:
            process.env.NODE_ENV == 'production'
              ? '/child/business_cma/'
              : 'http://localhost:8005',
        },
        {
          name: 'business_cccf',
          entry:
            process.env.NODE_ENV == 'production'
              ? '/child/business_cccf/'
              : 'http://localhost:8008',
        },
      ],
    },
    slave: {},
  },
  locale: {
    default: 'zh-CN',
  },
  // fastRefresh: {},
  chainWebpack(config) {
    config.optimization.minimize(
      process.env.NODE_ENV == 'production' ? true : false
    )
    if (process.env.NODE_ENV == 'production') {
      // // 添加 Gzip 压缩配置
      config
        .plugin('compression-webpack-plugin')
        .use(require('compression-webpack-plugin'), [
          {
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/, // 匹配需要压缩的文件类型
            threshold: 10240, // 对超过10k的数据进行压缩
            minRatio: 0.8, // 压缩比例
            deleteOriginalAssets: false, // 是否删除原文件
          },
        ])
    }
  },
  proxy: {
    '/api': {
      target: 'http://10.8.2.16:8088/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
})
