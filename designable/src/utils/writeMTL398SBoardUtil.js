import { message } from 'antd'
import $ from 'jquery'
;('use strict')
// API Url
var websocket = null
var wsUrl = 'ws://localhost:8089'
var apiUrl = wsUrl + '/PPSignSDK/'
//var apiUrl = 'wss://localhost:8090/PPSignSDK/';
/*var apiUrl;
if (location.protocol != 'wss:') {
  apiUrl = 'ws://localhost:8089/PPSignSDK/';
}
else {
  apiUrl = 'wss://localhost:8090/PPSignSDK/';
}*/

// initialize device web api
var initUrl = apiUrl + 'InitialDevice?id=2&width=580&height=380'
// uninitialize device web api
var uninitUrl = apiUrl + 'UninitialDevice?id=2'
// get ink web api
var getInkUrl = apiUrl + 'GetInks'
// clear ink api
var clrInkUrl = apiUrl + 'Clear'
// open & close LCD api
var oplcdUrl = apiUrl + 'OpenLCD'
var cllcdUrl = apiUrl + 'CloseLCD'
// set pen color api
var pencolorUrl = apiUrl + 'SetPenColor?'
// set pen width api
var penwidthUrl = apiUrl + 'SetPenWidth?Width='
// set pen style api
var penstyUrl = apiUrl + 'SetPenStyle?Style='
// save drawing api
var savedrawUrl = apiUrl + 'SaveDrawingImage?'
// get size api
var getsizeUrl = apiUrl + 'GetSize'
// get point api
var getpointUrl = apiUrl + 'GetPointer'
// get about info api
var aboutUrl = apiUrl + 'GetAboutInfo'
// get Version ID api ( for L398 & E560 )
var veridUrl = apiUrl + 'VersionID'
// get pen ID api ( for L398 & E560 )
var penidUrl = apiUrl + 'PenID'
// get pad ID api ( for L398 & E560 )
var padidUrl = apiUrl + 'PadID'
// Display device information in LCD api ( only for L398 )
var diilUrl = apiUrl + 'DisplayDeviceInfoInLCD?show='
// get device information api
var devinfoUrl = apiUrl + 'GetDeviceInfo?type='
// get Encode api
var encodeUrl = apiUrl + 'Encode?type='
// get Decode api
var decodeUrl = apiUrl + 'Decode?type='
// set clip api
var setclipUrl = apiUrl + 'SetClip'
// get valid api
var validUrl = apiUrl + 'IsValid'
// get Decode File Path api
var decodepathUrl = apiUrl + 'GetDecodeFilePath'
// get GetDeviceConfirmOrCancelKeyStatus api
var confirmStatusUrl = apiUrl + 'GetDeviceConfirmOrCancelKeyStatus'

// =========================================
// global variables definition...
var canvas
var context

var isPolling = false
var LastSignatureBase64Data
var bInitWebSocket = false
// =========================================

export function isEmpty(str) {
  return !str || str.length === 0
}

// initialize Web Socket
export function initWebSocket() {
  try {
    if (websocket && websocket.readyState == 1) websocket.close()

    websocket = new WebSocket(wsUrl)
    websocket.onopen = function (evt) {
      // CONNECTED...
      bInitWebSocket = false
      // send initUrl to initial device...
      websocket.send(initUrl)
    }
    websocket.onclose = function (evt) {
      // DISCONNECTED...
      if (bInitWebSocket) {
        bInitWebSocket = false
        message.error(
          '未检测到[蒙恬电子签名板驱动程序],请开启修复工具,进行修复 !'
        )
        //   alert('please run PPSignPadSDK_WSSvr first !');
      }
    }
    websocket.onmessage = function (evt) {
      // message coming from local server...
      var dataInfos = JSON.parse(evt.data)
      processWebSocketResponse(dataInfos)
    }
    websocket.onerror = function (evt) {
      // ERROR : value at evt.data !
      //            alert('initWebSocket() error: ' + evt.data);
    }
  } catch (exception) {
    // exception error !
    bInitWebSocket = false
    //   alert('initWebSocket() exception error: ' + exception);
    message.error(`初始化设备失败${exception}`)
  }
}

export function processWebSocketResponse(wsResponse) {
  var APIName = wsResponse.API
  var Result = wsResponse.Result

  if (APIName == 'InitialDevice') {
    if (Result == '1') {
      isPolling = true
      getInk()
      getStatus()
      $('.init').removeAttr('disabled')
      $('#initBtn').attr('disabled', 'disabled')
    } else {
      message.error(
        '未检测到蒙恬电子签名设备请更换USB孔接入或者重新拔插连接线 !'
      )
      // alert('No device!');
    }
  } else if (APIName == 'UninitialDevice') {
    if (Result == '1') {
      if (websocket && websocket.readyState == 1) websocket.close()

      var encodeArea = $('#encode')
      var decodeArea = $('#decode')
      var canvas = document.getElementById('ppCanvas')
      context.clearRect(0, 0, canvas.width, canvas.height)
      encodeArea.text('')
      decodeArea.text('')
      $('#penColor').val('1')
      $('#penWidth').val('1')
      $('#penStyle').val('0')
      $('.init').attr('disabled', 'disabled')
      $('#initBtn').removeAttr('disabled')
    }
  } else if (APIName == 'GetInks') {
    if (Boolean(Result)) {
      var dataInfos = JSON.parse(Result)
      var inkData = dataInfos[0]

      if (inkData.EventType == '0') {
        drawImage(inkData.Image)
        LastSignatureBase64Data = inkData.Image
      }
    }

    if (isPolling) getInk()
    else {
    }
  } else if (APIName == 'GetDeviceConfirmOrCancelKeyStatus') {
    if (Result == '1') {
      //   alert('Notify From Device : Confirmed.');
      var canvas = document.getElementById('ppCanvas')
      context.clearRect(0, 0, canvas.width, canvas.height)
      drawImage(LastSignatureBase64Data)
      confirmBoard()
    } else if (Result == '0') {
      //   alert('Notify From Device : Cancel !');
      clearMTL398SInk()
    }

    if (isPolling) getStatus()
    else {
    }
  } else if (APIName == 'Clear') {
    var canvas = document.getElementById('ppCanvas')
    context.clearRect(0, 0, canvas.width, canvas.height)
  } else if (APIName == 'OpenLCD') {
    $('.shutdown').fadeOut('fast')
  } else if (APIName == 'CloseLCD') {
    $('.shutdown').fadeIn('fast')
  } else if (APIName == 'SetPenColor') {
  } else if (APIName == 'SetPenWidth') {
    clearMTL398SInk()
  } else if (APIName == 'SetPenStyle') {
  } else if (APIName == 'SaveDrawingImage') {
    if (Boolean(parseInt(Result))) {
      alert('Save file ' + localPath + ' failed' + ', result=' + Result)
    } else {
      alert('File：' + Result + ' saved')
    }
  } else if (APIName == 'SetClip') {
  } else if (APIName == 'GetSize') {
    if (Result == '-8') {
      alert('Ink Empty.\nresult=' + Result)
    } else {
      alert('result=' + Result)
    }
  } else if (APIName == 'GetPointer') {
    var oJson = JSON.parse(Result)
    var dataLength = oJson.length
    var pointcontent = $('#pointContent')
    pointcontent.empty()

    if (dataLength === 0) {
      alert('Point information is empty.')
    } else {
      $('#myModal').modal('show')
      for (var i = 0; i < dataLength; i++) {
        pointcontent.append(
          '<tr><td>' +
            oJson[i].x +
            '</td><td>' +
            oJson[i].y +
            '</td><td align="right">' +
            oJson[i].pressure +
            '</td><td align="right">' +
            oJson[i].bStrokeEnd +
            '</td><td align="right">' +
            oJson[i].Time +
            '</td></tr>'
        )
      }
    }
  } else if (APIName == 'GetAboutInfo') {
    alert(Result)
  } else if (APIName == 'VersionID') {
    alert(Result)
  } else if (APIName == 'PadID') {
    alert(Result)
  } else if (APIName == 'PenID') {
    alert(Result)
  } else if (APIName == 'DisplayDeviceInfoInLCD') {
  } else if (APIName == 'GetDeviceInfo') {
    var diVal = $('#devInfo').val()

    if (diVal == 1) {
      if (Result === 'true') {
        alert('Connected\nresult=' + Result)
      } else {
        alert('Disconnected\nresult=' + Result)
      }
    } else {
      alert(Result)
    }
  } else if (APIName == 'Encode') {
    var encodeArea = $('#encode')
    encodeArea.text(Result)
  } else if (APIName == 'IsValid') {
    if (Result) {
      alert('Protect is valid.')
    } else {
      alert('Protect is not valid !')
    }
  } else if (APIName == 'Decode') {
    var encodeType = $('#encodeType').val()
    var decodeArea = $('#decode')

    if (encodeType == 6) {
      decodeArea.append('X\t\t\t\tY\t\t\t\tbStrokeEnd\n')
      var data = JSON.parse(Result)
      for (var i = 0; i < data.length; i++) {
        var x = data[i].x,
          y = data[i].y,
          bStrokeEnd = data[i].bStrokeEnd

        decodeArea.append(x + '\t\t\t\t' + y + '\t\t\t\t' + bStrokeEnd + '\n')
      }
    } else {
      // send decodepathUrl to get decode file path...
      websocket.send(decodepathUrl)
    }
  } else if (APIName == 'GetDecodeFilePath') {
    alert('File：' + Result + '\nSaved.')
  }
}

// initialize device
export function initMTL398SDevice() {
  canvas = document.getElementById('ppCanvas')

  if (canvas.getContext) {
    context = canvas.getContext('2d')
  }
  bInitWebSocket = true
  initWebSocket()
}

// uninitialize device
export function uninitMTL398SDevice() {
  isPolling = false

  // send uninitUrl to uninitial device...
  websocket.send(uninitUrl)
}

export function getStatus() {
  // 用polling的方式向self-host發送request取得簽名板按鈕status
  var timeId = setTimeout(function () {
    clearTimeout(timeId)

    // 取得狀態
    if (isPolling) {
      // send confirmStatusUrl to start get device confirm or cancel Key status...
      websocket.send(confirmStatusUrl)
    }
  }, 500)
}

export function getInk() {
  // 用polling的方式向self-host發送request取得簽名板畫面(base64格式)
  var timeId = setTimeout(function () {
    clearTimeout(timeId)

    if (isPolling) {
      // send getInkUrl to start get ink data...
      websocket.send(getInkUrl)
    }
  }, 50)
}

export function drawImage(base64) {
  var dataUrl = 'data:image/png;base64,'

  dataUrl = dataUrl + base64

  // 在image中載入圖檔，再畫到canvas呈現
  var img = new Image()

  img.addEventListener(
    'load',
    function () {
      context.drawImage(this, 0, 0, canvas.width, canvas.height)
    },
    false
  )

  img.src = dataUrl
}

// clear Ink
export function clearMTL398SInk() {
  // send clrInkUrl to clear device...
  websocket.send(clrInkUrl)
}

// open lcd
export function openLcd() {
  // send oplcdUrl to open lcd...
  websocket.send(oplcdUrl)
}
// close lcd
export function closeLcd() {
  // send oplcdUrl to open lcd...
  websocket.send(cllcdUrl)
}

// pen width color case
export function pcChange() {
  var colorIndex = $('#penColor').val()
  var R, G, B

  switch (colorIndex) {
    case '1': // Black color...
      R = 0
      G = 0
      B = 0
      break
    case '2': // Red color...
      R = 255
      G = 0
      B = 0
      break
    case '3': // Green color...
      R = 0
      G = 255
      B = 0
      break
    case '4': // Blue color...
      R = 0
      G = 0
      B = 255
      break
  }

  // send pencolorUrl to set pen color...
  websocket.send(pencolorUrl + 'R=' + R + '&G=' + G + '&B=' + B)
}

// pen width change case
export function pwChange() {
  var pwVal = $('#penWidth').val()

  // send penwidthUrl + pwVal to set pen width...
  websocket.send(penwidthUrl + pwVal)
}

//  pen style change case
export function psChange() {
  var psVal = $('#penStyle').val()

  // send penstyUrl + psVal to set pen style...
  websocket.send(penstyUrl + psVal)
}

// save drawing images
export function saveDrawing() {
  var getsdType = $('#sdType').val()
  var getsdDpi = $('#sdDpi').val()
  var localPath = 'DrawImage_' + generateString(5)
  var sdT, sdD

  switch (getsdType) {
    case '1':
      sdT = '.BMP'
      break
    case '2':
      sdT = '.JPG'
      break
    case '3':
      sdT = '.PNG'
      break
    case '7':
      sdT = '.PDF'
      break
    case '8':
      sdT = '.SVG'
      break
  }

  if (getsdDpi == '0') {
    sdD = '150'
  } else {
    sdD = '300'
  }

  // send savedrawUrl + 'type=' + getsdType + '&dpi=' + getsdDpi + '&path=' + localPath + sdT to set drawing image...
  websocket.send(
    savedrawUrl +
      'type=' +
      getsdType +
      '&dpi=' +
      getsdDpi +
      '&path=' +
      localPath +
      sdT
  )
}

// Set clip
export function setClip() {
  var scWidth = $('#scWidth').val()
  var scHeight = $('#scHeight').val()

  if (!scWidth || scWidth < 0) {
    alert('Insert Width!')
    return
  }
  if (!scHeight || scHeight < 0) {
    alert('Insert height!')
    return
  }

  var canvas = document.getElementById('ppCanvas')
  context.clearRect(0, 0, canvas.width, canvas.height)

  // send setclipUrl + '?width=' + scWidth + '&height=' + scHeight to set clip drawing image...
  websocket.send(setclipUrl + '?width=' + scWidth + '&height=' + scHeight)
}

// get size
export function getSize() {
  // send getsizeUrl to get size of ink points...
  websocket.send(getsizeUrl)
}

// get pointer
export function getPointer() {
  // send getpointUrl to get all of ink points...
  websocket.send(getpointUrl)
}

// get about
export function getAbout() {
  // send aboutUrl to get about info...
  websocket.send(aboutUrl)
}

// get version id
export function getVerid() {
  // send veridUrl to get device version...
  websocket.send(veridUrl)
}

// get pad id
export function getPadid() {
  // send padidUrl to get device pad id...
  websocket.send(padidUrl)
}

// get pen id
export function getPenid() {
  // send penidUrl to get device pen id...
  websocket.send(penidUrl)
}

// show device info in lcd
export function showDiilcd() {
  // send diilUrl + '1' to show device info in LCD...
  websocket.send(diilUrl + '1')
}

// hide device info in lcd
export function hideDiilcd() {
  // send diilUrl + '0' to hide device info in LCD...
  websocket.send(diilUrl + '0')
}

// get device information
export function getDevinf() {
  var diVal = $('#devInfo').val()

  // send devinfoUrl + diVal to get device info...
  websocket.send(devinfoUrl + diVal)
}

// Encode
export function encode() {
  var encodeArea = $('#encode')
  encodeArea.text('')
  var encodeType = $('#encodeType').val()

  // send encodeUrl + encodeType to encode ink data...
  websocket.send(encodeUrl + encodeType)
}

// Decode
export function decode() {
  var encodeContent = $('#encode').val()
  var encodeType = $('#encodeType').val()
  var decodeFormat
  var decodeArea = $('#decode')
  decodeArea.text('')

  switch (encodeType) {
    case '1':
      decodeFormat = '.BMP'
      break
    case '2':
      decodeFormat = '.JPG'
      break
    case '3':
      decodeFormat = '.PNG'
      break
  }

  if (encodeType == 6) {
    // send decodeUrl + encodeType to decode ink data...
    websocket.send(decodeUrl + encodeType + '&data=' + encodeContent)
  } else {
    // send decodeUrl + encodeType + '&path=Decode_Image_' + generateString(5) + decodeFormat + '&data=' + encodeContent to decode ink data...
    websocket.send(
      decodeUrl +
        encodeType +
        '&path=Decode_Image_' +
        generateString(5) +
        decodeFormat +
        '&data=' +
        encodeContent
    )
  }
}

// Get Valid
export function getValid() {
  // send validUrl to check if device is connected...
  websocket.send(validUrl)
}

// Generate random number
export function generateString(length) {
  var text = ''
  var possible = '0123456789'

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
