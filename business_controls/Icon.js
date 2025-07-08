import { createFromIconfontCN } from '@ant-design/icons';
// let scriptUrl = '//at.alicdn.com/t/c/font_2430737_ezkb3586oir.js'
let scriptUrl = require('./public/assets/iconfont');
const IconFont = createFromIconfontCN({
  scriptUrl,
});

export default IconFont;
