import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { history} from 'umi';
import IUpload from '../../../componments/Upload/uploadModal';
import {
  Button,
  Form,
  Modal,
  Input,
  Table,
  Space,
  ConfigProvider,
  message,
} from 'antd';
import styles from './accessoryModal.less';
import { dataFormat } from '../../../util/util';
import {
  ArrowDownOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
function AccessoryModal({ dispatch, notification, nameId, setNameId,location,setState,state }) {
  const {
    fileExists,
    fileStorageId,
    fileName,
    md5FileId,
    type,
    fileSize,
    typeNames,
    getFileMD5Message,
    fileData,
  } = notification;
  const {searchResult}=state
  const [resetFlag, setResetFlag] = useState(false);
  const [rowName, setRowName] = useState('');
  const [form] = Form.useForm();
  const layout = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };
  useEffect(() => {
    // 如果文件存在于minio
    if (fileExists) {
      // setNameId(nameId.concat(fileData)

        // nameId.concat({
        //   uid: md5FileId,
        //   name: fileName,
        //   fileUploadTime: dataFormat(
        //     Math.round(new Date().getTime() / 1000).toString(),
        //     'YYYY-MM-DD HH:mm:ss',
        //   ),
        //   fileSize: fileSize,
        //   fileType: typeNames,
        // }),
      // );
      dispatch({
        type: 'notification/updateStates',
        payload: {
          fileExists: '',
        },
      });
    } else if (fileExists === false) {
      // setNameId(
      //   nameId.concat({
      //     uid: fileStorageId,
      //     name: fileName,
      //     fileUploadTime: dataFormat(
      //       Math.round(new Date().getTime() / 1000).toString(),
      //       'YYYY-MM-DD HH:mm:ss',
      //     ),
      //     fileSize: fileSize,
      //     fileType: typeNames,
      //   }),
      // );
      dispatch({
        type: 'notification/updateStates',
        payload: {
          fileExists: '',
        },
      });
    }
  }, [fileExists]);

  const customizeRenderEmpty = () => (
    //这里面就是我们自己定义的空状态
    <div style={{ textAlign: 'center' }}>
      <p>暂无数据</p>
    </div>
  );
  const columns = [
    {
      title: '序号',
      dataIndex: 'num',
      width:80,
      render:(text,record,index)=><span>{index+1}</span>
    },
    {
      title: '附件名称',
      dataIndex: 'name',
      render:(text,record)=><span className={styles.fileTitle} title={text}>{text}</span>
    },
    {
      title: '附件类型',
      dataIndex: 'fileType',
    },
    {
      title: '附件大小',
      dataIndex: 'fileSize',
      render:(text,record)=><span>{(text/1024).toFixed(2)}KB</span>
    },
    {
      title: '上传人',
      dataIndex: 'uploadUser',
      render: (text) => {
        return <span>{text?text:searchResult&&searchResult.releaseUserName}</span>;
      },
    },
    {
      title: '上传时间',
      dataIndex: 'fileUploadTime',
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed:'right',
      render: (text, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              downUploadFile(text, record);
            }}
          >
            <ArrowDownOutlined />
          </a>
          {location.query.title!=='查看' && (
            <>
              <a
                onClick={() => {
                  deleteFile(text, record);
                }}
              >
                <DeleteOutlined />
              </a>
              <a
                onClick={() => {
                  moveUp(text, record);
                }}
              >
                <CaretUpOutlined />
              </a>
              <a
                onClick={() => {
                  moveDown(text, record);
                }}
              >
                <CaretDownOutlined />
              </a>
            </>
          )}
        </Space>
      ),
    },
  ].filter(Boolean)

  //下载文件
  const downUploadFile = (text, record) => {
    dispatch({
      type: 'notification/getDownFileUrl',
      payload: {
        fileStorageId: record.uid,
      },
      callback: (url) => {
        // downFile(url,record)
        global.location.href = url;
      },
    });
  };
  //删除文件
  const deleteFile = (text, record) => {
    nameId.forEach((item, index) => {
      if (item.key == record.key) {
        nameId.splice(index, 1);
      }
    });
    setNameId([...nameId]);
  };
  //上移
  const moveUp = (text, record) => {
    let i = nameId.findIndex((v) => record === v);
    if(i==0){
      message.warning('不可上移')
    }else{
      let i_ = i - 1;
      nameId.splice(i, 1);
      nameId.splice(i_, 0, record);
      setNameId([...nameId]);
    }
  };
  //下移
  const moveDown = (text, record) => {
    let i = nameId.findIndex((v) => record === v);
    if(i==nameId.length-1){
      message.warning('不可下移')
      return 
    }else{
      let i_ = i + 1;
      nameId.splice(i, 1);
      nameId.splice(i_, 0, record);
      setNameId([...nameId]);
    }
  };
  //重命名
  const resetName = () => {
    //重命名
    if (rowName) {
      setResetFlag(true);
      nameId.forEach((item) => {
        if (item.fileUploadTime == rowName) {
          form.setFieldsValue({
            resetname: item.name,
          });
        }
      });
    } else {
      message.warning('请选择一条数据');
    }
  };
  const onOkReset = () => {
    let name = form.getFieldsValue();
    if(name.resetname.length<=0){
      message.error('请输入文件名称！')
      return
    }
    nameId.forEach((item, index) => {
      if (item.fileUploadTime === rowName) {
        item.name = name.resetname;
      }
    });
    setResetFlag(false);
  };
  const onCancelReset = () => {
    setResetFlag(false);
  };
  const onClickRow = (record) => {
    const name = record.fileUploadTime;
    return {
      onClick: () => {
        setRowName(name);
      },
    };
  };
  const setRowClassName = (record) => {
    return record.fileUploadTime === rowName ? styles.clickRowsStyle : '';
  };
  const uploadFn=()=>{
    if(nameId.length>=15){
      message.error('文件最多可上传15个！')
      return
    }
  }
  return (
    <div>
      <div className={styles.accessory_button}>
        <Form form={form}>
          {
            <Form.Item labelAlign={'left'} style={{marginLeft:'40px'}} label="附件" colon={location.query.title=='查看'?true:false}>
              <i className={styles.accessory_icon}>
                <CaretUpOutlined />
              </i>
              {location.query.title !== '查看' && (
                <>
                  <span className={styles.limitImg}>
                    不支持文件格式exe、bat、js、java、sh、dll、cmd，文件不大于50M，文件最多可上传15个
                  </span>
                  <Button type="primary" onClick={resetName} style={{marginRight:16}}>
                    重命名
                  </Button>
                  {
                    nameId.length>=15?<Button onClick={()=>{uploadFn()}}>上传</Button>:
                    <IUpload
                    location={location}
                    nameSpace="notification"
                    requireFileSize={50}
                    buttonContent={
                      <Button type="primary" className={styles.upload_button}>
                        上传
                      </Button>
                    }
                  />
                  }
                </>
              )}
            </Form.Item>
          }
        </Form>
        <div style={{marginBottom:'8px'}}>
          {/* <ConfigProvider renderEmpty={customizeRenderEmpty}> */}
            <Table
              rowKey={(record) => {
                return record.fileUploadTime + Math.random().toString(36).slice(2);
              }}
              bordered={false}
              pagination={false}
              size="small"
              columns={columns}
              dataSource={nameId}
              //locale={{emptyText:'暂无数据'}}
              onRow={onClickRow}
              rowClassName={setRowClassName}
              scroll={{y:290}}
            />
          {/* </ConfigProvider> */}
        </div>
      </div>
      <Modal
        width={400}
        title="重命名"
        className={styles.resetNameModl}
        visible={resetFlag}
        bodyStyle={{ height: 110 }}
        onOk={onOkReset}
        onCancel={onCancelReset}
        mask={false}
        maskClosable={false}
        getContainer={() => {
          return document.getElementById('addNotice_id')||false;
        }}
      >
        <Form form={form}>
          <Form.Item name="resetname" label="文件名"
          rules={[
            {max:200, message: '文件名称长度不能超过200!' },
        ]}
          >
            <Input/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
export default connect(({ notification }) => ({ notification }))(
  AccessoryModal,
);
