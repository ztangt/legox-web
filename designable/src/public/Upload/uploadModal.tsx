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
import { CHUNK_SIZE } from '@/service/constant'
import { dataFormat } from '@/utils/utils'
import { Button, Upload, message } from 'antd'
import PropTypes from 'prop-types'
import { useState } from 'react'
import SparkMD5 from 'spark-md5'
import { connect, history, useModel } from 'umi'
// interface State {
//   newFileList:any
// }
const defaultInfo = {
  file: '',
  getFileMD5Message: '',
  index: 0,
  isFu: '',
  fileExists: '',
  fileExistsFu: '',
  md5FileId: '',
  md5FilePath: '',
  // needfilepath: filePath
  needfilepath: '',
  fileName: '',
  fileChunkedList: [],
  md5: '',
  uploadFlag: true,
  fileSize: 0,
  isStop: false,
  isContinue: false,
  nowMessage: '',
  isCancel: false,
  merageFilepath: '',
  fileStorageId: '',
  htmlFileStorageId: '',
  fileNames: '',
  typeNames: '',
  optionFile: '',
}
function Index({
  disabled,
  typeName,
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
  filePath,
  isImportExcel,
  ayscBeforeCondition,
  maxCount,
  multiple,
}) {
  // const [state, setState] = useSetState<State>({
  //   newFileList:[]
  // })
  const [sucessFiles, setSucessFiles] = useState([]) //这个需要用到数组，要不doupload中数量总是初始值
  const {
    getFileMD5,
    presignedUploadUrl,
    getFileMerage,
    storingFileInformation,
  } = useModel('uploadfile')
  const beforeUpload = (file: any, fileList: any) => {
    if (beforeCondition && !beforeCondition(file)) {
      // message.error(beforeConditionMessage)
      return false
    }
    const fileTypeName = file.name.split('.')[1]
    const fileSize = file.size
    const isRealSize = file.size / 1024 / 1024 <= requireFileSize
    const notations = file.name.split('.')
    let notBanFileType = false
    let allowFileType = false
    if (!mustFileType.split(',').includes(fileTypeName)) {
      allowFileType = true
    }
    if (!mustFileType) {
      allowFileType = false
    }

    if (banFileType.split(',').includes(fileTypeName)) {
      notBanFileType = true
    }
    if (allowFileType) {
      message.error(`${file.name}--仅支持上传${mustFileType}格式!`)
      return false
    } else if (notBanFileType) {
      message.error(`${file.name}--上传的文件不允许是${fileTypeName}格式!`)
      return false
    } else if (!isRealSize) {
      message.error(
        `${file.name}--上传的文件不能大于${
          requireFileSize >= 1024
            ? (requireFileSize / 1024).toFixed(0) + 'GB!'
            : requireFileSize + 'MB!'
        }`
      )
      return false
    }
    return true
  }
  const getFileMD5Callback = async (
    data: any,
    payload: any,
    nextState: any
  ) => {
    console.log('state===', nextState)
    const { index, isFu } = nextState
    const { filePath, isPresigned } = payload
    // 传参isPresigned	？ YES（小于40M）
    if (isPresigned) {
      // 存在，返回对应minio路径及主键
      if (data.have === 'Y') {
        uploadSuccess &&
          uploadSuccess(
            data.filePath,
            data.fileId,
            nextState.optionFile,
            data?.fileFullPath,
            sucessFiles
          )
        // 返回值have=N  ？不存在
        // 直接获取presignedUploadUrl，上传到指定url（前端自己传），再调用public/fileStorage/saveFileStorag（保存到数据库）
      } else {
        nextState = {
          ...nextState,
          needfilepath: filePath,
          getFileMD5Message: data,
        }
        uploadStore(
          {
            url: `${data.presignedUploadUrl}`,
            file: nextState.optionFile,
          },
          { ...nextState }
        )
      }
      // 传参isPresigned	？ NO（大于40M，需调用预上传接口）
    } else {
      // 存在，返回对应minio路径及主键
      if (data.have === 'Y') {
        uploadSuccess &&
          uploadSuccess(
            data.filePath,
            data.fileId,
            nextState.optionFile,
            data?.fileFullPath,
            sucessFiles
          )
      } else {
        let tmpInfo = {
          ...nextState,
          needfilepath: filePath,
        }
        presignedUploadUrl(
          {
            filePath: `${data.filePath}.${index}`,
            file: nextState.optionFile,
          },
          presignedUploadUrlCallback,
          { ...tmpInfo, index: index + 1 }
        )
      }
    }
  }
  const presignedUploadUrlCallback = (data: any, file: any, nextState: any) => {
    uploadStore(
      {
        url: `${data.presignedUploadUrl}`,
        file: file,
      },
      nextState
    )
  }
  //上传到minIO
  const uploadStore = async (payload: any, nextState: any) => {
    debugger
    let file = payload.file
    delete payload.file
    const {
      fileName,
      fileChunkedList,
      md5,
      index,
      uploadFlag,
      fileSize,
      needfilepath,
    } = nextState
    try {
      let response = await fetch(payload.url, {
        method: 'PUT',
        body: fileChunkedList[index],
      })
      let tmpInfo = {
        ...nextState,
        isStop: false,
        isContinue: false,
        nowMessage: '正在上传...',
      }
      if (fileChunkedList.length && fileChunkedList.length - 1 != index) {
        // 此处为暂停判断器
        if (uploadFlag) {
          presignedUploadUrl(
            {
              filePath: `${needfilepath}.${index + 1}`,
              file,
            },
            presignedUploadUrlCallback,
            {
              ...tmpInfo,
              index: index + 1,
            }
          )
        } else {
          //暂时不写，现在还没有暂停的地方
          // tmpInfo.nowMessage = '已暂停'
          // state.newFileList[nextState.index] = tmpInfo
          // setState({
          //   newFileList: state.newFileList[nextState.index],
          // })
        }
      } else {
        tmpInfo = {
          ...tmpInfo,
          isStop: true,
          isContinue: true,
          isCancel: true,
        }
        if (fileSize > 40 * 1024 * 1024) {
          getFileMerage(
            {
              filePath: needfilepath,
              fileName: fileName,
            },
            getFileMerageCallback,
            { ...tmpInfo }
          )
        } else {
          storingFileInformation(
            {
              fileName: fileName,
              fileSize: fileSize,
              filePath: needfilepath,
              fileEncryption: md5,
            },
            storingFileInformationCallback,
            { ...tmpInfo }
          )
        }
      }
    } catch (e) {
      message.error(e)
      console.log(e)
    }
  }
  // 根据文件路径合并文件的回调
  const getFileMerageCallback = async (data: any, nextState: any) => {
    const { fileSize, md5, fileName } = nextState
    let tmpInfo = {
      ...nextState,
      merageFilepath: data,
      isStop: true,
      isContinue: true,
    }
    storingFileInformation(
      {
        fileName: fileName,
        fileSize: fileSize,
        filePath: data,
        fileEncryption: md5,
      },
      storingFileInformationCallback,
      { ...tmpInfo }
    )
  }
  const storingFileInformationCallback = (
    payload: any,
    data: any,
    nextState: any
  ) => {
    // const { isFu } = nextState.info
    uploadSuccess &&
      uploadSuccess(
        payload.filePath,
        data.fileStorageId,
        nextState.optionFile,
        data.fileFullPath,
        sucessFiles
      )
  }
  const doUpload = async (options: any) => {
    const fileName = options.file.name
    const fileNames = options.file.name.split('.')[0]
    const typeNames = options.file.name.split('.')[1]
    const optionFile = options.file
    const fileSize = options.file.size
    let newArr = []
    // 文件分片
    for (let i = 0; i < optionFile.size; i = i + CHUNK_SIZE) {
      const tmp = optionFile.slice(i, Math.min(i + CHUNK_SIZE, optionFile.size))
      newArr.push(tmp)
    }
    let tmpInfo = {
      ...defaultInfo,
      uploadFlag: true,
      nowMessage: '正在计算文件MD5...',
      fileChunkedList: newArr,
      fileName: fileName,
      fileNames: fileNames,
      typeNames: typeNames,
      optionFile: optionFile,
      fileSize: fileSize,
    }
    if (ayscBeforeCondition) {
      //只能把请求接口的校验放到这，放到before中拿不到state的值
      let isCheck = await ayscBeforeCondition(optionFile)
      if (!isCheck) {
        return
      }
    }
    //计数
    sucessFiles.push({ ...options })
    setSucessFiles(sucessFiles)
    if (isImportExcel) {
      //excel直接上传
      uploadSuccess(optionFile)
      return
    }
    const fileReader = new FileReader()
    fileReader.readAsBinaryString(optionFile)
    fileReader.onloadend = async (e) => {
      const md5 = SparkMD5.hashBinary(e.target.result)
      tmpInfo = {
        ...tmpInfo,
        md5: md5,
        fileExists: '',
      }
      if (md5.length != 0) {
        getFileMD5(
          {
            isPresigned: fileSize < CHUNK_SIZE ? 1 : 0,
            fileEncryption: md5,
            filePath: filePath
              ? `${filePath}/${optionFile.name}`
              : `${history.location.pathname.slice(1)}/${dataFormat(
                  String(new Date().getTime()).slice(0, 10),
                  'YYYY-MM-DD'
                )}${typeName == '' ? '' : '/' + typeName}/${optionFile.name}`,
          },
          getFileMD5Callback,
          { ...tmpInfo, index: fileSize < CHUNK_SIZE ? 0 : -1 }
        )
      }
    }
  }
  return (
    <>
      <Upload
        style={styles}
        name={name}
        disabled={disabled}
        showUploadList={showUploadList}
        beforeUpload={beforeUpload}
        customRequest={doUpload}
        multiple={true}
      >
        {!buttonContent ? <Button type={type}>选择文件</Button> : buttonContent}
      </Upload>
    </>
  )
}
Index.propTypes = {
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
  showUploadList: PropTypes.string,
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
  buttonContent: PropTypes.element,
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
  disabled: PropTypes.string,
  /**
   * 上传成功回调
   */
  uploadSuccess: PropTypes.func,
  /**
   * 自定义路径
   */
  filePath: PropTypes.string,
  /**
   * 是否为excel导入
   */
  isImportExcel: PropTypes.bool,
  /**
   * 最大上传数量
   */
  maxCount: PropTypes.number,
  /**
   * 是否多选
   */
  multiple: PropTypes.bool,
}
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
  typeName: '',
  uploadSuccess: () => {},
  isImportExcel: false,
  maxCount: 1,
  multiple: false,
}
export default connect((uploadfile) => uploadfile)(Index)
