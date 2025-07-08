import { connect } from 'dva';
import { Modal,Button} from 'antd';
import _ from "lodash";
import styles from '../index.less'
import React from 'react'
class EditTree extends React.Component {

    state = {
    }


    render(){
        const { onCancel,onEdit,onDelete } =this.props
        return (
            <Modal
                visible={true}
                footer={false}
                title={'请选择您要进行的操作'}
                onCancel={onCancel}
                maskClosable={false}
                mask={false}
                width={240}
                centered
                getContainer={() =>{
                    return document.getElementById('uintInfo_container')||false
                }}
            >
                <div className={styles.bt_group}>
                    <Button onClick={onEdit} type="primary" style={{marginRight: 64}}>编辑</Button>
                    <Button onClick={onDelete} type="primary">删除</Button>
                </div>
            </Modal>
        )
    }
  }



export default (connect(({})=>({

  }))(EditTree));
