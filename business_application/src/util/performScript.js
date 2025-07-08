import _ from 'lodash';
// import { fetch as DvaFetch } from 'dva';
import { env } from '../../../project_config/env';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const fetchResource = (url) => {
  return fetch(url).then(async (res) => {
    return await res.text();
  });
};

export const getCleanScript = (script) => {
  return String(script).slice(20, -2);
};

// 获取脚本列表
export const fetchedScriptList = async (scriptUrlList = []) => {
  if (Array.isArray(scriptUrlList) && scriptUrlList.length === 0) {
    return [];
  }

  let list = scriptUrlList.filter((i) => i);

  return await Promise.all(list.map(async (item) => await fetchResource(item)));
};

// 执行js脚本
export const performScriptForFunction = (scriptText) => {
  if (!scriptText) {
    return;
  }

  let text = `return ${scriptText}()`;

  return new Function(text);
};

export const scriptEvent = async (scriptUrlList) => {
  const fnList = await fetchedScriptList(scriptUrlList);
  return fnList;

  // let resFn = [];

  // if (fnList.length > 0) {
  //   // 遍历脚本列表
  //   for (let i = 0; i < fnList.length; i++) {
  //     let fn = performScriptForFunction(fnList[i]);
  //     resFn.push(fn);
  //   }
  // }

  // return resFn;
};

export const fetchAPI = async (url, options) => {
  // let res = await DvaFetch(`${env}/${url}`, options);

  // if (res.status >= 200 && res.status < 300) {
  //   let data = await res.json();

  //   if (data.code === '401') {
  //     //跳转到首页
  //     window.location.href = '#/login';
  //   }

  //   return data;
  // }

  // return res;
};

// 获取打印DOM
export async function fetchDOM(templateFullPath) {
  let HTMLStr = await fetchResource(templateFullPath);

  let parser = new DOMParser();
  let dom = parser
    .parseFromString(HTMLStr, 'text/html')
    .getElementsByTagName('body')[0].innerHTML;

  let faDiv = document.createElement('div');
  faDiv.id = 'formView';

  document.body.appendChild(faDiv);

  let div = document.createElement('div');
  div.id = 'preview_HTML';
  div.innerHTML = dom;

  let formView = document.getElementById('formView');

  formView.appendChild(div);

  // 设置打印预设的canvas
  let eleWidth = formView.scrollWidth;
  let eleHeight = formView.scrollHeight;

  let opts = {
    scale: window.devicePixelRatio,
    width: eleWidth,
    height: eleHeight,
    useCORS: true,
    logging: true,
    useCORS: true, // 允许加载跨域的图片
    allowTaint: false, // 允许图片跨域，和 useCORS 二者不可共同使用
    tainttest: true, // 检测每张图片已经加载完成
  };
  html2canvas(formView, opts).then((canvas) => {
    // 设置打印预设的canvas
    printTemplate(canvas);
    document.body.removeChild(faDiv);
  });
}

// 打印DOM
export function printTemplate(canvasPic) {
  const contentWidth = canvasPic.width;
  const contentHeight = canvasPic.height;
  //一页pdf显示html页面生成的canvas高度;
  let pageHeight = (contentWidth / 592.28) * 841.89;
  //未生成pdf的html页面高度
  let leftHeight = contentHeight;
  //页面偏移
  let position = 0;
  //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
  let imgWidth = 595.28;
  let imgHeight = (592.28 / contentWidth) * contentHeight;
  canvasPic.style.padding = '10px';
  let pageData = canvasPic.toDataURL('image/jpeg', 1.0);
  /////////////////////////////////////////////////////////////////
  const pdf = new jsPDF('', 'pt', 'A4');
  //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
  //当内容未超过pdf一页显示的范围，无需分页
  if (leftHeight < pageHeight) {
    pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
  } else {
    // 分页
    while (leftHeight > 0) {
      pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
      leftHeight -= pageHeight;
      position -= 841.89;
      //避免添加空白页
      if (leftHeight > 0) {
        pdf.addPage();
      }
    }
  }
  pdf.save('表单.pdf');
}
