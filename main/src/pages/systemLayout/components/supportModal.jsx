import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Button, message, Form, Tabs, Checkbox, Table, Input } from 'antd';
import IUpload from '../../../componments/Upload/uploadModal';
import GlobalModal from '../../../componments/GlobalModal';
import { LoadingOutlined, PlusOutlined,UploadOutlined } from '@ant-design/icons';
import ViewImage from './viewItem';
import styles from '../index.less';

const { TabPane } = Tabs;

function support({
  dispatch,
  typeName,
  getFileMD5Message,
  loading,
  onCancel,
  fileExists,
  fileName,
  basesetObj,
  homeImgList,
  basesetId,
}) {
  console.log('typeName', typeName);
  const [imageLoading, setImageLoading] = useState(false);
  const [logoUrl,setLogoUrl] = useState('')
  const [showViewModal,setShowViewModal] = useState(false)
  const [form] = Form.useForm();

  useEffect(() => {
    console.log(fileExists, 'fileExists============');
    // 如果文件存在于minio
    if (fileExists) {
      dispatch({
        type: 'systemLayout/addLogo',
        payload: {
          tabTypeCode: 'PAGETAB_FIRSTLOGO',
          logoUrl: getFileMD5Message.filePath,
          registerId: basesetId,
          logoName: fileName,
          isEnable: '0',
        },
        callback: function() {
          dispatch({
            type: 'systemLayout/getLogo',
            payload: {
              tabTypeCode: 'PAGETAB_FIRSTLOGO',
              registerId: basesetId,
              start: 1,
              limit: 1000,
              registerCode:'PLATFORM_SYS'
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
    } else if (fileExists === false) {
      // 如果文件不存在于minio
      dispatch({
        type: 'systemLayout/addLogo',
        payload: {
          tabTypeCode: 'PAGETAB_FIRSTLOGO',
          logoUrl: getFileMD5Message.filePath,
          registerId: basesetId,
          logoName: fileName,
          isEnable: '0',
        },
        callback: function() {
          dispatch({
            type: 'systemLayout/getLogo',
            payload: {
              tabTypeCode: 'PAGETAB_FIRSTLOGO',
              registerId: basesetId,
              start: 1,
              limit: 1000,
              registerCode:'PLATFORM_SYS'
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
    }
  }, [fileExists]);

  //新增页面点击保存触发 onFinish事件
  //   function onFinish(values) {
  //     dispatch({
  //       type: 'systemLayout/supportBaseset',
  //       payload: {
  //         supportCopyright: values.supportCopyright
  //           ? values.supportCopyright
  //           : '',
  //         otherJson: JSON.stringify({
  //           PERSONENUM__CONNADMIN: values.PERSONENUM__CONNADMIN ? 1 : 0,
  //           PERSONENUM__DOWNLOAD: values.PERSONENUM__DOWNLOAD ? 1 : 0,
  //         }),
  //         connadminType: values.connadminType ? values.connadminType : '',
  //         contactName: values.contactName ? values.contactName.trim() : '',
  //         contactPhone: values.contactPhone ? values.contactPhone.trim() : '',
  //         contactTelephone: values.contactTelephone
  //           ? values.contactTelephone.trim()
  //           : '',
  //         contactAddress: values.contactAddress ? values.contactAddress : '',
  //         contactOthers: values.contactOthers ? values.contactOthers : '',
  //         registerId: basesetId,
  //       },
  //       callback: function() {
  //         message.success('保存成功');
  //         dispatch({
  //           type: 'systemLayout/updateStates',
  //           payload: {
  //             supportModal: false,
  //           },
  //         });
  //       },
  //     });
  //   }
  // 预览图片
  const actionViewItem = (record)=>{
    setLogoUrl(record.logoUrl)
    setShowViewModal(true)
  }
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
        tabTypeCode: 'PAGETAB_FIRSTLOGO',
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
            tabTypeCode: 'PAGETAB_FIRSTLOGO',
            registerId: basesetId,
            start: 1,
            limit: 1000,
            registerCode:'PLATFORM_SYS'
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
  const validatorList = ()=>{
    const validator = homeImgList.every(item=>item.isEnable==0)
    return validator
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
                maxWidth: name == '主页logo' ? '200px' : '100px',
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
      //       onChange={onLogoChange.bind(this, i, item, listName, list)}
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
    return <Table dataSource={list} columns={columns} pagination={false} />;
  }

  function renderTab(uploadName, imgList, name, listNmae) {
    return (
      <div style={{ minHeight: '200px',overflow:'hidden' }} className={styles.businessLogo}>
        <IUpload
          nameSpace="systemLayout"
          requireFileSize={5}
          buttonContent={
            <div
              style={{
                width: '90px',
                textAlign: 'center',
                float:'right',
                cursor: 'pointer',
              }}
            >
              <div style={{textAlign:'right'}}>
                {/* 上传logo
                {imageLoading ? <LoadingOutlined /> : <PlusOutlined />} */}
                <Button className={styles.up_logo} icon={<UploadOutlined />}>上传logo</Button>
              </div>
            </div>
          }
          typeName={typeName}
        />

        {imgUl(imgList, name, listNmae)}
      </div>
    );
  }
  const onFinish=(values)=>{
    if(validatorList()){
      message.error('当前列表logo未使用')
      return false
    }
    dispatch({
      type: 'systemLayout/supportBaseset',
      payload: {
        copyRight: values.copyRight
          ? values.copyRight
          : '',
        registerId:basesetId
      },
      callback: function() {
        message.success('保存成功');
        onCancel()
      },
    });
    // dispatch({
    //   type: 'user/getRegisterByCode',
    //   payload: {
    //     registerCode: 'PLATFORM_SYS',
    //   },
    // });
  }
  return (
    <GlobalModal
      visible={true}
      widthType={3}
      title="基础配置显示页面"
      onCancel={onCancel}
      className={styles.add_form}
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
          确定
        </Button>,
      ]}
    >
      <div className={styles.main}>
        <Form initialValues={basesetObj} onFinish={onFinish} form={form}>
          <p className={styles.title} style={{ marginTop: '10px' }}>
            logo配置
          </p>
          <Tabs defaultActiveKey="0" style={{ padding: '10px' }}>
            <TabPane tab="主页logo" key="1">
              {renderTab('loginAvatar', homeImgList, '主页logo', 'homeImgList')}
            </TabPane>
          </Tabs>
          <Tabs defaultActiveKey="COPYRIGHT">
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
}))(support);
