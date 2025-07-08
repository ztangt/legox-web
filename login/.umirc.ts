import { defineConfig } from 'umi';
import { resolve, join } from 'path';

const publicPath = process.env.NODE_ENV == 'production' ? join(process.env.PUBLIC_PATH || '', '/').replace(/\\/g, '/').replace(':/', '://') : '/';

export default defineConfig({
  history: {
    type: 'hash'
  },
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  dva: {},
  outputPath: '../output/',
  publicPath,
  theme: {
    "primary-color": "#03A4FF",
  },
  mfsu: false,
  hash: true,
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
  jsMinifierOptions: {
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    drop: ['console', 'debugger']
  },
  qiankun: {
    master: {
      prefetch: 'all',
      apps: [
        {
          name: 'business_application',
          entry: process.env.NODE_ENV == 'production' ? '/child/business_application/' : 'http://localhost:8002'
        },
        {
          name: 'cloud',
          entry: process.env.NODE_ENV == 'production' ? '/child/cloud/' : 'http://localhost:8006'
        },
        {
          name: 'main',
          entry: process.env.NODE_ENV == 'production' ? '/child/main/' : 'http://localhost:8001'
        }],
      routes: [{
        path: '/business_application',
        microApp: 'business_application'
      }, {
        path: '/support',
        microApp: 'main'
      }],
    },
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
  headScripts: [
    { src: process.env.NODE_ENV == 'production' ? join(publicPath, '/child/designable/writeboard/jquery-3.4.1.min.js').replace(/\\/g, '/').replace(':/', '://') : 'http://localhost:8004/writeboard/jquery-3.4.1.min.js' },
    { src: process.env.NODE_ENV == 'production' ? join(publicPath, '/child/business_application/pdfjs-dist/legacy/build/pdf.min.js').replace(/\\/g, '/').replace(':/', '://') : 'http://localhost:8002/pdfjs-dist/legacy/build/pdf.min.js' },
    { src: process.env.NODE_ENV == 'production' ? join(publicPath, '/child/business_application/pdfjs-dist/legacy/web/pdf_viewer.js').replace(/\\/g, '/').replace(':/', '://') : 'http://localhost:8002/pdfjs-dist/legacy/web/pdf_viewer.js' },
    { src: process.env.NODE_ENV == 'production' ? join(publicPath, '/child/business_application/uni-webview/index.js').replace(/\\/g, '/').replace(':/', '://') : 'http://localhost:8002/uni-webview/index.js' },
    { src: process.env.NODE_ENV == 'production' ? join(publicPath, '/child/business_application/luckysheet/dist/plugins/js/plugin.js').replace(/\\/g, '/').replace(':/', '://') : 'http://localhost:8002/luckysheet/dist/plugins/js/plugin.js' },
    { src: process.env.NODE_ENV == 'production' ? join(publicPath, '/child/business_application/luckysheet/dist/luckysheet.umd.js').replace(/\\/g, '/').replace(':/', '://') : 'http://localhost:8002/luckysheet/dist/luckysheet.umd.js' },
    // { src: process.env.NODE_ENV == 'production' ? join(publicPath, '/child/business_application/uni-webview/index.js').replace(/\\/g, '/').replace(':/', '://') : 'http://localhost:8002/uni-webview/index.js' },
  ],
  links: [
    { href: process.env.NODE_ENV == 'production' ? join(publicPath, '/assets/login_tonglian.png').replace(/\\/g, '/').replace(':/', '://') : 'http://localhost:8000/assets/login_tonglian.png', rel: 'icon' },
    { href: process.env.NODE_ENV == 'production' ? join(publicPath, '/child/designable/formily/antd/dist/antd.css').replace(/\\/g, '/').replace(':/', '://') : 'http://localhost:8004/formily/antd/dist/antd.css', rel: 'stylesheet' },
    { href: process.env.NODE_ENV == 'production' ? join(publicPath, '/child/business_application/luckysheet/dist/plugins/css/pluginsCss.css').replace(/\\/g, '/').replace(':/', '://') : 'http://localhost:8002/luckysheet/dist/plugins/css/pluginsCss.css' ,rel: 'stylesheet'},
    { href: process.env.NODE_ENV == 'production' ? join(publicPath, '/child/business_application/luckysheet/dist/plugins/plugins.css').replace(/\\/g, '/').replace(':/', '://') : 'http://localhost:8002/luckysheet/dist/plugins/plugins.css',rel: 'stylesheet' },
    { href: process.env.NODE_ENV == 'production' ? join(publicPath, '/child/business_application/luckysheet/dist/css/luckysheet.css').replace(/\\/g, '/').replace(':/', '://') : 'http://localhost:8002/luckysheet/dist/css/luckysheet.css',rel: 'stylesheet' },
    { href: process.env.NODE_ENV == 'production' ? join(publicPath, '/child/business_application/luckysheet/dist/assets/iconfont/iconfont.css').replace(/\\/g, '/').replace(':/', '://') : 'http://localhost:8002/luckysheet/dist/assets/iconfont/iconfont.css',rel: 'stylesheet' },
  ],
  proxy: {
    '/api': {
      target: 'http://10.20.105.21:8088/', //气象测试环境
      // 'target': 'http://152.136.18.219:8088/',
        // 'target': 'http://10.10.8.4:8088/',
      // 'target': 'http://10.10.8.154:1111',
      // 'target': 'http://10.10.8.154:8088/',
      // target: 'http://106.38.248.144:8088/',//消防测试环境
      'changeOrigin': false,
      'pathRewrite': { '^/api': '' },
    },
  },
});
