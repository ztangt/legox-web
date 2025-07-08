import React,{useEffect,useState,useRef} from 'react'
import {CloseOutlined} from '@ant-design/icons'
import WebOfficeSDK  from '../../util/web-office-sdk-solution-v2.0.2.es'
import {connect} from 'umi'
import {message} from 'antd'
import styles from './index.less'

const WpsPdf = ({dispatch,state})=>{
    const ref = React.createRef()
    const [instance,setInstance] = useState(null)
    async function initConfig(ref){
        const  APPID = JSON.parse(localStorage.getItem('configJson'))?. WPS?.AppID
        if(!APPID){
            message.error('尚未配置AppID')
            return
        }
        wpsInit({
            officeType:'f',
            appId: APPID,
            fileId: (state?.bizInfo?.bizInfoId || state?.bizInfoId)+'p',
            fileToken: 'Bearer '+window.localStorage.getItem('userToken'),
            customArgs:{
               docType: 'pdf',
               autoCreate: true,
               isEdit: true, // 默认是编辑形态
            //    groupId: 0,   // 分组id 默认0
               groupId: state.bizTaskId||0
            }
        },ref)
    }

    // 初始化
    async function wpsInit (config,ref){
        if (instance) {
            instance.destroy()
          }
          const inst = WebOfficeSDK.init({
            ...config,
            mount: ref?.current||ref
          })
          setInstance(inst)
          // 等待加载完毕
        await inst.ready()
        const instApp = inst?.Application
        // appRefs.current = inst.Application
     }

    useEffect(()=>{
        initConfig(ref)
        return ()=>{
            if (instance) {
                instance.destroy()
            }
        }
    },[])

    return (
        <div style={{width: '100%',height: '100%',position:'relative'}} id="wps_pdf" className={styles.wps_pdf}>
            <div  id="pdf_base"  ref={ref} style={{width: '100%',height: '100%'}}/>
        </div>
    )
}

export default connect(({wpsOffice})=>({wpsOffice}))(WpsPdf)