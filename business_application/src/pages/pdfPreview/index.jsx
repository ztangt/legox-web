// import React,{useRef,useEffect} from 'react'
// import './index.less'
// import {Button,Input,InputNumber} from 'antd';
// import * as dd from 'dingtalk-jsapi';
// import {useSetState} from 'ahooks';
// import {displayLayoutPdf,resizePDF,scrollIntoPage,navAreaAsyncRender,mainRender} from './componments/displayPDF';
// import {getUrlParameters} from '../../util/util';
// const URL = process.env.NODE_ENV == 'production' ? `${window.location.origin}/child/business_application/` : 'http://10.8.9.67:8002/'
// const CMAP_URL = `${URL}pdfjs-dist/cmaps/`;
// const CMAP_PACKED = true;



// const ENABLE_XFA = true;
// const SEARCH_FOR = ""; // try "Mozilla";

// const SANDBOX_BUNDLE_SRC = `${URL}pdfjs-dist/legacy/build/pdf.sandbox.js`;
// function ShowPDF(){
// 	const leftNav = useRef();
// 	const controlArea = useRef();
// 	/*
// 		当前显示设备的物理像素分辨率与CSS像素分辨率之比,它告诉浏览器应使用多少屏幕实际像素来绘制单个CSS像素
// 		<canvas>可能在视网膜屏幕上显得太模糊。 使用window.devicePixelRatio确定应添加多少额外的像素密度以使图像更清晰。
// 	*/
// 	const outputScale = window.devicePixelRatio || 1;
// 	const [state,setState]=useSetState({
// 		pagesInfo:[],//存pdf
// 		// 注意 pdf 要放在 public 文件夹下
// 		leftNavCanvasClassName:'left-canvas',   // 左侧略缩图列表各canvas的类名（共同
// 		centerCanvasClassName:'can',            // 主要展示区各canvas的类名（共同
// 		controlDisable:false,                   // 是否允许操作
// 		pdfScaleSize:1,// pdf 展示的缩放比例
// 		totalPage:0,                            // pdf 的页数
// 		targetPage:1,                           // 用户输入，要跳转到多少页
// 		maxPageWidth:0,                          //pdf页面的最大宽度，用于根据浏览器设置适合的默认缩放比例
// 		proportion:0.2                            //缩放比例
// 	});
// 	let {leftNavCanvasClassName, pdfScaleSize, centerCanvasClassName,pagesInfo,proportion} = state;
// 	useEffect(async()=>{
// 			const query = getUrlParameters(window.location.href);
// 			const src = query.src.includes('.dwg')?query.src.split('.dwg')[0]+'.pdf':query.src;
// 			if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer) {
// 				alert("Please build the pdfjs-dist library using\n  `gulp dist-install`");
// 			}
// 			pdfjsLib.GlobalWorkerOptions.workerSrc =`${URL}pdfjs-dist/legacy/build/pdf.worker.min.js`;
// 		const loadingTask = pdfjsLib.getDocument({
// 		  url: src,
// 		  cMapUrl: CMAP_URL,
// 		  cMapPacked: CMAP_PACKED,
// 		  enableXfa: ENABLE_XFA,
// 		});
// 				//布局
// 				await displayLayoutPdf(loadingTask,
// 					document.querySelector('.left-nav'),
// 					document.querySelector('.center-area'),
// 					leftNavCanvasClassName,
// 					centerCanvasClassName,
// 					pdfScaleSize,
// 					(totalPage,pagesInfo)=>{
// 						setState({
// 							totalPage,
// 							pagesInfo
// 						})
// 					}
// 				)
// 		},[])
// 		useEffect(()=>{
// 			if(pagesInfo.length){
// 				//将页面的最大宽度找到，定义合适的比例缩放
// 				let maxWidth = 0;
// 				let newScale = pdfScaleSize;
// 				pagesInfo.map((page)=>{
// 					let viewport = page.getViewport({scale:newScale});
// 					if(viewport.width>maxWidth){
// 						maxWidth = viewport.width;
// 					}
// 				})
// 				let clientWidth = document.getElementById('center-area').clientWidth*0.8;
// 				if(maxWidth>clientWidth){
// 					pdfScaleSize = (clientWidth/maxWidth).toFixed(2);
// 				}
// 				let leftAllCanvasParentNode = document.querySelector('.left-nav').getElementsByTagName('div')[0];
// 				//缩略图
// 				navAreaAsyncRender(0,pagesInfo,pdfScaleSize*0.2,centerCanvasClassName,
// 					leftAllCanvasParentNode,leftNavCanvasClassName,outputScale);
// 				let allCanvasParentNode=document.querySelector('.center-area').getElementsByTagName('div')[0];
// 				// //展示区域
// 				mainRender(0,pagesInfo,pdfScaleSize,centerCanvasClassName,outputScale,allCanvasParentNode,(pdfScaleSize)=>{
// 					setState({
// 						pdfScaleSize,
// 						proportion:(pdfScaleSize/5).toFixed(2)
// 					})
// 				})
// 			}
// 		},[pagesInfo])
// 	return(
// 		<div className='container'>
// 						{/* <div id="viewerWrapper" className="bg-secondary viewerWrapperNormal">
// 							<div id="viewerContainer" tabindex="0">
// 								<div id="viewer" className="pdfViewer"></div>
// 							</div>
// 						</div> */}
// 						<div className='display-area'>
// 				{/* 左侧的略缩图 */}
// 				<div ref={leftNav} className='left-nav'></div>
// 				{/* 中间的展示区 */}
// 				<div className='center-area' id="center-area"></div>
// 			</div>
// 		</div>
// 	)
// }
// export default ShowPDF;


import {getUrlParameters,isMobileFn} from '../../util/util';
import React,{useState,useEffect} from 'react'
import { Spin } from 'antd';
export default function viewPDF(){
    //pdf.js库的代码，放在项目的public目录下
	// const BASEURL = process.env.NODE_ENV == 'production' ? `${window.location.origin}/child/business_application/` : 'http://localhost:8000/'
	const BASEURL = window.location.origin
	const viewerUrl = `${BASEURL}/pdfjs-5.2.133-dist/web/viewer.html`;
	const query = getUrlParameters(window.location.href);
	let src = query.src.includes('.dwg')
    ? query.src.split('.dwg')[0] + '.pdf'
    : query.src;
    const [pdfUrl, setPdfUrl] = useState('');
    useEffect(() => {
        fetch(src)
        .then (res => res.blob ())
        .then(blob =>{
            // 强制更换为PDF类型 
            const newTypeBlob = new Blob([blob], { type: 'application/pdf' });
            const url = URL.createObjectURL(newTypeBlob);
            setPdfUrl(url);
        });
    },[]);
    const pdfName = query.src.split('/').pop();
	const url = `${viewerUrl}?file=${encodeURIComponent(pdfUrl)}&pdfname=${pdfName}`;
    return <Spin spinning={!pdfUrl}>
        <iframe id='pdfIframe' src={url} width="100%" height="100%"></iframe>
      </Spin>;

}