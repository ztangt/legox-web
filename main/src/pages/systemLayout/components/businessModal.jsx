import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {Modal,Radio,Button,message,Form,Row,Col,Switch,Tabs,Checkbox,Table,Input,TreeSelect} from 'antd';
import GlobalModal from '../../../componments/GlobalModal';
import { LoadingOutlined, PlusOutlined,UploadOutlined } from '@ant-design/icons';
import ViewImage from './viewItem';
import styles from '../index.less';

const { TabPane } = Tabs;

function business({
  dispatch,
  loading,
  onCancel,
  radioIndex,
  loginImgList,
  homeImgList,
  basesetId,
  imgList,
  basesetObj,
  partabilityList,
  customLink,
  menuList
}) {
console.log(menuList,'menuList--');
  const [form] = Form.useForm();
  const [imageLoading, setImageLoading] = useState(false);
  const [signImageLoading, setSignImageLoading] = useState(false);
  const [logoUrl,setLogoUrl] = useState('')
  const [showViewModal,setShowViewModal] = useState(false)
  // radio
  const [radioVal, setRadioVal] = useState(radioIndex);
  const layout = { labelCol: { span: 16 }, wrapperCol: { span: 8 } };
  const [tabTypeCode, setTabTypeCode] = useState('PAGETAB_FIRSTLOGO');
  const [switchVal, setSwitchValVal] = useState();
  const [allValues,setAllValues]=useState(null)
  const [selectIds,setSelectIds]=useState([])
  useEffect(()=>{
    if(basesetObj.PERSONENUM__COMMONAPP){
      setAllValues({...allValues,PERSONENUM__COMMONAPP:basesetObj.PERSONENUM__COMMONAPP})
    }
    if(basesetObj.menuIds){
      setSelectIds(basesetObj.menuIds.split(','))
    }
  },[])
  const onRadioChange = e => {
    setRadioVal(e.target.value);
  };

  const changeThemeToBol = values => {
    const tableKeyArr = ['TABLE_PERSON', 'TABLE_MIX', 'TABLE_FAST','TABLE_CUSTOM'];
    return tableKeyArr.reduce((pre, cur, index) => {
      const tableSwitchBol = values[cur] ? 1 : 0;
      const tableRadioBol = index === radioVal ? 1 : 0;
      pre[cur] = `${tableSwitchBol},${tableRadioBol}`;
      if(cur=='TABLE_CUSTOM'&&(values.TABLE_CUSTOM==1||values.TABLE_CUSTOM==true)){
        pre['TABLE_CUSTOM'] = `${tableSwitchBol},${tableRadioBol},${customLink}`;
      }
      return pre;
    }, {});
  };

  const validatorList = ()=>{
    const validator = imgList.every(item=>item.isEnable==0)
    return validator
  }

  //新增页面点击保存触发 onFinish事件
  function onFinish(values) {
    if(validatorList()){
      message.error('当前列表logo未使用')
      return false
    }
    let isAbilityCodes = partabilityList.reduce((pre, cur) => {
      pre[cur.menuCode] = values[cur.menuCode] ? 1 : 0;
      return pre;
    }, {});
    dispatch({
      type: 'systemLayout/bussinessBaseset',
      payload: {
        tableJson: JSON.stringify(changeThemeToBol(values)),
        personConfigsJson: JSON.stringify({
          PERSONENUM__SIGNMODIFY: values.PERSONENUM__SIGNMODIFY ? 1 : 0,
          PERSONENUM__HEADIMGMODIFY: values.PERSONENUM__HEADIMGMODIFY ? 1 : 0,
          PERSONENUM__COMMONAPP: values.PERSONENUM__COMMONAPP ? 1 : 0,
          PERSONENUM__ABOUTUS: values.PERSONENUM__ABOUTUS ? 1 : 0,
          PERSONENUM__MESSAGEALERT: values.PERSONENUM__MESSAGEALERT ? 1 : 0,
        }),
        registerId: basesetId,
        isAbilityCodes: JSON.stringify(isAbilityCodes),
        copyRight: values?.copyRight,
        menuIds:selectIds.join(',')
      },
      callback: function() {
        message.success('保存成功');
        // dispatch({
        //   type: 'user/getRegisterByCode',
        //   payload: {
        //     registerCode: 'PLATFORM_BUSS',
        //   },
        // });
        dispatch({
          type: 'systemLayout/updateStates',
          payload: {
            businessModal: false,
            basesetObj:{}
          },
        });
      },
    });
  }

  function callback(key) {
    setTabTypeCode(key);

    dispatch({
      type: 'systemLayout/getLogo',
      payload: {
        tabTypeCode: key,
        registerId: basesetId,
        start: 1,
        limit: 1000,
        registerCode: 'PLATFORM_BUSS',
      },
    });
  }

  function switchList(list) {
    let newArr = [];
    list.forEach(function(item, i) {
      partabilityList.forEach(function(policy, j) {
        if (item.menuCode == policy.menuCode) {
          let obj = {
            menuCode: policy.menuCode,
            menuName: policy.menuName,
          };
          newArr.push(obj);
        }
      });
    });
    console.log("newArr009",newArr)
    const listItems = newArr.map((item, i) => {
      return (
        <Col span={4} key={i}>
          <Form.Item
            label={item.menuName}
            {...layout}
            name={item.menuCode}
            valuePropName="checked"
            style={{ margin: '0' }}
          >
            <Switch />
          </Form.Item>
        </Col>
      );
    });
    return (
      <Row gutter={0} style={{ padding: '10px' }}>
        {listItems}
      </Row>
    );
  }
  // 预览图片
  const actionViewItem = (record)=>{
    setLogoUrl(record.logoUrl)
    setShowViewModal(true)
  }
  
  // logo改变
  function onLogoChange(index, obj, name, list, checked) {
    let newList = _.cloneDeep(list);
    newList[index].isEnable = checked ? 1 : 0;
    newList.forEach(function(item, i) {
      if (index != i && checked) {
        item.isEnable = 0;
      }
    });
    dispatch({
      type: 'systemLayout/updateLogo',
      payload: {
        isEnable: checked ? 1 : 0,
        logoId: obj.logoId,
        tabTypeCode: tabTypeCode,
      },
    });
    dispatch({
      type: 'systemLayout/updateStates',
      payload: {
        [name]: newList,
      },
    });
  }
  // 删除列表
  const deleteActionList = (text,item)=>{
    const logoId = item.id
    dispatch({
      type: 'systemLayout/deleteTenantLogo',
      payload: {  
        logoId
      },
      callback(){
        message.success('删除成功')
        dispatch({
          type: 'systemLayout/getLogo',
          payload:{
            tabTypeCode: tabTypeCode,
            registerId: basesetId,
            start: 1,
            limit: 1000,
            registerCode: 'PLATFORM_BUSS',
          }
        })
      }
    })
  }
  // 是否使用
  const actionUse = (text,item,i,listName,list)=>{
    onLogoChange(
      i,
      item,
      listName,
      list,
      item.isEnable == 1 ? false : true,
    )
  }
  const handleViewOk = ()=>{
    handleViewCancel()
  }
  const handleViewCancel = ()=>{
    setShowViewModal(false)
  }

  function imgUl(list, name, listName) {
    const columns = [
      {
        title: name,
        dataIndex: 'bizSolName',
        key: 'bizSolName',
        align: 'left',
        width: '50%',
        render: (text, item) => (
          <div style={{ height: '100%', display: 'flex' }}>
            <div
              style={{
                maxWidth: name == '登录页图片' ? '200px' : '100px',
                textAlign: 'right',
              }}
            >
              {item.logoName}:
            </div>
            <img
              src={item.logoUrl}
              style={{
                width: '260px',
                height: '100%',
                marginLeft: '10px',
                background: '#ddd',
              }}
            />
          </div>
        ),
      },
      // {
      //   title: '是否使用',
      //   dataIndex: 'bizSolCode',
      //   key: 'bizSolCode',
      //   align: 'center',
      //   render: (text, item, i) => (
      //     <Checkbox
      //       checked={item.isEnable == 1 ? true : false}
      //       onChange={onLogoChange.bind(
      //         this,
      //         i,
      //         item,
      //         listName,
      //         list,
      //         item.isEnable == 1 ? false : true,
      //       )}
      //     />
      //   ),
      // },
      {
        title: '状态',
        dataIndex: 'bpmFlag',
        key: 'bpmFlag',
        render: (text, item) => (
          <div className={item.isEnable == 1 ? styles.stus : styles.un_stus}>
            {item.isEnable == 1 ? '已使用' : '未使用'}
          </div>
        ),
      },
      {
        title:'操作',
        render:(text,record,i)=>{
          return <div className={styles.actions}>
            <a onClick={()=>actionViewItem(record)}>预览</a>
            <a disabled={record.logoId?false:true} onClick={()=>record.logoId?deleteActionList(text,record):null}>删除</a>
            <a onClick={()=>actionUse(text,record,i,listName,list)}>{record.isEnable == 1?'取消使用':'使用'}</a>
          </div>
        }
      }
    ];
    return <Table dataSource={list} rowKey={'id'} columns={columns} pagination={false} />;
  }

  const onUpload = () => {
    let input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.onchange = async () => {
      let file = input.files[0];
      const fileName = file.name;

      function fileToBase64Async(file) {
        return new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = e => {
            resolve(e.target.result);
          };
        });
      }

      const uploadCallBack = (path, fullPath, fileExt) => {
        dispatch({
          type: 'systemLayout/addLogo',
          payload: {
            tabTypeCode: tabTypeCode,
            logoUrl: path,
            registerId: basesetId,
            logoName: fileName,
            isEnable: '0',
          },
          callback: function() {
            dispatch({
              type: 'systemLayout/getLogo',
              payload: {
                tabTypeCode: tabTypeCode,
                registerId: basesetId,
                start: 1,
                limit: 1000,
                registerCode: 'PLATFORM_BUSS',
              },
              callback: () => {
                dispatch({
                  type: 'systemLayout/updateStates',
                  payload: {
                    fileExists: '',
                  },
                });
              },
            });
          },
        });
      };
      dispatch({
        type: 'systemLayout/getPicToMinio',
        payload: await fileToBase64Async(file),
        callback: uploadCallBack,
      });
    };
  };

  function renderTab(uploadName, imgList, name, listNmae) {
    return (
      <div
        style={{ minHeight: '200px',overflow:'hidden' }}
        className={styles.businessLogo}
      >
        <div
          style={{
            width: '90px',
            textAlign: 'center',
            float:'right',
            marginBottom: '8px',
            cursor: 'pointer',
          }}
          onClick={onUpload}
        >
          <div style={{textAlign:'right'}}>
            <Button className={styles.up_logo} icon={<UploadOutlined />}>上传logo</Button>
            {/* 上传logo
            {imageLoading ? <LoadingOutlined /> : <PlusOutlined />} */}
          </div>
        </div>

        {imgUl(imgList, name, listNmae)}
      </div>
    );
  }

  useEffect(() => {
    setRadioVal(radioIndex);
  }, [radioIndex]);
  const changeSwitch=(value)=>{
    setSwitchValVal(value)
  }
  function changeLink(e){
    dispatch({
      type: 'systemLayout/updateStates',
      payload: {
        customLink: e.target.value,
      },
    });
  }
  const changeSelectTree=(value, label, extra)=>{
    if(value.length>15){
      return message.error('最多设置15个')
    }else{
      setSelectIds(value)
    }

  }
  const onValuesChange=(changedValues, allValues)=>{
    setAllValues(allValues)
  }

  return (
    <GlobalModal
      visible={true}
      widthType={3}
      title="基础配置显示页面"
      onCancel={onCancel}
      className={styles.add_form}
      bodyStyle={{overflow: 'hidden'}}
      mask={false}
      maskClosable={false}
      getContainer={() => {
        return document.getElementById('systemLayout_container')||false;
      }}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading.global}
          htmlType={'submit'}
          onClick={() => {
            form.submit();
          }}
        >
          保存
        </Button>,
      ]}
    >
      <div className={styles.main}>
        <Form
          form={form}
          //  fields={fields}
          initialValues={basesetObj}
          onFinish={onFinish}
          onValuesChange={onValuesChange}
        >
          <p className={styles.title}>顶部图标</p>
          {switchList([
            { menuCode: 'AGNEW' },
            { menuCode: 'NOTIC' },
            { menuCode: 'YUOUB' },
            { menuCode: 'YUBAB' },
            { menuCode: 'SEARC' },
          ])}
          <p className={styles.title}>功能操作</p>
          <Row gutter={0} style={{ padding: '10px' }}>
            <Col span={4}>
              <Form.Item
                label="签名修改"
                {...layout}
                name="PERSONENUM__SIGNMODIFY"
                valuePropName="checked"
                style={{ margin: '0' }}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="头像修改"
                {...layout}
                name="PERSONENUM__HEADIMGMODIFY"
                valuePropName="checked"
                style={{ margin: '0' }}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="关于我们"
                {...layout}
                name="PERSONENUM__ABOUTUS"
                valuePropName="checked"
                style={{ margin: '0' }}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="弹框消息提醒"
                {...layout}
                name="PERSONENUM__MESSAGEALERT"
                valuePropName="checked"
                style={{ margin: '0' }}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="常用应用"
                {...layout}
                name="PERSONENUM__COMMONAPP"
                valuePropName="checked"
                style={{ margin: '0' }}
              >
                <Switch />
              </Form.Item>
            </Col>
            
          </Row>
          <Row gutter={0} style={{ padding: '10px' }}>
          {(allValues?.PERSONENUM__COMMONAPP)?<Col span={24}>
              <Form.Item
                label="默认快捷方式配置"
                labelCol={{span:4}}
                 wrapperCol={{span:20}}
                // style={{ margin: '0',width:'200px' }}
              >
                <TreeSelect
                  showSearch
                  style={{
                    width: '100%',
                  }}
                  value={selectIds}
                  dropdownStyle={{
                    maxHeight: 400,
                    overflow: 'auto',
                  }}
                  // placeholder="Please select"
                  allowClear
                  multiple
                  maxTagCount={15}
                  // treeDefaultExpandAll
                  onChange={changeSelectTree}
                  treeData={menuList}
                />
              </Form.Item>
            </Col>:''}
          </Row>
          <p className={styles.title}>主题设置</p>
          <Row gutter={0} style={{ padding: '10px' }}>
            <Col span={4}>
              <Form.Item
                label="个人桌面"
                {...layout}
                name="TABLE_PERSON"
                valuePropName="checked"
                style={{ margin: '0' }}
              >
                <Switch />
              </Form.Item>
            </Col>
            {/* <Col span={4}>
              <Form.Item
                label="领导桌面"
                {...layout}
                name="TABLE_LEADER"
                valuePropName="checked"
                style={{ margin: '0' }}
              >
                <Switch />
              </Form.Item>
            </Col> */}
            <Col span={4}>
              <Form.Item
                label="融合桌面"
                {...layout}
                name="TABLE_MIX"
                valuePropName="checked"
                style={{ margin: '0' }}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="快捷桌面"
                {...layout}
                name="TABLE_FAST"
                valuePropName="checked"
                style={{ margin: '0' }}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="自定义桌面"
                {...layout}
                name="TABLE_CUSTOM"
                valuePropName="checked"
                style={{ margin: '0' }}
              >
                <Switch onChange={changeSwitch}/>
              </Form.Item>
            </Col>
            {/* (switchVal||form.getFieldsValue()['TABLE_CUSTOM']==1||form.getFieldsValue()['TABLE_CUSTOM']==true)&& */}
            <Col span={4}>
              <Form.Item
                label="链接"
                name='link'
                labelCol={{span:8}}
                 wrapperCol={{span:16}}
                style={{ margin: '0',width:'200px' }}
              >
                <Input defaultValue={customLink} onChange={changeLink.bind(this)}/>
              </Form.Item>
            </Col>
          </Row>
          <div className={styles.gropWarp}>
            <Radio.Group onChange={onRadioChange} value={radioVal}>
              <Row >
                 <Col span={4}>
                    <Radio value={0} className={styles.gropItem}>
                      设为默认桌面
                    </Radio>
                 </Col>
                 <Col span={4}>
                  <Radio value={1} className={styles.gropItem}>
                    设为默认桌面
                  </Radio>
                 </Col>
                 <Col span={4}>
                  <Radio value={2} className={styles.gropItem}>
                    设为默认桌面
                  </Radio>
                 </Col>
                 <Col span={4}>
                  <Radio value={3} className={styles.gropItem}>
                    设为默认桌面
                  </Radio>
                 </Col>
              </Row>
              
              {/* <Radio value={1} className={styles.gropItem}>
                设为默认桌面
              </Radio> */}
              
            </Radio.Group>
          </div>

          <p className={styles.title} style={{ marginTop: '10px' }}>
            logo配置
          </p>
          <Tabs defaultActiveKey="PAGETAB_FIRSTLOGO" onChange={callback}>
            {/* <TabPane tab="登录页图片" key="PAGETAB_LOGINPIC">
              {renderTab('avatar', imgList, '登录页图片', 'imgList')}
            </TabPane>
            <TabPane tab="登录页logo" key="PAGETAB_LOGINLOGO">
              {renderTab(
                'loginAvatar',
                loginImgList,
                '登录页LOGO',
                'loginImgList',
              )}
            </TabPane> */}
            <TabPane tab="主页logo" key="PAGETAB_FIRSTLOGO">
              {renderTab('homeAvatar', imgList, '主页LOGO', 'imgList')}
            </TabPane>
          </Tabs>
          <Tabs defaultActiveKey="COPYRIGHT" onChange={callback}>
            <TabPane tab="版权配置" key="COPYRIGHT">
              <Form.Item
                  label="系统版权"
                  name='copyRight'
                  labelCol={{span:3}}
                  wrapperCol={{span:21}}
                >
                  <Input disabled={localStorage.getItem('isModifyCopyRight')==1?false:true}/>
                </Form.Item>
            </TabPane>
          </Tabs>
        </Form>
      </div>
      {showViewModal&&<ViewImage logoUrl={logoUrl} handleViewOk={handleViewOk} handleViewCancel={handleViewCancel}/>}
    </GlobalModal>
  );
}
export default connect(({ systemLayout, layoutG }) => ({
  ...systemLayout,
  layoutG,
}))(business);
