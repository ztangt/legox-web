import {useState} from 'react'
import GlobalModal from '../GlobalModal'
import {Checkbox,Button,message} from 'antd'
import {getAxiosData,downloadCreateA} from '../../util/util'
import styles from './index.less'

const DownLoadZipModal = ({onCancel,targetKey})=>{
    const [checkZipType,setCheckZipType] = useState([])

    const zipArr = [
        {
            label: '表单',
            value: 'form',
            key: 'form'
        },
        {
            label: '正文',
            value: 'text',
            key: 'text'
        },
        {
            label: '附件',
            value: 'attach',
            key: 'attach'
        }
    ]

    const onCheckChange = (value)=>{
        setCheckZipType([...value])
    }
    // 下载
    const onDownload = ()=>{
        if(checkZipType.length==0){
            message.error('请选择下载项')
            return 
        }
        const selectItem = zipArr.filter(item=>item.value==checkZipType[0])
        console.log("selectItem12",selectItem)
        // zip下载
        if(selectItem[0].key=="attach"){
           
        // zip下载
        }else if(checkZipType.length>1){


        // 普通方式下载
        }else{
            // onSingleDownload()
        }
    }

  async function onSingleDownload(src,filename){
        const res = await getAxiosData(src)
        console.log('res===', res)
        try {
            downloadCreateA(res,filename)
        } catch (e) {
            message.error('下载失败')
        }
    }


    return (
        <GlobalModal
            title="下载"
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
            footer={[
                <Button onClick={onCancel}>取消</Button>,
                <Button onClick={onDownload}>下载</Button>
            ]}
        >
            <div className={styles.zip}>
                <Checkbox.Group
                    onChange={onCheckChange}
                >
                    {
                        zipArr.map(item=><Checkbox key={item.value} value={item.value}>{item.label}</Checkbox>)
                    }
                </Checkbox.Group>    
            </div>

        </GlobalModal>
    )
}

export default DownLoadZipModal