global.STATE401 = false;//false是没有401的状态，true是有401的状态（用于refreshUsertoken）
global.ACTIONS401 = [];//返回401状态的action请求及参数
global.getQuery = () =>{
    var url = window.location.href;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.split("?")[1];
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    return theRequest
}