import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tabs, Table, Checkbox,Button,message } from 'antd';
import _ from 'lodash';
import { LoadingOutlined, PlusOutlined,UploadOutlined } from '@ant-design/icons';
import IUpload from '../../../componments/Upload/uploadModal';
import ViewItem from './viewItem'
import styles from '../index.less';

const { TabPane } = Tabs;

function LogoList({ dispatch, loginImgList, imgList, portalImgList, portaLoginImgList }) {
  const [imageLoading, setImageLoading] = useState(false);
  // logo tab
  const [tabTypeCode, setTabTypeCode] = useState('PAGETAB_LOGINPIC');
  const [logoUrl,setLogoUrl] = useState('')
  const [showViewModal,setShowViewModal] = useState(false)

  const onLogoChange = (index, obj, name, list, checked) => {
    let newList = _.cloneDeep(list);
    newList[index].isEnable = checked ? 1 : 0;
    newList.forEach(function(item, i) {
      if (index != i && checked) {
        item.isEnable = 0;
      }
    });
    dispatch({
      type: 'tenantSettings/updateLogo',
      payload: {
        isEnable: checked ? 1 : 0,
        logoId: obj.logoId,
        tabTypeCode: tabTypeCode,
      },
    });
    dispatch({
      type: 'tenantSettings/updateStates',
      payload: {
        [name]: newList,
      },
    });
  };
  // 预览图片
  const actionViewItem = (record)=>{
    setLogoUrl(record.logoUrl)
    setShowViewModal(true)
  }
  // 是否使用
  const actionUse = (text,item,i,listName,list)=>{
    localStorage.setItem(`actionUse${tabTypeCode}`,item.id)
    onLogoChange(
      i,
      item,
      listName,
      list,
      item.isEnable == 1 ? false : true,
    )
  }
  // 删除列表
  const deleteActionList = (text,item)=>{
    const storageLogoId = localStorage.getItem(`actionUse${tabTypeCode}`)
    const logoId = item.id
    if(storageLogoId == logoId){
      localStorage.removeItem(`actionUse${tabTypeCode}`)
    }
    dispatch({
      type: 'tenantSettings/deleteTenantLogo',
      payload:{
        logoId
      },
      callback(){
        message.success('删除成功')
      dispatch({
        type: 'tenantSettings/getLogo',
        payload: {
          tabTypeCode: tabTypeCode,
          start: 1,
          limit: 1000,
        },
      });
      }
    })
  }
  const handleViewOk = ()=>{
    handleViewCancel()
  }
  const handleViewCancel = ()=>{
    setShowViewModal(false)
  }

  const callback = key => {
    setTabTypeCode(key);

    dispatch({
      type: 'tenantSettings/getLogo',
      payload: {
        tabTypeCode: key,
        start: 1,
        limit: 1000,
      },
    });
    dispatch({
      type: 'tenantSettings/updateStates',
      payload: {
        tabTypeKey: key
      }
    })
  };

  const imgUl = (list, name, listName) => {
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
                maxWidth: name.includes('登录页图片') ? '200px' : '100px',
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
                marginLeft: '8px',
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
      //       onChange={() =>
      //         onLogoChange(
      //           i,
      //           item,
      //           listName,
      //           list,
      //           item.isEnable == 1 ? false : true,
      //         )
      //       }
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
    return <Table style={{marginTop:8}} dataSource={list} rowKey={'id'} columns={columns} pagination={false} />;
  };

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
          type: 'tenantSettings/addLogo',
          payload: {
            tabTypeCode: tabTypeCode,
            logoUrl: path,
            logoName: fileName,
            isEnable: '0',
          },
          callback: function() {
            dispatch({
              type: 'tenantSettings/getLogo',
              payload: {
                tabTypeCode: tabTypeCode,
                start: 1,
                limit: 1000,
              },
              callback: () => {
                dispatch({
                  type: 'tenantSettings/updateStates',
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
        type: 'tenantSettings/getPicToMinio',
        payload: await fileToBase64Async(file),
        callback: uploadCallBack,
      });
    };
  };

  const renderTab = (uploadName, imgList, name, listNmae) => {
    return (
      <div
        style={{ minHeight: '200px',overflow:'hidden' }}
        className={styles.businessLogo}
      >
        <div
          style={{
            width: '90px',
            // height: '50px',
            // lineHeight: '50px',
            textAlign: 'center',
            float:'right',
            marginBottom: '8px',
            cursor: 'pointer',
          }}
          onClick={onUpload}
        >
          <div style={{textAlign:'right'}}>
          <Button icon={<UploadOutlined />}>上传logo</Button>
            {/* 上传logo
            {imageLoading ? <LoadingOutlined /> : <PlusOutlined />} */}
          </div>
        </div>

        {imgUl(imgList, name, listNmae)}
      </div>
    );
  };

  return (
    <>
      <Tabs defaultActiveKey="PAGETAB_LOGINPIC" onChange={val => callback(val)}>
        <TabPane tab="登录页图片" key="PAGETAB_LOGINPIC">
          {renderTab('avatar', imgList, '登录页图片', 'imgList')}
        </TabPane>
        <TabPane tab="登录页logo" key="PAGETAB_LOGINLOGO">
          {renderTab('loginAvatar', loginImgList, '登录页LOGO', 'loginImgList')}
        </TabPane>
        <TabPane tab="门户登录页图片" key="PAGETAB_SCENELOGINPIC">
          {renderTab('portalLoginAvatar', portaLoginImgList, '门户登录页图片', 'portaLoginImgList')}
        </TabPane>
        <TabPane tab="门户首页logo" key="PAGETAB_SCENELOGO">
          {renderTab('portalAvatar', portalImgList, '门户首页LOGO', 'portalImgList')}
        </TabPane>
      </Tabs>
      {showViewModal&&<ViewItem logoUrl={logoUrl} handleViewOk={handleViewOk} handleViewCancel={handleViewCancel}/>}
    </>
  );
}

export default connect(({ tenantSettings }) => ({
  ...tenantSettings,
}))(LogoList);
