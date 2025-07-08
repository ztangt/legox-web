import dayjs from 'dayjs';
/**
 * [formatDate 时间戳格式化为指定日期格式]
 * @param  {[String]} timestamp [时间戳字符串]
 * @param  {[String]} format [转换格式，全格式"YYYY MM DD HH:mm:ss" 缺省则默认"MM-DD HH:mm"]
 * @return {[String]}           [日期格式]
 */
export function dataFormat(timestamp, format) {
  if (!timestamp) {
    return '';
  }
  var day = dayjs.unix(Number(timestamp));
  var thisFormat = format == undefined ? 'YYYY-MM-DD' : format;

  return day.format(thisFormat).toString();
}

export function dealBigMoney(n) {
  var fraction = ['角', '分'];
  var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  var unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  var head = n < 0 ? '负' : '';
  n = Math.abs(n);
  var s = '';
  for (var i = 0; i < fraction.length; i++) {
    s += (
      digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
    ).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);
  for (var i = 0; i < unit[0].length && n > 0; i++) {
    var p = '';
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return (
    head +
    s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整')
  );
}

/**
 * [formatDate 时间戳格式化为指定日期格式]
 * @param  {[String]} timestamp [时间戳字符串]
 * @param  {[String]} format [转换格式，全格式"YYYY MM DD HH:mm:ss" 缺省则默认"MM-DD HH:mm"]
 * @return {[String]}           [日期格式]
 */
export function formatDate(timestamp, format) {
  var day = dayjs.unix(Number(timestamp));
  var thisFormat = format == undefined ? 'MM-DD HH:mm' : format;

  return day.format(thisFormat).toString();
}

export function toChinese(num) {
  num = Math.floor(num);
  var chinese = '';
  var digits = Math.floor(Math.log10(num)) + 1;
  var digit = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  var times = ['', '十', '百', '千', '万'];
  if (digits >= 9) {
    var quotient = Math.floor(num / Math.pow(10, 8));
    var remainder = num % Math.pow(10, 8);
    var remainderDigits = Math.floor(Math.log10(remainder)) + 1;
    return (
      toChinese(quotient) +
      '亿' +
      (remainderDigits < 8 ? '零' : '') +
      (remainder > 0 ? toChinese(remainder) : '')
    );
  }
  //10000 0000
  if (digits == 1) return digit[num];
  if (digits == 2) {
    var quotient = Math.floor(num / 10);
    var remainder = num % 10;
    if (quotient > 1) {
      chinese = digit[quotient];
    }
    chinese = chinese + times[1];
    if (remainder > 0) {
      chinese = chinese + digit[remainder];
    }
    return chinese;
  }
  if (digits > 5) {
    var quotient = num / Math.pow(10, 4);
    var remainder = num % Math.pow(10, 4);
    var remainderDigits = Math.floor(Math.log10(remainder)) + 1;
    return (
      toChinese(quotient) +
      '万' +
      (remainderDigits < 4 ? '零' : '') +
      (remainder > 0 ? toChinese(remainder) : '')
    );
  }
  for (var index = digits; index >= 1; index--) {
    var number = Math.floor((num / Math.pow(10, index - 1)) % 10);
    //console.log(index+" "+number);
    if (number > 0) {
      chinese = chinese + digit[number] + times[index - 1];
    } else {
      if (index > 1) {
        var nextNumber = Math.floor((num / Math.pow(10, index - 2)) % 10);
        if (nextNumber > 0 && index > 1) {
          chinese = chinese + digit[number];
        }
      }
    }
  }
  return chinese;
}

export function formattingMoney(value) {
  let a = Number(value || 0); //转为数字格式
  let b = a.toLocaleString('zh', {
    style: 'currency',
    currency: 'CNY',
  });
  let c = b.replace('¥', '');
  //解决缺少负号和负号位置不对的问题
  return '¥' + c;
}

// 超大功能弹窗计算
export const superModelComputed = () => {
  const width = window.outerWidth;
  const height = window.outerHeight;
  return {
    width,
    height,
  };
};
// 驼峰转换下划线
export function toLine(name) {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase();
}

export function formatSeconds(seconds) {
  if (seconds < 60) {
    return `${seconds}秒`;
  } else {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) {
      return `${minutes}分`;
    } else {
      return `${minutes}分${remainingSeconds}秒`;
    }
  }
}
//百分比转乘小数
export function toPoint(percent) {
  var str = percent.replace('%', '');
  str = str / 100;
  return str;
}
/**
 * 搜索框内容校验是否包含特殊字符
 * @param {*校验值} value
 */
export function checkWOrd(value) {
  let specialKey =
    "`@《》·~!%#$^&*=|{}':;'\\.<>/?~！#￥……&*|{}‘；：”“'。，、？‘'";
  for (let i = 0; i < value.length; i++) {
    if (specialKey.indexOf(value.substr(i, 1)) != -1) {
      return true;
    }
  }
  return false;
}
//解析url,获取参数
export function getUrlParams(url) {
  let params = [];
  let query = url.split('?');
  if (query.length == 2) {
    let vars = query[1].split('&');
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split('=');
      params[pair[0]] = pair[1];
    }
  }
  return params;
}
