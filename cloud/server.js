/**
 * web服务器
 * @author liuyang
 */
const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const proxy = require('koa-better-http-proxy');
const querystring = require('querystring');
const rp = require('request-promise-native');
const parseString = require('xml2js').parseString;
const Router = require('koa-router');
const fs = require('fs');
// const config = require('./config_project');
const compress =require('koa-compress');
const options = {threshold:2048};
app.use(compress(options));
app.use(serve('../output'));
let router = new Router();
console.log(process.env.NODE_ENV);
// app.use(proxy((ctx)=>{
//   if(ctx.url.includes('health')||ctx.url.includes('user/record')){
//     return config.healthApi;
//   }else if (ctx.url.includes('mobile/goods')||ctx.url.includes('mobile/financial')|| ctx.url.includes('mobile/equipment')) {
//     return config.financialApi;
//   }else {
//     return config.apiUrl
//   }
// }, {
//   proxyReqPathResolver: function(ctx) {
//     let path = ctx.url.split('/');
//     path = path.slice(2);
//     if(ctx.url.includes('health')||ctx.url.includes('user/record')){
//       return config.healthApi+path.join('/')
//     }else if (ctx.url.includes('mobile/goods')||ctx.url.includes('mobile/financial')|| ctx.url.includes('mobile/equipment')) {
//       return config.financialApi+path.join('/');
//     }else {
//       return config.apiUrl+path.join('/')
//     }
//   },
//   filter: function(ctx) {
//      return !ctx.url.includes('fapi')
//   },
//   limit: '10000mb'
// }));

const main = ctx => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream('../output/index.html');
};
app
  .use(router.routes())
  .use(router.allowedMethods());
app.listen(8000, ()=>{
  console.log(`running at ${8000}`);
});
