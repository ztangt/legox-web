import moment from 'moment'
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
    var day = moment.unix(Number(timestamp));
    var thisFormat = format == undefined ? "YYYY-MM-DD" : format;

    return day.format(thisFormat).toString();
  }
  /**
 * 【设置cookie】
 */
export function setCookie(objName, objValue, objHours = 0) {
  var str = objName + "=" + objValue;
  if (objHours > 0) {//为0时不设定过期时间，浏览器关闭时cookie自动消失
      var date = new Date();
      var ms = objHours * 3600 * 1000;
      date.setTime(date.getTime() + ms);
      str += "; expires=" + date.toGMTString();
  }
  document.cookie = str;
}
/**
* 【读取cookie】
*/
export function getCookie(objName) {//获取指定名称的cookie的值
  var arrStr = document.cookie.split("; ");
  for (var i = 0; i < arrStr.length; i++) {
      var temp = arrStr[i].split("=");
      if (temp[0] == objName) return temp[1];
  }
  return "";
}
