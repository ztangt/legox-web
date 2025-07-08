/*
 * @Author: gaohy gaohy@suirui.com
 * @Date: 2022-06-24 10:14:52
 * @LastEditors: gaohy gaohy@suirui.com
 * @LastEditTime: 2022-06-29 10:12:36
 * @FilePath: \WPX\business_application\src\pages\information\modify\modify.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import ReactQuill from '../../../componments/public/ReactQuill';
import Wangeditor from '../../../componments/public/Wangeditor';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import SparkMD5 from 'spark-md5';
import { v4 as uuidv4 } from 'uuid';
import {dataFormat} from '../../../util/util'
import { Button, Form, Input, Upload, message, Image, Card,Radio } from 'antd';
import styles from './index.less';

import IUpload from '../../../componments/Upload/uploadModal';

function Modify({ dispatch, informationModal,location,history }) {
  const [value, setModifyText] = useState('');
  const [radioValue,setRadioValue] = useState(1);
  const [linkUrl,setLinkUrl] = useState('');

  const {
    informations,
    start,
    limit,
    listValue,
    typeId,
    buttonState,
    fileStorageId,
    fileUrl,
    fileExists,
    fileName,
    fileSize,
    needfilepath,
    typeName,
    md5FileId,
    getFileMD5Message,
    modifyInformationTitle,
    modifyInformationDescription,
    modifyInformationTexts,
    informationLink,
    informationOldText,
  } = informationModal;
  // 添加外部咨询和内部链接
  const informationType = [
    {
      id: 1,
      value: '内部咨讯'
    },
    {
      id: 2,
      value: '外部链接'
    }
  ]  
  
  useEffect(() => {
    // 如果文件存在于minio
    if (fileExists) {
      dispatch({
        type: 'informationModal/getDownFileUrl',
        payload: {
          fileStorageId: md5FileId,
        },
        callback: () => {
          dispatch({
            type: 'informationModal/updateStates',
            payload: {
              fileExists: '',
              fileStorageId: md5FileId,
            },
          });
        },
      });
    } else if (fileExists === false) {
      // 如果文件不存在于minio
      dispatch({
        type: 'informationModal/getDownFileUrl',
        payload: {
          fileStorageId: fileStorageId,
        },
        callback: () => {
          dispatch({
            type: 'informationModal/updateStates',
            payload: {
              fileExists: '',
              fileStorageId: fileStorageId,
            },
          });
        },
      });
    }
  }, [fileExists]);
  useEffect(() => {
    dispatch({
      type: 'informationModal/updateStates',
      payload: {
        modifyInformationTitle: informations.informationFileName,
        modifyInformationDescription: informations.informationDesc,
        needfilepath: informations.filePath
      },
    });
  }, [buttonState]);
  useEffect(()=>{
    setModifyText(modifyInformationTexts)
    setRadioValue(informations.informationType)
    setLinkUrl(informations.linkUrl)
    if(informationLink){
      getHtmlContent()
    }
  },[informationLink])
 
  // 获取富文本内容
  const getHtmlContent = async()=>{
    const regex = /^(http|https):\/\/[^ "]+$/;
    // http://10.8.12.151:9001/1557204233395175426/noticePage/2024-05-07/fedc43fe-a2a3-4cb2-9d2e-3ab58ae7f41d.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin%2F20240507%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240507T060323Z&X-Amz-Expires=1800&X-Amz-SignedHeaders=host&X-Amz-Signature=47304e618d97d85364adc44b46a0687c1aa47b46f6b3be5818aa80474af10d11
    const htmlLink = regex.test(informationLink)
    if(htmlLink){
      const res =  await axios.get(informationLink)
      if (res.status == 200) {
        setModifyText(res.data.value)
        dispatch({
          type: 'informationModal/updateStates',
          payload: {
            modifyInformationTexts: res.data.value
          }
        })
      }
    }
  }

  const gotoNotice = () => {
    // const search =
    //   history.location.search.includes('?') || !history.location.search
    //     ? history.location.search
    //     : `?${history.location.search}`;
    historyPush({
      pathname:"/information"
    },'/information/modify')
    // setTimeout(() => {
    //   dropScope(`${location.pathname}${search}`);
    // }, 500);
  };
  function getInformation() {
    dispatch({
      type: 'information/getInformation',
      payload: {
        informationTypeId: typeId,
        informationFileName: listValue,
        start: start,
        limit: limit,
        isOwn: true,
      },
    });
  }
  //radio单选
  const onRadioChange = e=>{
    setRadioValue(e.target.value)
  }
  const getInformationLinkUrl = e=>{
    setLinkUrl(e.target.value)
  }

  function getTitle(e) {
    dispatch({
      type: 'informationModal/updateStates',
      payload: {
        modifyInformationTitle: e.target.value,
      },
    });
  }

  function getText(e) {
    dispatch({
      type: 'informationModal/updateStates',
      payload: {
        modifyInformationDescription: e.target.value,
      },
    });
  }
  const richTextToMio = (value) => {
    // 字符内容转blod再转file
    const data = JSON.stringify({ value }, undefined, 4);
    const blob = new Blob([data], { type: 'text/json' });
    const file = new File([blob], uuidv4(), { type: 'text/plain' });

    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) => {
      const richTextMD5 = SparkMD5.hashBinary(e.target.result);
      dispatch({
        type: 'informationModal/updateStates',
        payload: {
          isFu: true,
          fileChunkedList: [file],
          md5: richTextMD5,
          fileName: `${file.name}.json`,
          fileSize: file.size,
        },
      });
      // 上传mio
      dispatch({
        type: 'uploadfile/getFileMD5',
        payload: {
          namespace: 'informationModal',
          isPresigned: 1,
          fileEncryption: richTextMD5,
          filePath: `informationModal/${dataFormat(
            String(new Date().getTime()).slice(0, 10),
            'YYYY-MM-DD',
          )}/${file.name}.json`,
        },
        hisLocation: location,
        uploadSuccess: (val, fileId) => {
          dispatch({
            type: 'informationModal/updateStates',
            payload: {
              htmlFileStorageId: fileId,
            },
          });
          if(fileId){
            saveFn(fileId)
          }
        },
      });
    };
  };

  // 保存函数
  const saveFn = (fileId)=>{
    dispatch({
      type: 'information/updateInformation',
      payload: {
        informationId: informations.informationId,
        informationFileName: modifyInformationTitle,
        isRelease: informations.isRelease,
        loopPlayback: informations.loopPlayback,
        informationDesc: modifyInformationDescription,
        // informationText: value,
        htmlFileStorageId:fileId||'',
        informationType: radioValue,
        fileStorageId: fileStorageId,
        isTop: informations.isTop,
        informationTypeId: informations.informationTypeId,
        filePath: needfilepath,
        linkUrl,
      },
      callback: () => {
        getInformation();
        dispatch({
          type: 'informationModal/updateStates',
          payload: {
            modifyInformationTitle: '',
            modifyInformationDescription: '',
            fileStorageId: '',
            modifyInformationTexts: '',
            fileUrl: '',
            fileUrlQull: '',
            urlQuillSwitch: false,
          },
        });
        gotoNotice();
      },
    });
  }

  function sureSave() {
    if(!radioValue){
      message.warning('咨询类型不能为空')
      return
    }
    if(!modifyInformationTitle){
      message.warning('资讯标题不能为空')
      return
    }
    if(radioValue == 1&&(value=='<p><br></p>'||!value)){
      message.warning('资讯正文不能为空');
      return
    }
    if(radioValue == 2&&linkUrl==''){
      message.warning('外部链接不能为空');
      return 
    }
      if(radioValue == 1){
        richTextToMio(value)
      }else{
        saveFn('')
      }

  }

  const uploadButton = (
    <div className={styles.changeMan}>
      <p>上传图片</p>
      <p>图片建议尺寸：220×100</p>
    </div>
  );

  const onModalCancel = () => {
    //清除输入框内的所有内容
    // const search =
    //   history.location.search.includes('?') || !history.location.search
    //     ? history.location.search
    //     : `?${history.location.search}`;
    dispatch({
      type: 'informationModal/updateStates',
      payload: {
        modifyInformationTitle: '',
        modifyInformationDescription: '',
        fileStorageId: '',
        modifyInformationTexts: '',
        fileUrl: '',
        fileUrlQull: '',
        urlQuillSwitch: false,
        linkUrl: '',
      },
    });
    // historyPush('/information');
    historyPush({
      pathname:"/information"
    },'/information/modify')
    // setTimeout(() => {
    //   dropScope(`${location.pathname}${search}`);
    // }, 500);
  };
  // console.log(informationOldText,"modifyInformationTexts",modifyInformationTexts,informations)
  console.log("fileUrl112",fileUrl)
  return (
    <div className="informationModal" style={{height:'100%'}}>
      <div className={styles.buttons}>
        {/* {buttonState == 1 ? <Button type="primary" onClick={saveFile}>保存</Button> : ''}
                     {buttonState == 1 ? <Button type="primary" onClick={saveAndIssue}>保存并发布</Button> */}
        <Button type="primary" onClick={sureSave}>
          保存
        </Button>
        <Button type="primary" onClick={onModalCancel}>
          返回
        </Button>
      </div>
      <Form labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}style={{height:'calc(100% - 42px)',overflow:'auto'}}>
        <div className={styles.imgUpload}>
          <div className={styles.inputs}>
            <div className={styles.input}>
              <p style={{ color: 'red', paddingTop: '10px' }}>*</p>
              <p style={{ paddingTop: '10px' }}>资讯标题</p>
              <Input
                onChange={getTitle}
                value={modifyInformationTitle}
                maxLength={60}
              />
            </div>
            <div className={styles.input}>
              {/* <p style={{ color: 'red', paddingTop: '10px' }}>*</p> */}
              <p style={{ paddingTop: '10px', paddingLeft: '6px' }}>
                资讯描述
              </p>
              <Input
                onChange={getText}
                value={modifyInformationDescription}
                maxLength={60}
              />
            </div>
            <div className={styles.information_type}>
              <p>资讯类型</p>
              <Radio.Group onChange={onRadioChange} value={radioValue}>
                  {
                    informationType.map(item=>(
                      <Radio key={item.id} value={item.id}>{item.value}</Radio>
                    ))
                  }
              </Radio.Group>
            </div>
            {
              radioValue==2&&<div className={styles.input}>
              <p style={{ color: 'red', paddingTop: '10px' }}>*</p>
              <p style={{ paddingTop: '10px' }}>资讯跳转链接</p>
              <Input placeholder='请输入http或https完整网址信息' style={{width: 672}} onChange={getInformationLinkUrl} value={linkUrl}/>
            </div>
            }
          </div>
          <div className={styles.imgPic}>
            <IUpload
              location={location}
              typeName={typeName}
              nameSpace="informationModal"
              requireFileSize={5}
              mustFileType={
                'bmp,jpg,png,tif,gif,pcx,tga,exif,fpx,svg,psd,cdr,pcd,dxf,ufo,eps,ai,raw,WMF,webp,avif,apng'
              }
              buttonContent={
                fileUrl ? (
                  <Image
                    width={220}
                    height={100}
                    preview={false}
                    src={fileUrl}
                    alt="avatar"
                    style={{
                      borderRadius:'4px'
                    }}
                  />
                ) : (
                  uploadButton
                )
              }
            />
          </div>
        </div>
        {
           radioValue==1&&<div style={{ margin: '10px auto' }}>
           <div style={{ display: 'flex',paddingLeft:8 }}>
             <p style={{ color: 'red' }}>*</p>
             <p>资讯正文</p>
           </div>
           <Wangeditor
             setNoticeText={setModifyText}
             text={modifyInformationTexts||informationOldText}
             location={location}
           />
         </div>
        }      
      </Form>
    </div>
  );
}

export default connect(({ informationModal,uploadfile }) => ({
  informationModal,
  uploadfile,
}))(Modify);
