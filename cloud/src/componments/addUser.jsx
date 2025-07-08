import { connect } from 'dva';
import React, { useState,useEffect } from 'react';
import { Button, Space, Upload,Avatar ,message,Row, Col,Input ,Switch,Select,DatePicker,Form,Radio,Modal,Spin} from 'antd';
import { LoadingOutlined, PlusOutlined,FormOutlined,PlusSquareOutlined,MinusSquareOutlined} from '@ant-design/icons';
import _ from "lodash";
import styles from './addUser.less';
import { history } from 'umi';
import moment from 'moment';
import IUpload from '../componments/Upload/uploadModal';
import { sm2 } from 'sm-crypto';
import 'moment/locale/zh-cn'; 
moment.locale('zh-cn');
import pinyinUtil from '../service/pinyinUtil';
const servicePublicKey =
  '0416e39a2a5023e90a4f8d0c663b7f9e21bcd430c122e767150b201dd5935d8953a08227be68de4a04c46d46c6b2644d3042889404a7dcda92c7f211ee29f20c8e';
function addForm ({dispatch,loading,onCancel,currentUg,imageUrl,signImageUrl,signDoImgUploaderId,doImgUploaderId,onAddSubmit,isCat,usersLists,acountStatus,fileExists,uploadType,getFileMD5Message,fileStorageId,md5FileId,md5FilePath,picUrl,needfilepath}){ 
    const [form,UploadForm,signUploadForm] = Form.useForm();
    const [isShow,setIsShow] = useState(true);
    const [imageLoading, setImageLoading] = useState(false);
    const [signImageLoading, setSignImageLoading] = useState(false);
    const layout =  {labelCol: { span: 8 },wrapperCol: { span: 16 }};
    currentUg.userAccount = currentUg.userAccount ? currentUg.userAccount.trim() : '';
    currentUg.userShortName = currentUg.userShortName ? currentUg.userShortName.trim() : '';
    useEffect(() => {
        // 如果文件存在于minio
        if (fileExists) {
          if (uploadType=='picture') {
            console.log('头像存在');
            dispatch({
              type: 'addUser/getPictureDownFileUrl',
              payload: {
                fileStorageId: md5FileId
              },
              callback: () => {
                dispatch({
                  type: 'addUser/updateStates',
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
              type: 'addUser/getSignatureDownFileUrl',
              payload: {
                fileStorageId: md5FileId
              },
              callback: () => {
                dispatch({
                  type: 'addUser/updateStates',
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
              type: 'addUser/getPictureDownFileUrl',
              payload: {
                fileStorageId: fileStorageId
              },
              callback: () => {
                dispatch({
                  type: 'addUser/updateStates',
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
              type: 'addUser/getSignatureDownFileUrl',
              payload: {
                fileStorageId: fileStorageId
              },
              callback: () => {
                dispatch({
                  type: 'addUser/updateStates',
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
    const [fields, setFields] = useState([
        {
            name: ['isEnable'],
            value: true,
        },
        {
            name: ['isAppEnable'],
            value: true,
        },
        {
            name:['userShortName'],
            value:currentUg.userShortName,
        },
        {
            name:['customType'],
            value:currentUg.customType?currentUg.customType:'1',
        },
      ]);
    //输入完姓名后失焦事件
    function nameCallback(e){
        let name = `${pinyinUtil.getPinyin(e.target.value, '', false)},${pinyinUtil.getFirstLetter(e.target.value).toLowerCase()}`
        currentUg['userShortName'] = name;

        form.setFieldsValue({
            userShortName: name,
        });
    }  
    function accountCallBack(e) {
        if(userAccount.value) {
            dispatch({
                type:"userMg/getUserInfo",
                payload:{
                    userAccount:userAccount.value,
                    orgCenterId:''
                },
            })
        } else {
            message.error('请传入用户账号!');
        }
    }
    function onChange(date, dateString) {
        console.log(date, dateString);
      }
    //输入证件号码时先判断有无选择证件类型  idenType
    function idCallback(e){
        // if(!currentUg.idenType){
        //     message.warning('请选择证件类型');
        // }
    }
    //新增页面点击保存触发 onFinish事件
    function onFinish(values){
        if(!currentUg.userId) {
            values['userPassword'] = '04'+sm2.doEncrypt(values.userPassword,servicePublicKey);
        }
        if(currentUg.id) {
            delete values['userPassword'];
        }
        values['isEnable'] = values.isEnable?1:0;//是否启用
        values['isAppEnable'] = values.isAppEnable?1:0;//是否移动端登录
        values['birthday'] = values.birthday?values.birthday.format('X'):null//生日   
        values['pwdExprTime'] = values.pwdExprTime?values.pwdExprTime.format('X'):null //密码到期时间 
        values['workTime'] = values.workTime?values.workTime.format('X'):null  //参加工作时间
        values['entryTime'] = values.entryTime?values.entryTime.format('X'):null   //入党时间
        values['joinTime'] = values.joinTime?values.joinTime.format('X'):null   //调入时间
        values['picturePath'] = picUrl.picture?picUrl.picture:picUrl.pictureOriginalPath, //头像id
        values['signaturePath'] = picUrl.signature?picUrl.signature:picUrl.signatureOriginaPath,//手写签批id
        // Object.keys(values).forEach(function(key) {
        //     if(key!='isEnable'&& key!='isAppEnable' &&
        //        values[key]){
        //         values[key] = values[key].trim()
        //     }
        // })
        onAddSubmit(values)
    }
    //
    function onValuesChange(values){
        dispatch({
            type: 'addUser/updateStates',
            payload:{
               // currentUg:{...currentUg,...values}
            }
        })
    }
    // function getBase64(img, callback) {
    //     const reader = new FileReader();
    //     reader.addEventListener('load', () => callback(reader.result));
    //     reader.readAsDataURL(img);
    // }
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
    function isShowFn(text){
        if(text == '展开'){
            setIsShow(false)
        }else{
            setIsShow(true)
        }
    }
    //点击上传头像
    function handleChange(info){
        if (info.file.status === 'uploading') {
            setImageLoading(true)
            return;
        }
        if (info.file.status === 'done' || info.file.status === 'error') {
            // getBase64(info.file.originFileObj, function imageUrl(imageUrl){
            //      //   setImageUrl(imageUrl)
                     setImageLoading(false)
            //         console.log('imageUrl111',imageUrl)
            //     }  
            // );
            
        }
    }
    const uploadFormData = new FormData(UploadForm);
    const signUploadFormData = new FormData(signUploadForm)
    //上传头像
    function doImgUpload(options){
        const { onSuccess, onError, file, onProgress } = options;
        const reader = new FileReader();
        reader.readAsDataURL(file); // 读取图片文件
        reader.onload = (file) => {
            dispatch({
                type: 'addUser/updateStates',
                payload:{
                    imageUrl:file.target.result
                }
            })
            setImageLoading(false)
        };
        uploadFormData.append('fileType','PERSONAL_PHOTO')
        uploadFormData.append('file',file);
        dispatch({
            type: 'addUser/uploader',
            payload:uploadFormData,
            callback:function(dataId){
                // doImgUploaderId = dataId;
                // dispatch({
                //     type: 'addUser/updateStates',
                //     payload:{
                //         doImgUploaderId,
                //     }
                // })
            }
        })    
    };
    //上传手写签名
    function signDoImgUpload(options){
        const { onSuccess, onError, file, onProgress } = options;
        const reader = new FileReader();
        reader.readAsDataURL(file); // 读取图片文件
        reader.onload = (file) => {
            dispatch({
                type: 'addUser/updateStates',
                payload:{
                    signImageUrl:file.target.result
                }
            })
            setSignImageLoading(false)
        };
        signUploadFormData.append('fileType','PERSONAL_SIGNATURE')
        signUploadFormData.append('file',file)
        dispatch({
            type: 'addUser/uploader',
            payload:signUploadFormData,
            callback:function(dataId){
                // signDoImgUploaderId = dataId;
                // dispatch({
                //     type: 'addUser/updateStates',
                //     payload:{
                //         signDoImgUploaderId,
                //     }
                // })
            }
        })  
    };
    // const signUploadButton = (
    //     <div>
    //       {signImageLoading ? <LoadingOutlined /> : <PlusOutlined />}
    //       <div style={{ marginTop: 8 }}>上传签名</div>
    //     </div>
    // );

    //密码失效时间
    function disabledDate(current) {
        return current && current < moment().endOf('day')
    }
    

    function signBeforeUpload(file) {
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
    //点击上传手写签名
    function signHandleChange(info){
        if (info.file.status === 'uploading') {
            setSignImageLoading(true)
            return;
        }
        if (info.file.status === 'done' || info.file.status === 'error') {
            setSignImageLoading(false)
        }
    }
    const signUploadButton = (
        <div>
          {signImageLoading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>上传签名</div>
        </div>
    );
    const uploadButton = (
        <div>
          {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>上传头像</div>
        </div>
    );
    return (
        <Modal
            visible={true}
            width={900}
            title={isCat?'查看':currentUg.id ? '修改' : '新增'}
            bodyStyle={{padding: '10px'}}
            onCancel={onCancel}
            mask={false}
            maskClosable={false}
            getContainer={() =>{
                return document.getElementById('dom_container')
            }}
            footer={
                !isCat&&[
                    <Button onClick={onCancel}>
                                取消
                            </Button>,
                    <Button  type="primary" htmlType="submit" loading={loading.global} onClick={()=>{form.submit()}}>
                                保存
                    </Button>
                            
                ]
            }
        >
           <div className={styles.wrap}>
            <div className={`${styles.top} ${styles.displayFlex}`}>
                <div className={styles.displayFlex}>
                    {/* <Form form={UploadForm}> */}
                        <IUpload
                            name="avatar"
                            typeName='picture'
                            nameSpace='addUser'
                            className={styles.avatarUploader}
                            requireFileSize={2}
                            uploadSuccess={(filePath)=>{
                                console.log(filePath,'filePath---');
                                picUrl['picture'] = filePath
                                dispatch({
                                    type: 'addUser/updateStates',
                                    payload: {
                                        picUrl,
                                        uploadType:'picture'
                                    }
                                })
                            }}
                            buttonContent={
                                <>
                                  {picUrl.picturePath ? <img src={picUrl.picturePath} alt="avatar" style={{ width: '300px',height:'150px' }} /> : uploadButton}
                                </>
                              }
                        />
                            
                    {/* </Form> */}
                </div>
                {/* <div className={styles.displayFlex}>
                        <IUpload
                            name="avatar"
                            typeName='signature'
                            nameSpace='addUser'
                            className={styles.signAvatarUploader}
                            requireFileSize={2}
                            uploadSuccess={(filePath)=>{
                                picUrl['signature'] = filePath
                                dispatch({
                                type: 'addUser/updateStates',
                                payload: {
                                    picUrl,
                                    uploadType:'signature'
                                }
                                })
                            }}
                            buttonContent={
                                <>
                                  {picUrl.signaturePath ? <img src={picUrl.signaturePath} alt="signAvatar" style={{ width: '300px',height:'150px' }} /> : signUploadButton}
                                </>
                              }
                        />
                </div> */}
            </div>
            <div>
                <Form form={form} initialValues={currentUg}  fields={fields} onFinish={onFinish} onValuesChange={onValuesChange}>
                    <p className={styles.modalItemTitle}>基础信息</p>
                    <Row gutter={0} >
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="登录账号"
                                name="userAccount" 
                                rules={[
                                    { pattern: /^\w+$/,message: '只能输入字母、数字、下划线'},
                                    { required: true,message:'请输入登录账号' },
                                    { max: 50,message:'最多输入50个字符'}

                                ]}
                            >
                                <Input disabled={isCat || currentUg.id}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                {...layout}
                                label="登录密码"
                                name="userPassword" 
                                rules={currentUg.id ? '' : [
                                    { pattern: /^[\w\!\&\@\#\$\%\*\.]+$/,message: '密码支持字母、数字、特殊字符!&@#$%*.'},
                                    { required: true,message:'请输入登录密码' },
                                    { max: 50,message:'最多输入50个字符'}
                                ]}
                            >
                                <Input.Password placeholder={currentUg.id?'******':'123456'} disabled={currentUg.id? true:false}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="姓名"
                                name="userName" 
                                rules={[
                                    { required: true,message:'请输入姓名' },
                                    { max: 20,message:'最多输入20个字符'}

                                ]}
                            >
                                <Input onBlur={(e)=>{nameCallback(e)}} disabled={isCat || currentUg.id}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="姓名简称"
                                name="userShortName" 
                                rules={[
                                    { pattern: /^[^\s]*$/,message: '禁止输入空格'},
                                    { max: 200,message:'最多输入200个字符'}
                                ]}
                            >
                                <Input disabled={isCat}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                           {
                            acountStatus==true?
                             <Form.Item 
                                label="账号状态"
                                {...layout}
                                name="isEnable" 
                                valuePropName={currentUg.isEnable==true || !currentUg.id?'checked':''}
                            >
                                <Switch disabled={isCat} />
                            </Form.Item>
                            :''
                           }
                        </Col>
                       
                        
                    </Row>
                    <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                label="启动移动端登录"
                                {...layout}
                                name="isAppEnable" 
                                valuePropName="checked"
                            >
                                <Switch disabled={isCat}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="用户类型"
                                name="customType" 
                                rules={[
                                    { required: true,message:'请选择用户类型' }
                                ]}
                            >
                                <Select disabled={isCat} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                    <Select.Option value="1">用户</Select.Option>
                                    <Select.Option value="2">用户&管理员</Select.Option>
                                    <Select.Option value="8">管理员</Select.Option>
                                    {/* <Select.Option value="5">其他</Select.Option> */}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="性别"
                                name="sex" 
                            >
                                <Select defaultValue="0" disabled={isCat} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                    <Select.Option value="0">请选择</Select.Option>
                                    <Select.Option value="1">男</Select.Option>
                                    <Select.Option value="2">女</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="出生日期"
                                name="birthday" 
                            >
                                <DatePicker disabled={isCat} getPopupContainer={triggerNode => triggerNode.parentNode}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <p className={styles.modalItemTitle}>拓展信息&nbsp;&nbsp;{isShow && <span onClick={()=>isShowFn('展开')}>&nbsp;&nbsp;<PlusSquareOutlined /></span>}{!isShow && <span onClick={()=>isShowFn('收起')}>&nbsp;&nbsp;<MinusSquareOutlined /></span>}</p>
                    {!isShow && <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="证件类型"
                                name="idenType" 
                            >
                                <Select defaultValue="0" disabled={isCat} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                    <Select.Option value="0">请选择</Select.Option>
                                    <Select.Option value="1">身份证</Select.Option>
                                    <Select.Option value="2">军官证</Select.Option>
                                    <Select.Option value="3">台胞证</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="证件号码"
                                name="idenNumber" 
                                rules={[
                                    {
                                      required: false,
                                      message: '证件号码',
                                    },
                                    { max: 50,message:'最多输入50个字符'}
                                  ]}
                                  
                            >
                                <Input onFocus={(e)=>{idCallback(e)}} disabled={isCat}/>
                            </Form.Item>
                        </Col>
                    </Row>}
                    {!isShow && <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="学历"
                                name="education" 
                            >
                                <Select defaultValue="0" disabled={isCat} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                    <Select.Option value="0">请选择</Select.Option>
                                    <Select.Option value="1">本科</Select.Option>
                                    <Select.Option value="2">硕士研究生</Select.Option>
                                    <Select.Option value="3">博士研究生</Select.Option>
                                    <Select.Option value="4">高中</Select.Option>
                                    <Select.Option value="5">专科</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="学位"
                                name="degree" 
                            >
                                <Select defaultValue="0" disabled={isCat} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                    <Select.Option value="0">请选择</Select.Option>
                                    <Select.Option value="1">学士</Select.Option>
                                    <Select.Option value="2">硕士</Select.Option>
                                    <Select.Option value="3">博士</Select.Option>
                                    <Select.Option value="4">副学士</Select.Option>
                                    <Select.Option value="5">其他</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>}
                    {!isShow && <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="政治面貌"
                                name="political" 
                            >
                                <Select defaultValue="0" disabled={isCat} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                    <Select.Option value="0">请选择</Select.Option>
                                    <Select.Option value="1">党员</Select.Option>
                                    <Select.Option value="2">团员</Select.Option>
                                    <Select.Option value="3">群众</Select.Option>
                                    <Select.Option value="4">民主党派</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="电子邮箱"
                                name="email" 
                                rules={[
                                { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,message:'请输入正确的邮箱' },
                                { max: 50,message:'最多输入50个字符'}
                                ]}
                            >
                                <Input disabled={isCat}/>
                            </Form.Item>
                        </Col>
                    </Row>}
                    {!isShow && <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="手机号"
                                name="phone" 
                                rules={[
                                    {
                                      required: false,
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
                                <Input disabled={isCat}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                        {!isShow && <Form.Item 
                            {...layout}
                            label="籍贯"
                            name="address" 
                            rules={[
                                { max: 200,message:'最多输入200个字符'}
                            ]}
                            >
                            <Input disabled={isCat}/>
                            </Form.Item>}
                        </Col>
                    </Row>}
                    {!isShow && <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="人员类型"
                                name="personType" 
                            >
                                <Select defaultValue="0" disabled={isCat} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                    <Select.Option value="0">请选择</Select.Option>
                                    <Select.Option value="1">正式编制</Select.Option>
                                    <Select.Option value="2">派遣制</Select.Option>
                                    <Select.Option value="3">合同制</Select.Option>
                                    <Select.Option value="4">临时工</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="参加工作时间"
                                name="workTime" 
                            >
                                <DatePicker  disabled={isCat} getPopupContainer={triggerNode => triggerNode.parentNode}/>
                            </Form.Item>
                        </Col>
                    </Row>}
                    {!isShow && <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="工资卡信息"
                                name="salaryCard" 
                                rules={[
                                    { max: 50,message:'最多输入50个字符'}
                                ]}
                            >
                                <Input disabled={isCat}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="公务卡信息"
                                name="officialCard" 
                                rules={[
                                    { max: 50,message:'最多输入50个字符'}
                                ]}
                            >
                                <Input disabled={isCat}/>
                            </Form.Item>
                        </Col>
                    </Row>}
                    {!isShow && <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item
                                {...layout} 
                                label="工龄"
                                name="workYears" 
                                rules={[
                                    {
                                        required: false,
                                        message: '请输入工龄',
                                    },
                                    {
                                        pattern: /^(?:0|[1-9]\d?)$/,
                                        message: '请输入0-99之间的正整数',
                                    },
                                    { max: 50,message:'最多输入50个字符'},
                                ]}
                            >
                                <Input disabled={isCat}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="调入时间"
                                name="entryTime" 
                            >
                                <DatePicker  disabled={isCat} getPopupContainer={triggerNode => triggerNode.parentNode}/>
                            </Form.Item>
                        </Col>
                    </Row>}
                    {!isShow && <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="入党时间"
                                name="joinTime" 
                            >
                                <DatePicker  disabled={isCat} getPopupContainer={triggerNode => triggerNode.parentNode}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="清除mac地址"
                                name="clearMacAddress" 
                            >   
                                <Radio.Group disabled={isCat}>
                                    <Space>
                                        <Radio.Button value="0">手机端</Radio.Button>
                                        <Radio.Button value="1">电脑端</Radio.Button>
                                    </Space>
                                    
                                </Radio.Group>
                              
                            </Form.Item>
                        </Col>
                    </Row>}
                    {!isShow && <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="座机号码"
                                name="telephone" 
                                rules={[
                                    { max: 50,message:'最多输入50个字符'}
                                ]}
                            >
                                <Input disabled={isCat}/>
                            </Form.Item>
                        </Col>
                    </Row>}
                    {/* {!isCat&&
                    <Row className={styles.bt_group}>
                        <Space>
                            <Button  type="primary" htmlType="submit" loading={loading.global}>
                                保存
                            </Button>
                            <Button onClick={onCancel}>
                                取消
                            </Button>
                        </Space>
                    </Row>} */}
                </Form>
            </div>
            <div>
                    {/* <Spin spinning={loading.global}> */}
                        {/* <Department departmentClick={departmentClick} setValues={(value)=>{setFields(value)}} departmentModal={departmentModal} /> */}
                    {/* </Spin> */}
            </div>
        </div>
    </Modal>
    )
  }


  
export default (connect(({addUser,layoutG,loading})=>({
    ...addUser,
    ...layoutG,
    loading
  }))(addForm));
