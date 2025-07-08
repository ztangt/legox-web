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
function AddUpdateEngine({dispatch,loading,chartEngine}){
  const [form] = Form.useForm();
  const {chartInfo,selectCtlgId,ctlgTree,isLookModal}=chartEngine;
  const handelCanel=()=>{
    dispatch({
      type:"chartEngine/updateStates",
      payload:{
        isShowAddModal:false,
        bizSolInfo:[]
      }
    })
  }
  //提交
  const onFinish=(values)=>{
    for(let key in values){
      if(key!='chartDesc'&&typeof values[key]=='string'){
        values[key] = values[key].trim()
      }
    }
    values['ctlgId'] = selectCtlgId;
    if(chartInfo.id){//修改
      dispatch({
        type:'chartEngine/updateChart',
        payload:{
          ...values,
          id:chartInfo.id
        }
      })
    }else{
      dispatch({
        type:'chartEngine/addChart',
        payload:{
          ...values
        }
      })
    }
  }
  const onValuesChange=(changedValues, allValues)=>{
    dispatch({
      type:"chartEngine/updateStates",
      payload:{
        chartInfo:{...chartInfo,...allValues}
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
    if(!chartInfo.id){
      let name = `${pinyinUtil.getFirstLetter(e.target.value)}`
      form.setFieldsValue({
        chartCode: name,
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
  return (
    <GlobalModal
        visible={true}
        widthType={1}
        title={chartInfo.id?'修改方案':'新增方案'}
        onCancel={handelCanel}
        maskClosable={false}
        mask={false}
        centered
        getContainer={() =>{
          return document.getElementById('chart_modal')||false
        }}
        incomingWidth={600}
        incomingHeight={300}
        bodyStyle={{padding:'8px'}}
        footer={[
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
            ctlgId:chartInfo.id?chartInfo.ctlgId:selectCtlgId,
            chartName:chartInfo.chartName,
            chartCode:chartInfo.chartCode,
            createTime:chartInfo.createTime,
            isAble:!chartInfo||chartInfo.isAble?"1":"0",
            chartDesc:chartInfo.chartDesc
          }}
          onFinish={onFinish.bind(this)}
          onValuesChange={onValuesChange}
        >
          <Row gutter={16}>

            <Col span={12}>
              <Form.Item
                label="方案名称"
                name="chartName"
                rules={[{ required: true, message: '请输入方案名称!',whitespace:true },
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
                label="方案编码"
                name="chartCode"
                rules={[{ required: true, message: '请输入方案编码!' },
                  {validator:checkCode}
                ]}
              >
                <Input disabled={chartInfo.id?true:false}/>
              </Form.Item>
            </Col>
          </Row>
          {/* <Row>
            <Col span={24}>
            <Form.Item
              label="是否启用"
              name="isAble"
              labelCol={{span:4}}
            >
              <Radio.Group>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Radio.Group>
            </Form.Item>
            </Col>
          </Row> */}
          <Row>
            <Col span={24}>
              <Form.Item
                label="备注"
                name="chartDesc"
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
export default connect(({chartEngine,loading,layoutG})=>{return {chartEngine,loading,layoutG}})(AddUpdateEngine)
