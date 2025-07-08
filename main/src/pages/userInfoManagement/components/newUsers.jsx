import React, { useState,useRef,useEffect } from 'react';
import { connect } from 'dva';
import styles from './newUsers.less';
import moment from 'moment';
import Department from './department'  //所属部门
import { history } from 'umi'
import pinyinUtil from '../../../service/pinyinUtil';
import IUpload from '../../../componments/Upload/uploadModal';

import { Button, Space, Upload,Avatar ,message,Row, Col,Input ,Switch,Select,DatePicker,Form,Radio,Modal,Spin} from 'antd';
import { LoadingOutlined, PlusOutlined,FormOutlined,PlusSquareOutlined,MinusSquareOutlined} from '@ant-design/icons';
import { sm2 } from 'sm-crypto';
import GlobalModal from '../../../componments/GlobalModal';


const servicePublicKey =
  '0416e39a2a5023e90a4f8d0c663b7f9e21bcd430c122e767150b201dd5935d8953a08227be68de4a04c46d46c6b2644d3042889404a7dcda92c7f211ee29f20c8e';
function newUsers ({dispatch,handleEditOkClick,currentUg,currentNodeId,loading,onCancel,setValues,layoutG,doImgUploader,signDoImgUploader,imageUrl,signImageUrl,currentNode,posts,onSave,minioTurePicture, minioTureSignature, minioFalsePicture, minioFalseSignature, fileExists,uploadType,getFileMD5Message,fileStorageId,md5FileId,md5FilePath,picUrl,needfilepath,viewModal,sexData}){
    const [form,UploadForm,signUploadForm] = Form.useForm();
    const [imageLoading, setImageLoading] = useState(false);
    const [userIds, setUserIds] = useState('');
    const [postId, setPostId] = useState('');
    const [signImageLoading, setSignImageLoading] = useState(false);
    const layout =  {labelCol: { span: 8 },wrapperCol: { span: 16 },colon:false};
    const [isShow,setIsShow] = useState(true);
     //departmentModal 所属部门modal 初始化状态 false  （测试）
    const [departmentModal, setDepartmentModal] = useState(false);
    const { searchObj } = layoutG;
    const { echoFormData } = searchObj['/passwordMg'];
    const [fields, setFields] = useState([
        {
            name: ['deptName'],
            value: currentUg.deptName,
        },
        // {
        //     name: ['isEnable'],
        //     value: true,
        // },
        {
            name:['userShortName'],
            value:currentUg.userShortName,
        }
      ]);
    useEffect(()=>{
        dispatch({
            type: `userInfoManagement/getDictType`,
            payload: {
              dictTypeCode: 'XB',
              showType: 'ALL',
              isTree: '1',
              searchWord: '',
            },
          });
        if(currentUg.postId){
            form.setFieldsValue({
                postId: currentUg.postName,
            });
        }
        // form.setFieldsValue({
        //     deptName:
        // })
        if(!currentUg.id){
            dispatch({
                type: 'userInfoManagement/updateStates',
                payload: {
                    picUrl:{}
                }
            })
        }
           
    },[])
    // useEffect(() => {
    //     if (fileExists) {
    //       form.setFields([
    //         {
    //           name: 'picture',
    //           value: minioTurePicture
    //         },
    //         {
    //           name: 'gifPicture',
    //           value: minioTureSignature
    //         }
    //       ])
    //     } else if (fileExists === false) {
    //       form.setFields([
    //         {
    //           name: 'picture',
    //           value: minioFalsePicture
    //         },
    //         {
    //           name: 'gifPicture',
    //           value: minioFalseSignature
    //         }
    //       ])
    //     }
    //   }, [minioTurePicture, minioTureSignature, minioFalsePicture, minioFalseSignature, fileExists])
      useEffect(() => {
        // 如果文件存在于minio
        if (fileExists) {
          if (uploadType=='picture') {
            console.log('头像存在');
            dispatch({
              type: 'userInfoManagement/getPictureDownFileUrl',
              payload: {
                fileStorageId: md5FileId
              },
              callback: () => {
                dispatch({
                  type: 'userInfoManagement/updateStates',
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
              type: 'userInfoManagement/getSignatureDownFileUrl',
              payload: {
                fileStorageId: md5FileId
              },
              callback: () => {
                dispatch({
                  type: 'userInfoManagement/updateStates',
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
              type: 'userInfoManagement/getPictureDownFileUrl',
              payload: {
                fileStorageId: fileStorageId
              },
              callback: () => {
                dispatch({
                  type: 'userInfoManagement/updateStates',
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
              type: 'userInfoManagement/getSignatureDownFileUrl',
              payload: {
                fileStorageId: fileStorageId
              },
              callback: () => {
                dispatch({
                  type: 'userInfoManagement/updateStates',
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
    function isJoin(e){
        dispatch({
            type:"userInfoManagement/getUserInfo",
            payload:{
                userAccount:userAccount.value,
                orgCenterId:''
            },
            callback: function(data) {
                setUserIds(data.userId);
                if(data.accountExist == true) {
                    Modal.warning({
                    title: '曾创建过相同的账号，基础资料将自动带入',
                    okText: '确认',
                    mask: false,
                    maskClosable:false,
                    getContainer:() =>{
                        return document.getElementById('userInfo_container');
                    },
                    onOk() {
                        data.userPassword = echoFormData.password
                        ? echoFormData.password
                        : '123456';
                        data.orgName = currentUg.orgName;
                        data.deptName = currentUg.deptName;
                        data.postName = currentUg.postName;
                        form.setFieldsValue({
                            ...data
                        });
                     }
                    });
                }
            }
        })
    }
    
    //输入完姓名后失焦事件
    function nameCallback(e){
        let name = `${pinyinUtil.getPinyin(e.target.value, '', false)},${pinyinUtil.getFirstLetter(e.target.value).toLowerCase()}`
        currentUg['userShortName'] = name;

        form.setFieldsValue({
            userShortName: name,
        });
    }
    //输入证件号码时先判断有无选择证件类型
    function idCallback(e){
        if(!currentUg.idenType){
            message.warning('请选择证件类型');
        }
    }
    //点击新增页面 所属部门input方法
    function departmentModalFn(){
        if(!currentUg.id){
            setDepartmentModal(true)
            // dispatch({
            //     type: 'tree/getOrgChildren',
            //     payload:{
            //         nodeId: currentNode.parentId=='0'?currentNode.id:currentNode.parentId,
            //         nodeType: 'DEPT',
            //         onlySubDept: 1,
            //         start:1,
            //         limit:200
            //     },
            //     pathname: history.location.pathname,
            // })
            dispatch({
                type: 'tree/getOrgTree',
                payload:{
                    parentId:currentNode.parentId=='0'?currentNode.id:currentNode.parentId,
                    orgKind:'DEPT',
                    searchWord:'',
                    onlySubDept:1
                },
                pathname: history.location.pathname,
            })
        }
    }
    //点击所属部门弹框确定按钮 关闭按钮 departmentModal false
    function departmentClick(){
        dispatch({
            type: 'tree/updateStates',
            payload:{
                deptData: [],
                expandedDeptKeys: []
            }
        })
        dispatch({
            type:'userInfoManagement/updateStates',
            payload:{
              deptSearchWord:''
            }
        })
        
        setDepartmentModal(false);
    }
    //新增页面点击保存触发 onFinish事件
    function onFinish(values){
        values['isEnable'] = currentUg.id?values.isEnable:'1';//是否启用
        values['isAppEnable'] = values.isAppEnable?'1':'0';//是否移动端登录
        values['birthday'] = values.birthday?values.birthday.format('X'):null//生日   
        values['pwdExprTime'] = values.pwdExprTime?values.pwdExprTime.format('X'):null //密码到期时间 
        values['workTime'] = values.workTime?values.workTime.format('X'):null  //参加工作时间
        values['entryTime'] = values.entryTime?values.entryTime.format('X'):null   //入党时间
        values['joinTime'] = values.joinTime?values.joinTime.format('X'):null   //调入时间
        values['orgId'] = currentUg.orgId //所属单位id
        values['deptId'] = currentUg.deptId //所属部门id
        values['picturePath'] = picUrl.picture?picUrl.picture:currentUg.pictureOriginalPath, //头像id
        values['signaturePath'] = picUrl.signature?picUrl.signature:currentUg.signatureOriginaPath//手写签批id
        if(values['orgName']){
            let arr = values['orgName'].split("-");
            values['orgName'] = arr[arr.length -1]
        }
        if(values['deptName']){
            let arr = values['deptName'].split("-");
            values['deptName'] = arr[arr.length -1]
        }
        if(currentUg.postId){
            values['postId'] = currentUg.postId
        }
        Object.keys(values).forEach(function(key) {
            if(key!='isEnable'&&
               values[key]){
                values[key] = values[key].trim()
            }
        })
        if(currentUg.id){
            delete values.userPassword
        }else{
            values['userPassword'] = '04'+sm2.doEncrypt(values.userPassword,servicePublicKey)
        }

        handleEditOkClick(values, userIds, currentNode.id, postId);
    }

    //
    function onValuesChange(values){
        dispatch({
            type: 'userInfoManagement/updateStates',
            payload:{
                currentUg:{...currentUg,...values}
            }
        })
    }
    // function getBase64(img, callback) {
    //     const reader = new FileReader();
    //     reader.addEventListener('load', () => callback(reader.result));
    //     reader.readAsDataURL(img);
    // }
    const uploadButton = (
        <div>
          {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>上传头像</div>
        </div>
    );
    function beforeUpload(file) {
        // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        // if (!isJpgOrPng) {
        //   message.error('上传的图片不是JPG/PNG格式');
        // }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('I上传的图片不能大于2MB!');
        }
        return isLt2M;
        // return isJpgOrPng && isLt2M;
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
    // const uploadFormData = new FormData(UploadForm);
    // const signUploadFormData = new FormData(signUploadForm)
    //上传头像
    function doImgUpload(options){
        const { onSuccess, onError, file, onProgress } = options;
        const reader = new FileReader();
        reader.readAsDataURL(file); // 读取图片文件
        reader.onload = (file) => {
            dispatch({
                type: 'userInfoManagement/updateStates',
                payload:{
                    imageUrl:file.target.result
                }
            })
            setImageLoading(false)
        };
        uploadFormData.append('fileType','PERSONAL_PHOTO')
        uploadFormData.append('file',file);
        dispatch({
            type: 'userInfoManagement/doImgUploader',
            payload:uploadFormData,
            callback:function(dataId){
                doImgUploader = dataId;
                dispatch({
                    type: 'userInfoManagement/updateStates',
                    payload:{
                        doImgUploader,
                    }
                })
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
                type: 'userInfoManagement/updateStates',
                payload:{
                    signImageUrl:file.target.result
                }
            })
            setSignImageLoading(false)
        };
        signUploadFormData.append('fileType','PERSONAL_SIGNATURE')
        signUploadFormData.append('file',file)
        dispatch({
            type: 'userInfoManagement/doImgUploader',
            payload:signUploadFormData,
            callback:function(dataId){
                signDoImgUploader = dataId;
                dispatch({
                    type: 'userInfoManagement/updateStates',
                    payload:{
                        signDoImgUploader,
                    }
                })
            }
        }) 
    };
    const signUploadButton = (
        <div>
          {signImageLoading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>上传签名</div>
        </div>
    );

    //密码失效时间
    function disabledDate(current) {
        return current && current < moment().endOf('day')
    }
    

    function signBeforeUpload(file) {
        // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        // if (!isJpgOrPng) {
        //   message.error('上传的图片不是JPG/PNG格式');
        // }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('I上传的图片不能大于2MB!');
        }
        // return isJpgOrPng && isLt2M;
        return isLt2M;
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
    function isShowFn(text){
        if(text == '展开'){
            setIsShow(false)
        }else{
            setIsShow(true)
        }
    }
    function onChange(date, dateString) {
        console.log(date, dateString);
      }
    function onChangePost(value) {
        setPostId(value);
    }
    return (
        <GlobalModal
        title={viewModal?'查看用户':currentUg.id ? '修改用户' : '新增用户'}
        visible={true}
        onCancel={() => {
          dispatch({
            type: 'userInfoManagement/updateStates',
            payload: {
              addModal: false,
            },
          });
        }}
        // width={900}
        widthType={2}
        incomingHeight={400}
        incomingWidth={900}
        mask={false}
        maskClosable={false}
        className={styles.add_form}
        // bodyStyle={{ overflow: 'auto'}}
        centered
        footer={!viewModal&&[
            <Button onClick={onCancel}>
            取消
            </Button>,
            <Button  type="primary" htmlType="submit" loading={loading.global} onClick={()=>{form.submit()}}>
            保存
            </Button>
        ]}
        getContainer={() => {
          return document.getElementById('userInfo_container');
        }}
      >
        <div className={styles.wrap}>
            {!viewModal?<div className={`${styles.top} ${styles.displayFlex}`}>
                <div className={styles.displayFlex}>
                        <IUpload
                            name="avatar"
                            typeName='picture'
                            nameSpace='userInfoManagement'
                            className={styles.avatarUploader}
                            requireFileSize={2}
                            uploadSuccess={(filePath)=>{
                                console.log(filePath,'filePath---');
                                picUrl['picture'] = filePath
                                dispatch({
                                    type: 'userInfoManagement/updateStates',
                                    payload: {
                                        picUrl,
                                        uploadType:'picture'
                                    }
                                })
                            }}
                            buttonContent={
                                <>
                                  {picUrl.pictureUrl ? <img src={picUrl.pictureUrl} alt="avatar" style={{ width: '300px',height:'150px' }} /> : uploadButton}
                                </>
                              }
                        />
                </div>
                <div className={styles.displayFlex}>
                        <IUpload
                            name="avatar"
                            typeName='signature'
                            nameSpace='userInfoManagement'
                            className={styles.signAvatarUploader}
                            requireFileSize={2}
                            uploadSuccess={(filePath)=>{
                                picUrl['signature'] = filePath
                                dispatch({
                                type: 'userInfoManagement/updateStates',
                                payload: {
                                    picUrl,
                                    uploadType:'signature'
                                }
                                })
                            }}
                            buttonContent={
                                <>
                                  {picUrl.signatureUrl ? <img src={picUrl.signatureUrl} alt="signAvatar" style={{ width: '300px',height:'150px' }} /> : signUploadButton}
                                </>
                              }
                        />
                </div>
            </div>:
            <div className={styles.top_content}>
               <div className={styles.img}>
                   <img src={currentUg&&currentUg.picturePath? currentUg.picturePath : require('../../../../public/assets/signImageUrl.png')}  alt="头像"/>
                </div>
               <div className={styles.sign}>
                   {currentUg&&currentUg.signaturePath ? <img src={currentUg.signaturePath}  alt="签名"/> : <div style={{lineHeight:'100px',textAlign:'center'}}>未上传签名</div>}
                </div>
           </div>}
            <div>
                <Form form={form} initialValues={currentUg}  fields={fields} onFinish={onFinish} onValuesChange={onValuesChange}>
                    <p className={styles.modalItemTitle}>基础信息</p>
                    <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                // labelCol={{ span: 4 }}
                                // wrapperCol={{ span: 20 }}
                                {...layout}
                                label="所属单位"
                                name="orgName" 
                                rules={[
                                    { required: true,message:'请输入所属单位' },
                                ]}
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                // labelCol={{ span: 4 }}
                                // wrapperCol={{ span: 20 }}
                                {...layout}
                                label="所属部门"
                                name="deptName" 
                            >
                                <Select
                                    disabled={currentUg.id? true:false}
                                    onClick={departmentModalFn}
                                    autoComplete="off"
                                    open={false}
                                    showArrow={false}
                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                    >
                                    <Select.Option value="0"></Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
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
                                <Input disabled={currentUg.id? true:false} onBlur={(e)=>{isJoin(e)}}/>
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
                                <Input.Password placeholder={currentUg.id? "******":''}   disabled={currentUg.id? true:false}/>
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
                                <Input onBlur={(e)=>{nameCallback(e)}} disabled={viewModal}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="所属岗位"
                                name="postId" 
                            >

                                <Select  getPopupContainer={triggerNode => triggerNode.parentNode} onChange={onChangePost} disabled={viewModal}>
                                    {
                                        posts.map((item,index)=> <Select.Option value={item.value} key={index}>{item.name.split('-')[1]}</Select.Option>)
                                    }

                                </Select>
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
                                <Input disabled={viewModal}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {/* <Form.Item 
                                label="账号状态"
                                {...layout}
                                name="isEnable" 
                                valuePropName={currentUg.isEnable==true || !currentUg.id?'checked':''}
                            >
                                <Switch />
                            </Form.Item> */}
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
                                <Switch disabled={viewModal}/>
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
                                <Select getPopupContainer={triggerNode => triggerNode.parentNode} defaultValue='0' disabled={viewModal}>
                                    <Select.Option value="1">用户</Select.Option>
                                    <Select.Option value="2">用户&管理员</Select.Option>
                                    <Select.Option value="8">管理员</Select.Option>
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
                                <Select defaultValue="0" getPopupContainer={triggerNode => triggerNode.parentNode} disabled={viewModal}>
                                <Select.Option value="0">请选择</Select.Option>
                                    {
                                        sexData.map((item)=>{
                                            return <Select.Option value={item.dictInfoCode}>{item.dictInfoName}</Select.Option>
                                        })
                                    }
                                    {/* <Select.Option value="0">请选择</Select.Option>
                                    <Select.Option value="1">男</Select.Option>
                                    <Select.Option value="2">女</Select.Option> */}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="出生日期"
                                name="birthday" 
                            >
                                <DatePicker onChange={onChange} getPopupContainer={triggerNode => triggerNode.parentNode} disabled={viewModal}/>
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
                                <Select defaultValue="0" getPopupContainer={triggerNode => triggerNode.parentNode} disabled={viewModal}>
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
                                <Input onFocus={(e)=>{idCallback(e)}} disabled={viewModal}/>
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
                                <Select defaultValue="0" getPopupContainer={triggerNode => triggerNode.parentNode} disabled={viewModal}>
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
                                <Select defaultValue="0" getPopupContainer={triggerNode => triggerNode.parentNode} disabled={viewModal}>
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
                                <Select defaultValue="0" getPopupContainer={triggerNode => triggerNode.parentNode} disabled={viewModal}>
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
                                <Input disabled={viewModal}/>
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
                                <Input disabled={viewModal}/>
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
                            <Input disabled={viewModal}/>
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
                                <Select defaultValue="0" disabled={viewModal}>
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
                                <DatePicker getPopupContainer={triggerNode => triggerNode.parentNode} disabled={viewModal}/>
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
                                <Input disabled={viewModal}/>
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
                                <Input disabled={viewModal}/>
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
                                        pattern: /^(?:0|[1-9]\d?)$/,
                                        message: '请输入0-99之间的正整数',
                                    },
                                    { max: 50,message:'最多输入50个字符'}
                                ]}
                            >
                                <Input disabled={viewModal}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="调入时间"
                                name="entryTime" 
                            >
                                <DatePicker getPopupContainer={triggerNode => triggerNode.parentNode} disabled={viewModal}/>
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
                                <DatePicker  getPopupContainer={triggerNode => triggerNode.parentNode} disabled={viewModal}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="清除mac地址"
                                name="clearMacAddress" 
                            >   
                                <Radio.Group disabled={viewModal}>
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
                                <Input disabled={viewModal}/>
                            </Form.Item>
                        </Col>
                    </Row>}
                    {/* <Row className={styles.bt_group}>
                        <Space>
                            <Button  type="primary" htmlType="submit">
                                保存
                            </Button>
                            <Button onClick={onCancel}>
                                取消
                            </Button>
                        </Space>
                    </Row> */}
                </Form>
            </div>
            <div>
                    {/* <Spin spinning={loading.global}> */}
                        <Department departmentClick={departmentClick} setValues={(value)=>{setFields(value)}} departmentModal={departmentModal} />
                    {/* </Spin> */}
            </div>
        </div>
        </GlobalModal>
    )
}
export default connect(({userInfoManagement,tree,loading,layoutG})=>({
    ...userInfoManagement,
    ...tree,
    loading,
    layoutG
  }))(newUsers);

