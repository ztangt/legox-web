
import pubsub from 'pubsub-js'
import {Modal} from 'antd';
// // 承装所有 canvas 的容器的类名
const allCanvasParentNodeClassName = 'canvas-parent-container';
// //页面的整体布局
async function  displayLayoutPdf(loadingTask,leftNav,centerArea,callback,isMobile){
    loadingTask.promise.then(async pdf=>{
        // pdf._pdfInfo.numPages 为 pdf 的总页数
        const pageNumber = pdf._pdfInfo.numPages;
        console.log('pageNumber===',pageNumber);
        const leftAllCanvasParentNode = document.createElement('div');
        leftAllCanvasParentNode.className = allCanvasParentNodeClassName;
        leftAllCanvasParentNode.style = `
            width: 100%;
            height: 100%;
            overflow: auto;
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
        `
        const allCanvasParentNode = document.createElement('div');
        allCanvasParentNode.className = allCanvasParentNodeClassName;
        allCanvasParentNode.style = `
            width: 100%;
            height: 100%;
            overflow: auto;
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
        `
        // 将 canvas 列表的容器添加到给定的容器中
        if(!isMobile){
            leftNav.appendChild(leftAllCanvasParentNode);
        }
        centerArea.appendChild(allCanvasParentNode);
        // 根据 isAllPages 确定渲染多少页
        mainAreaAsyncRender(pdf, pageNumber, 1,callback,[]);
    }).catch((msg)=>{
        console.log('msg====',msg);
			Modal.error({
				title: '文件预览失败！请重新操作。',
				content: '',
				onOk(){
						window.close();
				}
		});

    })
}

/*
    在已经绘制过pdf的基础上 放大 canvas 和 pdf （重绘）
    直接修改样式属性 transform scale 会导致 pdf 失真，需要重绘
    传入 pdf地址、canvas类名、自定义缩放大小
*/
function resizePDF(pagesInfo, canvasClassName, customScale,outputScale){
    // 使用 PDF 加载指定的 .pdf 文档
    const canvasList = document.querySelectorAll(`.${canvasClassName}`);
    // 根据 isAllPages 确定渲染多少页（从 0 开始）
    resizeAsyncRender(pagesInfo, canvasList, 0, customScale,outputScale);
}

/*
    滚动到指定的pdf页面位置(num 为 pdf 第几页 从 1 开始)
*/
function scrollIntoPage(num, canvasClassName){
    document.querySelectorAll(`.${canvasClassName}`)[num - 1].scrollIntoView({
        behavior:'smooth',
    });
}

/*
    点击左侧的略缩栏的某页，将该页滚动到展示区
*/
function clickNavToSee(canvasNode, centerAreaCanvasClassName){
    let index = canvasNode.id.split('-')[2].trim();
    document.querySelectorAll(`.${centerAreaCanvasClassName}`)[index - 1].scrollIntoView({
        behavior:'smooth'
    });
}

// // 主要展示区 异步渲染解决方案，使之一上来就有页面
async function mainAreaAsyncRender(pdf, pageNumber, i,callback,pagesInfo){
    // 获取 pdf 指定页
    let page = await pdf.getPage(i);//将page存入state中用于放大缩小使用
    console.log('page===',page);
    pagesInfo.push(page)
    i++;
    if(i <= pageNumber){
        requestAnimationFrame(()=>
            mainAreaAsyncRender(pdf, pageNumber, i, callback,pagesInfo));
    }else{
        // 传入 pdf 总页数
        if(callback) callback(pdf._pdfInfo.numPages,pagesInfo);
        // 发布渲染完成的消息
        // pubsub.publish('renderFinish');
    }
};
function mainRender(i,pagesInfo,pdfScaleSize,canvasClassName,outputScale,allCanvasParentNode,handlePinch,callback){
    console.log('pdfScaleSize==',pdfScaleSize);
    // 设置 canvas 整体缩放的倍数
    let page = pagesInfo[i];
    let scale = pdfScaleSize||1;
    console.log('pdfScaleSize==',scale);
    let viewport = page.getViewport({ scale });
    console.log('viewport==',viewport);
    // 创建 canvas 共同的容器
    let canvas = document.createElement('canvas');
    canvas.className = canvasClassName || '';
    let context = canvas.getContext("2d");

    // 设置 canvas 和内容 大小
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = Math.floor(viewport.width)+'px';
    canvas.style.height = Math.floor(viewport.height)+'px'
    canvas.style.margin = '10px 0';
    let transform = (outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null);

    // 将指定页渲染到 canvas
    let renderContext = {
        canvasContext: context,
        transform,
        viewport,
    };
    page.render(renderContext);

    // 将当前 canvas（当前页） 添加到父容器中
    allCanvasParentNode.appendChild(canvas);
    i++;
    if(i < pagesInfo.length){
        requestAnimationFrame(()=>
        mainRender(i,pagesInfo,pdfScaleSize,canvasClassName,outputScale,allCanvasParentNode,handlePinch,callback));
        handlePinch(i-1);
    }else{
        handlePinch(i-1);
        callback(pdfScaleSize);
        // 发布渲染完成的消息
        pubsub.publish('renderFinish');
    }
}

// // 侧边略缩图列表 异步渲染解决方案
async function navAreaAsyncRender(i, pagesInfo, pdfScaleSize,centerAreaCanvasClassName,
    allCanvasParentNode, canvasClassName,outputScale){
    // 获取 pdf 指定页
    let page = pagesInfo[i];
    // 设置 canvas 整体缩放的倍数
    let scale = pdfScaleSize||0.35;
    let viewport = page.getViewport({ scale });

    // 创建 canvas 共同的容器
    let canvas = document.createElement('canvas');
    canvas.className = canvasClassName || 'canvas-left-nav-class-name';
    let context = canvas.getContext("2d");

    // 设置 canvas 内容 大小,添加悬浮事件
    canvas.id = `canvas-l-${i+1}`;
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = '80%';
    // canvas.style.height = Math.floor(viewport.height) + "px";
    canvas.style.border = '1px solid #888';
    canvas.style.margin = '20px 0 10px 0';
    canvas.addEventListener('mouseover',()=>{
        canvas.style.cursor = 'pointer';
        canvas.style.boxShadow = '2px 2px 1px 1px #888';
    });
    canvas.addEventListener('mouseleave',()=>{
        canvas.style.cursor = '';
        canvas.style.boxShadow = '';
    })
    canvas.addEventListener('click',(event)=>{
        clickNavToSee(canvas, centerAreaCanvasClassName);
    })

    let transform = (outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null);

    // 将指定页渲染到 canvas
    let renderContext = {
        canvasContext: context,
        transform,
        viewport,
    };
    page.render(renderContext);

    // 底部的页码标注
    let span = document.createElement('span');
    span.innerText = i+1;
    span.style = 'font-size: 0.85rem;color: #888;';

    // 将当前 canvas（当前页） 添加到父容器中
    allCanvasParentNode.appendChild(canvas);
    allCanvasParentNode.appendChild(span);

    i ++;
    if(i <pagesInfo.length){
        requestAnimationFrame(()=>
            navAreaAsyncRender(i, pagesInfo, pdfScaleSize,centerAreaCanvasClassName,
                allCanvasParentNode,canvasClassName,outputScale));
    }
}

// // 根据放大和缩小的比例重绘中间pdf展示区
async function resizeAsyncRender(pagesInfo, canvasList, i, customScale,outputScale){
    console.log('customScale==',customScale);
    let canvas = canvasList[i];
    // 获取 pdf 指定页
    let page = pagesInfo[i];
    // 设置 canvas 整体缩放的倍数
    let scale = customScale || 1;
    let viewport = page.getViewport({ scale });
    let context = canvas.getContext("2d");
    // 设置 canvas 和内容 大小
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = Math.floor(viewport.width) + "px";
    canvas.style.height = Math.floor(viewport.height) + "px";

    let transform = (outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null);

    // 将指定页渲染到 canvas
    let renderContext = {
        canvasContext: context,
        transform,
        viewport,
    };
    page.render(renderContext);
    i++;
    if(i < canvasList.length){
        requestAnimationFrame(()=>resizeAsyncRender(pagesInfo, canvasList, i, customScale, outputScale));
    }else{
        // 发布重新渲染完成的消息
        pubsub.publish("resizeFinish");
    }
}

export {
    displayLayoutPdf,
    resizePDF,
    scrollIntoPage,
    mainRender,
    navAreaAsyncRender
    // getPDFPageSum
}
