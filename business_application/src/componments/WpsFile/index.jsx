import React,{useEffect,useState,useRef} from 'react'
import {CloseOutlined} from '@ant-design/icons'
import WebOfficeSDK  from '../../util/web-office-sdk-solution-v2.0.2.es'
import {connect} from 'umi'
import {message} from 'antd'
// import WpsFillReplaceDraw from '../WpsFillReplaceDraw'
import ReSizeLeftRight from '../public/reSizeLeftRight'
import {configFile} from './configFile'
import HistoryModal from './historyModal'
import SetRedModal from './setRedModal'
import OpenLocal from './openLocal'
import LeftAndRightModal from './leftAndRightModal'
import RedTemplatePreview from './redTemplateView'
import SaveAsFile from './saveAs'
import styles from './index.less'
import { v4 as uuidv4 } from 'uuid'
const WpsFiles = ({dispatch,fileType='word',state,isShowButton,targetKey,location,isNeedFit=false,setState})=>{
    console.log("statessss",state,isShowButton,fileType)   
    const ref = React.createRef()
    const [instance, setInstance] = useState(null)
    const appRefs = useRef(null)
    const curValRef = useRef('')// 获取当前文档copy值
    const rightRefs  = useRef(null) 
    const curHeightRefs = useRef(0)
    const curWidthRefs = useRef(0) // 当前窗口宽
    const [templateId,setTemplateId] = useState('') // 模板id
    const [isFillForm,setIsFillForm] = useState(false) // 选择套红模板
    const [showLeftAndRight,setShowLeftAndRight] = useState(false) // 左看右写样式
    const [isLeftAndRightModal,setIsLeftAndRightModal] = useState(false) // 左看右写弹窗
    const [showHistory,setShowHistory] = useState(false) // 历史正文
    const [showOpen,setShowOpen] = useState(false) // 打开本地文档
    const [showRedPreview,setShowRedPreview] = useState(false) // 套红预览
    const [showFileSaveAs,setShowFileSaveAs] = useState(false) // 文件另存为
    const [windowClose,setWindowClose] = useState(null)
    const [wpsId,setWpsId] = useState(uuidv4())
    const [messageApi, contextHolder] = message.useMessage();
    // 一级按钮添加 1按钮，10下拉框
    const addButton = async(type='StartTab',number=1,text,callback,instApp,listArr=[],onlyRead=false)=>{
        console.log("listArr1",listArr)
        const controls = await instApp.CommandBars(type).Controls
        const controlButton = await controls.Add(number)
        controlButton.Caption = text
        controlButton.TooltipText  = text
        if(number == 10){
            // 获取新增下拉框
            listArr&&listArr.forEach(item=>{
                onAddSelectTwoLevel(controlButton,item.name,item.callbackIt)
            })
        }
        const ReadOnly = await instApp.ActiveDocument.ReadOnly
        if(ReadOnly){
            controlButton.Enabled = false
        }else if(onlyRead){
            controlButton.Enabled = false
        }else{
            controlButton.Enabled = true
        }
        controlButton.OnAction = ()=> callback()
    }

    // 按钮配置
    function fileConfig(instance,value){
        switch(value){
            case 'history':
                return  save(instance,()=>{setShowHistory(true)})
            case 'textToAttach':
                return  save(instance,()=>{textToAttach()})
            case 'openLocalText':
                return  save(instance,()=>{setShowOpen(true)})
            case 'saveAs': // 文档另存为 
                return  save(instance,()=>{setShowFileSaveAs(true)})
           case 'transferPDF': // 文档另存为 
                return  save(instance,()=>{transferPDF()})
        }
    }
    // 正文转PDF
    function transferPDF(){
        dispatch({
            type: 'wpsOffice/transferPdf',
            payload: {
                fileId: (state?.bizInfo?.bizInfoId || state?.bizInfoId) + 'w',
                groupId: state.bizTaskId||0,
                bizInfoId: state?.bizInfo?.bizInfoId || state?.bizInfoId,
            },
            callback:()=>{
                debugger
                setState({
                    relType:'PDF',
                  })
            }
        })
    }

    // 正文转附件
    function textToAttach(){
        dispatch({
            type: 'wpsOffice/postTransferRelAtt',
            payload: {
                bizInfoId: state?.bizInfo?.bizInfoId || state?.bizInfoId,
            }
        })
    }

    // 按钮二级
    async function onAddSelectTwoLevel(controlButton,text,callback){
        const popupControls = controlButton.Controls
            const button =  popupControls.Add(1)
            button.Caption = text
            button.TooltipText  = text
            button.OnAction = ()=> callback()
     } 
     // 点击左看右写弹窗
     function leftAndRightModal(){
        setIsLeftAndRightModal(true)
     }

     // 左看右写点击弹窗确定显示内容
     async function leftAndRight(){
        setShowLeftAndRight(true)
        setTimeout(()=>{
            const left_refs = document.getElementById(wpsId).querySelector('#left_wps')
            initConfig(left_refs,true)
        },500)
        setTimeout(()=>{
            const right_refs = document.getElementById(wpsId).querySelector('#right_wps')
            initConfig(right_refs)
        },1000)
     }
     function onCloseLeftAndRight(){
        setShowLeftAndRight(false)
        setTimeout(()=>{
            const refs = document.getElementById(wpsId).querySelector('#wps_base')
        initConfig(refs)
        },2100)
     } 
     useEffect(()=>{
        let timer = null
        if(windowClose){
            timer = setInterval(()=>{
                const isSave = localStorage.getItem('isSave')
                if(windowClose?.closed){
                    const getFile = localStorage.getItem('redFile')
                    if(isSave =='save'){
                        listenerData({
                            data: getFile
                        })
                    }    
                    clearInterval(timer)
                    timer = null
                }
            },1000)   
        }
        return () => {
            clearInterval(timer);
          };
     },[windowClose?.closed])
     // 监听postMessage数据
     function listenerData(data){
        setShowLeftAndRight(false)
        if(data.data){
            confirmTemplatePreview(data.data)
        }
     }


    // 初始化
    async function wpsInit (config,ref,onlyRead){
        if (instance) {
            instance.destroy()
          }
          console.log("resssff",ref,instance,config)
          const inst = WebOfficeSDK.init({
            ...config,
            mount:ref?.current||ref
          })
          setInstance(inst)
          // 等待加载完毕
        await inst.ready()
        const instApp = inst?.Application
        appRefs.current = inst?.Application
        // if(isShowButton){
            if(!state?.bizInfo?.operation||state?.bizInfo?.operation=='edit'){
                addButton('InsertTab',1,'左看右写',leftAndRightModal,instApp,[],onlyRead)  
            }

            state?.bizInfo?.operation&&state?.bizInfo?.operation=='deal'&&addButton('InsertTab',1,'套红',replaceFillUp.bind(this,inst),instApp,[],onlyRead)        
            addButton('StartTab',10,'操作',()=>{},instApp,configFile(fileType=='red'?'redAction':'action',fileConfig.bind(this,inst)),onlyRead)

            // addButton('StartTab',10,'文档合并',()=>{},instApp,connectArr,onlyRead)
            // addButton('StartTab',10,'保存',()=>{},instApp,saveData(inst),onlyRead)
        // }
        // 缩小按比例适配窗口
        if(isNeedFit){
            instApp.ActiveDocument.ActiveWindow.View.Zoom.PageFit = 2
        } 
        if(fileType=='red'){
            inst.ApiEvent.AddApiEventListener('DocumentSaveStatus', async data => {
                //status: 0, 文档无更新
                //status: 1, 版本保存成功, 触发场景：手动保存、定时保存、关闭网页
                //status: 2, 暂不支持保存空文件, 触发场景：内核保存完后文件为空
                //status: 3, 空间已满
                //status: 4, 保存中请勿频繁操作，触发场景：服务端处理保存队列已满，正在排队
                //status: 5, 保存失败
                //status: 6, 文件更新保存中，触发场景：修改文档内容触发的保存
                //status: 7, 保存成功，触发场景：文档内容修改保存成功
                if(data.status!=2&&data.status!=3&&data.status!=4&&data.status!=5&&data.status!=6){
                    const bookmarks = await instApp.ActiveDocument.Bookmarks.Json()
                    let names = bookmarks.map((item)=>{
                        return item.name//书签name
                    })
                    dispatch({
                        type: 'wpsOffice/updateBookMark',
                        payload: {
                            id: state?.bizInfoId,
                            bookmark: names.toString(),
                        },
                        callback:()=>{
                        }
                    }) 
                }
            })
        }
     }
     async function save(instance,callback){
        if(instance){
            const result = await instance.save();
            switch (result.result) {
                case 'ok':
                case 'nochange':
                    // message.success('文件保存成功')
                    callback()
                    break;
                case 'SavedEmptyFile':
                    message.error('暂不支持保存空文件')
                    break;
                case 'SpaceFull':
                    message.error('空间已满')
                    break;
                case 'SpaceFull':
                    message.error('保存中请勿频繁操作')
                    break;
                case 'SpaceFull':
                    message.error('保存失败')
                    break;
                default:
                    break;
            }
        }
     }

     // 填充套红内容显示弹窗
     async function replaceFillUp(inst){   
        save(inst,()=>{setIsFillForm(true)})        
     }
      
    // 调用书签的ReplaceBookmark API 替换书签内容
//   async function replaceBookmark(
//     values,
//     bookmarksJson
//     ) {
//       // 书签对象
//     const bookmarks = await appRefs.current.ActiveDocument.Bookmarks
//     const contentArr = bookmarksJson.filter(item=>item.name== 'content') 
//     console.log("contentArr",contentArr)
//     const isReplaceSuccess = await bookmarks.ReplaceBookmark(values)
//     console.log("valuesss",values,"book",isReplaceSuccess)
//     const textHtml = window.localStorage.getItem('localHtml')
//     // setTimeout(async()=>{
//         const DocumentRange = await appRefs.current.ActiveDocument.GetDocumentRange()
//         // 获取末尾
//         const End = await DocumentRange.End
//         console.log("enddddd",End)

//         // 定位到文档活动范围改变范围内文档
//         const range = await appRefs.current.ActiveDocument.Range(contentArr[0].begin,contentArr[0].end).SetRange(contentArr[0].begin,contentArr[0].begin)
        
//         // 将带格式的HTML数据粘贴进文档
//         await range.PasteHtml({ HTML: textHtml })
//     // },0)
    
//   }

    // // 提交表单 - 填充数据
    // async function callbackFillSubmit() {
    //     if (!appRefs.current) {
    //         return
    //     }
    //     const values = {
    //             title: '合同替换1',
    //             fwzh:'文号： 1247866672'
    //     }
    //     const bookmarksJson = await appRefs.current.ActiveDocument.Bookmarks.Json()
    //     console.log("jsonBooss",bookmarksJson)
    //     // const Range = await appRefs.current.ActiveDocument.Content

    //     //  // 获取 range 内文本内容信息
    //     // const text = await Range.Text
    //     // const jsBook = jsonBook.map(item=>{
    //     //     const obj={
    //     //         name: item.name,
    //     //         value: text
    //     //     }
    //     //     return obj
    //     // })
    //     // console.log("jsBook2233",jsBook)

    //     // const DocumentRange = await appRefs.current.ActiveDocument.GetDocumentRange()
    //     // const textClipboard = await navigator.clipboard.readText()
    //     // console.log("textClipboardq",textClipboard)
    //     // // 获取末尾
    //     // // const End = await DocumentRange.End

    //     // // 定位到末尾
    //     // const range = await appRefs.current.ActiveDocument.Range.SetRange(0,0)
        
    //     // // 将带格式的HTML数据粘贴进文档
    //     // await range.PasteHtml({ HTML: textClipboard })

    //     // console.log("jsonBook222",jsonBook)
    //     // const isSuccess = await appRefs.current.ActiveDocument.ReplaceText(jsBook)

    //     // const getNames = await appRefs.current.DocumentFields.GetAllNames()
    //     // console.log("getNamess",getNames)
    //     // 自动获取书签位置不靠手动设置书签获取位置

    //     const bookmarksNameArr = bookmarksJson.map((item)=>{
    //         return {
    //             name: item.name,
    //             type: 'text',
    //             value: values[item.name]||''
    //         }
    //     }).filter(item=>item!=undefined)
    //     if(bookmarksJson.length>0){
    //         await replaceBookmark(
    //             bookmarksNameArr,
    //             bookmarksJson
    //         )
    //     }
    // }

  // 复制当前文档
    async function copy () {
        // 获取全文区域
        const DocumentRange = await appRefs.current.ActiveDocument.GetDocumentRange()
        // 获取指定区域的带格式 HTML 数据
        const htmlInfo = await DocumentRange.GetHtmlData()
        // 存储HTML数据
        curValRef.current = htmlInfo.HTML
        console.log("curValRef.current1",curValRef.current)
        window.localStorage.setItem("localHtml",htmlInfo.HTML)
    }

    // // 将复制的内容粘贴到当前文档
    // async function paste () {
    //     // 获取全文区域
    //     const DocumentRange = await appRefs.current.ActiveDocument.GetDocumentRange()
    //     const textClipboard = await navigator.clipboard.readText()
    //     // 获取末尾
    //     const End = await DocumentRange.End

    //     // 定位到末尾
    //     const range = await appRefs.current.ActiveDocument.Range.SetRange(End - 9, End - 9)
        
    //     // 将带格式的HTML数据粘贴进文档
    //     await range.PasteHtml({ HTML: textClipboard })
    // }
   
    useEffect(()=>{
        const isRead = state.onlyRead
        // const refs = document.getElementById(wpsId).querySelector('wps_base')
        const  APPID = JSON.parse(localStorage.getItem('configJson'))?. WPS?.AppID
        if(!APPID){
            message.error('尚未配置AppID')
            return
        }
        initConfig(ref,isRead)
        curWidthRefs.current = document.getElementById(wpsId).clientWidth
        curHeightRefs.current = document.getElementById(wpsId).clientHeight
        return ()=>{
            if (instance) {
                instance.destroy()
            }
        }
    },[])
    async function initConfig(ref,onlyRead=false,fromBizInfoId,docType=''){
        console.log("fromBizInfoId",fromBizInfoId)
        const w =  WebOfficeSDK.OfficeType.Writer
        const pdf = WebOfficeSDK.OfficeType.Pdf
        const objType = {
            'word': 'w',
            'pdf': 'f',
            'red': 'w',
        }
        const  APPID = JSON.parse(localStorage.getItem('configJson'))?. WPS?.AppID
        if(!APPID){
            message.error('尚未配置AppID')
            return
        }
        debugger
        wpsInit({
            officeType: objType[fileType]||'w',
            appId: APPID,
            fileId: fromBizInfoId || (state?.bizInfo?.bizInfoId || state?.bizInfoId)+'w',
            fileToken: 'Bearer '+window.localStorage.getItem('userToken'),
            customArgs:{
               docType: docType||fileType,
               autoCreate: true,
               isEdit: onlyRead?false:true, // 默认是编辑形态
            //    groupId: 0,   // 分组id 默认0
               groupId: state.bizTaskId||0,

            },
            // wordOptions: {
            //     isBestScale: true
            // }
        },ref,onlyRead)
    }
    // 打开本地文件重新刷新本地文档
    function freshOpen(){
        setTimeout(()=>{
            const refs = document.getElementById(wpsId).querySelector('#wps_base')
            initConfig(refs,false,(state?.bizInfo?.bizInfoId || state?.bizInfoId)+'w')
        },2100)
    }

    // 关闭历史引用弹窗
    function cancelModal(){
        setShowHistory(false)
        setShowOpen(false)
        setIsFillForm(false)
        setShowFileSaveAs(false)
    }
    // 关闭leftAndRight弹窗
    function cancelLeftAndRight(){
        setIsLeftAndRightModal(false)
    }

    // 套红预览查看
    function cancelPreview(){
        setShowRedPreview(false)
    }
    // 确认选择套红模板
    function confirmRedTemplate(template){
        cancelModal()
        // setShowRedPreview(true)
        setTemplateId(template)
        // 点击确认选择模板id 选择套红文件
        copy()
        const url = `${window.location.href}/wpsRedTemplate?templateId=${template}&bizTaskId=${state.bizTaskId}&bizInfoId=${state.bizInfoId}`
        const closeObj = window.open(url,'_blank',`width=${curWidthRefs.current},height=${curHeightRefs.current}`)
        setWindowClose(closeObj)
    }
    //确认套红模板预览
    function confirmTemplatePreview(fileId){
        dispatch({
            type: 'wpsOffice/saveWpsRdTemplate',
            payload: {  
                fileId
            },
            callback:()=>{
                cancelPreview()
                 
                const refs = document.getElementById(wpsId).querySelector('#wps_base')
                initConfig(refs,false,fileId)
            }
        })
    }

    function onConfirmHistory(params){
        if(params.length ==0 ){
            message.error('未选择历史正文项')
            return 
        }
        dispatch({
            type: 'wpsOffice/useHistoryReference',
            payload: {
                sourceBizInfoId: params[0].bizInfoId,
                targetBizInfoId: state.bizInfoId,
                bizTaskId: params.bizTaskId||0,
                docType: 'word'
            },
            callback:()=>{
                cancelModal()
                setTimeout(()=>{
                    const refs = document.getElementById(wpsId).querySelector('#wps_base')
                    initConfig(refs,false,params[0].bizInfoId+'w')
                },2000)
            }
        })
    }

    const historyModal = {
        onCancel: cancelModal,
        onConfirmHistory,
        targetKey
    }

    return (
        <div style={{width: '100%',height: '100%',position:'relative'}} id={wpsId}>
            {contextHolder}
            {
                showLeftAndRight&&<CloseOutlined onClick={onCloseLeftAndRight} className={styles.close_wps}/>
            }

            {
                showLeftAndRight&&<ReSizeLeftRight
                    vNum={curWidthRefs.current/2}
                    canResize={false}
                    leftChildren={
                        <div className={styles.left_resize}>
                            <div className='wps_container'  id="left_wps" style={{width: curWidthRefs.current/2,height: '100%'}}/>
                        </div>
                    }
                    rightChildren={
                        <div className={styles.right_resize}>
                            <div className='wps_container'  id="right_wps" style={{width: curWidthRefs.current/2,height: '100%'}}/>
                        </div>
                    }
                />
            }
            {
                !showLeftAndRight&&<div className={styles.wps_container} id="wps_base"  ref={ref} style={{width: '100%',height: '100%'}}/>
            }
            <div>{showHistory&&<HistoryModal {...historyModal}/>}</div>
            <div>{showOpen&&<OpenLocal state={state} onCancel={cancelModal} freshOpen={freshOpen} typeName={fileType} targetKey={targetKey} location={location}/>}</div>
            <div>{isFillForm&&<SetRedModal targetKey={targetKey} onCancel={cancelModal} onConfirm={confirmRedTemplate} state={state}/>}</div>
            <div>{isLeftAndRightModal&&<LeftAndRightModal state={state} onConfirm={leftAndRight} targetKey={targetKey} onCancel={cancelLeftAndRight} typeName={fileType}  location={location} />}</div>
            {/* <div>{showRedPreview&&<RedTemplatePreview state={state} appRefs={appRefs}  templateId={templateId} onCancel={cancelPreview} targetKey={targetKey} onConfirm={confirmTemplatePreview}/>}</div> */}
            <div>{showFileSaveAs&&<SaveAsFile onCancel={cancelModal} state={state} instance={instance} typeName={fileType} targetKey={targetKey}/>}</div>
        </div>
    )

}


export default connect(({wpsOffice})=>({wpsOffice})) (WpsFiles)