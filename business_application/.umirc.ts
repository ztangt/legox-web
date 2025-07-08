import { defineConfig } from 'umi';
import { resolve, join } from 'path';

const publicPath = process.env.NODE_ENV == 'production' ? join(process.env.PUBLIC_PATH || '', '/child/business_application/').replace(/\\/g,'/').replace(':/','://') : '/';

export default defineConfig({
  history: {
    type: 'hash'
  },
  plugins: ['./plugins/qiankun'],
  dva: {
    skipModelValidate: true
  },
  layout: false,
  favicons: ['/assets/favicon.ico'],
  // legacy: {
  //   nodeModulesTransform: false,
  // },
  antd: {},
  mfsu: false,
  esbuildMinifyIIFE: true,
  hash:true,
  qiankun: {
    slave: {},
  },
  qiankunNew: {
    master: {
      apps: [
        {
          name: 'designable',
          entry: process.env.NODE_ENV == 'production' ? '/child/designable/' : 'http://localhost:8004'
        },
        {
          name: 'business_controls',
          entry: process.env.NODE_ENV == 'production' ? '/child/business_controls/' : 'http://localhost:8003'
        },
        {
          name: 'business_cma',
          entry: process.env.NODE_ENV == 'production'? '/child/business_cma/': 'http://localhost:8005'
        },
        {
          name: 'main',
          entry: process.env.NODE_ENV == 'production'? '/child/main/': 'http://localhost:8001'
        },
        {
          name: 'business_oa',
          entry: process.env.NODE_ENV == 'production'? '/child/business_oa/': 'http://localhost:8007'
        },
        {
          name: 'business_cccf',
          entry: process.env.NODE_ENV == 'production'? '/child/business_cccf/': 'http://localhost:8008'
        },
        {
          name: 'legox-impc',
          entry: process.env.NODE_ENV == 'production'? '/child/legox-impc/': '//localhost:8009/'
        }
      ],
      prefetch:'all',
    },
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
  jsMinifierOptions: {
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    drop: ['console','debugger']
  },
  analyze: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: true,
    // generate stats file while ANALYZE_DUMP exist
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'parsed', // stat  // gzip
  },
  outputPath: '../output/child/business_application',
  publicPath,
  alias: {
    api: resolve(__dirname, './src/service/'),
    imgs: resolve(__dirname, './src/assets/imgs/'),
    assets: resolve(__dirname, './src/assets/'),
    components: resolve(__dirname, './src/components/'),
    utils: resolve(__dirname, './src/utils/'),
  },
  proxy: {
    '/api': {
      target: 'http://10.20.105.21:8088/', //气象测试环境
      // 'target': 'http://10.8.2.14:8088/',   // 个人
      // 'target': 'http://10.8.12.154:8088/',//测试环境
      // target: 'http://106.38.248.144:8088/',//消防测试环境

      'changeOrigin': true,
      'pathRewrite': { '^/api': '' },
    },
  },
});
