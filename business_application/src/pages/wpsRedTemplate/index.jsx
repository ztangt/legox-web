// 套红模板预览
import {useEffect,useRef,useState} from 'react'
import {connect,history} from 'umi'
import {message,Button,Spin} from 'antd'
import WebOfficeSDK  from '../../util/web-office-sdk-solution-v2.0.2.es'
import {getUrlParams} from '../../util/util'
import styles from './index.less'

const RedTemplatePreview = ({dispatch,appRefs})=>{
    const templateRef = useRef(null)
    const [instance, setInstance] = useState(null)
    const [loading, setLoading] = useState(false)

    const fileIdRef = useRef('')
    const params = getUrlParams(history.location.search)
    console.log("paramsss",params)

    // 合并套红文件
   async function redTemplateCombined(values){
    if (!templateRef.current) {
        setLoading(false)
        return
    }
    
    // 获取当前设置书签内容
    // const bookmarks = await  appRefs.current.ActiveDocument.Bookmarks
    const bookmarksJson = await templateRef.current.ActiveDocument.Bookmarks.Json()
    if(!bookmarksJson?.length){
        setLoading(false)
        message.error('未查到书签，请设置书签')
        return
    }
        console.log("jsonBooss",bookmarksJson)
        // const bookArr = bookmarksJson
        // const inTextBookArr = []
        // 通过外部接口等获取内容动态修改
        // const values = {
        //     title: '合同替换1',
        //     fwzh:'文号： 1247866672'
        // }
        // for(let i = 0; i<bookArr.length;i++){
        //     // const value =  await bookmarks.GetBookmarkText(bookArr[i].name)
        //     const obj = {
        //         name: bookArr[i].name,
        //         type: 'text',
        //         value: values[bookArr[i].name]||''
        //     }
        //     inTextBookArr.push(obj)
        // }
        const bookmarksNameArr = bookmarksJson.map((item)=>{
            return {
                name: item.name,
                type: 'text',
                value: values[item.name]||''
            }
        }).filter(item=>item!=undefined)
         
        if(bookmarksJson.length>0){
            await replaceBookmark(
                bookmarksNameArr,
                bookmarksJson
            )
        }
    }
     // 调用书签的ReplaceBookmark API 替换书签内容
    async function replaceBookmark(
        values,
        bookmarksJson
        ) {
        const contentArr = bookmarksJson.filter(item=>item.name== 'content') 
        console.log("contentArr",contentArr)
        if(contentArr.length==0){
            message.error('未查到内容书签，请设置书签')
            setLoading(false)
            return false
        }
        const textHtml = window.localStorage.getItem('localHtml')
        // setTimeout(async()=>{
            const DocumentRange = await templateRef.current.ActiveDocument.GetDocumentRange()
            // 获取末尾
            const End = await DocumentRange.End
            console.log("enddddd",End)
            // 定位到文档活动范围改变范围内文档
            const range = await templateRef.current.ActiveDocument.Range(contentArr[0].begin,contentArr[0].end+2).SetRange(contentArr[0].begin+2,contentArr[0].end+2)
            
            // 将带格式的HTML数据粘贴进文档
            await range.PasteHtml({ HTML: textHtml })
        // },0)
        // 书签对象
        const bookmarks = await templateRef.current.ActiveDocument.Bookmarks
        const isReplaceSuccess = await bookmarks.ReplaceBookmark(values)
        console.log("valuesss",values,"book",isReplaceSuccess)
        setLoading(false)
    }


    const wpsRedInit = async(ref,onlyRead,fromBizInfoId,docType='word',data={})=>{
        if (instance) {
            instance.destroy()
        }
        const  APPID = JSON.parse(localStorage.getItem('configJson'))?. WPS?.AppID
        if(!APPID){
            message.error('尚未配置AppID')
            return
        }
        const inst = WebOfficeSDK.init({
        officeType: 'w',
        appId: APPID,
        fileId: fromBizInfoId,
        fileToken: 'Bearer '+window.localStorage.getItem('userToken'),
        customArgs:{
            docType: docType,
            autoCreate: true,
            isEdit: true, // 默认是编辑形态
            groupId: 0,   // 分组id 默认0
        },
        mount: ref?.current||ref
        })
        setInstance(inst)
        await inst.ready()
        const instApp = inst?.Application
        templateRef.current = instApp
        //   if(isShowButton){
        //       addButton('ViewTab',1,'左看右写',leftAndRight,instApp,onlyRead)  
  
        //       addButton('InsertTab',1,'套红',replaceFillUp,instApp,onlyRead)        
        //       addButton('StartTab',10,'操作',()=>{},instApp,configFile('action',fileConfig),onlyRead)
  
        //       // addButton('StartTab',10,'文档合并',()=>{},instApp,connectArr,onlyRead)
        //       addButton('StartTab',10,'保存',()=>{},instApp,saveData(inst),onlyRead)
        //   }
          // 设置文档只读
        if(onlyRead){
            await instApp.ActiveDocument.SetReadOnly({
                Value: true
            })
        }
        // instApp.ActiveDocument.ActiveWindow.View.Zoom.PageFit = 2
        redTemplateCombined(data)

    }

    function getWpsRedPreview(){
        setLoading(true)
        dispatch({
            type: 'wpsOffice/getWpsRedTemplateView',
            payload: {
                bizInfoId: params.bizInfoId,
                fileId: params.bizInfoId + 'w',
                redTemplateId: params.templateId,
                groupId: params.bizTaskId||0
            },
            callback:(value)=>{
debugger
                // setTimeout(()=>{
                    const preview = document.querySelector('#templatePreview')
                    wpsRedInit(preview,false,value.fileId,value.docType,value?.data)
                    // window.redFileId = value.fileId
                    localStorage.setItem('redFile',value.fileId)
                // },100)
            }
        })
    }
    useEffect(()=>{
        window.localStorage.setItem('isSave','cancel')
        getWpsRedPreview()
    },[])

    async function saveTemplate(){
        if(instance){
            const result = await instance.save()
            switch (result.result) {
                case 'ok':
                case 'nochange':
                    window.localStorage.setItem('isSave','save')
                    window.close()
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
    function cancelSave(){
        window.close()
    }

    return (
        <Spin spinning={loading}>
            <div className={styles.wps_header}><Button className={styles.cancel} onClick={cancelSave}>取消</Button><Button className={styles.save} onClick={saveTemplate}>保存</Button></div>
            <div className={styles.red_template} id="templatePreview"></div>
        </Spin>
    )
}

export default connect(({wpsOffice})=>({wpsOffice}))(RedTemplatePreview)