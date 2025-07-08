import { connect } from 'dva';
import { Modal, Input,Button,message,Form,Row,Col,Switch,Select,TreeSelect} from 'antd';
import _ from "lodash";
import pinyinUtil from '../../../service/pinyinUtil';
import styles from '../index.less';
import { history } from 'umi';
import React from 'react'
import GlobalModal from '../../../componments/GlobalModal';
const FormItem = Form.Item;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;

class addForm extends React.Component {
    formRef = React.createRef();
    componentDidMount(){
        const {dispatch,nodeType,businessUseSort,addObj} = this.props
        // dispatch({
        //     type: 'tree/updateStates',
        //     payload:{
        //         treeData:[
        //         ],
        //         expandId: '',
        //         expandedKeys: [],
        //         currentNodeId:''
        //     }
        // })
        dispatch({
            type: 'businessUseSort/getCtlgTree',
            payload:{
                type:'ALL',
                hasPermission:'1'
            }
        })
        this.formRef.current.setFieldsValue({
            name: addObj.modelName&&decodeURI(addObj.modelName),
            key: addObj.modelKey
        })
    }

    onFinish(values){
        values['name'] = values['name'].trim();
        values['key'] = values['key'].trim();
        const { onAddSubmit,addObj,isWatch,onCancel} =this.props
        // 优化只是查看弹窗
        if(isWatch){
            onCancel()
            return
        }
        if(addObj.id){
            onAddSubmit(values,'修改')
        }else{
            onAddSubmit(values,'新增')
        }
    }
    onSelect(selectedKeys,info){
        const { dispatch, getData,workflowEngine } = this.props;
        const { searchObj } = workflowEngine;
        let newArr = [];
        newArr.push(selectedKeys)
        if(info.nodeId){

            dispatch({
              type: 'workflowEngine/updateStates',
              payload:{
                currentNode: info,
                expandedKeys: newArr,
                autoExpandParent: true,
              }
            })

        }
      }

    onValuesChange(changedValues, allValues){
        const {setValues} = this.props
        setValues(allValues)
    }
     checkCode=(_,value)=>{
        let reg = /^[a-zA-Z][a-zA-Z0-9]*$/;
        if(value&&value.length>50){
          return Promise.reject(new Error('长度不能超过50!'))
        }else if(value&&!reg.test(value)){
          return Promise.reject(new Error('只能输入字母+数字，且首位必须是字母!'))
        }else{
          return Promise.resolve();
        }
      }
      //输入完名称后获取简拼
       nameCallback(e) {
        const {addObj} = this.props
        if(!addObj.id){
          let name = `${pinyinUtil.getFirstLetter(e.target.value)}`
          this.formRef.current.setFieldsValue({
            key: name
          })
        }
      }
      save(){
        this.formRef.current.submit()
      }

    render(){
        const { addObj,onCancel,loading,parentStrCtlgId,businessUseSort,workflowEngine,isWatch} =this.props;
        const {businessDatas} = businessUseSort;
        const layout =  {labelCol: { span: 3 },wrapperCol: { span: 19 }};
        let fields = [
        // {
        //     name: ['ctlgId'],
        //     value: addObj.ctlgId,
        // }
        ]
        return (
            <GlobalModal
                visible={true}
                footer={isWatch?false:[
                    <Button onClick={onCancel}>
                        取消
                    </Button>,
                    <Button  type="primary" style={{marginLeft: 8}} onClick={this.save.bind(this)} loading={loading}>
                        保存
                    </Button>
                ]}
                widthType={1}
                title={isWatch?'查看':addObj.id?'流程修改':'流程新增'}
                onCancel={onCancel}
                incomingHeight={300}
                className={styles.add_form}
                mask={false}
                maskClosable={false}
                getContainer={() =>{
                    return document.getElementById('workflowEngine_container')||false
                }}
            >
            <Form
                ref={this.formRef}
                fields={fields}
                initialValues={addObj}
                onFinish={this.onFinish.bind(this)}
                onValuesChange={this.onValuesChange.bind(this)}
            >

                <Form.Item
                    label="&nbsp;&nbsp;名称"
                    name="name"
                    {...layout}
                    rules={[
                        { required: true,message:'请输入名称' },
                        // { pattern: /^[^\s]*$/,message: '禁止输入空格'},
                        { max: 50,message:'最多输入50个字符'},
                        {
                            validator: (rule, value) =>{
                                if(value&&(!/^[\a-\z\A-\Z0-9\u4e00-\u9fe5]+$/.test(value))){
                                    return Promise.reject(new Error(`只能输入汉字、英文、数字`))
                                  }else{
                                    return Promise.resolve()
                                  }
                            }
                        }
                    ]}
                    // getValueFromEvent = {e => e.target.value.replace(/(^\s*)|(\s*$)/g, "")}
                >
                    <Input disabled={isWatch} onChange={this.nameCallback.bind(this)}/>
                </Form.Item>
                <Form.Item
                    label="&nbsp;&nbsp;编码"
                    name="key"
                    {...layout}
                    rules={[
                        { required: true,message:'请输入编码' },
                        // { pattern: /^[^\s]*$/,message: '禁止输入空格'},
                        { max: 50,message:'最多输入50个字符'},
                        {validator:this.checkCode}
                    ]}
                >
                    <Input disabled={isWatch?true:addObj.id?true:false}/>
                </Form.Item>

                <Form.Item
                    label="&nbsp;&nbsp;分类"
                    name="ctlgId"
                    rules={[{
                        required: true,
                        message:'请选择分类'
                    }]}
                    {...layout}
                >
                    <TreeSelect
                        disabled={isWatch?true:addObj.id?true:false}
                        showSearch
                        treeData={businessDatas}
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择"
                        allowClear
                        // treeDefaultExpandAll
                        onSelect={this.onSelect.bind(this)}
                     />

                </Form.Item>

                <Form.Item
                    label="&nbsp;&nbsp;描述:"
                    name="description"
                    {...layout}
                    rules={[
                        { max: 200,message:'最多输入200个字符'}
                    ]}
                >
                    <TextArea disabled={isWatch}/>
                </Form.Item>
                {/* <Row className={styles.bt_group}>
                    <Button onClick={onCancel}>
                        取消
                    </Button>
                    <Button  type="primary" style={{marginLeft: 8}} htmlType="submit" loading={loading}>
                        保存
                    </Button>
                </Row> */}
            </Form>
        </GlobalModal>
        )
    }
}


export default (connect(({businessUseSort,workflowEngine})=>({
    businessUseSort,
    workflowEngine
  }))(addForm));
