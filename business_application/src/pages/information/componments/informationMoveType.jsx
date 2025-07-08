/**
 * @author gaoj
 * @description 移动分类
 */

import { connect } from 'dva';
import { Space, Modal, Input, message,Form} from 'antd';
import { useEffect, useState } from 'react';
import { REQUEST_SUCCESS } from '../../../service/constant';
import ITree from '../../../componments/public/iTree';
import curStyles from './informationMoveType.less';
import { FormOutlined, PlusOutlined, MinusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import pinyinUtil from '../../../util/pinyinUtil'
import GlobalModal from '../../../componments/GlobalModal';
const { confirm } = Modal;
function InformationMoveType({ dispatch, information, getInformationType, getInforMationList }) {
  const {
    informationTypeList,
    typeId,
  } = information;
  const [form]=Form.useForm()
  const [showModal, setShowModal] = useState(false);//展示弹窗
  const [isAddOrChange, setIsAddOrChange] = useState(false);//判断是新增还是修改（false新增）
  const [typeValue, setTypeValue] = useState('');//类别标题
  const [typeKey, setTypeKey] = useState();//点击的类别key
  const layouts = { labelCol: {span: 6 }, wrapperCol: { span: 18 } };
  const treeCategorList = [{
    informationTypeName: '全部分类',
    id: '',
    children: informationTypeList ? informationTypeList : null
  }];
    // useEffect({
    //   treeCategorList
    // },[informationTypeList])
  const titleRender = (nodeData) => {
    return (
      <div className={curStyles.tree_title}>
        <div style={{ display: 'inline-block' }}>{nodeData.title}</div>
        <div className={curStyles.hover_opration}>
          {nodeData.id != '' ? '' : <PlusOutlined onClick={() => addType(false)} />}
          {nodeData.id != '' ? <FormOutlined title="修改" onClick={() => changeType(true, nodeData)} /> : ''}
          {nodeData.id != '' ?<MinusOutlined title="删除" onClick={delType.bind(this, nodeData.key)} /> : ''}
        </div>
      </div>
    )
  }

  const addType = (e) => {
    setShowModal(true);
    setIsAddOrChange(e);
  }

  const delType = (key) => {
    confirm({
      title: '确定删除这条类别吗？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后将无法撤回',
      onOk() {
        dispatch({
          type: 'information/delInformationType',
          payload: {
            informationTypeIds: key
          },
          callback: () => {
            getInformationType();
          }
        });
      },
      mask: false,
      onCancel() { },
      getContainer: () => {
        return document.getElementById('information_id')||false
      },
    });
  };

  const changeType = (e, nodeData) => {
    setShowModal(true);
    setIsAddOrChange(e);
    setTypeKey(nodeData.key);
    setTypeValue(nodeData.title);
    form.setFieldsValue({
      informationTypeName:nodeData.title,
      informationTypeCode:nodeData.code
    })
  }

  const onOK = (values) => {
    if (!isAddOrChange) {
      dispatch({
        type: 'information/addInformationType',
        payload: {
          // informationTypeName: typeValue
          ...values
        },
        callback: (code) => {
          if (code == 200) {
            setTypeValue('');
            getInformationType();
          }
        }
      });
      setShowModal(false);
    } else if (isAddOrChange) {
      dispatch({
        type: 'information/updateInformationType',
        payload: {
          // informationTypeName: typeValue,
          ...values,
          informationTypeId: typeKey
        },
        callback: (code) => {
          if (code == REQUEST_SUCCESS) {
            message.success('修改成功');
            setTypeValue('');
            getInformationType();
          };
          setShowModal(false);
        }
      })
    }
  };

  const selectCategorInforFn = (selectedKeys, selected) => {
    dispatch({
      type: 'information/updateStates',
      payload: {
        start: 1,
        limit: 10,
        selectedRows: [],
        selectedRowKeys:[],
        selectedRowKeysCurrent: []
      }
    });
    dispatch({
      type: 'informationModal/updateStates',
      payload: {
        typeName: selected.node.title
      }
    });
    if (selectedKeys[0] != 'all') {
      dispatch({
        type: 'information/updateStates',
        payload: {
          typeId: selectedKeys[0],
          typeName: typeof selected.node.title == 'string'? selected.node.title: '全部类别'
        }
      });
    } else {
      dispatch({
        type: 'information/updateStates',
        payload: {
          typeId: '',
          typeName: '全部类别'
        }
      });
    }
    getInforMationList(selectedKeys[0])
  }
  const changeFormItem=(e)=>{
    console.log(e.target.value,'ashfj');
    let name = `${pinyinUtil.getFirstLetter(e.target.value)}`
    console.log(name,'name--');
      form.setFieldsValue({
        informationTypeCode: name,
      });

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
  return (
    <div className={curStyles.home}>
   {  showModal&& <GlobalModal
        // width={400}
        widthType={1}
        incomingWidth={400}
        incomingHeight={120}
        visible={true}
        className={curStyles.addModal}
        title={isAddOrChange ? '修改分组' : '新增分组'}
        onCancel={() => { setShowModal(false), setTypeValue(''),form.resetFields() }}
        onOk={()=>{form.submit()}}
        mask={false}
        getContainer={() => {
          return document.getElementById('information_id')||false;
        }}
        bodyStyle={{padding:16}}
      >
        <Form form={form} onFinish={onOK} {...layouts}>
          <Form.Item name='informationTypeName' label={'分类名称'}
           rules={[{ required: true, message: '请输入分类名称!' }]}>
            <Input onChange={changeFormItem.bind(this)} />
          </Form.Item>
          <Form.Item name='informationTypeCode' label={'分类编码'} 
          rules={[{ required: true, message: '请输入分类编码!' },
          {validator:checkCode}
        ]}>
            <Input/>
          </Form.Item>
        </Form>
      </GlobalModal>}
      <ITree
        isSearch={false}
        treeData={treeCategorList}
        onSelect={selectCategorInforFn}
        selectedKeys={typeId}
        style={{ width: 'auto' }}
        titleRender={titleRender}
        defaultExpandAll={true}
        field={{ titleName: "informationTypeName", key: "id", children: "children" }}
      />
    </div>
  )
};

export default connect(({
  information,
  informationModal
}) => ({
  information,
  informationModal
}))(InformationMoveType);
