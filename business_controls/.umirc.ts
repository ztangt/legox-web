import { resolve } from 'path';
import { defineConfig } from 'umi';
export default defineConfig({
  // nodeModulesTransform: {
  //   type: 'none',
  // },
  hash: true,
  history: {
    type: 'hash',
  },
  mfsu: false,
  layout: false,
  antd: {},
  icons: {},
  model: {},
  dva: {
    // immer: false, // 表示是否启用 immer 以方便修改 reducer
    // hmr: false, // 表示是否启用 dva model 的热更新
    // skipModelValidate: true,
  },
  jsMinifierOptions: {
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    drop: ['console', 'debugger'],
  },
  // dynamicImport: {},
  outputPath: '../output/child/business_controls',
  publicPath:
    process.env.NODE_ENV == 'production' ? '/child/business_controls/' : '/',
  alias: {
    api: resolve(__dirname, './src/service/'),
    components: resolve(__dirname, './src/components/'),
    utils: resolve(__dirname, './src/utils/'),
  },
  qiankun: {
    slave: {},
  },
  locale: {
    default: 'zh-CN',
  },
  fastRefresh: true,
  chainWebpack(config) {
    config.optimization.minimize(
      process.env.NODE_ENV == 'production' ? true : false,
    );
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
        ]);
    }
  },
  proxy: {
    '/api': {
      // 'target': 'http://10.8.10.25:8088/',//测试环境
      target: 'http://81.70.230.227:3222/mock/101/',
      // target: 'http://81.70.230.227:3222/mock/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
});
