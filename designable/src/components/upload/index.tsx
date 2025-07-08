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
import { useSetState } from 'ahooks'
import { Button, Upload, message } from 'antd'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import SparkMD5 from 'spark-md5'
import { history, useModel } from 'umi'
import { CHUNK_SIZE } from '../../service/constant'
import { dataFormat } from '../../utils/utils'

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
  uploadSuccess,
  isImportExcel,
}) {
  interface State {
    fileChunkedList?: any
    fileName?: any
    fileNames?: any
    typeNames?: any
    optionFile?: any
    fileSize?: any
    uploadFlag?: any
    nowMessage?: any
    md5?: any
    fileExists: any
    md5FileId: any
    md5FilePath?: any
    needfilepath?: any
    index?: any
    getFileMD5Message?: any
    merageFilepath?: any
    isStop?: any
    isContinue?: any
    fileStorageId?: any
    isCancel?: any
  }
  const [state, setState] = useSetState<State>({
    uploadFlag: true, //上传暂停器
    nowMessage: '', //提示上传进度的信息
    md5: '', //文件的md5值，用来和minio文件进行比较
    fileChunkedList: [], //文件分片完成之后的数组
    fileName: '', //文件名字
    fileNames: '', //文件前半部分名字
    fileStorageId: '', //存储文件信息到数据库接口返回的id
    typeNames: '', //文件后缀名
    optionFile: {}, //文件信息
    fileSize: '', //文件大小，单位是字节
    getFileMD5Message: {}, //md5返回的文件信息
    needfilepath: '', //需要的minio路径
    isStop: true, //暂停按钮的禁用
    isContinue: false, //继续按钮的禁用
    isCancel: false, //取消按钮的禁用
    index: 0, //fileChunkedList的下标，可用于计算上传进度
    merageFilepath: '', //合并后的文件路径
    fileExists: '', //判断文件是否存在于minio服务器中，相关modal中监听判断fileExists状态进行后续分别操作
    md5FileId: '', //md5查询到的文件返回的id
    md5FilePath: '', //md5查询到的文件返回的pathname
  })
  const {
    fileChunkedList,
    fileName,
    fileNames,
    typeNames,
    optionFile,
    fileSize,
    uploadFlag,
    nowMessage,
    md5,
    fileExists,
    md5FileId,
    md5FilePath,
    needfilepath,
    index,
    getFileMD5Message,
    merageFilepath,
    isStop,
    isContinue,
    fileStorageId,
    isCancel,
  } = state
  const {
    getFileMD5,
    presignedUploadUrl,
    getFileMerage,
    storingFileInformation,
  } = useModel('uploadfile')
  useEffect(() => {
    if (fileExists) {
      uploadSuccess &&
        uploadSuccess(
          {
            fileurl: needfilepath,
          },
          () => {
            setState({
              fileExists: '',
            })
          }
        )
    } else if (fileExists === false) {
      uploadSuccess &&
        uploadSuccess(
          {
            //导入
            fileurl: fileSize > CHUNK_SIZE ? merageFilepath : needfilepath,
          },
          () => {
            setState({
              fileExists: '',
            })
          }
        )
    }
  }, [fileExists])

  //根据文件md5查询是否存在该文件
  const getFileMD5Fn = (payload) => {
    const { isPresigned, filePath } = payload
    let restPaylod = payload.restPaylod
    delete payload.restPaylod
    getFileMD5(
      payload,
      (data) => {
        setState({
          getFileMD5Message: data.data,
        })
        // new
        // 传参isPresigned	？ YES（小于40M）
        if (isPresigned) {
          // 存在，返回对应minio路径及主键
          if (data.have === 'Y') {
            // uploadSuccess && uploadSuccess({ fileurl: data.data.filePath })
            setState({
              fileExists: true,
              md5FileId: data.data.fileId,
              md5FilePath: data.data.filePath,
              // needfilepath: filePath,
              needfilepath: data.data.filePath,
            })
            // 返回值have=N  ？不存在
            // 直接获取presignedUploadUrl，上传到指定url（前端自己传），再调用public/fileStorage/saveFileStorag（保存到数据库）
          } else {
            setState({
              needfilepath: filePath,
            })
            uploadStoreFn(`${data.data.presignedUploadUrl}`, {
              ...restPaylod,
              needfilepath: filePath,
            })
          }
          // 传参isPresigned	？ NO（大于40M，需调用预上传接口）
        } else {
          // 存在，返回对应minio路径及主键
          if (data.have === 'Y') {
            // uploadSuccess && uploadSuccess(data.data.filePath)
            setState({
              md5FileId: data.data.fileId,
              md5FilePath: data.data.filePath,
              fileExists: true,
              needfilepath: filePath,
            })
          } else {
            setState({
              needfilepath: filePath,
            })
            presignedUploadUrlFn(
              {
                filePath: `${data.data.filePath}.${index}`,
              },
              restPaylod
            )
          }
        }
      },
      null
    )
  }
  //上传到数据库
  const uploadStoreFn = async (url, restPaylod) => {
    if (
      !fileChunkedList?.[index] &&
      !restPaylod?.fileChunkedList?.[restPaylod?.index]
    ) {
      message.error('文件上传失败,请重新上传！')
      return
    }
    //防止setState未更新到值，先从restPaylod取数值
    var index = index || restPaylod?.index
    var fileChunkedList = fileChunkedList || restPaylod?.fileChunkedList
    var fileName = fileName || restPaylod?.fileName
    var fileSize = fileSize || restPaylod?.fileSize
    var md5 = md5 || restPaylod?.md5
    var needfilepath = needfilepath || restPaylod?.needfilepath
    await fetch(url, {
      method: 'PUT',
      body: fileChunkedList[index],
    })
    setState({
      isStop: false,
      isContinue: false,
      nowMessage: '正在上传...',
    })
    if (fileChunkedList.length - 1 != index) {
      // 此处为暂停判断器
      if (uploadFlag) {
        presignedUploadUrlFn(
          {
            filePath: `${needfilepath}.${index + 1}`,
          },
          { ...restPaylod, index: index + 1 }
        )
        setState({
          index: index + 1,
        })
      } else {
        setState({
          nowMessage: '已暂停',
        })
      }
    } else {
      setState({
        isStop: true,
        isContinue: true,
        isCancel: true,
      })
      if (fileSize > CHUNK_SIZE) {
        getFileMerageFn({
          filePath: needfilepath,
          fileName: fileName,
        })
      } else {
        storingFileInformationFn({
          fileName: fileName,
          fileSize: fileSize,
          filePath: needfilepath,
          fileEncryption: md5,
        })
      }
    }
  }
  //文件预上传
  const presignedUploadUrlFn = (payload, restPaylod) => {
    presignedUploadUrl(
      payload,
      (data) => {
        uploadStoreFn(`${data.data.presignedUploadUrl}`, restPaylod)
      },
      null
    )
  }
  //根据文件路径合并文件
  const getFileMerageFn = (payload) => {
    getFileMerage(
      payload,
      (data) => {
        setState({
          merageFilepath: data.data,
          isStop: true,
          isContinue: true,
        })
        storingFileInformationFn({
          fileName: fileName,
          fileSize: fileSize,
          filePath: data.data,
          fileEncryption: md5,
        })
      },
      null
    )
  }
  //存储文件信息到数据库接口
  const storingFileInformationFn = (payload) => {
    storingFileInformation(
      payload,
      (data) => {
        // uploadSuccess && uploadSuccess(payload.filePath)
        setState({
          fileExists: false,
          fileStorageId: data.data.fileStorageId,
        })
      },
      null
    )
  }

  const beforeUpload = (file) => {
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
      message.error(`仅支持上传${mustFileType}格式!`)
    } else if (notBanFileType) {
      message.error(`上传的文件不允许是${fileTypeName}格式!`)
    } else if (!isRealSize) {
      message.error(
        `上传的文件不能大于${
          requireFileSize >= 1024
            ? (requireFileSize / 1024).toFixed(0) + 'GB!'
            : requireFileSize + 'MB!'
        }`
      )
    } else if (notations.length > 2) {
      message.error('上传的文件命名不规范!')
    } else {
      setState({
        uploadFlag: true,
        nowMessage: '正在计算文件MD5...',
      })
    }
  }

  const doUpload = (options) => {
    if (isImportExcel || !options.file.size) {
      uploadSuccess(options.file)
      return
    }
    const fileReader = new FileReader()
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
    setState({
      fileChunkedList: newArr,
      fileName: fileName,
      fileNames: fileNames,
      typeNames: typeNames,
      optionFile: optionFile,
      fileSize: fileSize,
    })
    fileReader.readAsBinaryString(optionFile)
    fileReader.onload = (e) => {
      const md5 = SparkMD5.hashBinary(e.target.result)
      console.log('md5', md5)
      console.log('target.result', e.target.result)
      if (md5.length != 0) {
        setState({
          md5: md5,
          fileExists: '',
        })
        const filePath = `${history.location.pathname.slice(1)}/${dataFormat(
          String(new Date().getTime()).slice(0, 10),
          'YYYY-MM-DD'
        )}${typeName == '' ? '' : '/' + typeName}/${fileName}`

        getFileMD5Fn({
          isPresigned: fileSize < CHUNK_SIZE ? 1 : 0,
          fileEncryption: md5,
          filePath,
          restPaylod: {
            fileChunkedList: newArr,
            fileName: fileName,
            fileNames: fileNames,
            typeNames: typeNames,
            optionFile: optionFile,
            fileSize: fileSize,
            md5: md5,
            index: 0,
          },
        })
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
        maxCount={1}
      >
        {buttonContent == '' ? (
          <Button type={type}>选择文件</Button>
        ) : (
          buttonContent
        )}
      </Upload>
    </>
  )
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
  disabled: PropTypes.bool,
  /**
   * 上传成功回调
   */
  uploadSuccess: PropTypes.func,
  /**
   * 是否为excel导入
   */
  isImportExcel: PropTypes.bool,
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
}
export default Index
