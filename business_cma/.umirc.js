import { join, resolve } from 'path';
import { defineConfig } from 'umi';

const publicPath =
    process.env.NODE_ENV == 'production'
        ? join(process.env.PUBLIC_PATH || '', '/child/business_cma/')
              .replace(/\\/g, '/')
              .replace(':/', '://')
        : '/';

export default defineConfig({
    // nodeModulesTransform: {
    //     type: 'none',
    // },
    history: {
        type: 'hash',
    },
    hash: true,
    jsMinifierOptions: {
        minifyWhitespace: true,
        minifyIdentifiers: true,
        minifySyntax: true,
        drop: ['console', 'debugger'],
    },
    dva: {
        // immer: false, // 表示是否启用 immer 以方便修改 reducer
        // hmr: false, // 表示是否启用 dva model 的热更新
        // skipModelValidate: true,
    },
    layout: false,
    antd: {},
    icons: {},
    mfsu: false,
    model: {},
    // dynamicImport: {},
    outputPath: '../output/child/business_cma',
    publicPath,
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
    chainWebpack(config) {
        config.optimization.minimize(process.env.NODE_ENV == 'production' ? true : false);
        if (process.env.NODE_ENV == 'production') {
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
    proxy: {
        '/api': {
            // target: 'http://10.20.105.51:8088/', //正式环境
            target: 'http://10.20.105.21:8088/', //测试环境
            // target: 'http://10.14.35.117:8088/', //个人的
            // target: 'http://10.8.12.154:8088/', //公司测试环境的
            // target: 'http://152.136.18.219:8088/', //外网银企
            // target: 'http://81.70.230.227:3222/mock/101/',
            // target: 'http://81.70.230.227:3222/mock/',
            changeOrigin: true,
            pathRewrite: { '^/api': '' },
            headers: {
                Referer: 'http://10.20.105.21:8088/860396/',
            },
        },
    },
});
