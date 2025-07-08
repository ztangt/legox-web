// 套红弹窗
import GlobalModal from '../GlobalModal'
import {Select,Button} from 'antd'
import styles from './index.less'
import {connect} from 'umi'
import { useEffect,useState } from 'react'
const SetRedModal=({dispatch,onCancel,onConfirm,targetKey,wpsOffice,state})=>{
    const [value,setValue] = useState('')
    const { redTemplates } =  wpsOffice
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
    useEffect(()=>{
        dispatch({
            type: 'wpsOffice/getRedTemplateListByOrgId',
            payload:{
                bizSolId: state?.bizSolId || state?.bizInfo?.bizSoild,
                orgId: userInfo?.orgId,
            },
            callback:(list)=>{
                setValue(list[0].id)
            }
        })
    },[])
    function onChange(value){
        setValue(value)
    }
    return (
        <GlobalModal
            title="选择套红文件"
            visible={true}
            widthType={5}
            onCancel={onCancel}
            onOk={onConfirm.bind(this,value)}
            maskClosable={false}
            bodyStyle={{padding:'8px 16px'}}
            mask={false}
            centered
            getContainer={() => {
                return document.getElementById(`formShow_container_${targetKey}`)||false
            }}
        >
            <div className={styles.modal_red}>
                <span className={styles.modal_label}>套红模板:</span>
                <Select
                    value={value}
                    onChange={onChange}
                    options = {redTemplates}
                    style={{width: 200}}
                />
            </div>

        </GlobalModal>
    )
}
export default connect(({wpsOffice})=>({wpsOffice})) (SetRedModal)
