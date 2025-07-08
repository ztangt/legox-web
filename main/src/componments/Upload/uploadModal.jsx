/**
 * @author gaoj
 * @description上传功能
 * 文件的分片上传
 * 请在相关的model内定义以下变量
 * uploadFlag:true, //上传暂停器
 * nowMessage:'', //提示上传进度的信息
 * md5:'', //文件的md5值，用来和minio文件进行比较
 * fileChunkedList:[], //文件分片完成之后的数组
 * fileName:'', //文件名字
 * fileNames:'',  //文件前半部分名字
 * fileStorageId:'', //存储文件信息到数据库接口返回的id
 * typeNames:'', //文件后缀名
 * optionFile:{}, //文件信息
 * fileSize:'', //文件大小，单位是字节
 * getFileMD5Message:{}, //md5返回的文件信息
 * success:'', //判断上传路径是否存在
 * v:1, //计数器
 * needfilepath:'', //需要的minio路径
 * isStop:true,  //暂停按钮的禁用
 * isContinue:false, //继续按钮的禁用
 * isCancel:false, //取消按钮的禁用
 * index:0, //fileChunkedList的下标，可用于计算上传进度
 * merageFilepath:'',  //合并后的文件路径
 * typeName:'', //层级
 * fileExists:'', //判断文件是否存在于minio服务器中，相关modal中监听判断fileExists状态进行后续分别操作
 * md5FileId:'', //md5查询到的文件返回的id
 * md5FilePath:'', //md5查询到的文件返回的pathname
 */
import { dataFormat } from '../../util/util';
import { CHUNK_SIZE } from '../../service/constant';
import { history } from 'umi';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Upload, Button, message } from 'antd';
import SparkMD5 from 'spark-md5';

function Index({
  dispatch,
  nameSpace,
  disabled,
  typeName,
  fileName,
  name,
  styles,
  showUploadList,
  type,
  requireFileSize,
  banFileType,
  mustFileType,
  buttonContent,
  beforeCondition,
  beforeConditionMessage,
  uploadSuccess,
  onChange,
}) {
  const beforeUpload = file => {
    // if (!beforeCondition) {
    //   message.error(beforeConditionMessage);
    //   return;
    // }

    const fileReader = new FileReader();
    const fileTypeName = file.name.split('.')[1];
    const fileSize = file.size;
    const isRealSize = file.size / 1024 / 1024 <= requireFileSize;
    const notations = file.name.split('.');

    let notBanFileType = false;
    let allowFileType = false;
    if (!mustFileType.split(',').includes(fileTypeName)) {
      allowFileType = true;
    }
    if (!mustFileType) {
      allowFileType = false;
    }

    if (banFileType.split(',').includes(fileTypeName)) {
      notBanFileType = true;
    }

    if (allowFileType) {
      message.error(`仅支持上传${mustFileType}格式!`);
    } else if (notBanFileType) {
      message.error(`上传的文件不允许是${fileTypeName}格式!`);
    } else if (!isRealSize) {
      message.error(
        `上传的文件不能大于${
          requireFileSize >= 1024
            ? (requireFileSize / 1024).toFixed(0) + 'GB!'
            : requireFileSize + 'MB!'
        }`,
      );
    } else if (notations.length > 2) {
      message.error('上传的文件命名不规范!');
    } else {
      dispatch({
        type: nameSpace == 'applyModelConfig'
        ? `${nameSpace}/updateStatesGlobal`
        : `${nameSpace}/updateStates`,
        payload: {
          uploadFlag: true,
          isUploading: true,
          nowMessage: '正在计算文件MD5...',
        },
      });

      fileReader.readAsBinaryString(file);
      fileReader.onload = e => {
        const md5 = SparkMD5.hashBinary(e.target.result);
        if (md5.length != 0) {
          dispatch({
            type: nameSpace == 'applyModelConfig'
            ? `${nameSpace}/updateStatesGlobal`
            : `${nameSpace}/updateStates`,
            payload: {
              md5: md5,
              fileExists: '',
            },
          });
          dispatch({
            type: 'uploadfile/getFileMD5',
            payload: {
              namespace: nameSpace,
              isPresigned: fileSize < CHUNK_SIZE ? 1 : 0,
              fileEncryption: md5,
              filePath:`${history.location.pathname.includes('userInfoManagement')?'personInfo':nameSpace=='moduleResourceMg'?'moduleResourceMg':history.location.pathname.slice(1)}/${dataFormat(
                String(new Date().getTime()).slice(0, 10),
                'YYYY-MM-DD',
              )}${typeName == '' ? '' : '/' + typeName}/${file.name}`,
            },
            uploadSuccess: uploadSuccess && uploadSuccess,
          });
        }
      };
    }
  };

  const doUpload = options => {
    const fileName = options.file.name;
    const fileNames = options.file.name.split('.')[0];
    const typeNames = options.file.name.split('.')[1];
    const optionFile = options.file;
    const fileSize = options.file.size;
    let newArr = [];
    // 文件分片
    for (let i = 0; i < optionFile.size; i = i + CHUNK_SIZE) {
      const tmp = optionFile.slice(
        i,
        Math.min(i + CHUNK_SIZE, optionFile.size),
      );
      newArr.push(tmp);
    }
    onChange &&
      onChange({
        fileChunkedList: newArr,
        fileName: fileName,
        fileNames: fileNames,
        typeNames: typeNames,
        optionFile: optionFile,
        fileSize: fileSize,
      });
    dispatch({
      //updateStatesGlobal
      type: nameSpace == 'applyModelConfig'
      ? `${nameSpace}/updateStatesGlobal`
      : `${nameSpace}/updateStates`,
      payload: {
        index:0,
        fileChunkedList: newArr,
        fileName: fileName,
        fileNames: fileNames,
        typeNames: typeNames,
        optionFile: optionFile,
        fileSize: fileSize
      },
    });
  };

  return (
    <>
      <Upload
        style={styles}
        name={name}
        disabled={disabled}
        showUploadList={showUploadList}
        beforeUpload={beforeUpload}
        customRequest={doUpload}
        maxCount={1}
      >
        {buttonContent == '' ? (
          <Button type={type}>选择文件</Button>
        ) : (
          buttonContent
        )}
      </Upload>
    </>
  );
}
Index.propTypes = {
  /**
   * nameSpace 命名空间
   */
  nameSpace: PropTypes.string.isRequired,
  /**
   * styles 样式
   */
  styles: PropTypes.string,
  /**
   * name文件类型，可以是file
   */
  name: PropTypes.string,
  /**
   * showUploadList 显示文件列表
   */
  showUploadList: PropTypes.bool,
  /**
   * buttonType 按钮类型
   */
  type: PropTypes.string,
  /**
   * typeName 左侧业务类别
   */
  typeName: PropTypes.string,
  /**
   * requireFileSize 要求的文件大小,单位为MB
   */
  requireFileSize: PropTypes.number.isRequired,
  /**
   * banFileType 禁止上传的文件类型,用一个字符串表示，类型与类型之间用逗号隔开
   */
  banFileType: PropTypes.string,
  /**
   * mustFileType 要求上传的文件类型,用一个字符串表示，类型与类型之间用逗号隔开
   */
  mustFileType: PropTypes.string,
  /**
   * buttonContent 按钮的内容
   */
  buttonContent: PropTypes.object,
  /**
   * afterMinioApi 在minio之后的接口
   */
  afterMinioApi: PropTypes.string,
  /**
   * beforeCondition 上传的前置条件
   */
  beforeCondition: PropTypes.string,
  /**
   * beforeConditionMessage 上传的前置条件的错误的提示信息
   */
  beforeConditionMessage: PropTypes.string,
  /**
   * disabled 禁用上传
   */
  disabled: PropTypes.bool,
  // 正在上传
  isUploading: PropTypes.bool,
  /**
   * 上传成功回调
   */
  uploadSuccess: PropTypes.func,
};
Index.defaultProps = {
  name: 'file',
  showUploadList: false,
  type: 'primary',
  banFileType: 'exe,bat,js,java,sh,dll,cmd',
  beforeCondition: '',
  beforeConditionMessage: '',
  mustFileType: '',
  styles: '',
  disabled: false,
  isUploading: false,
  typeName: '',
  uploadSuccess: () => {},
};
export default connect(uploadfile => uploadfile)(Index);
