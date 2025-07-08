// 另存为弹窗
import {useState,useEffect} from 'react'
import GlobalModal from "../GlobalModal"
import {Input,Button,message} from 'antd'
import {connect} from 'umi'
import {dataFormat} from '../../util/util'
import styles from './index.less'
import axios from 'axios'
const SaveAsFile = ({dispatch,onCancel,targetKey,typeName,instance,state,wpsOffice})=>{
    console.log("wpsOffice1",wpsOffice)
    const {downloadFileType,downloadFilename,downloadUrl} = wpsOffice
    const [fileChange,setFileChange] = useState('')
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        dispatch({
            type: 'wpsOffice/getWpsDownload',
            payload: {
                fileId:  (state?.bizInfo?.bizInfoId || state?.bizInfoId) + 'w',
                docType: typeName
            }
        })
    },[]) 
    
    // 文件另存为
    const saveOtherFile = async()=>{
        const filename = fileChange||downloadFilename
        const timer = new Date().getTime()/1000
        const nowDate = dataFormat(timer)    
        const combineFilename = filename+nowDate+'.'+downloadFileType  
        download(downloadUrl,combineFilename)
    }
    // 文件名修改
    function onFileNameChange(e){
        const filename =e.target.value
        setFileChange(filename)
    }   

    function download(src,filename) {
        if(!src){
            message.error('暂未生成下载地址,请保存后再进行该操作！')
            return
        }
        axios({ url: src, method: 'get', responseType: 'blob' }).then((res) => {
          console.log('res===', res)
          try {
            //res.blob().then((blob) => {
            const blobUrl = window.URL.createObjectURL(new Blob([res.data]))
            // 这里的文件名根据实际情况从响应头或者url里获取
            const a = document.createElement('a')
            a.href = blobUrl
            a.download = filename
            a.click()
            window.URL.revokeObjectURL(blobUrl)
            //})
            onCancel()
          } catch (e) {
            message.error('下载失败')
          }
        })
      }
      console.log("downloadFilename12",downloadFilename,downloadFileType)
    return (
       <GlobalModal
        title="文件另存为"
        visible={true}
        widthType={5}
        onCancel={onCancel}
        maskClosable={false}
        bodyStyle={{padding:'8px 16px'}}
        mask={false}
        centered
        getContainer={() => {
            return document.getElementById(`formShow_container_${targetKey}`)||false
        }}
        footer={null}
       >
        <div className={styles.save_as}>文件名： <Input key={downloadFilename} defaultValue={downloadFilename} className={styles.input_text}  onChange={onFileNameChange}/> {`.${downloadFileType}`}<Button className={styles.button_as} onClick={saveOtherFile} loading={loading}>另存</Button></div>

       </GlobalModal>     
    )
}


export default connect(({wpsOffice})=>({wpsOffice}))(SaveAsFile)