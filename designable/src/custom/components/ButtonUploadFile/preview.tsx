import IconLeft from '@/Icon-left'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import IUpload from '@/public/Upload/uploadModal'
import { observer, useField, useFieldSchema, useForm } from '@formily/react'
import { useSetState } from 'ahooks'
import { message } from 'antd'
import axios from 'axios'
import classnames from 'classnames'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
import { initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'
import ModalDetail from './modalDetail'
import ModalMobileDetail from './modalMobileDetail'
function returnType(attachType: string) {
  if (attachType == 'DOC') {
    return 'docx,doc,xls,xlsx'
  } else if (attachType == 'PIC') {
    return 'png,jpeg,gif,jpg'
  } else if (attachType == 'NULL') {
    return ''
  }
}
interface State {
  dataSource?: Array<any> //详情数据
  isShowDetail?: boolean //是否显示详情弹框
  formCode?: string //子表的code
  subTableId?: string //子表行的id
  tmpFlag?: number //是否获取临时数据 1是 0否
  reNameVisible?: boolean //是否显示重命名弹框
  sucessFiles: any //成功上传到mion的文件,主要用于记录
  sucessNums: number //主要用于记录,只提示一次
  errorNums: number //主要用于记录,只提示一次
  filePath?: string //路径
}
export const ButtonUploadFile: DnFC<any> = observer((props) => {
  const masterProps = useModel('@@qiankunStateFromMaster')
  let { location, bizInfo, cutomHeaders } = masterProps

  const [state, setState] = useSetState<State>({
    dataSource: [],
    isShowDetail: false,
    subTableId: '',
    formCode: '',
    tmpFlag: 0,
    sucessFiles: [],
    sucessNums: 0,
    errorNums: 0,
    filePath: ``,
  })
  const {
    saveAppendBizRelAtt,
    getV2BizRelAtt,
    checkName,
    deleteV2BizRelAtt,
    downZip,
  } = useModel('buttonUploadFile')
  const fieldScme: any = useFieldSchema()
  const [columnCode, setColumnCode] = useState('')
  //const columnCode: string = fieldScme ? fieldScme.columnCode : ''
  const form = useForm()
  const field = useField()
  //获取父节点的code
  const pathSegments = field.path.segments
  useEffect(() => {
    setState({
      tmpFlag: props.tmpFlag,
    })
  }, [props.tmpFlag])
  useEffect(() => {
    if (pathSegments.length > 1 && pathSegments[0] != 'x-component-props') {
      if (pathSegments.length > 2) {
        //包含在字表里面
        const index = pathSegments[pathSegments.length - 2]
        let parentCode = pathSegments[pathSegments.length - 3]
        const tabelValue = form.values[parentCode]
        let tmpSubTableId = tabelValue?.[index]?.['ID']
        let columnCode = fieldScme ? fieldScme.columnCode : ''
        setColumnCode(columnCode)
        setState({
          formCode: parentCode,
          subTableId: tmpSubTableId,
          filePath: `BizAttachment/${new Date().getFullYear()}/${
            new Date().getMonth() + 1
          }/${new Date().getDate()}/${
            cutomHeaders?.mainTableId
          }/${parentCode}_${columnCode}`,
        })
      } else {
        let columnCode = fieldScme ? fieldScme.columnCode : ''
        setColumnCode(columnCode)
        //对象容器
        let parentCode = pathSegments[pathSegments.length - 2]
        setState({
          formCode: parentCode,
          filePath: `BizAttachment/${new Date().getFullYear()}/${
            new Date().getMonth() + 1
          }/${new Date().getDate()}/${
            cutomHeaders?.mainTableId
          }/${parentCode}_${columnCode}`,
        })
      }
    } else {
      let columnCode = fieldScme ? fieldScme.columnCode : ''
      setColumnCode(columnCode)
      setState({
        filePath: `BizAttachment/${columnCode}/${new Date().getFullYear()}/${
          new Date().getMonth() + 1
        }/${new Date().getDate()}/${cutomHeaders?.mainTableId}/${columnCode}`,
      })
    }
  }, [])
  const ayscBeforeCondition = (file: any) => {
    const fileTypeName = file.name
    //获取数据
    let isCheck = checkName(
      {
        bizInfoId: bizInfo?.bizInfoId,
        mainTableId: cutomHeaders?.mainTableId,
        subTableId: state.subTableId,
        formCode: state.formCode,
        columnCode,
        fileName: fileTypeName,
      },
      (data: any) => {}
    )
    return isCheck
  }
  //上传成功回调
  const uploadSuccess = (
    filePath: any,
    fileId: string,
    file: any,
    fileFullPath: string,
    sucessFiles: any,
    callback?: any
  ) => {
    setState({ sucessFiles: sucessFiles })
    let fileNames: any = file.name.split('.')
    let fileType: string = '.' + fileNames[fileNames.length - 1]
    let fileObject: object = {
      fileName: file.name,
      fileSize: file.size,
      fileType: fileType,
      createTime: Math.floor(new Date().getTime() / 1000).toString(),
      createUserName: window.localStorage.getItem('userName'),
      filePath: filePath,
      fileUrl: fileFullPath,
      fileId: fileId,
      id: '',
    }
    let num = parseInt(field.value || '0') + 1
    field.setValue(num)
    let atts = []
    atts.push(fileObject)
    //更新数据
    saveAppendBizRelAtt(
      {
        bizInfoId: bizInfo?.bizInfoId,
        bizSolId: bizInfo?.bizSolId,
        mainTableId: cutomHeaders?.mainTableId,
        subTableId: state.subTableId,
        formCode: state.formCode,
        columnCode,
        atts: atts,
        relType: 4,
      },
      (returnData: any) => {
        let data = returnData.data?.ids || []
        if (returnData.code == 200) {
          setState((prev) => ({ sucessNums: prev.sucessNums + 1 }))
          fileObject.id = data[0]
          setState({ tmpFlag: 1 })
          callback && callback(fileObject)
        } else if (
          returnData.code != 401 &&
          returnData.code != 419 &&
          returnData.code != 403
        ) {
          setState((prev) => ({ errorNums: prev.errorNums + 1 }))
          message.error(`${file.name}--${returnData.msg}`)
        }
      }
    )
  }
  useEffect(() => {
    if (
      state.sucessFiles.length &&
      state.sucessFiles.length == state.sucessNums + state.errorNums
    ) {
      message.success('上传成功')
    }
  }, [state.sucessFiles, state.errorNums, state.sucessNums])
  //附件详情
  const detailFn = () => {
    //获取数据
    getV2BizRelAtt(
      {
        bizInfoId: bizInfo.bizInfoId,
        relType: 'FORM',
        mainTableId: cutomHeaders.mainTableId,
        subTableId: state.subTableId,
        formCode: state.formCode,
        columnCode,
        tmpFlag: state.tmpFlag,
      },
      (data: any) => {
        setState({ dataSource: data })
        setState({ isShowDetail: true })
      }
    )
  }
  console.log('columnCode==', columnCode, props)
  //删除
  const deleteV2BizRelAttFn = (id: string) => {
    deleteV2BizRelAtt(
      {
        bizInfoId: bizInfo.bizInfoId,
        columnCode: columnCode,
        ids: id,
        mainTableId: cutomHeaders.mainTableId,
        subTableId: state.subTableId,
        formCode: state.formCode,
      },
      () => {
        setState({
          tmpFlag: 1,
        })
        //更新数据
        let tmpDataSource = []
        state.dataSource.map((item) => {
          if (item.id != id) {
            tmpDataSource.push(item)
          }
        })
        setState({ dataSource: tmpDataSource })
        let num = parseInt(field.value) - 1
        if (num == 0) {
          field.setValue('') //为了验证该控件是否为空
        } else {
          field.setValue(num)
        }
      }
    )
  }
  const onOk = () => {
    props?.onOk?.(state.dataSource)
  }
  //下载
  const downZipFn = () => {
    if (!field.value) {
      message.warning('没有可下载的文件')
      return
    }
    downZip(
      {
        zipName: field.title,
        bizSolId: bizInfo.bizSolId,
        mainTableIds: cutomHeaders.mainTableId,
        mainCols: state.formCode ? '' : columnCode,
        subFormCols: state.formCode
          ? JSON.stringify({ [state.formCode]: columnCode })
          : '',
        tmpFlag: state.tmpFlag,
        subTableIds: state.subTableId,
      },
      (src: string) => {
        if (!src) {
          message.warning('暂未生成下载地址,请保存后再进行该操作！')
          return
        }
        axios({ url: src, method: 'get', responseType: 'blob' }).then((res) => {
          try {
            //res.blob().then((blob) => {
            const blobUrl = window.URL.createObjectURL(new Blob([res.data]))
            // 这里的文件名根据实际情况从响应头或者url里获取
            const a = document.createElement('a')
            a.href = blobUrl
            a.download = field.title + '.zip'
            a.click()
            window.URL.revokeObjectURL(blobUrl)
            //})
          } catch (e) {
            message.error('下载失败')
          }
        })
      }
    )
  }
  return (
    <div
      style={props.style}
      className={classnames(
        styles.button_upload_file_warp,
        props.className,
        props.redClassName
      )}
    >
      <IUpload
        typeName={'全部类别'}
        requireFileSize={props.fileSizeMax || 35}
        mustFileType={returnType(props.attachType)}
        buttonContent={
          <span
            className={
              !props.disabled ? styles.upload_warp : styles.disabled_warp
            }
          >
            上传
          </span>
        }
        ayscBeforeCondition={ayscBeforeCondition.bind(this)}
        uploadSuccess={uploadSuccess.bind(this)}
        filePath={state.filePath}
        disabled={props.disabled}
      />
      <span onClick={detailFn.bind(this)}>详情</span>
      <span
        onClick={
          window.location.href.includes('/mobile')
            ? () => {}
            : downZipFn.bind(this, props)
        }
        className={
          window.location.href.includes('/mobile') ? styles.no_fileName : ''
        }
      >
        下载({field.value || 0})
      </span>
      {state.isShowDetail ? (
        !window.location.href.includes('/mobile') ? (
          <ModalDetail
            dataSource={state.dataSource}
            parentSetState={setState}
            deleteV2BizRelAttFn={deleteV2BizRelAttFn}
            onOk={onOk.bind(this)}
            props={props}
            returnType={returnType}
            ayscBeforeCondition={ayscBeforeCondition}
            uploadSuccess={uploadSuccess}
            columnCode={columnCode}
            formCode={state.formCode}
          />
        ) : (
          <ModalMobileDetail
            dataSource={state.dataSource}
            parentSetState={setState}
            deleteV2BizRelAttFn={deleteV2BizRelAttFn}
            onOk={onOk.bind(this)}
            props={props}
            returnType={returnType}
            ayscBeforeCondition={ayscBeforeCondition}
            uploadSuccess={uploadSuccess}
          />
        )
      ) : null}
    </div>
  )
})
ButtonUploadFile.Behavior = createBehavior({
  name: 'ButtonUploadFile',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'ButtonUploadFile',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.ButtonUploadFile),
  },
  designerLocales: AllLocales.ButtonUploadFile,
})

ButtonUploadFile.Resource = createResource({
  icon: <IconLeft type="icon-riqiziduan" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: '上传文件',
        'x-decorator': 'FormItem',
        'x-component': 'ButtonUploadFile',
        'x-component-props': {
          allowClear: true,
          style: {
            ...initStyle?.style,
            borderWidth: '0px',
          },
        },
        'x-decorator-props': {
          labelStyle: {
            ...initStyle?.labelStyle,
          },
        },
      },
    },
  ],
})
