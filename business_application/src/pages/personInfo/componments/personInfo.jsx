import { Form, Input, Button, Col, Select, Row, Upload } from 'antd';
import { connect } from 'dva';
import styles from './index.less'
import React, { useState, useEffect } from 'react';
import { stubFalse } from 'lodash';
import { LoadingOutlined, PlusOutlined, FormOutlined } from '@ant-design/icons';
import ModifyPwd from '../../../componments/modifyPwd';
import IUpload from '../../../componments/Upload/uploadModal';
function Index({ dispatch, personInfo, closable = false,location}) {
  const [form] = Form.useForm();
  const { userInfo, fileExists, fileStorageId, needfilepath, md5FileId, getFileMD5Message, md5FilePath, merageFilepath, minioFalseSignature, minioTureSignature, minioFalsePicture, minioTurePicture,uploadType } = personInfo
  const [loading, setLoading] = useState(false);
  const [mVisible, setMVisible] = useState(false);
  const personConfig = JSON.parse(window.localStorage.getItem('personConfig'))
  const layouts = { labelCol: { span: 8 }, wrapperCol: { span: 14 } };
console.log(userInfo,'userInfo==');
console.log(needfilepath,'needfilepath');
  useEffect(()=>{
      dispatch({
      type: 'personInfo/getCurrentUserInfo'
    })
  },[])
  useEffect(() => {
    form.resetFields();
  }, [userInfo.id]);

  useEffect(() => {
    if (fileExists) {
      form.setFields([
        {
          name: 'picture',
          value: minioTurePicture
        },
        {
          name: 'signature',
          value: minioTureSignature
        }
      ])
    } else if (fileExists === false) {
      form.setFields([
        {
          name: 'picture',
          value: minioFalsePicture
        },
        {
          name: 'signature',
          value: minioFalseSignature
        }
      ])
    }
  }, [minioTurePicture, minioTureSignature, minioFalsePicture, minioFalseSignature, fileExists])

  // useEffect(() => {
  //   form.resetFields([{
  //     name: 'fileStorageId',
  //     value: md5FileId
  //   }]);
  // }, [md5FileId]);

  // useEffect(() => {
  //   form.resetFields([{
  //     name: 'fileStorageId',
  //     value: md5FileId
  //   }]);
  // }, [md5FileId]);
  console.log(fileExists, 'fileExists=====');
  console.log(needfilepath, 'needfilepath=====');
  useEffect(() => {
    // 如果文件存在于minio
    if (fileExists) {
      if (uploadType=='picture') {
        console.log('头像存在');
        dispatch({
          type: 'personInfo/getPictureDownFileUrl',
          payload: {
            fileStorageId: md5FileId
          },
          callback: () => {
            dispatch({
              type: 'personInfo/updateStates',
              payload: {
                minioTurePicture: md5FilePath,
                fileExists: '',
                fileStorageId: ''
              }
            });
          }
        });
      } else if (uploadType=='signature') {
        console.log('签名存在');
        dispatch({
          type: 'personInfo/getSignatureDownFileUrl',
          payload: {
            fileStorageId: md5FileId
          },
          callback: () => {
            dispatch({
              type: 'personInfo/updateStates',
              payload: {
                minioTureSignature: md5FilePath,
                fileExists: ''
              }
            });
          }
        });
      }
    } else if (fileExists === false) {
      // 如果文件不存在于minio
      if (needfilepath.includes('picture')) {
        console.log('头像不存在');
        dispatch({
          type: 'personInfo/getPictureDownFileUrl',
          payload: {
            fileStorageId: fileStorageId
          },
          callback: () => {
            dispatch({
              type: 'personInfo/updateStates',
              payload: {
                minioFalsePicture: getFileMD5Message.filePath,
                fileExists: ''
              }
            });
          }
        });
      } else if (needfilepath.includes('signature')) {
        console.log('签名不存在');
        dispatch({
          type: 'personInfo/getSignatureDownFileUrl',
          payload: {
            fileStorageId: fileStorageId
          },
          callback: () => {
            dispatch({
              type: 'personInfo/updateStates',
              payload: {
                minioFalseSignature: getFileMD5Message.filePath,
                fileExists: ''
              }
            });
          }
        });
      }
    }
  }, [fileExists, getFileMD5Message])
  const onFinish = (values) => {
    console.log(userInfo,'userInfo---');
    // values['picture'] = userInfo.picture_Id
    // values['signature'] = userInfo.signature_Id

    // values['picture'] = fileExists ? minioTurePicture : fileExists === false ? minioFalsePicture : '',
    //   values['signature'] = fileExists ? minioTureSignature : fileExists === false ? minioFalseSignature : ''
    // values['sex'] = values.sex
    dispatch({
      type: 'personInfo/updateUser',
      payload: {
        userName: values.userName,
        sex: values.sex=='女'?'1':values.sex=='男'?'2':values.sex=='未知'?'3':values.sex,
        email: values.email,
        phone: values.phone,
        telephone: values.telephone,
        orgId: userInfo.orgId,
        deptId: userInfo.deptId,
        userId: userInfo.userId,
        signaturePath : userInfo.signature?userInfo.signature:userInfo.signatureOriginaPath,
        picturePath: userInfo.picture?userInfo.picture:userInfo.pictureOriginalPath
      }
    })

  }


  const uploadButton = (
    <div className={styles.uploadButton}>
      <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <p style={{marginRight:0}}>上传</p>
      </div>
    </div>
  );

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('上传的图片不是JPG/PNG格式');
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('I上传的图片不能大于2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  //上传
  function doImgUpload(name, fileType, options) {
    const { onSuccess, onError, file, onProgress } = options;
    let filePath = `UserInfo/${new Date().getTime()}/${file.name}`
    const reader = new FileReader();
    reader.readAsDataURL(file); // 读取图片文件
    reader.onload = (file) => {
      userInfo[`${name}Url`] = file.target.result
      setLoading(false)
    };
    dispatch({
      type: 'personInfo/presignedUploadUrl',
      payload: {
        filePath: filePath
      },
      callback: function (url) {
        fetch(url, {
          method: 'PUT',
          body: file
        }).then(() => {
          // userInfo[`${name}Url`] = filePath
          dispatch({
            type: 'personInfo/updateStates',
            payload: {
              userInfo: {
                ...userInfo,
                [`${name}_Id`]: filePath
              }
            }
          })
        }).catch((e) => {
          console.error(e);
        });
      }
    })
  };

  return (

  <div className={styles.personInfo}>
    <div className={styles.picture}>
      <div className={styles.upload_picture}>
      <Row>
        <Col span={6}> <p>头像</p></Col>
        <Col span={18}>
          <IUpload
            location={location}
            name='avatar'
            typeName='picture'
            disabled={personConfig && personConfig.PERSONENUM__HEADIMGMODIFY == 0}
            nameSpace='personInfo'
            requireFileSize={2}
            uploadSuccess={(filePath)=>{
              userInfo['picture'] = filePath
              dispatch({
                type: 'personInfo/updateStates',
                payload: {
                  userInfo,
                  uploadType:'picture'
                }
              })

            }}
            buttonContent={
              <>
                {userInfo.picturePath ? <img src={userInfo.picturePath} alt="avatar" className={styles.img} /> : uploadButton}
                {personConfig && personConfig.PERSONENUM__HEADIMGMODIFY == 1 && userInfo.picture && <p style={{textAlign:'center',marginRight:0}}>上传<FormOutlined /></p>}
              </>
            }
          />
        </Col>

      </Row>
     
          
      </div>
      <div className={styles.upload_signature}>
      <Row>
        <Col span={6}> <p>签名</p></Col>
        <Col span={18}>
            <IUpload
          location={location}
          name='avatar'
          typeName='signature'
          disabled={personConfig && personConfig.PERSONENUM__SIGNMODIFY == 0}
          nameSpace='personInfo'
          requireFileSize={2}
          uploadSuccess={(filePath)=>{
            userInfo['signature'] = filePath
            dispatch({
              type: 'personInfo/updateStates',
              payload: {
                userInfo,
                uploadType:'signature'
              }
            })

          }}
          buttonContent={
            <>
              {userInfo.signaturePath ? <img src={userInfo.signaturePath} alt="signAvatar" className={styles.img} /> : uploadButton}
              {personConfig && personConfig.PERSONENUM__SIGNMODIFY == 1 && userInfo.signature && <p style={{textAlign:'center',marginRight:0}}>修改<FormOutlined /></p>}
            </>
          }
        />
        </Col>

      </Row>
       
        
       
      </div>
          
    </div>
    <hr className={styles.line}/>
    <Form
      form={form}
      {...layouts}
      initialValues={{...userInfo,
      sex:userInfo.sex==1?'男':userInfo.sex==2?'女':'未知'}
      }
      onFinish={onFinish}
      className={styles.form}
    >
      {/* <Row>
        <Col span={6}></Col>
        <Col span={18}> */}
          {/* <Upload
            disabled={personConfig && personConfig.PERSONENUM__HEADIMGMODIFY == 0}
            name="avatar"
            listType="picture-card"
            className={styles.avatarUploader}
            showUploadList={false}
            beforeUpload={beforeUpload}
            customRequest={doImgUpload.bind(this, 'picture', 'PERSONAL_PHOTO')}
          >
            {userInfo.pictureUrl ? <img src={userInfo.pictureUrl} alt="avatar" style={{ borderRadius: '50px', width: '100%' }} /> : uploadButton}
            {personConfig && personConfig.PERSONENUM__HEADIMGMODIFY == 1 && userInfo.picture && <p >上传<FormOutlined /></p>}
          </Upload> */}
          {/* <IUpload
            name='avatar'
            typeName='picture'
            disabled={personConfig && personConfig.PERSONENUM__HEADIMGMODIFY == 0}
            nameSpace='personInfo'
            requireFileSize={2}
            uploadSuccess={(filePath)=>{
              userInfo['picture'] = filePath
              dispatch({
                type: 'personInfo/updateStates',
                payload: {
                  userInfo,
                  uploadType:'picture'
                }
              })

            }}
            buttonContent={
              <>
                {userInfo.picturePath ? <img src={userInfo.picturePath} alt="avatar" style={{ borderRadius: '50px', width: '100%' }} /> : uploadButton}
                {personConfig && personConfig.PERSONENUM__HEADIMGMODIFY == 1 && userInfo.picture && <p >上传<FormOutlined /></p>}
              </>
            }
          />
        </Col>
      </Row> */}
      <Form.Item
        style={{ position: 'relative' }}
        label="姓名"
        name="userName"
        rules={[
          {
            required: true,
            message: '请输入姓名',
          },
          { max: 50, message: '最多输入50个字符' },
        ]}
      >
        <Input placeholder='请输入姓名'  style={{width:240}}/>

      </Form.Item>
      {/* <a className={styles.modify_pwd} onClick={() => {  setMVisible(true) }}>修改密码</a> */}

      <Form.Item
        label="性别"
        name="sex"
        rules={[
          {
            required: true,
            message: '请选择性别',
          }
        ]}
      >
        <Select style={{width:240}}>
          <Select.Option value='1'>男</Select.Option>
          <Select.Option value='2'>女</Select.Option>
          <Select.Option value='3'>未知</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="电子邮箱"
        name="email"
        rules={[
          {
            required: true,
            message: '请输入电子邮箱',

          },
          { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message: '请输入正确的邮箱' },
        ]}
      >
        <Input placeholder='请输入电子邮箱'  style={{width:240}}/>
      </Form.Item>
      <Form.Item
        label="手机号"
        name="phone"
        rules={[
          {
            required: true,
            message: '请输入手机号',

          },
          {
            max: 11,
            message: '最长11位!',
          },

          {
            pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
            message: '请输入正确的手机号',
          },
        ]}
      >
        <Input placeholder='请输入手机号'  style={{width:240}}/>
      </Form.Item>
      <Form.Item
        label="固定电话"
        name="telephone"
        rules={[
          {
            required: true,
            message: '请输入固定电话',
          },
        ]}
      >
        <Input placeholder='请输入固定电话' style={{width:240}}/>
      </Form.Item>
      <Form.Item
        label="单位"
        name="orgName"
      >
        <Input disabled style={{width:240}}/>
      </Form.Item>
      <Form.Item
        label="部门"
        name="deptName"
      >
        <Input disabled style={{width:240}}/>
      </Form.Item>
      {/* <Form.Item
        label="签名"
        name="signature"

      > */}
        {/* <Upload
          disabled={personConfig && personConfig.PERSONENUM__SIGNMODIFY == 0}
          name="signAvatar"
          listType="picture-card"
          className={styles.signAvatarUploader}
          showUploadList={false}
          beforeUpload={beforeUpload}
          customRequest={doImgUpload.bind(this, 'signature', 'PERSONAL_SIGNATURE')}
        >
          {userInfo.signatureUrl ? <img src={userInfo.signatureUrl} alt="signAvatar" style={{ width: '100%' }} /> : uploadButton}
          {personConfig && personConfig.PERSONENUM__SIGNMODIFY == 1 && userInfo.signature && <p >修改<FormOutlined /></p>}
        </Upload> */}
        {/* <IUpload
          name='avatar'
          typeName='signature'
          disabled={personConfig && personConfig.PERSONENUM__SIGNMODIFY == 0}
          nameSpace='personInfo'
          requireFileSize={2}
          uploadSuccess={(filePath)=>{
            userInfo['signature'] = filePath
            dispatch({
              type: 'personInfo/updateStates',
              payload: {
                userInfo,
                uploadType:'signature'
              }
            })

          }}
          buttonContent={
            <>
              {userInfo.signaturePath ? <img src={userInfo.signaturePath} alt="signAvatar" style={{ width: '100%' }} /> : uploadButton}
              {personConfig && personConfig.PERSONENUM__SIGNMODIFY == 1 && userInfo.signature && <p >修改<FormOutlined /></p>}
            </>
          }
        /> */}
      {/* </Form.Item> */}
      <Row>
        <Col span={8}></Col>
        <Col span={8}>
          <Button type="primary" htmlType="submit" style={{width:240}}>
            保存
          </Button>
        </Col>

      </Row>
      {/* <ModifyPwd mVisible={mVisible} closable={true} setMVisible={setMVisible} /> */}
    </Form>
  </div>
  )
}
export default connect(({ personInfo }) => { return { personInfo } })(Index);
