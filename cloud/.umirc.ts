import { defineConfig } from 'umi';
import { resolve, join } from 'path';

const publicPath = process.env.NODE_ENV == 'production' ? join(process.env.PUBLIC_PATH || '', '/child/cloud/').replace(/\\/g,'/').replace(':/','://') : '/';

export default defineConfig({
  // nodeModulesTransform: {
  //   type: 'none',
  // },
  history: {
    type:'hash'
  },
  dva: {
    // immer: false,//ie
    // skipModelValidate: true
  },
  hash:true,
  layout: false,
  antd: {},
  mfsu: false,
  jsMinifierOptions: {
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    drop: ['console','debugger']
  },
  routes: [
    { path: '/login', component: 'login',layout: false },
    {
      path: '/',
      component: '@/layouts/index',
      layout: false ,
      routes: [
        { path: '/tenement', component: 'tenement' },
        { path: '/organization', component: 'organization' },
        { path: '/userMg', component: 'userMg' },
        { path: '/manageModel', component: 'manageModel' },
        { path: '/sendTask', component: 'sendTask' },
        { path: '/', component: '@/pages/index' },
        { path: '/cloud/applyConfig', component: 'applyConfig' },
      ],
    }, 
    { path: '/userAuthorization', component: 'userAuthorization' ,layout: false },
  ],
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
  // dynamicImport: {},
  outputPath:'../output/child/cloud',
  publicPath,
  locale:{
    default: 'zh-CN',
  },
  qiankun: {
    master: {
      apps: [
        {
          name: 'main',
          entry: process.env.NODE_ENV == 'production' ? '/child/main/' : 'http://localhost:8001'
        },
        {
          name: 'designable',
          entry:
            process.env.NODE_ENV == 'production'
              ? '/child/designable/'
              : '//localhost:8004',
        },
      ],
      // sandbox: { strictStyleIsolation: true }
    },
    slave: {},
  },
  alias: {
    api: resolve(__dirname, './src/service/'),
    imgs: resolve(__dirname, './src/assets/imgs/'),
    assets: resolve(__dirname, './src/assets/'),
    components: resolve(__dirname, './src/components/'),
    utils: resolve(__dirname, './src/utils/'),
  },
  proxy: {
    '/api': {
      'target': 'http://10.10.8.154:8088/',
      'changeOrigin': true,
      'pathRewrite': { '^/api' : '' },
    },
  },
});
