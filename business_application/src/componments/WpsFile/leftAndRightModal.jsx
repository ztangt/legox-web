import { Radio,Button } from 'antd';
import {useState,useEffect} from 'react'
import {connect} from 'umi'
import {DeleteOutlined} from '@ant-design/icons'
import GlobalModal from "../GlobalModal"
import IUpload from '../../componments/Upload/uploadModal';
import styles from './index.less'
const LeftAndRightModal = ({dispatch,onCancel,onConfirm,targetKey,location,typeName,wpsOffice,state})=>{
    console.log("wpsOffice11222s",wpsOffice)
    const {fileName,typeNames} = wpsOffice
    const [radioValue,setRadioValue] = useState('local')

    function initState(){
        dispatch({
            type: 'wpsOffice/updateStates',
            payload: {
                htmlFileStorageId:"",
                noticeHtmlValue: '',
                uploadFlag: true,
                nowMessage: '',
                md5: '',
                fileChunkedList: [],//文件分片完成之后的数组
                fileName: '',
                fileNames: '',
                fileStorageId: '',
                typeNames: '',
                optionFile: {},
                fileSize: '',
                getFileMD5Message: {},
                success: '',
                v: 1,
                needfilepath: '',
                isStop: true,
                isContinue: false,
                isCancel: false,
                index: 0,
                merageFilepath: '',
                typeName: '',
                fileExists: '',
                md5FilePath: '',
                md5FileId: '',
                fileData:[],
                file: {},
                downloadFileType: '',
                downloadFilename: '',
                downloadFile: '',
                downloadUrl: '', 
            }
        })
    }

    useEffect(()=>{
        initState()
    },[])

    function onDeleteFileName(){
        initState()
    }

    const onRadioChange = (e)=>{
        setRadioValue(e.target.value)
    }
    return (
        <GlobalModal
            title="参考文信息"
            visible={true}
            widthType={5}
            onCancel={onCancel}
            onOk={onConfirm}
            maskClosable={false}
            bodyStyle={{padding:'8px 16px'}}
            mask={false}
            centered
            getContainer={() => {
                return document.getElementById(`formShow_container_${targetKey}`)||false
            }}
        >
            <div className={styles.left_and_right_header}>
                <div className={styles.type}>类型:</div>
                <div>
                    <Radio.Group
                        onChange={onRadioChange}
                        value={radioValue} 
                    >
                        <Radio value={'local'}>本地文件</Radio>
                        <Radio value={'sys'}>系统正文文件</Radio>
                        {/* <Radio value={'library'}>知识库文件</Radio> */}
                    </Radio.Group></div>
            </div>
            {radioValue=='local'&&<div className={styles.left_and_cont}>
                <div className={styles.watch_file}>
                    参考文件:
                </div>
                <div>
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
                </div>
            </div>
            }
            {
            fileName&&(typeNames=='docx'||typeNames=='doc')&&<div className={styles.left_and_right_footer}>
                    {fileName} 
                    <DeleteOutlined onClick={onDeleteFileName}/>
                </div>}
        </GlobalModal>
    )
}

export default connect(({wpsOffice})=>({wpsOffice}))(LeftAndRightModal)