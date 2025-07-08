import { connect } from 'dva';
import { Modal, Input,Button,message,Form,Row,Col,TreeSelect,Tree} from 'antd';
import _ from "lodash";
import styles from '../index.less';
import { history } from 'umi';
import React from 'react'

const FormItem = Form.Item;
const { TextArea } = Input;
class addForm extends React.Component {




    componentDidMount(){
        const {dispatch,moduleResourceMg} = this.props
        // dispatch({
        //     type: 'moduleResourceMg/getCtlgTree',
        //     payload:{
        //         type:'ALL',
        //         hasPermission:'1'
        //     }
        // })
    }

    onFinish(values){
        // const { onAddSubmit,addObj} =this.props
        // if(addObj.id){
        //     onAddSubmit(values,'修改')
        // }else{
        //     onAddSubmit(values,'新增')
        // }
    }


    onValuesChange(changedValues, allValues){
        const {setValues} = this.props
        setValues(allValues)
    }

    render(){
        const { addObj,onCancel,loading,layoutG,moduleResourceMg} =this.props;
        const { searchObj } = layoutG;
        const { sysTreeData,moduleTreeData} = moduleResourceMg;
        const layout =  {labelCol: { span: 5 },wrapperCol: { span: 19 }};
        let fields = [
        // {
        //     name: ['ctlgId'],
        //     value: addObj.ctlgId,
        // }
        ]
        return (
            <Modal
                visible={true}
                footer={false}
                width={800}
                title='业务域配置'
                onCancel={onCancel}
                className={styles.add_form}
                mask={false}
                maskClosable={false}
                centered
                bodyStyle={{padding:'0 0 24px 0'}}
                getContainer={() =>{
                    return document.getElementById('moduleResourceMg_container')||false
                }}
            >
                <div style={{height:'400px',borderBottom:'1px solid #f0f0f0'}}>
                    <Row gutter={0} style={{height:'100%'}}>
                        <Col span={8} style={{height:'100%',borderRight:'1px solid #f0f0f0'}}>
                            <div style={{padding:'15px'}}>
                                <Tree
                                    key={loading}
                                    className={styles.tree_list}
                                    // onSelect={this.onSelect.bind(this)}
                                    treeData={sysTreeData}
                                    defaultExpandAll
                                    showLine={false}
                                    />
                            </div>
                        </Col>
                        <Col span={16} style={{height:'100%'}}>
                            <div style={{padding:'15px'}}>
                                <Tree
                                    checkable
                                    key={loading}
                                    className={styles.tree_list}
                                    // onSelect={this.onSelect.bind(this)}
                                    treeData={moduleTreeData}
                                    />
                            </div>
                        </Col>
                    </Row>
                </div>
                <Row className={styles.bt_group} style={{width: '150px',margin:'24px auto 0'}} >
                    <Button  type="primary" htmlType="submit" loading={loading}>
                        保存
                    </Button>
                    <Button onClick={onCancel} style={{marginLeft: 8}}>
                        取消
                    </Button>
                </Row>
        </Modal>
        )
    }
  }



export default (connect(({moduleResourceMg,layoutG})=>({
    moduleResourceMg,
    layoutG
  }))(addForm));
