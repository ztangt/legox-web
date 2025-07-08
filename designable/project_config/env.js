//api标识，本地代理时请添加，部署时为空，此文件已忽略
module.exports = {
  env: process.env.NODE_ENV == 'development' ? '/api/api' : '/api',
}
