import {useEffect} from 'react'
import {connect} from 'umi'
import GlobalModal from '../GlobalModal'
import {Button} from 'antd'
import IUpload from '../../componments/Upload/uploadModal';
import styles from './index.less'


const OpenLocalDocument = ({dispatch,onCancel,targetKey,location,typeName,wpsOffice,state,freshOpen})=>{

    const {fileExists,fileStorageId} = wpsOffice
    useEffect(()=>{
         console.log("fileExists12",fileExists)   
        if(fileStorageId){
            dispatch({
                type: 'wpsOffice/postWpsBaseLocal',
                payload: {
                    fileId:  (state?.bizInfo?.bizInfoId || state?.bizInfoId) + 'w',
                    fileStorageId,
                    groupId: state.bizTaskId||0,
                    docType: typeName || 'word'
                },
                callback:()=>{
                    dispatch({
                        type: 'wpsOffice/updateStates',
                        payload: {
                            fileStorageId: ''
                        }
                    })
                    freshOpen()
                    onCancel()
                }
            })
        }
        
    },[fileStorageId])

    return (
        <GlobalModal
            title="打开本地文档"
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
            <div className={styles.local_title}>【注意：文件格式：仅支持doc,docx】</div>
            <IUpload
                typeName={typeName}
                nameSpace="wpsOffice"
                requireFileSize={1024}
                location={location}
                mustFileType="doc,docx"
                buttonContent={
                    <Button type="primary" style={{ marginTop: '20px' }}>
                        选择文件
                    </Button>
                }
            />
        </GlobalModal>
    )
}

export default connect(({wpsOffice})=>({wpsOffice}))(OpenLocalDocument)