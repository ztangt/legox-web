import { createFromIconfontCN } from '@ant-design/icons'
// let scriptUrl = '//at.alicdn.com/t/c/font_2430737_ezkb3586oir.js'
let scriptUrl = require('../public/iconfont-font.js')
const IconFont = createFromIconfontCN({
  scriptUrl,
})

export default IconFont
