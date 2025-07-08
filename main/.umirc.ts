import { defineConfig } from 'umi';
import { resolve, join } from 'path';

const publicPath = process.env.NODE_ENV == 'production' ? join(process.env.PUBLIC_PATH || '', '/child/main/').replace(/\\/g,'/').replace(':/','://') : '/';

export default defineConfig({
  // nodeModulesTransform: {
  //   type: 'none',
  // },
  history: {
    type: 'hash',
  },
  dva: {
    // immer: false, //ie
    // skipModelValidate: true,
  },
  layout: false,
  // legacy: {
  //   nodeModulesTransform: false,
  // },
  antd: {},
  mfsu: false,
  // dynamicImport: {},
  outputPath: '../output/child/main',
  publicPath,
  theme: {
    'primary-color': '#03A4FF',
  },
  hash: true,
  // terserOptions: {
  //   compress: {
  //     drop_console: process.env.NODE_ENV == 'production' ? true : false, //去掉console
  //     drop_debugger: process.env.NODE_ENV == 'production' ? true : false, //去掉debugger
  //   },
  // },
  esbuildMinifyIIFE: true,
  jsMinifierOptions: {
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    drop: ['console','debugger']
  },
  chainWebpack(config) {
    config.optimization.minimize(process.env.NODE_ENV == 'production' ? true : false);
    if(process.env.NODE_ENV == 'production'){
      // // 添加 Gzip 压缩配置
      config.plugin('compression-webpack-plugin').use(require('compression-webpack-plugin'), [
        {
          algorithm: 'gzip',
          test: /\.js$|\.css$|\.html$/, // 匹配需要压缩的文件类型
          threshold: 10240, // 对超过10k的数据进行压缩
          minRatio: 0.8, // 压缩比例
          deleteOriginalAssets: false, // 是否删除原文件
        },
      ]);
    }
  },
  qiankun: {
    master: {
      // prefetch: 'all',
      apps: [
        {
          name: 'designable',
          entry:
            process.env.NODE_ENV == 'production'
              ? '/child/designable/'
              : '//localhost:8004',
        },
        {
          name: 'business_application',
          entry:
            process.env.NODE_ENV == 'production'
              ? '/child/business_application/'
              : '//localhost:8002',
        },
      ],
    },
    slave: {},
  },
  locale: {
    default: 'zh-CN',
  },
  alias: {
    api: resolve(__dirname, './src/service/'),
    imgs: resolve(__dirname, './src/assets/imgs/'),
    assets: resolve(__dirname, './src/assets/'),
    components: resolve(__dirname, './src/components/'),
    utils: resolve(__dirname, './src/utils/'),
    themConfig: resolve(__dirname, './src/config/them.config.json'),
  },
  links: [
    {
      href:
        process.env.NODE_ENV == 'production'
          ? '/assets/logo_tonglian.png'
          : 'http://localhost:8000/assets/logo_tonglian.png',
      rel: 'icon',
    },
  ],
  proxy: {
    '/api': {
      target: 'http://10.20.105.21:8088/', //气象测试环境
      // 'target': 'http://10.8.2.14:8088/',   // 个人
      // target: 'http://10.8.12.154:8088/',
      // target: 'http://106.38.248.144:8088/',//消防测试环境

      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
});
