import dayjs from 'dayjs'
export const json2file = ({ name, json }) => {
  let file = new File([JSON.stringify(json)], `${name}.json`, {
    type: 'application/json',
    lastModified: Date.now(),
  })
  return file
}
export const strlen = (str) => {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i)
    //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++
    } else {
      len += 2
    }
  }
  return len
}
//获取所选文本的开始和结束位置
export function getPositions() {
  var x = 0,
    y = 0
  //IE
  if (document.selection) {
    //创建范围对象
    var range = document.selection.getRangeAt(0)
    x = range.startOffset
    y = range.endOffset
  }
  //Firefox,Chrome,Safari,opera etc
  else if (window.getSelection) {
    x = window.getSelection().getRangeAt(0).startOffset
    y = window.getSelection().getRangeAt(0).endOffset
  }
  return {
    style: {},
    x: x,
    y: y,
  }
}

export function getParam() {
  var hrefs = window.location.href.split('?'),
    querys = hrefs[hrefs.length - 1].split('&'),
    pair,
    params = {}

  for (var i = 0; i < querys.length; i++) {
    pair = querys[i].split('=')
    params[pair[0]] = pair[1]
  }
  return params
}
// 驼峰转换下划线
export function toLine(name) {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase()
}
/*金额格式化成千位
floatNum浮点数
*/
export function moneyFormateKilobit(floatNum) {
  //去掉小数
  let intNums = floatNum.split('.')
  let str = intNums[0].toString()
  let re = /(?=(?!(\b))(\d{3})+$)/g
  str = str.replace(re, ',')
  return str + '.' + intNums[1]
}
/**
 * [formatDate 时间戳格式化为指定日期格式]
 * @param  {[String]} timestamp [时间戳字符串]
 * @param  {[String]} format [转换格式，全格式"YYYY MM DD HH:mm:ss" 缺省则默认"MM-DD HH:mm"]
 * @return {[String]}           [日期格式]
 */
export function dataFormat(timestamp, format) {
  if (!timestamp) {
    return ''
  }
  var day = dayjs.unix(Number(timestamp))
  var thisFormat = format == undefined ? 'YYYY-MM-DD' : format

  return day.format(thisFormat).toString()
}

import bigInt from 'big-integer'

export function guid() {
  const Snowflake = /** @class */ (function () {
    function Snowflake(_workerId, _dataCenterId, _sequence) {
      // this.twepoch = 1288834974657;
      this.twepoch = 0
      this.workerIdBits = 5
      this.dataCenterIdBits = 5
      this.maxWrokerId = -1 ^ (-1 << this.workerIdBits) // 值为：31
      this.maxDataCenterId = -1 ^ (-1 << this.dataCenterIdBits) // 值为：31
      this.sequenceBits = 12
      this.workerIdShift = this.sequenceBits // 值为：12
      this.dataCenterIdShift = this.sequenceBits + this.workerIdBits // 值为：17
      this.timestampLeftShift =
        this.sequenceBits + this.workerIdBits + this.dataCenterIdBits // 值为：22
      this.sequenceMask = -1 ^ (-1 << this.sequenceBits) // 值为：4095
      this.lastTimestamp = -1
      //设置默认值,从环境变量取
      this.workerId = 1
      this.dataCenterId = 1
      this.sequence = 0
      if (this.workerId > this.maxWrokerId || this.workerId < 0) {
        throw new Error(
          'config.worker_id must max than 0 and small than maxWrokerId-[' +
            this.maxWrokerId +
            ']'
        )
      }
      if (this.dataCenterId > this.maxDataCenterId || this.dataCenterId < 0) {
        throw new Error(
          'config.data_center_id must max than 0 and small than maxDataCenterId-[' +
            this.maxDataCenterId +
            ']'
        )
      }
      this.workerId = _workerId
      this.dataCenterId = _dataCenterId
      this.sequence = _sequence
    }
    Snowflake.prototype.tilNextMillis = function (lastTimestamp) {
      var timestamp = this.timeGen()
      while (timestamp <= lastTimestamp) {
        timestamp = this.timeGen()
      }
      return timestamp
    }
    Snowflake.prototype.timeGen = function () {
      //new Date().getTime() === Date.now()
      return Date.now()
    }
    Snowflake.prototype.nextId = function () {
      var timestamp = this.timeGen()
      if (timestamp < this.lastTimestamp) {
        throw new Error(
          'Clock moved backwards. Refusing to generate id for ' +
            (this.lastTimestamp - timestamp)
        )
      }
      if (this.lastTimestamp === timestamp) {
        this.sequence = (this.sequence + 1) & this.sequenceMask
        if (this.sequence === 0) {
          timestamp = this.tilNextMillis(this.lastTimestamp)
        }
      } else {
        this.sequence = 0
      }
      this.lastTimestamp = timestamp
      var shiftNum =
        (this.dataCenterId << this.dataCenterIdShift) |
        (this.workerId << this.workerIdShift) |
        this.sequence // dataCenterId:1,workerId:1,sequence:0  shiftNum:135168
      var nfirst = new bigInt(String(timestamp - this.twepoch), 10)
      nfirst = nfirst.shiftLeft(this.timestampLeftShift)
      var nnextId = nfirst.or(new bigInt(String(shiftNum), 10)).toString(10)
      return nnextId
    }
    return Snowflake
  })()

  return new Snowflake(1, 1, 0).nextId()
}

// 超大功能弹窗计算
export const superModelComputed = () => {
  const width = window.outerWidth
  const height = window.outerHeight
  return {
    width,
    height,
  }
}

export function getKeyValue(key) {
  var url = window.location.href
  var theRequest = new Object()
  if (url.indexOf('?') != -1) {
    var str = url.split('?')[1]
    var strs = str.split('&')
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
    }
  }
  return theRequest?.[key]
}
