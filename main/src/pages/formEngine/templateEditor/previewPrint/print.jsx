import {connect} from 'dva';
import {Button} from 'antd';
import {useEffect, useState} from 'react';
import {filterDOM} from '../componments/util';
import {cssInnerFormat} from './config.js';
import './print.css';
import WaterMark from 'watermark-component-for-react'
import { parse } from 'query-string';
import { history,useDispatch } from 'umi'
function Print({dispatch, templateEditorPrint}) {
  const {previewURL} = templateEditorPrint;

  const [ styleObj, setStyleObj ] = useState({});
  // 方向
  const [ sizeLayout, setSizeLayout ] = useState('portrait');

  let [waterMarkText, setWaterMarkText] = useState('');
  useEffect(()=>{
    const query = parse(history.location.search);
    const { deployFormId } = query;
    // const dispatch = useDispatch()
    dispatch({
      type: 'templateEditorPrint/updateStates',
      payload: {
        deployFormId,
      },
    });

    dispatch({
      type: 'templateEditorPrint/previewPrintTemplate',
      payload: { id: deployFormId },
    });
  },[])
  const getStyle = arr => {
    return arr.reduce((pre, cur) => {
      let curArr = cur.split(':');

      pre[curArr[0]] = curArr[1];
      return pre;
    }, {});
  };

  const getHTMLRes = async (previewURL, doc) => {
    const formPreview = doc.getElementById('formPreview');

    let HTMLStr = await filterDOM(previewURL);

    let parser = new DOMParser();
    let dom = parser
      .parseFromString(HTMLStr, 'text/html')
      .getElementsByTagName('body')[0].innerHTML;

    let body = parser
      .parseFromString(HTMLStr, 'text/html')
      .getElementsByTagName('body')[0];

    let stArr = body
      .getAttribute('style')
      .split('; ')
      .filter(i => i);

    let {size, height, ...stObj} = getStyle(stArr);
    console.log('styleObj', stObj);
    setStyleObj(stObj);
    size = size.replace(/\s/g, '')
    console.log(size,5555)
    setSizeLayout(size);

    formPreview.innerHTML = dom;
    let tdList = formPreview.getElementsByTagName('td');
    let wText=''
    tdList=[...tdList]
    tdList.forEach((item,index)=>{
      let innerText = item.innerText;
      if(innerText==='单据编号：'){
      // if(innerText==='现金'){
        wText=tdList[index+1].innerText
      }
    })
    setWaterMarkText(wText)
  };


  const __canvasWM = ({
                        container,
                        width = 2000,
                        height = 10000,
                        textAlign = 'center',
                        textBaseline = 'middle',
                        font = "90px Microsoft Yahei",
                        fillStyle = 'rgba(245, 245, 245, 0.6)',
                        content = '水印',
                        rotate = '45',
                        zIndex = -1
                      }) => {
    const args = arguments[0];
    const canvas = document.createElement('canvas');

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    const ctx = canvas.getContext("2d");

    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.font = font;
    ctx.fillStyle = fillStyle;
    // ctx.rotate(Math.PI / 180 * rotate);

    let number=600;
    if(waterMarkText.length>12){
      number=800
    }
    if(waterMarkText.length>15){
      number=1000
    }
    if(waterMarkText.length>20){
      number=1200
    }
    if(waterMarkText.length>25){
      number=1360
    }

    for (let i = 0; i < width; i++) {
      for(let j = 0; j < height; j++) {
        ctx.save();
        ctx.translate(i, j);
        ctx.rotate(Math.PI / 180 * rotate);
        ctx.fillText(waterMarkText, 0, 0);
        ctx.translate(-i,-j);
        ctx.restore();
        j+= number;
      }
      i+= number;
    }

    const base64Url = canvas.toDataURL();
    const contentWindow = document.querySelector("iframe").contentWindow;
    const __wm = contentWindow.document.querySelector('.__wm');

    const watermarkDiv = __wm || document.createElement("div");
    watermarkDiv.appendChild(canvas);

    const styleStr = `
                  position:fixed;
                  top:0;
                  left:0;
                  bottom:0;
                  right:0;
                  width:100%;
                  height:100%;
                  z-index:${ zIndex };
                  pointer-events:none;
                  background-repeat:repeat;`;

    watermarkDiv.setAttribute('style', styleStr);
    watermarkDiv.classList.add('__wm');

    console.log(watermarkDiv,'--->watermarkDiv')

    if (!__wm) {
      container.style.position = 'relative';
      container.insertBefore(watermarkDiv, container.firstChild);
    }
    console.log(container.firstChild,'--->')

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    if (MutationObserver) {
      let mo = new MutationObserver(function () {
        const __wm = document.querySelector('.__wm');
        // 只在__wm元素变动才重新调用 __canvasWM
        if (( __wm && __wm.getAttribute('style') !== styleStr ) || !__wm) {
          // 避免一直触发
          mo.disconnect();
          mo = null;
          __canvasWM(JSON.parse(JSON.stringify(args)));
        }
      });

      mo.observe(container, {
        attributes: true,
        subtree: true,
        childList: true
      })
    }

    window.__canvasWM = __canvasWM;
  }


  const onPrint = async () => {
    let cssLinks =
      document.querySelectorAll('link[href$=".css"]').length > 0
        ? document.querySelectorAll('link[href$=".css"]')
        : document.querySelectorAll('style[type^="text/css"]');
    let cssFormat =
      document.querySelectorAll('link[href$=".css"]').length > 0
        ? [].slice.call(cssLinks).map(item => item.href)
        : cssLinks[cssLinks.length - 1];
    if (!iframe) {
      let el = document.querySelectorAll('#formPreview')[0];
      var iframe = document.createElement('IFRAME');
      let doc = null;
      iframe.setAttribute('id', 'print-iframe');
      iframe.setAttribute(
        'style',
        'position:absolute; width:0; height:0;left:-500px;top:-500px',
      );
      document.body.appendChild(iframe);
      doc = iframe.contentWindow.document;
      if (document.querySelectorAll('link[href$=".css"]').length > 0) {
        doc.write(
          `<style media="print" type="text/css"> @page {size:${ sizeLayout }; margin:${ styleObj.padding };}
            ${ cssInnerFormat }
          </style>`,
        );
      } else {
        doc.write(
          `<style media="print" type="text/css"> @page {size:${ sizeLayout }; margin:${ styleObj.padding };}' +
            ${ cssFormat.innerHTML } +
            '</style>`,
        );
      }
      doc.write('<div class="ck-content" id="ck-content">' + el.innerHTML + '</div>');
      doc.close();
      iframe.contentWindow.focus();
    }
    iframe.onload = function () {
      let iframeDom = iframe.contentWindow.document;
      console.log(iframeDom,'iframeDom')

      let bodyContent = iframeDom.getElementsByTagName('body')[0];
      bodyContent.style.position = 'relative';
      __canvasWM({container: bodyContent, content: '水印'})
      console.log(iframeDom,`iframeDom22`)
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    };
  };

  useEffect(() => {
    if (previewURL) {
      getHTMLRes(previewURL, document);
    }
  }, [ previewURL ]);

  // console.log(waterMarkText,'waterMarkText--->最后的')
  return (
    <div
      style={ {height: '100%', overflowY: 'auto', backgroundColor: '#f0f2f5'} }
    >
      <Button
        style={ {position: 'absolute', right: '30px', top: '30px'} }
        onClick={ onPrint }
      >
        打印
      </Button>
      <div style={ {width: '100%', backgroundColor: '#f0f2f5'} } id='toPrint' >
      {/*<div style={ {width: '100%', backgroundColor: '#f0f2f5'} }>*/}
        {/*<WaterMark  style={ {...styleObj, margin: '0 auto', padding: '0'} } content={ waterMarkText }>*/}
          <div
            className="ck-content"
            id="formPreview"
            style={ {
              ...styleObj,
              margin: '0 auto',
              backgroundColor: '#fff',
            } }
          ></div>
        {/*</WaterMark>*/}
      </div>
    </div>
  );
}

export default connect(({templateEditorPrint}) => ( {
  templateEditorPrint,
} ))(Print);
