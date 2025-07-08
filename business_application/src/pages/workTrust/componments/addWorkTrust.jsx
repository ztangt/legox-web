import { Modal, Button, Form, Input, DatePicker, Checkbox, Row ,message} from 'antd';
import { connect } from 'umi';
import styles from './list.less';
import { PlusOutlined, CloseCircleFilled } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import SelectTrustedModal from './selectTrustedModal';
import GlobalModal from '../../../componments/GlobalModal/index'
import moment from 'moment';
import {dataFormat} from '../../../util/util';
import search_black from '../../../../public/assets/search_black.svg'
function Add({dispatch,workTrust}){
  const {trustInfo,isShowSelectUser,menusApp,oldMenusApp,selectedDataIds,selectedDatas} = workTrust;
  const [form] = Form.useForm();
  const userName = window.localStorage.getItem("userName");
  let defaultIdea = [];
  trustInfo.trustIdea && trustInfo.trustIdea.split('/').map((item) => {
    let newItem = {};
    newItem.value = item;
    newItem.type = 'look';
    newItem.checked = true;
    defaultIdea.push(newItem);
  })
  const [trustIdeas, setTrustIdeas] = useState(defaultIdea);
  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  useEffect(() => {
    //获取应用建模列表
    dispatch({
      type: "workTrust/getUserMenus",
      payload: {
        sysPlatType: 'FRONT',
        type: 'APP'
      },
      callback: () => {
        let defaultCheckedList = [];
        trustInfo.trustSolIds && trustInfo.trustSolIds.split(',').map((item) => {
          defaultCheckedList.push(item)
        })
        console.log('defaultCheckedList=', defaultCheckedList);
        setCheckedList(defaultCheckedList);
        setIndeterminate(defaultCheckedList.length?true:false)
        setCheckAll(defaultCheckedList.length&&menusApp.length==defaultCheckedList.length?true:false)
      }
    })
  }, [])
  const handelCancel = () => {
    dispatch({
      type: "workTrust/updateStates",
      payload: {
        isShow: false,
        selectedDataIds:[]
      }
    })
  }
  //添加意见
  const addIdeaFn = () => {
    trustIdeas.push({ type: 'edit', value: '', checked: true });
    setTrustIdeas(_.cloneDeep(trustIdeas))
    //滚动到最底部聚焦输入框（先重新熏染才能获取ID）
    setTimeout(() => {
      var input_idea = document.getElementById('input_idea');
      input_idea.focus();
    }, 500)
  }
  //删除意见
  const delIdeaFn = (index) => {
    trustIdeas.splice(index, 1);
    setTrustIdeas(_.cloneDeep(trustIdeas))
  }
  //意见保存
  const changeCheck = (index, e) => {
    if (e.target.value) {
      trustIdeas[index].type = 'look';
      trustIdeas[index].value = e.target.value;
      trustIdeas[index].checked = true;
    } else {
      //删除掉
      trustIdeas.splice(index, 1);
    }
    setTrustIdeas(_.cloneDeep(trustIdeas))
  }
  //改变意见的复选框
  const changeIdeaCheck = (index, e) => {
    trustIdeas[index].checked = e.target.checked;
    setTrustIdeas(_.cloneDeep(trustIdeas))
  }
  //显示选择用户的弹框
  const selectUserModalFn = () => {
    dispatch({
      type: "workTrust/updateStates",
      payload: {
        isShowSelectUser: true
      }
    })
  }
  const submitForm = (values) => {
    console.log('values = ', values);
    let trustIdea = [];
    trustIdeas.map((item) => {
      if (item.checked) {
        trustIdea.push(item.value)
      }
    })
    if (!checkedList.length) {
      message.error('请选择要委托的事项');
      return;
    }
    if (checkedList.length>10) {
      message.error('委托事项不可超过十个！');
      return;
    }
    if (userName===values.trustedUserName) {
      message.error('委托人与被委托人不能相同！');
      return;
    }
    if (trustInfo.id) {
      dispatch({
        type: "workTrust/updateWorkTrust",
        payload: {
          id: trustInfo.id,
          trustIdentityId: trustInfo.trustIdentityId,
          trustUserName: trustInfo.trustUserName,
          ...values,
          trustStartTime:values['trustStartTime'].unix(),
          trustEndTime:values['trustEndTime'].unix(),
          trustIdea:trustIdea.join('/'),
          trustSolIds:checkedList.join(','),
          trustedIdentityId:selectedDataIds?selectedDataIds.join(','):trustInfo.trustedIdentityId
        }
      })
    } else {
      dispatch({
        type: "workTrust/addWorkTrust",
        payload: {
          trustIdentityId: trustInfo.trustIdentityId,
          trustUserName: trustInfo.trustUserName,
          ...values,
          trustStartTime:values['trustStartTime'].unix().toString(),
          trustEndTime:values['trustEndTime'].unix().toString(),
          trustIdea:trustIdea.join('/'),
          trustSolIds:checkedList.join(','),
          trustedIdentityId:selectedDataIds.join(',')
        }
      })
    }
  }
  const onChange = list => {
    console.log('list=', list);
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < menusApp.length);
    setCheckAll(list.length === menusApp.length);
  };
  const onCheckAllChange = e => {
    let ids = menusApp.map((item) => {
      return item.bizSolId;
    })
    setCheckedList(e.target.checked ? ids : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  //搜索工作事项
  const searchMenu = (value) => {
    let newMenuApp = [];
    oldMenusApp.map((item) => {
      if (item.menuName.includes(value)) {
        newMenuApp.push(item)
      }
    })
    dispatch({
      type: "workTrust/updateStates",
      payload: {
        menusApp: newMenuApp
      }
    })
  }
  return (
    <GlobalModal
      visible={true}
      title={trustInfo.id ? "修改" : "新增"}
      onCancel={handelCancel}
      width={800}
      bodyStyle={{overflow:'auto'}}
      widthType={2}
      incomingHeight={450}
      top={20}
      getContainer={() =>{
        return document.getElementById('work_trust')||false
      }}
      maskClosable={false}
      mask={false}
      footer={[
        <Button key="cancel" onClick={handelCancel}>取消</Button>,
        <Button key="submit" onClick={() => { form.submit() }}>确定</Button>
      ]}
      className={styles.add_modal}
    >
      <Form
        colon={false}
        name="trust"
        form={form}
        labelCol={{
          span: 8,
        }}
        onFinish={submitForm}
        initialValues={{
          trustUserName: userName,
          ...trustInfo,
          trustStartTime: trustInfo.trustStartTime ? moment(dataFormat(trustInfo.trustStartTime, 'YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss') : '',
          trustEndTime: trustInfo.trustEndTime ? moment(dataFormat(trustInfo.trustEndTime, 'YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss') : '',
        }}
        className={styles.add_form}
      >
        <Form.Item name="trustUserName" label="委托人">
          <Input disabled style={{ width: '220px' }} />
        </Form.Item>
        {/* <Form.Item name="trustedIdentityId" style={{display:'none'}}>
          <Input/>
        </Form.Item> */}
        <Form.Item
          name="trustedUserName"
          label="被委托人"
          rules={[
            {
              required: true,
              message: '请选择被委托人',
            }
          ]}
        >
          <Input readOnly style={{ width: '220px' }} onClick={selectUserModalFn} />
        </Form.Item>
        <Form.Item
          name="trustStartTime"
          label="委托开始时间"
          rules={[
            {
              required: true,
              message: '请选择委托开始时间',
            }
          ]}
        >
          <DatePicker style={{ width: '220px' }} showTime />
        </Form.Item>
        <Form.Item
          name="trustEndTime"
          label="委托结束时间"
          rules={[
            {
              required: true,
              message: '请选择委托结束时间',
            }
          ]}
        >
          <DatePicker style={{ width: '220px' }} showTime />
        </Form.Item>
        <Form.Item label="委托意见" className={styles.idea_item}>
          <div className={styles.idea_list}>
            <div className={styles.check_idea} id="check_idea">
              {trustIdeas.map((item, index) => {
                return (
                  <Row key={index} className={styles.check_one}>
                    <Checkbox value={index} checked={item.checked} onChange={changeIdeaCheck.bind(this, index)}>
                      {item.type == 'edit' ? <Input defaultValue={item.value} onBlur={changeCheck.bind(this, index)} id="input_idea" /> : <span>{item.value}</span>}
                    </Checkbox>
                    {item.type != 'edit' ? <CloseCircleFilled style={{ color: '#CCCCCC', fontSize: '14px' }} className={styles.del_idea} onClick={delIdeaFn.bind(this, index)} /> : ''}
                  </Row>
                )
              })}
            </div>
            <p className={styles.add_idea} onClick={addIdeaFn}><PlusOutlined /><span>添加</span></p>
          </div>
        </Form.Item>
        <Form.Item name="trustComment" label="备注">
          <Input style={{ width: '220px' }} />
        </Form.Item>
      </Form>
      <div className={styles.work_warp}>
        <p className={styles.work_title}>委托事项</p>
        <div className={styles.work_list}>
          <Input.Search className={styles.search} allowClear onSearch={searchMenu} 
           enterButton={<img src={search_black} style={{ marginRight: 8,marginTop:-3,marginLeft:4 }}/>}
           />
          <Checkbox
            className={styles.check_all}
            indeterminate={indeterminate}
            onChange={onCheckAllChange.bind(this)}
            checked={checkAll}
          >
            全选/取消
          </Checkbox>
          <Checkbox.Group style={{ width: '100%' }} className={styles.check_list} value={checkedList} onChange={onChange}>
            {menusApp.map((item) => {
              return (
                <Row key={item.bizSolId}>
                  <Checkbox value={item.bizSolId} className={styles.check_one}>{item.menuName}</Checkbox>
                </Row>
              )
            })}
          </Checkbox.Group>
        </div>
      </div>
      {isShowSelectUser &&
        <SelectTrustedModal form={form} />
      }
    </GlobalModal>

  )
}
export default connect(({ workTrust, loading }) => { return { workTrust, loading } })(Add)
