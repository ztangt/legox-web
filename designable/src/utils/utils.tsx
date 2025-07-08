import dayjs from 'dayjs'
import moment from 'moment'
import iconData from '../../public/iconfont-font.json'
/**
 * 搜索框内容校验是否包含特殊字符
 * @params value {检验名}
 */
export function checkWOrd(value: string) {
  let specialKey =
    "`@《》·~!%#$^&*=|{}':;'\\.<>/?~！#￥……&*|{}‘；：”“'。，、？‘'"
  for (let i = 0; i < value.length; i++) {
    if (specialKey.indexOf(value.substr(i, 1)) != -1) {
      return true
    }
  }
  return false
}
/**
 * [formatDate 时间戳格式化为指定日期格式]
 * @param  {[String]} timestamp [时间戳字符串]
 * @param  {[String]} format [转换格式，全格式"YYYY MM DD HH:mm:ss" 缺省则默认"MM-DD HH:mm"]
 * @return {[String]}           [日期格式]
 */
export function dataFormat(timestamp: string, format?: string): string {
  if (!timestamp) {
    return ''
  }
  var day = dayjs.unix(Number(timestamp))
  var thisFormat = format == undefined ? 'YYYY-MM-DD' : format

  return day.format(thisFormat).toString()
}
export function dealBigMoney(n) {
  var fraction = ['角', '分']
  var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  var unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ]
  var head = n < 0 ? '负' : ''
  n = Math.abs(n)
  var s = ''
  for (var i = 0; i < fraction.length; i++) {
    s += (
      digit[Math.floor(n.multiply(10).multiply(Math.pow(10, i))) % 10] +
      fraction[i]
    )
      // digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
      .replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  for (var i = 0; i < unit[0].length && n > 0; i++) {
    var p = ''
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  return (
    head +
    s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整')
  )
}

/**
 * [formatDate 时间戳格式化为指定日期格式]
 * @param  {[String]} timestamp [时间戳字符串]
 * @param  {[String]} format [转换格式，全格式"YYYY MM DD HH:mm:ss" 缺省则默认"MM-DD HH:mm"]
 * @return {[String]}           [日期格式]
 */
export function formatDate(timestamp, format) {
  var day = moment.unix(Number(timestamp))
  var thisFormat = format == undefined ? 'MM-DD HH:mm' : format

  return day.format(thisFormat).toString()
}

// 计算起止时间
export function calculateTime(v1, v2, type = 'DAY') {
  let start = (v2.split('_')[1] || v2) * 1000
  let end = (v1.split('_')[1] || v1) * 1000
  let diff = Math.floor(end - start)
  let time = 0
  switch (type) {
    case 'DAY':
      time = Math.floor(diff / (24 * 3600 * 1000))
      break
    case 'HOUR':
      time = Math.floor(diff / (3600 * 1000))
      break
    case 'MIN':
      time = Math.floor(diff / (60 * 1000))
      break
    case 'SEC':
      time = Math.floor(diff / (60 * 1000))
      break
    default:
      break
  }
  return time
}

// 驼峰转换下划线
export function toLine(name) {
  if (typeof name === 'number') {
    return name
  }
  return name && name?.replace(/([A-Z])/g, '_$1').toLowerCase()
}

export function toNumber(val) {
  if (typeof val === 'number') {
    // 如果是数字类型则直接返回
    return val
  } else if (typeof val === 'string' && !isNaN(Number(val))) {
    // 如果是字符串且可以转为数字则先转成数字
    return Number(val)
  } else if (typeof val === 'string' && val.includes(',')) {
    // 如果是千分位字符串则去除逗号并转为数字
    return Number(val.replace(/,/g, ''))
  } else {
    // 其他情况则返回NaN
    return NaN
  }
}

export function mergeSameKeys(arr) {
  const result = {}
  // 遍历每一项
  arr.forEach((item) => {
    const key = item.key
    const val = item.val
    // 如果对象中已经存在该key，则将val添加到已有val的末尾
    if (result[key]) {
      result[key] += `\n${val}`
    } else {
      result[key] = val
    }
  })
  // 将合并后的结果转换为数组，并返回
  const mergedArr = []
  for (const key in result) {
    if (result.hasOwnProperty(key)) {
      const val = result[key]
      mergedArr.push({ key, val })
    }
  }
  return mergedArr
}
//千分位符转为数字
export function remoney(data: any) {
  let str = ''
  if (data) {
    str = String(data).replace(/,/g, '')
  }
  return parseFloat(str)
  // if (data && (data + '').indexOf('.') > -1 && Number(str)) {
  //   return String(data).replace(/[^\d\.-]/g, '')
  // } else if (data && Number(str)) {
  //   return str
  // } else {
  //   return data
  // }
}
export function getUrlParams(url: string) {
  let params = []
  let query = url.split('?')
  if (query.length == 2) {
    let vars = query[1].split('&')
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split('=')
      params[pair[0]] = pair[1]
    }
  }
  return params
}
//判断字符串的字符节点长度
export function strLength(str: string) {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    let c = str.charAt(i)
    if (/^[\u0000-\u00ffA-Za-z1-9]+$/.test(c)) {
      len += 1
    } else {
      len += 2
    }
  }
  return len
}

export function dateAdd(interval, number, date) {
  switch (interval) {
    case 'y': {
      date.setFullYear(date.getFullYear() + number)
      return date
    }
    case 'q': {
      date.setMonth(date.getMonth() + number * 3)
      return date
    }
    case 'm': {
      date.setMonth(date.getMonth() + number)
      return date
    }
    case 'w': {
      date.setDate(date.getDate() + number * 7)
      return date
    }
    case 'd': {
      date.setDate(date.getDate() + number)
      return date
    }
    case 'h': {
      date.setHours(date.getHours() + number)
      return date
    }
    case 'm': {
      date.setMinutes(date.getMinutes() + number)
      return date
    }
    case 's': {
      date.setSeconds(date.getSeconds() + number)
      return date
    }
    default: {
      date.setDate(date.getDate() + number)
      return date
    }
  }
}
//百分比转乘小数
export function toPoint(percent) {
  var str = percent.replace('%', '')
  str = str / 100
  return str
}

export function getFlatArr(arr) {
  return arr.reduce((a, item) => {
    let flatArr = [...a, item]
    if (item.children) {
      flatArr = [...flatArr, ...getFlatArr(item.children)]
    }
    return flatArr
  }, [])
}

// 查找可用icon
export function isInIconFont(info) {
  let name = ''
  let codeFlag = iconData.glyphs.findIndex((item) => {
    return item.font_class == info.menuCode
  })
  let iconFlag = iconData.glyphs.findIndex((item) => {
    return item.font_class == info.menuIcon
  })
  name =
    iconFlag != -1 ? info.menuIcon : codeFlag != -1 ? info.menuCode : 'default'
  return name
}

export function returnValue(
  columnobj,
  oldValue,
  element,
  isImport,
  basicList,
  fieldProps
) {
  console.log('fieldProps==', fieldProps, columnobj)
  let value = ''
  let key = isImport ? 'dictInfoName' : 'dictInfoCode'
  let keyU = isImport ? 'dictInfoCode' : 'dictInfoName'
  if (columnobj && Object.keys(columnobj)?.length) {
    if (columnobj?.columnType == 'BasicData' && columnobj?.codeTable) {
      //基础数据码表
      let list = []
      // basicList?.map((item) => {
      //   if (item?.[columnobj?.codeTable]) {
      //     list = item?.[columnobj?.codeTable]
      //   }
      // })
      Object.keys(basicList)?.map((key) => {
        if (key == columnobj?.codeTable && basicList?.[columnobj?.codeTable]) {
          list = basicList?.[columnobj?.codeTable]?.dictInfos
        }
      })
      const loop = (array) => {
        array.forEach((element) => {
          let arrayValue = []
          let checkValue = []
          if (columnobj.selectModal == 'checkbox') {
            //多选
            if (isImport && oldValue.includes(',')) {
              //导入的数据 逗号分隔
              arrayValue = oldValue.split(',')
            } else {
              //导出时的值是数组
              arrayValue = oldValue
            }
            arrayValue.map((item) => {
              if (item == element?.[key]) {
                checkValue.push(element?.[keyU])
              } else {
                if (element?.children && element?.children) {
                  loop(element?.children)
                }
              }
            })
            value = isImport ? checkValue : checkValue.toString()
          } else {
            //单选
            if (element?.[key] == oldValue) {
              value = element?.[keyU]
            } else {
              if (element?.children && element?.children) {
                loop(element?.children)
              }
            }
          }
        })
      }
      loop(list)
      // if (columnobj.showModel == 'select') {
      //   // getDictType(
      //   //   {
      //   //     dictTypeCode: columnobj?.codeTable,
      //   //     showType: 'ALL',
      //   //   },
      //   //   (list: any) => {

      //   //   }
      //   // )
      //       //需要遍历取值
      //       // dictInfoCode
      //       // dictInfoName
      //       const loop = (array)=>{
      //         array.forEach(element => {
      //           let arrayValue = []
      //           let checkValue = []
      //           if(columnobj.selectModal=='checkbox'){//多选
      //             if(isImport&&oldValue.includes(',')){//导入的数据 逗号分隔
      //               arrayValue = oldValue.split(',')
      //             }else{//导出时的值是数组
      //               arrayValue = oldValue
      //             }
      //             arrayValue.map((item)=>{
      //               if(item == element?.[key]){
      //                 checkValue.push(element?.[keyU])
      //               }else{
      //                 if(element?.children&& element?.children){
      //                   loop(element?.children)
      //                 }
      //               }
      //             })
      //             value =  isImport?checkValue:checkValue.toString()
      //           }else{//单选
      //             if(element?.[key] == oldValue){
      //               value = element?.[keyU]
      //               console.log('valuevalue',value);

      //             }else{
      //               if(element?.children&& element?.children){
      //                 loop(element?.children)
      //               }
      //             }
      //           }
      //         });
      //       }
      //       loop(list);
      // }
      // else {
      //   // getDictTypeList(
      //   //   {
      //   //     dictTypeCode: columnobj?.codeTable,
      //   //     showType: 'ALL',
      //   //   },
      //   //   (list: any) => {

      //   //   }
      //   // )
      //   let arrayValue = []
      //   let checkValue = []
      //   if(columnobj.selectModal=='checkbox'){//多选
      //     if(isImport&&oldValue.includes(',')){//导入的数据 逗号分隔
      //       arrayValue = oldValue.split(',')
      //     }else{//导出时的值是数组
      //       arrayValue = oldValue
      //     }
      //     arrayValue.map((item)=>{
      //       let flag  = list.findIndex((element)=>{return element?.[key] == item})
      //       if(flag!=-1){
      //         checkValue.push(list?.[flag]?.[keyU])
      //       }
      //     })
      //     value =  isImport?checkValue:checkValue.toString()
      //   }else{//单选
      //     let flag  = list.findIndex((item)=>{return item?.[key] == oldValue})
      //     if(flag!=-1){
      //       value = list?.[flag]?.[keyU]
      //     }
      //   }
      //   return value
      // }
    } else if (
      columnobj?.columnType == 'DeptTree' ||
      columnobj?.columnType == 'PersonTree' ||
      columnobj?.columnType == 'OrgTree'
    ) {
      //树控件
      // let hideCode = columnobj?.name?.split('NAME_')[0] + 'ID_'
      // let hideValue = element?.[hideCode]
      if (isImport) {
      } else {
        value = oldValue
      }
    } else if (columnobj?.columnType == 'TreeTable') {
      //业务控件
      value = oldValue //气象让加上，他们自己处理数据
      // if (isImport) {//气象让加上，他们自己处理数据
      //   value = oldValue
      // }
      // if (!isImport) {
      //   value = oldValue
      // }
    } else if (columnobj?.columnType == 'DatePicker') {
      //日期控件
      if (isImport) {
        if (moment(oldValue).isValid()) {
          value = `date_${moment(oldValue, columnobj?.format).unix()}`
        }
      } else {
        value =
          oldValue &&
          dataFormat(
            oldValue?.includes('date_') ? oldValue.split('date_')[1] : oldValue,
            columnobj?.format
          )
      }
    } else if (columnobj?.columnType == 'NumberPicker') {
      //金额字段是2.00的时候保存的是2，这个时候显示就会有问题
      console.log('oldValue==', oldValue)
      switch (fieldProps.formatter) {
        case 'THUSSECDECIMAL': //千分位两位小数
        case 'SECDECIMAL': //两位
          value = oldValue ? parseFloat(oldValue).toFixed(2) : ''
          break
        case 'THUSFOURDECIMAL': //千分位四位小数
        case 'FOURDECIMAL': //四位
          value = oldValue ? parseFloat(oldValue).toFixed(4) : ''
          break
        case 'THUSSIXDECIMAL': //千分位六位小数
        case 'SIXDECIMAL': //六位
          value = oldValue ? parseFloat(oldValue).toFixed(6) : ''
          break
        default:
          value = oldValue
          break
      }
    } else {
      value = oldValue
    }
  }

  return value
}
