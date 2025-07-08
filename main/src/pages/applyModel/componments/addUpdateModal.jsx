import {Modal,Form,Input,Button,Select,Radio,Row,Col,TreeSelect} from 'antd';
import {connect} from 'umi';
import pinyinUtil from '../../../service/pinyinUtil';
import GlobalModal from '../../../componments/GlobalModal';
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const {TextArea}=Input;
const {Option}=Select;
function AddUpdateModal({dispatch,loading,applyModel}){
  const [form] = Form.useForm();
  const {bizSolInfo,selectCtlgId,ctlgTree,isLookModal}=applyModel;
  console.log('isLookModal==',isLookModal);
  console.log(bizSolInfo,'bizSolInfo==');
  const handelCanel=()=>{
    dispatch({
      type:"applyModel/updateStates",
      payload:{
        isShowAddModal:false,
        bizSolInfo:[]
      }
    })
  }

  //提交
  const onFinish=(values)=>{
    delete(values['ctlgName'])
    for(let key in values){
      if(key!='remark'&&typeof values[key]=='string'){
        values[key] = values[key].trim()
      }
    }
    if(bizSolInfo.bizSolId){//修改
      dispatch({
        type:'applyModel/updateBizSol',
        payload:{
          ...values,
          bizSolId:bizSolInfo.bizSolId
        }
      })
    }else{
      dispatch({
        type:'applyModel/addBizSol',
        payload:{
          ...values
        }
      })
    }
  }
  const onValuesChange=(changedValues, allValues)=>{
    dispatch({
      type:"applyModel/updateStates",
      payload:{
        bizSolInfo:{...bizSolInfo,...allValues}
      }
    })
  }
  const checkCode=(_,value)=>{
    let reg = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if(value&&value.length>50){
      return Promise.reject(new Error('长度不能超过50!'))
    }else if(value&&!reg.test(value)){
      return Promise.reject(new Error('只能输入字母、数字、下划线，且首位必须是字母!'))
    }else{
      return Promise.resolve();
    }
  }
  //输入完名称后获取简拼
  function nameCallback(e) {
    if(!bizSolInfo.bizSolId){
      let name = `${pinyinUtil.getFirstLetter(e.target.value)}`
      form.setFieldsValue({
        bizSolCode: name,
      });
    }
  }
  //格式话节点数据
  const ctlgTreeFn=(tree)=>{
    tree.map((item)=>{
      item.value=item.nodeId;
      item.title=item.nodeName;
      if(item.children?.length){
        ctlgTreeFn(item.children)
      }
    })
    return tree;
  }

  const onChange = (e) => {
    if (e.target.value = "1"){
      form.setFieldsValue({
        basicDataFlag: "0",
      });
    }

  };

  return (
    <GlobalModal
      visible={true}
      widthType={1}
      title={bizSolInfo.bizSolId?(isLookModal?'查看':'修改'):'新增'}
      onCancel={handelCanel}
      maskClosable={false}
      mask={false}
      centered
      getContainer={() =>{
        return document.getElementById('add_modal')||false
      }}
      incomingWidth={600}
      incomingHeight={300}
      bodyStyle={{padding:'8px'}}
      footer={isLookModal?[]:[
        <Button key="cancel" onClick={handelCanel}>取消</Button>,
        <Button key="submit" type="primary" loading={loading.global} htmlType={"submit"} onClick={()=>{form.submit()}}>
          保存
        </Button>
      ]}
    >
      <Form
        {...layout}
        colon={false}
        form={form}
        name="role"
        initialValues={{
          ctlgId:bizSolInfo.bizSolId?bizSolInfo.ctlgId:selectCtlgId,
          bizSolName:bizSolInfo.bizSolName,
          bizSolCode:bizSolInfo.bizSolCode,
          bizSolTemplate:bizSolInfo.bizSolTemplate,
          bpmFlag:!bizSolInfo||bizSolInfo.bpmFlag?"1":"0",
          basicDataFlag:bizSolInfo.basicDataFlag?'1':'0',
          basicDataType:bizSolInfo.basicDataType,
          remark:bizSolInfo.remark
        }}
        onFinish={onFinish.bind(this)}
        onValuesChange={onValuesChange}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="应用类别"
              name="ctlgId"
            >
              <TreeSelect
                disabled={bizSolInfo.bizSolId?true:false}
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={ctlgTreeFn(ctlgTree)}
                placeholder="请选择应用类别"
                treeDefaultExpandAll
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="应用名称"
              name="bizSolName"
              rules={[{ required: true, message: '请输入业务应用名称!',whitespace:true },
                {max:50, message: '名称长度不能超过50!' },
              ]}
            >
              <Input onChange={nameCallback.bind(this)} disabled={isLookModal}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="应用编码"
              name="bizSolCode"
              rules={[{ required: true, message: '请输入业务应用编码!' },
                {validator:checkCode}
              ]}
            >
              <Input disabled={bizSolInfo.bizSolId?true:false}/>
            </Form.Item>
          </Col>
          {/* <Col span={12}>
              <Form.Item
                label="业务模版"
                name="bizSolTemplate"
                rules={[{ required: true, message: '请选择业务模版!' }
                ]}
              >
                <Select>
                  {BIZSOLTEMPLATE.map(item=>{
                    return <Option value={item.key} key={item.key}>{item.name}</Option>
                  })}
                </Select>
              </Form.Item>
            </Col> */}
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="有无流程"
              name="bpmFlag"
              labelCol={{span:4}}
            >
              <Radio.Group onChange={onChange} disabled={bizSolInfo.bizSolId?true:false}>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        { form.getFieldsValue().bpmFlag=='0'||bizSolInfo.bpmFlag==false?<Row>
          <Col span={24}>
            <Form.Item
              label="是否基础数据"
              name="basicDataFlag"
              labelCol={{span:4}}
            >
              <Radio.Group  disabled={bizSolInfo.bizSolId?true:false}>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>:''}
        {(form.getFieldsValue().bpmFlag=='0' && form.getFieldsValue().basicDataFlag=='1') || (bizSolInfo.bpmFlag==false && bizSolInfo.basicDataFlag=='1') ?<Row>
          <Col span={24}>
            <Form.Item
              label="基础数据类型"
              name="basicDataType"
              labelCol={{span:4}}
              rules={[{ required: true, message: '请选择基础数据类型!'}
              ]}
            >
              <Select disabled = {bizSolInfo.bizSolId?true:false}
                style={{
                  width: 170,
                }}
                options={[
                  {
                    value: '1',
                    label: '树形基础数据有结转',
                  },
                  {
                    value: '2',
                    label: '树形基础数据无结转',
                  },
                  {
                    value: '3',
                    label: '基础数据有结转',
                  },
                  {
                    value: '4',
                    label: '基础数据无结转',
                  }
                ]}
              />
            </Form.Item>
          </Col>
        </Row>:''}
        <Row>
          <Col span={24}>
            <Form.Item
              label="描述"
              name="remark"
              labelCol={{span:4}}
              wrapperCol={{span:20}}
              rules={[
                {max:200, message: '描述长度不能超过200!' },
              ]}
            >
              <TextArea disabled={isLookModal}/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </GlobalModal>
  )
}
export default connect(({applyModel,loading,layoutG})=>{return {applyModel,loading,layoutG}})(AddUpdateModal)
