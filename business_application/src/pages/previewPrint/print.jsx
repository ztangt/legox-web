import { connect } from 'dva';
import { Button } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { cssInnerFormat, filterDOM } from './config.js';
import './print.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import dayjs from 'dayjs';
import SparkMD5 from 'spark-md5';

function Print({ dispatch, templateEditorPrint, location }) {
  const { previewURL } = templateEditorPrint;

  const [styleObj, setStyleObj] = useState({});
  // 方向
  const [sizeLayout, setSizeLayout] = useState('portrait');

  const [scale, setScale] = useState(1);
  const [mainTableId, setMainTableId] = useState('');

  const getStyle = (arr) => {
    return arr.reduce((pre, cur) => {
      let curArr = cur.split(':');

      pre[curArr[0]] = curArr[1];
      return pre;
    }, {});
  };
  let [waterMarkText, setWaterMarkText] = useState('');
  const getHTMLRes = async (previewURL, doc) => {
    const formPreview = doc.getElementById(`formPreview-${mainTableId}`);

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
      .filter((i) => i);

    let { size, height, ...stObj } = getStyle(stArr);
    console.log('styleObj', stObj);
    setStyleObj(stObj);
    setSizeLayout(size);

    formPreview.innerHTML = dom;

    let tdList = formPreview.getElementsByTagName('td');
    let wText = ''
    tdList = [...tdList]
    console.log('tdList', tdList, '????')
    tdList.forEach((item, index) => {
      let innerText = item.innerText;
      if (innerText === '单据编号：') {
        // if(innerText==='现金'){
        wText = tdList[index + 1].innerText
      }
    })
    setWaterMarkText(wText)
    // if (formPreview) {
    //   const a4Width = 794; // A4 width in pixels
    //   const a4Height = 1123; // A4 height in pixels
    //   const newScale = Math.min(
    //     a4Width / formPreview.scrollWidth,
    //     a4Height / formPreview.scrollHeight,
    //   );
    //   console.log('formPreview', newScale);
    //   setScale(newScale);
    // }
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
  }, contentWindow) => {
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

    let number = 600;
    if (waterMarkText.length > 12) {
      number = 800
    }
    if (waterMarkText.length > 15) {
      number = 1000
    }
    if (waterMarkText.length > 20) {
      number = 1200
    }
    if (waterMarkText.length > 25) {
      number = 1360
    }

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        ctx.save();
        ctx.translate(i, j);
        ctx.rotate(Math.PI / 180 * rotate);
        ctx.fillText(waterMarkText, 0, 0);
        ctx.translate(-i, -j);
        ctx.restore();
        j += number;
      }
      i += number;
    }

    // const base64Url = canvas.toDataURL();
    // const contentWindow = document.querySelector("iframe").contentWindow;
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
                  z-index:${zIndex};
                  pointer-events:none;
                  background-repeat:repeat;`;

    console.log(zIndex, 10000000000000)
    watermarkDiv.setAttribute('style', styleStr);
    watermarkDiv.classList.add('__wm');

    console.log(watermarkDiv, '--->watermarkDiv')

    if (!__wm) {
      container.style.position = 'relative';
      container.insertBefore(watermarkDiv, container.firstChild);
    }
    console.log(container.firstChild, '--->')

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    if (MutationObserver) {
      let mo = new MutationObserver(function () {
        const __wm = document.querySelector('.__wm');
        // 只在__wm元素变动才重新调用 __canvasWM
        if ((__wm && __wm.getAttribute('style') !== styleStr) || !__wm) {
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

  const onPrint = () => {
    let cssLinks =
      document.querySelectorAll('link[href$=".css"]').length > 0
        ? document.querySelectorAll('link[href$=".css"]')
        : document.querySelectorAll('style[type^="text/css"]');
    let cssFormat =
      document.querySelectorAll('link[href$=".css"]').length > 0
        ? [].slice.call(cssLinks).map((item) => item.href)
        : cssLinks[cssLinks.length - 1];
    if (!iframe) {
      let el = document.querySelectorAll(`#formPreview-${mainTableId}`)[0];
      var iframe = document.createElement('IFRAME');
      let doc = null;
      iframe.setAttribute('id', 'print-iframe');
      iframe.setAttribute(
        'style',
        'position:absolute; width:0; height:0;left:-500px;top:-500px',
      );
      document.body.appendChild(iframe);
      doc = iframe.contentWindow.document;

      const a4Height = 1123; // A4 height in pixels
      // const newScale = Math.min(
      //   a4Width / el.scrollWidth,
      //   a4Height / el.scrollHeight,
      // );
      const newScale = a4Height / el.scrollHeight;
      console.log('newScale', newScale, 1 / newScale);
      // transform: scale(${1 / newScale});

      // const newSizeLayout='landscape'//打印客户只要横向的
      doc.write(
        `<style type="text/css">
          @page {size:${sizeLayout}}
          @media print {
            .ck-content {
              // transform: scale(${1 / newScale});
              max-width: 100%;
              max-width: 100%;
              width: fit-content;
              height: fit-content;
            }
          }
          ${document.querySelectorAll('link[href$=".css"]').length > 0
          ? cssInnerFormat
          : cssFormat.innerHTML
        }
        </style>`,
      );
      doc.write('<div  class="ck-content">' + el.innerHTML + '</div>');
      doc.close();
      iframe.contentWindow.focus();
    }
    iframe.onload = function () {

      let iframeDom = iframe.contentWindow.document;
      let bodyContent = iframeDom.getElementsByTagName('body')[0];
      bodyContent.style.position = 'relative';
      //将iframe的contentWindow传给__canvasWM，解决插件导致跨域问题
      __canvasWM({ container: bodyContent, content: '水印' }, iframe.contentWindow);

      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    };
  };


  /**
   * 计算文件MD5
   */
  const calcFileMD5 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onloadend = (e) => {
        console.log('FileReader onloadend', e);
        const md5 = SparkMD5.ArrayBuffer.hash(e.target.result);
        resolve(md5);
      };
      fileReader.onerror = reject;
    });
  };


  const onPdf = () => {
    let cssLinks =
      document.querySelectorAll('link[href$=".css"]').length > 0
        ? document.querySelectorAll('link[href$=".css"]')
        : document.querySelectorAll('style[type^="text/css"]');
    let cssFormat =
      document.querySelectorAll('link[href$=".css"]').length > 0
        ? [].slice.call(cssLinks).map((item) => item.href)
        : cssLinks[cssLinks.length - 1];
    if (!iframe) {
      let el = document.querySelectorAll(`#formPreview-${mainTableId}`)[0];
      var iframe = document.createElement('IFRAME');
      let doc = null;
      iframe.setAttribute('id', 'print-iframe-pdf');
      iframe.setAttribute(
        'style',
        'position:absolute; width:0; height:0;left:-500px;top:-500px',
      );
      document.body.appendChild(iframe);
      doc = iframe.contentWindow.document;
      doc.write(
        `<style type="text/css">
          ${document.querySelectorAll('link[href$=".css"]').length > 0
          ? cssInnerFormat
          : cssFormat.innerHTML
        }
        </style>`);
      doc.write('<div  class="ck-content" id="ck-content-id">' + el.innerHTML + '</div>');
      doc.close();
      iframe.contentWindow.focus();
    }
    iframe.onload = async function () {
      const iframeBody = iframe.contentWindow.document.body;
      // 调整 HTML 样式
      iframeBody.style.width = sizeLayout === 'portrait' ? '210mm' : '297mm'; // A4 页面宽度默认横向
      iframeBody.style.margin = '8px auto'; // 去除默认边距

      // 根据 sizeLayout 设置 PDF 的方向
      const pdf = new jsPDF(sizeLayout === 'portrait' ? 'p' : 'l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const content = iframe.contentWindow.document.querySelector('.ck-content');

      let position = 0;
      let firstPage = true;

      // 拆分内容，遇到 page-break 就分页
      let nodes = [];
      let temp = [];
      content.childNodes.forEach(node => {
        if (node.nodeType === 1 && node.classList.contains('page-break')) {
          if (temp.length) nodes.push([...temp]);
          nodes.push([node]); // page-break单独一组
          temp = [];
        } else {
          temp.push(node);
        }
      });

      // 处理最后一组
      if (temp.length) nodes.push([...temp]);
      for (let group of nodes) {
        // 跳过 page-break本身，只分页
        if (group.length === 1 && group[0].nodeType === 1 && group[0].classList.contains('page-break')) {
          // 只切换 firstPage，不加页
          firstPage = false;
          continue;
        }
        // 内容分组，除第一页外先加新页
        if (!firstPage) pdf.addPage();
        firstPage = false;

        // 创建临时div渲染
        const tempDiv = document.createElement('div');
        tempDiv.style.width = content.offsetWidth + 'px';
        tempDiv.style.background = '#fff';
        tempDiv.style.padding = '30px'
        tempDiv.className = 'ck-content';
        group.forEach(node => tempDiv.appendChild(node.cloneNode(true)));
        iframeBody.appendChild(tempDiv);
        await new Promise(resolve => setTimeout(resolve, 0)); // 等待一帧解决空白页问题
        // 渲染为canvas
        const canvas = await html2canvas(tempDiv, { scale: 3, useCORS: true, dpi: 96 });
        const imgData = canvas.toDataURL('image/jpeg', 0.5);
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        iframeBody.removeChild(tempDiv);
      }

      //到此生成了一个pdf,再去上传到后端
      let time = dayjs().format('YYYY/MM/DD');
      let filePathStr = `BizAttachment/${time}/${mainTableId}/THE_SAVE_PDF/sp_${mainTableId}.pdf`;
      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], `sp${mainTableId}.pdf`, { type: 'application/pdf' });
      // 计算文件的MD5值
      const fileMD5 = await calcFileMD5(pdfFile);
      console.log(fileMD5, '----->生成的文件fileMD5');

      dispatch({
        type: 'templateEditorPrint/getFileMD5',
        payload: {
          fileEncryption: fileMD5,
          filePath: filePathStr,
          isPresigned: 1,
        },
        callback: (data) => {
          let { presignedUploadUrl, have } = data?.data;
          if (have == 'Y') { // 如果文件已存在直接打开
            // 打开预览页面
            let href = window.document.location.href
            let pathname = href.split('/business_application')
            window.open(`${pathname[0]}/business_application/pdfPreview?src=${data.data.fileFullPath}`)
          } else {
            dispatch({
              type: 'templateEditorPrint/uploadPdfFileToMinio',
              payload: {
                fileEncryption: fileMD5,
                filePath: filePathStr,
                isPresigned: 1,
                fileName: `sp_${mainTableId}.pdf`,
                fileSize: pdfBlob.size,
                presignedUploadUrl: presignedUploadUrl,
                file: pdfFile,
              },
            })
          }
        }
      })
      // 移除 iframe
      document.body.removeChild(iframe);
    };
  };

  const [showBatchPrintBtn, setShowBatchPrintBtn] = useState(false);
  useEffect(() => {
    const { mainTableId, url, bizInfoId, bizSolId, oldFileId, showBatchPrintBtn } = location.query;
    setMainTableId(mainTableId);
    setShowBatchPrintBtn(showBatchPrintBtn == 'true');
    dispatch({
      type: 'templateEditorPrint/updateStates',
      payload: {
        previewURL: url,
        mainTableId: mainTableId,
        bizInfoId: bizInfoId,
        bizSolId: bizSolId,
        oldFileId: oldFileId,
        isOpen: false
      },
    });
    if (url) {
      getHTMLRes(url, document);
    }
  }, [])

  const onPrintSingle = () => {
    dispatch({
      type: 'templateEditorPrint/updateStates',
      payload: { isOpen: false },
    })
    onPrint();
    onPdf()
  }

  const onPdfBtn = () => {
    dispatch({
      type: 'templateEditorPrint/updateStates',
      payload: { isOpen: true, },
    })
    onPdf()
  }
  return (
    <div
      style={{ height: '100%', overflowY: 'auto', backgroundColor: '#f0f2f5' }}
    >
      <Button
        style={{ position: 'absolute', right: '30px', top: '30px' }}
        onClick={onPrintSingle}
      >
        打印
      </Button>
      {showBatchPrintBtn &&
        <Button
          style={{ position: 'absolute', right: '30px', top: '70px' }}
          onClick={onPdfBtn}
        >
          批量打印
        </Button>}
      <div style={{ width: '100%', backgroundColor: '#f0f2f5' }} id='toPrint'>
        <div
          className="ck-content"
          id={`formPreview-${mainTableId}`}
          style={{
            ...styleObj,
            margin: '0 auto',
            width: '80%',//宽度要改成80%的
            backgroundColor: '#fff',
            // transform: `scale(${scale})`,
          }}
        ></div>
      </div>
    </div>
  );
}

export default connect(({ templateEditorPrint }) => ({
  templateEditorPrint,
}))(Print);
