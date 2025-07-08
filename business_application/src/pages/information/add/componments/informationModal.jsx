/**
 * @author gaoj
 * @description 资讯公告modal
 */

import { connect } from 'dva';
import { history } from 'umi';
import React, { useEffect, useState } from 'react';
import ReactQuill from '../../../../componments/public/ReactQuill';
import Wangeditor from '../../../../componments/public/Wangeditor';
import { PlusOutlined } from '@ant-design/icons';
import SparkMD5 from 'spark-md5';
import { v4 as uuidv4 } from 'uuid';
import {dataFormat} from '../../../../util/util'
import { Button, Form, Input, Upload, message, Image, Card, Radio } from 'antd';
import styles from './index.less';

import IUpload from '../../../../componments/Upload/uploadModal';

function Index({ dispatch, informationModal,location }) {
  console.log("testLocation",location)
  const [value, setNoticeText] = useState(''); //富文本描述
  const [radioValue,setRadioValue] = useState(1) // 单选默认选择为1
  const {
    informations,
    start,
    limit,
    listValue,
    typeId,
    buttonState,
    informationFileName,
    informationDesc,
    fileStorageId,
    informationTexts,
    fileUrl,
    addFileUrl,
    fileExists,
    fileName,
    fileSize,
    needfilepath,
    typeName,
    md5FileId,
    linkUrl,
    // md5FilePath
    getFileMD5Message,
  } = informationModal;

  // 添加外部咨询和内部链接
  const informationType = [
    {
      id: 1,
      value: '内部资讯'
    },
    {
      id: 2,
      value: '外部链接'
    }
  ]
  useEffect(()=>{
    dispatch({
      type: 'informationModal/updateStates',
      payload: {
        informationFileName: '',
        informationDesc: '',
        fileStorageId: '',
        informationTexts: '',
        needfilepath:'',
        fileUrl: '',
        fileUrlQull: '',
        urlQuillSwitch: false,
        linkUrl: ''
      },
    });
    return ()=>{
      dispatch({
        type: 'informationModal/updateStates',
        payload: {
          fileUrl: '',
          fileUrlQull: '',
          linkUrl: ''
        },
      });
    }
  },[])
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

  // useEffect(() => {
  //     if (buttonState == 2) {
  //         dispatch({
  //             type: 'informationModal/updateStates',
  //             payload: {
  //                 informationFileName: informations.informationFileName,
  //                 informationDesc: informations.informationDesc
  //             }
  //         });
  //     } else if (buttonState == 1) {
  //         dispatch({
  //             type: 'informationModal/updateStates',
  //             payload: {
  //                 informationFileName: '',
  //                 informationDesc: ''
  //             }
  //         });
  //     }
  // }, [buttonState])

  const gotoNotice = () => {
    // const search =
    //   history.location.search.includes('?') || !history.location.search
    //     ? history.location.search
    //     : `?${history.location.search}`;
    historyPush({
      pathname:"/information"
    },'/information/add')
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

  function saveFile() {
    console.log("value",value,"informationTexts",informationTexts)
     if (informationFileName == '') {
      message.warning('资讯标题不能为空');
      return false
    } 
    if(radioValue==1&&(value == ''||value=='<p><br></p>')) {
      message.warning('资讯正文不能为空');
      return false
    }
    if(radioValue == 2&&linkUrl==''){
      message.warning('外部链接不能为空')
      return false
    }
    if(radioValue == 1){
      richTextToMio(value)
    }else{
      saveFn('')
    }
    
  }
  // 保存函数
  const saveFn = (fileId)=>{
    dispatch({
      type: 'information/addInformation',
      payload: {
        informationFileName: informationFileName, //资讯文件标题
        isRelease: 0, //是否发布1是0否
        informationDesc: informationDesc, //资讯描述
        htmlFileStorageId:fileId||'',
        // informationText: value, //资讯正文
        fileStorageId: fileStorageId, //图片存储id
        isTop: 0, //是否置顶
        informationTypeId: typeId, //资讯分类id
        filePath: needfilepath,
        informationType: radioValue,
        linkUrl
      },
      callback: () => {
        getInformation();
        dispatch({
          type: 'informationModal/updateStates',
          payload: {
            informationFileName: '',
            informationDesc: '',
            fileStorageId: '',
            informationTexts: '',
            fileUrl: '',
            fileUrlQull: '',
            urlQuillSwitch: false,
            linkUrl: ''
          },
        }); 
        gotoNotice();
      },
    });
  }
  // 保存后上传minio
  const richTextToMio = (value,type) => {
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
          // setNoticeText(val);
          dispatch({
            type: 'informationModal/updateStates',
            payload: {
              htmlFileStorageId: fileId,
            },
          });
          if(fileId){
            if(type == 'publish'){
              saveAndIssueFn(fileId)
            }else{
              saveFn(fileId)
            }
          }
        },
      });
    };
  };

  function getTitle(e) {
    dispatch({
      type: 'informationModal/updateStates',
      payload: {
        informationFileName: e.target.value,
      },
    });
  }

  function getText(e) {
    dispatch({
      type: 'informationModal/updateStates',
      payload: {
        informationDesc: e.target.value,
      },
    });
  }
  // 保存并发布函数
  const saveAndIssueFn = (fileId)=>{
    dispatch({
      type: 'information/addInformation',
      payload: {
        informationFileName: informationFileName, //资讯文件标题
        isRelease: 0, //是否发布1是0否
        informationDesc: informationDesc, //资讯描述
        htmlFileStorageId:fileId||'',
        // informationText: value, //资讯正文
        fileStorageId: fileStorageId, //图片存储id
        isTop: 0, //是否置顶
        informationTypeId: typeId, //资讯分类id
        filePath: needfilepath,
        informationType: radioValue,
        linkUrl
      },
      callback: (informationIds) => {
        dispatch({
          type: 'information/updateInformationOperation',
          payload: {
            informationIds: informationIds,
            isRelease: 1,
          },
          callback: () => {
            getInformation();
            dispatch({
              type: 'informationModal/updateStates',
              payload: {
                informationFileName: '',
                informationDesc: '',
                fileStorageId: '',
                informationTexts: '',
                fileUrl: '',
                addFileUrl: '',
                fileUrlQull: '',
                urlQuillSwitch: false,
                linkUrl: ''
              },
            });
            gotoNotice();
          },
        });
      },
    });
  }

  function saveAndIssue() {
    if (informationFileName == '') {
      message.warning('资讯标题不能为空');
      return false
    } 
    if (radioValue==1&&(value == ''||value =='<p><br></p>')) {
      message.warning('资讯正文不能为空');
      return false      
    }
    if(radioValue == 2&&linkUrl==''){
      message.warning('外部链接不能为空')
      return false
    }  
    if(radioValue == 1){
      richTextToMio(value,'publish')
    } else{
      saveAndIssueFn('')//咨询类型为外部链接 不需要富文本编辑器 传值为空
    }
  }

  // function sureSave() {
  //     dispatch({
  //         type: 'information/updateInformation',
  //         payload: {
  //             informationId: informations.informationId,
  //             informationFileName: informationFileName,
  //             isRelease: informations.isRelease,
  //             loopPlayback: informations.loopPlayback,
  //             informationDesc: informationDesc,
  //             informationText: informationTexts,
  //             fileStorageId: fileStorageId,
  //             isTop: informations.isTop,
  //             informationTypeId: informations.informationTypeId,
  //             filePath: needfilepath
  //         },
  //         callback: () => {
  //             getInformation();
  //             dispatch({
  //                 type: 'informationModal/updateStates',
  //                 payload: {
  //                     informationFileName: '',
  //                     informationDesc: '',
  //                     fileStorageId: '',
  //                     informationTexts: '',
  //                     fileUrl: '',
  //                     fileUrlQull: '',
  //                     urlQuillSwitch: false
  //                 }
  //             });
  //             gotoNotice()
  //         }
  //     })
  // }

  const uploadButton = (
    <div className={styles.changeMan}>
      <p>上传图片</p>
      <p>图片建议尺寸：220×100</p>
    </div>
  );
   // 单选 
  const onRadioChange = e=>{
    setRadioValue(e.target.value)
  }
  // 获取外部链接
  const getInformationLinkUrl = e=>{
    dispatch({
      type: 'informationModal/updateStates',
      payload: {
        linkUrl: e.target.value
      }
    })
  }

  const onModalCancel = () => {
    //清除输入框内的所有内容
    dispatch({
      type: 'informationModal/updateStates',
      payload: {
        informationFileName: '',
        informationDesc: '',
        fileStorageId: '',
        informationTexts: '',
        fileUrl: '',
        fileUrlQull: '',
        urlQuillSwitch: false,
        linkUrl: ''
      },
    });
    historyPush({
      pathname:"/information"
    },'/information/add')
  };
  return (
    <div className="informationModal" style={{height:'100%'}}>
      <div className={styles.buttons}>
        <Button type="primary" className={styles.button_width} onClick={saveFile}>
          保存
        </Button>
        {/* <Button type="primary" onClick={saveAndIssue}>
          保存并发布
        </Button> */}

        {/* <Button type='primary' onClick={sureSave}>保存</Button>} */}
        <Button type="primary" className={styles.button_width} onClick={onModalCancel}>
          返回
        </Button>
      </div>
      <Form labelCol={{ span: 2 }} wrapperCol={{ span: 20 }} style={{height:'calc(100% - 42px)',overflow:'auto'}}>
        <div className={styles.imgUpload}>
          <div className={styles.inputs}>
            <div className={styles.input}>
              <p style={{ color: 'red', paddingTop: '10px' }}>*</p>
              <p style={{ paddingTop: '10px' }}>资讯标题</p>
              <Input
                onChange={getTitle}
                value={informationFileName}
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
                value={informationDesc}
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
                <Input placeholder='请输入http或https完整网址信息' style={{width: 672}} value={linkUrl} onChange={getInformationLinkUrl}/>
              </div>
            }
            
          </div>
          <div className={styles.imgPic}>
            <IUpload
              typeName={typeName}
              nameSpace="informationModal"
              location={location}
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
            <Wangeditor setNoticeText={setNoticeText} text={informationTexts} location={location}/>
          </div>
         }     
        
      </Form>
    </div>
  );
}

export default connect(({ informationModal,uploadfile }) => ({
  informationModal,
  uploadfile
}))(Index);
