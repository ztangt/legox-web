import IconLeft from '@/Icon-left'
import DownMoudle from '@/components/fileMoudle'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import IUpload from '@/public/Upload/uploadModal'
import { strLength } from '@/utils/utils'
import { observer, useField, useFieldSchema, useForm } from '@formily/react'
import { useSetState } from 'ahooks'
import { Button, Checkbox, Col, Image, Modal, Row, message } from 'antd'
import { TableProps } from 'antd/lib/table'
import axios from 'axios'
import classnames from 'classnames'
import * as dd from 'dingtalk-jsapi'
import _ from 'lodash'
import { useEffect, useRef } from 'react'
import { useModel } from 'umi'
import { initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'
import UpdateFileName from './updateFileName'
const noDisabledTitle = [
  '.png',
  '.gif',
  '.jpg',
  '.jpeg',
  '.pdf',
  '.dwg',
  '.docx',
  '.xlsx',
  '.xls',
]

interface State {
  currentIndex: number //修改名称弹框选中的Index
  reNameVisible: boolean //是否显示编辑名称弹框
  formCode: string
  subTableId: string
  showSrc: string //预览要显示的图片链接
  visibleImg: boolean //是否显示预览
  imgPreviewList: any //图片预览列表用于切换
  imgIndex: number //预览图片当前位置
  sucessFiles: any //成功上传到mion的文件,主要用于记录
  sucessNums: number //主要用于记录,只提示一次
  errorNums: number //主要用于记录,只提示一次
  indeterminate: boolean //用于识别全选取消全选
  checkedValues: any //复选框的列表
  tmpFlag?: number //是否获取临时数据 1是 0否
  filePath?: string //路径
  fileMoudleList: any[] //文件模块列表
  downMoudleVisible: boolean //是否显示下载模块列表
}
interface ExtraProps extends TableProps<any> {
  limitNumber: number //上传的最大数量
  attachType: string //上传的文件类型
  fileSizeMax: number //上传文件大小的限制
}
function returnType(attachType: string) {
  if (attachType == 'DOC') {
    return 'docx,doc,xls,xlsx'
  } else if (attachType == 'PIC') {
    return 'png,jpeg,gif,jpg'
  } else if (attachType == 'NULL') {
    return ''
  }
}
export const UploadFile: DnFC<ExtraProps> = observer((props: any) => {
  const masterProps = useModel('@@qiankunStateFromMaster')
  let { location, bizInfo, cutomHeaders, targetKey, formJson } = masterProps
  const selfRef = useRef()
  const {
    deleteV2BizRelAtt,
    saveAppendBizRelAtt,
    updateBizRelAttName,
    downZip,
  } = useModel('buttonUploadFile')
  const { templateColumnList } = useModel('preview')
  console.log('templateColumnList==', templateColumnList)

  const { redCol } = masterProps
  const form = useForm()
  const fieldScme: any = useFieldSchema()
  const field = useField()
  const columnCode: string = fieldScme ? fieldScme.columnCode : ''
  const [state, setState] = useSetState<State>({
    currentIndex: 0,
    reNameVisible: false,
    formCode: '',
    subTableId: '',
    showSrc: '',
    visibleImg: false,
    imgPreviewList: [],
    imgIndex: 0,
    sucessFiles: [],
    sucessNums: 0,
    errorNums: 0,
    indeterminate: false,
    checkedValues: [],
    filePath: ``,
    fileMoudleList: [
      {
        id: '1',
        name: '默认',
        url: '',
      },
    ],
    downMoudleVisible: false,
  })
  console.log(
    'columnCode==',
    columnCode,
    state.formCode,
    formJson?.form?.formCode,
    templateColumnList.some(
      (item) =>
        item.formCode === (state.formCode || formJson?.form?.formCode) &&
        item.columnCode === columnCode
    )
  )

  console.log('filePath==', state.filePath)
  //获取父节点的code
  const pathSegments = field.path.segments
  useEffect(() => {
    if (pathSegments.length > 1 && pathSegments[0] != 'x-component-props') {
      if (pathSegments.length > 2) {
        //包含在字表里面
        const index = pathSegments[pathSegments.length - 2]
        let parentCode = pathSegments[pathSegments.length - 3]
        const tabelValue = form.values[parentCode]
        let tmpSubTableId = tabelValue?.[index]?.['id']
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
      setState({
        filePath: `BizAttachment/${new Date().getFullYear()}/${
          new Date().getMonth() + 1
        }/${new Date().getDate()}/${cutomHeaders?.mainTableId}/${columnCode}`,
      })
    }
  }, [])
  useEffect(() => {
    if (field.dataSource && field.dataSource.length) {
      field.setValue(field.dataSource.length)
    } else {
      field.setValue('')
    }
  }, [field.dataSource])

  //img弹框，pdf打开新页签，其他的下载
  function downloadLook(src: any, filename: string, fileType: string, e: any) {
    e.stopPropagation()
    e.preventDefault()
    if (
      fileType == '.png' ||
      fileType == '.gif' ||
      fileType == '.jpg' ||
      fileType == '.jpeg'
    ) {
      let imgsList = []
      let tmpIndex = 0
      field.dataSource &&
        field.dataSource.map((item: any) => {
          if (
            item.fileType == '.png' ||
            item.fileType == '.gif' ||
            item.fileType == '.jpg' ||
            item.fileType == '.jpeg'
          ) {
            if (src == item.fileUrl) {
              tmpIndex = imgsList.length
            }
            imgsList.push(item)
          }
        })
      console.log('imgsList==', imgsList, tmpIndex)
      setState({
        imgPreviewList: imgsList,
        visibleImg: true,
        imgIndex: tmpIndex,
      })
    } else if (fileType == '.pdf' || fileType == '.dwg') {
      let href = window.document.location.href
      let pathname = href.split('/business_application')
      let decoSrc = decodeURIComponent(src)
      let decoSrcs = decoSrc.split('?')[0].split('/')
      let title = decoSrcs[decoSrcs.length - 1]
      decoSrcs[decoSrcs.length - 1] = encodeURIComponent(title)
      let encodeSrc = decoSrcs.join('/')
      window.open(
        `${pathname[0]}/business_application/pdfPreview?src=${encodeSrc}`
      )
    } else if (fileType == '.docx') {
      let href = window.document.location.href
      let pathname = href.split('/business_application')
      window.open(`${pathname[0]}/business_application/filePreview?src=${src}`)
    } else if (fileType == '.xlsx') {
      let href = window.document.location.href
      let pathname = href.split('/business_application')
      window.open(`${pathname[0]}/business_application/excelPreview?src=${src}`)
    } else {
      download(src, filename)
    }
  }
  //选中下载
  function downloadZip() {
    if (!state.checkedValues.length) {
      // message.error('请选择要下载的文件');
      return
    }
    if (state.checkedValues.length == 1) {
      //获取当前选中的文件信息
      let tmpInfos = field.dataSource.filter(
        (i) => i.id == state.checkedValues[0]
      )
      let tmpInfo = tmpInfos[0]
      download(tmpInfo.fileUrl, tmpInfo.fileName)
    } else {
      //批量下载
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
          axios({ url: src, method: 'get', responseType: 'blob' }).then(
            (res) => {
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
            }
          )
        }
      )
    }
  }
  //下载
  function download(src: any, filename: string) {
    if (!src) {
      message.error('暂未生成下载地址,请保存后再进行该操作！')
      return
    }
    if (dd.env.platform !== 'notInDingTalk') {
      dd.ready(function () {
        dd.biz.util.downloadFile({
          url:
            'http://static.dingtalk.com/media/lADOADTWJM0C2M0C7A_748_728.jpg_60x60q90.jpg', //要下载的文件的url
          name: filename, //定义下载文件名字
          onProgress: function (msg) {
            // 文件下载进度回调
          },
          onSuccess: function (result) {
            /*
                true
              */
          },
          onFail: function () {},
        })
      })
      return
    }
    //src, { method: 'get', responseType: 'blob' }
    axios({ url: src, method: 'get', responseType: 'blob' }).then((res) => {
      console.log('res===', res)
      try {
        //res.blob().then((blob) => {
        const blobUrl = window.URL.createObjectURL(new Blob([res.data]))
        // 这里的文件名根据实际情况从响应头或者url里获取
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(blobUrl)
        //})
      } catch (e) {
        message.error('下载失败')
      }
    })
  }
  //删除
  function onDelete() {
    if (!state.checkedValues.length) {
      message.error('请选择文件')
      return
    }
    //删除附件
    Modal.confirm({
      title: '确认删除此附件?',
      content: '',
      okText: '删除',
      cancelText: '取消',
      mask: false,
      getContainer: () => {
        return document.getElementById(`formShow_container_${targetKey}`)
      },
      onOk: async () => {
        deleteV2BizRelAtt(
          {
            bizInfoId: bizInfo.bizInfoId,
            columnCode: columnCode,
            ids: state.checkedValues.join(','),
            mainTableId: cutomHeaders.mainTableId,
            subTableId: state.subTableId,
            formCode: state.formCode,
          },
          () => {
            //更新数据
            let tmpDataSource = []
            field.dataSource.map((item: any) => {
              if (!state.checkedValues.includes(item.id)) {
                tmpDataSource.push(item)
              }
            })
            field.setDataSource(tmpDataSource)
            setState({
              checkedValues: [],
              indeterminate: false,
            })
          }
        )
      },
    })
  }
  //更新附件名称
  function onReNameFile() {
    if (!state.checkedValues.length) {
      message.error('请选择一个文件')
      return
    }
    if (state.checkedValues.length != 1) {
      message.error('请选择一个文件')
      return
    }
    setState({ reNameVisible: true })
  }
  //重命名
  function changeFileName(fileName: string) {
    //获取当前选中的文件信息
    // let tmpInfos = field.dataSource.filter(
    //   (i) => i.fileId == state.checkedValues[0]
    // )
    // let tmpInfo = tmpInfos[0]
    //更新数据
    updateBizRelAttName(
      {
        targetId: state.checkedValues[0],
        newName: fileName,
      },
      () => {
        field.dataSource.map((item: any) => {
          if (item.id == state.checkedValues[0]) {
            item.fileName = fileName
          }
        })
        field.setDataSource(field.dataSource)
        setState({ reNameVisible: false })
      }
    )
  }
  //上传成功回调
  const uploadSuccess = (
    filePath: any,
    fileId: string,
    file: any,
    fileFullPath: string,
    sucessFiles: any
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
    //更新数据
    let atts = []
    atts.push(fileObject)
    //更新数据
    saveAppendBizRelAtt(
      {
        bizInfoId: bizInfo?.bizInfoId,
        bizSolId: location.query?.bizSolId,
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
          fileObject.id = data?.[0]
          let newDataSource = field.dataSource
            ? JSON.parse(JSON.stringify(field.dataSource))
            : []
          newDataSource.push(fileObject)
          field.setDataSource(newDataSource)
        } else if (
          returnData.code != 401 &&
          returnData.code != 419 &&
          returnData.code != 403
        ) {
          setState((prev) => ({ errorNums: prev.errorNums + 1 }))
          message.error(`${file.name}--${returnData.msg}`)
        }
        setState({
          checkedValues: [],
          indeterminate: false,
          tmpFlag: 1,
        })
      }
    )
  }
  useEffect(() => {
    console.log('state.sucessNums==', state)
    if (
      state.sucessFiles.length &&
      state.sucessFiles.length == state.sucessNums + state.errorNums
    ) {
      message.success('上传成功')
    }
  }, [state.sucessFiles, state.errorNums, state.sucessNums])
  const beforeCondition = (file: any) => {
    if (field.dataSource && field.dataSource.length == props.limitNumber) {
      message.error(`文件只能上传${props.limitNumber}条`)
      return false
    }
    const fileTypeName = file.name
    if (strLength(fileTypeName) > 150) {
      message.error(`文件名最大为75个字`)
      return false
    }
    console.log('fileTypeName==', fileTypeName)
    if (
      field.dataSource &&
      _.find(field.dataSource, function (o: any) {
        return o.fileName == fileTypeName
      })
    ) {
      message.error('文件名重复，请修改你上传的文件名')
      return false
    } else {
      return true
    }
  }
  //全选/取消全选
  const onCheckAllChange = () => {
    if (state.indeterminate) {
      //取消全选
      setState({
        indeterminate: false,
        checkedValues: [],
      })
    } else {
      //全选
      let tmpCheckedValues = []
      field.dataSource &&
        field.dataSource.map((item: any) => {
          tmpCheckedValues.push(item.id)
        })
      setState({
        indeterminate: true,
        checkedValues: tmpCheckedValues,
      })
    }
  }
  //复选框的选择
  const changeCheck = (list: any) => {
    if (list.length == field.dataSource.length) {
      setState({
        indeterminate: true,
        checkedValues: list,
      })
    } else {
      setState({
        indeterminate: false,
        checkedValues: list,
      })
    }
  }
  //上移，下移
  function arraymove(type: string) {
    if (!state.checkedValues.length) {
      message.error('请选择一个文件')
      return
    }
    if (state.checkedValues.length != 1) {
      message.error('请选择一个文件')
      return
    }
    //fromIndex: number, toIndex: number,
    let fromIndex = 0
    let toIndex = 0
    field.dataSource.map((item: any, index: number) => {
      if (item.id == state.checkedValues[0]) {
        fromIndex = index
      }
    })
    if (type == 'up') {
      if (fromIndex == 0) {
        return
      }
      toIndex = fromIndex - 1
    } else {
      if (fromIndex == field.dataSource.length - 1) {
        return
      }
      toIndex = fromIndex + 1
    }
    //获取
    updateBizRelAttName(
      {
        targetId: field.dataSource[fromIndex]['id'],
        preId:
          type == 'up'
            ? field.dataSource[toIndex - 1]?.['id']
            : field.dataSource[toIndex]?.['id'],
        nextId:
          type == 'up'
            ? field.dataSource[toIndex]?.['id']
            : field.dataSource[toIndex + 1]?.['id'],
      },
      () => {
        let newData = _.cloneDeep(field.dataSource)
        let element = newData[fromIndex]
        newData.splice(fromIndex, 1)
        newData.splice(toIndex, 0, element)
        //更新数据
        field.setDataSource(newData)
      }
    )
  }
  function onDownMoudle() {
    setState({
      downMoudleVisible: true,
    })
  }
  function handelCancle() {
    setState({
      downMoudleVisible: false,
    })
  }
  //应为label要与内容框剧中，移动端去掉按钮后导致差了36px，所以减去36
  useEffect(() => {
    if (window.location.href.includes('mobile')) {
      let labelDiv =
        selfRef.current?.parentNode?.parentNode?.parentNode?.previousSibling ||
        ''
      if (labelDiv) {
        var computedStyle = getComputedStyle(labelDiv, null)
        console.log('computedStyle==', computedStyle)
        let tmpTop = computedStyle.marginTop.includes('px')
          ? computedStyle.marginTop.split('px')[0]
          : '0'
        let tmpNum = parseInt(tmpTop) - 36
        labelDiv.style.marginTop = tmpNum > 0 ? `${tmpNum}px` : '0px' //应为老单子中没有marginTop等于36多有给他改成0px;
      }
    }
  }, [])
  return (
    <div
      className={classnames(
        styles.upload_warp,
        props.redClassName ? styles.redClassName : ''
      )}
      ref={selfRef}
    >
      {!window.location.href.includes('mobile') && (
        <div className={styles.header}>
          <Button className={styles.bt} onClick={onCheckAllChange}>
            全选/取消
          </Button>
          {field.authType != 'NONE' ? (
            <IUpload
              typeName={'全部类别'}
              requireFileSize={props.fileSizeMax || 35}
              mustFileType={returnType(props.attachType)}
              buttonContent={
                <Button className={styles.bt} disabled={!field.editable}>
                  上传
                </Button>
              }
              beforeCondition={beforeCondition.bind(this)}
              uploadSuccess={uploadSuccess.bind(this)}
              filePath={state.filePath}
            />
          ) : (
            <Button className={styles.bt} disabled>
              上传
            </Button>
          )}
          <Button className={styles.bt} onClick={downloadZip}>
            下载
          </Button>
          <Button
            className={styles.bt}
            onClick={onDelete}
            disabled={!field.editable}
          >
            删除
          </Button>
          <Button
            className={styles.bt}
            onClick={onReNameFile}
            disabled={!field.editable}
          >
            重命名
          </Button>
          <Button
            className={styles.bt}
            onClick={arraymove.bind(this, 'up')}
            disabled={!field.editable}
          >
            上移
          </Button>
          <Button
            className={styles.bt}
            onClick={arraymove.bind(this, 'down')}
            disabled={!field.editable}
          >
            下移
          </Button>
          {templateColumnList.length &&
          templateColumnList.some(
            (item) =>
              item.formCode === (state.formCode || formJson?.form?.formCode) &&
              item.columnCode === columnCode
          ) ? (
            <Button
              className={styles.bt}
              onClick={onDownMoudle}
              disabled={!field.editable}
            >
              模板下载
            </Button>
          ) : null}
        </div>
      )}

      <div style={{ ...props.style, overflowY: 'scroll' }}>
        {field.authType != 'NONE' && (
          <Checkbox.Group
            className={styles.checkbox_list}
            value={state.checkedValues}
            onChange={changeCheck}
          >
            {field.dataSource &&
              field.dataSource.map((item: any) => {
                return (
                  <Row>
                    <Col span={24}>
                      <Checkbox
                        value={item.id}
                        disabled={window.location.href.includes('mobile')}
                        className={styles.check_box}
                      >
                        <div className={styles.check_content}>
                          <span
                            className={
                              window.location.href.includes('/mobile') &&
                              !noDisabledTitle.includes(item.fileType)
                                ? styles.no_fileName
                                : styles.fielName
                            }
                            onClick={downloadLook.bind(
                              this,
                              item.fileUrl,
                              item.fileName,
                              item.fileType
                            )}
                            title={item.fileName}
                          >
                            {item.fileName}
                          </span>
                          <span className={styles.file_size}>
                            (
                            {item.fileSize
                              ? `${(item.fileSize / 1024 / 1024).toFixed(4)}MB`
                              : ''}
                            )
                          </span>
                        </div>
                      </Checkbox>
                    </Col>
                  </Row>
                )
              })}
          </Checkbox.Group>
        )}
      </div>
      {state.reNameVisible && (
        <UpdateFileName
          setState={setState}
          changeFileName={changeFileName}
          data={field.dataSource}
          checkedValues={state.checkedValues}
        />
      )}
      {state.visibleImg ? (
        <Image.PreviewGroup
          preview={{
            visible: state.visibleImg,
            current: state.imgIndex,
            onVisibleChange: (value) => {
              setState({
                imgIndex: 0,
                imgPreviewList: [],
                visibleImg: false,
              })
            },
          }}
        >
          {state.imgPreviewList.map((item) => {
            return (
              <Image
                width={200}
                key={item.fileUrl}
                style={{ display: 'none' }}
                src={item.fileUrl}
              />
            )
          })}
        </Image.PreviewGroup>
      ) : null}
      {state.downMoudleVisible && (
        <DownMoudle
          handelCancle={handelCancle}
          columnCode={columnCode}
          formCode={state.formCode || formJson?.form?.formCode}
        />
      )}
    </div>
  )
})
UploadFile.Behavior = createBehavior({
  name: 'UploadFile',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'UploadFile', //组件
  designerProps: {
    droppable: true,
    propsSchema: createFieldSchema(AllSchemas.UploadFile),
  },
  designerLocales: AllLocales.UploadFile, //语言
})

UploadFile.Resource = createResource({
  icon: <IconLeft type="icon-fujiankongjian" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        title: '上传文件',
        'x-decorator': 'FormItem',
        'x-component': 'UploadFile', //组件
        'x-data': {
          limitNumber: 10,
        },
        'x-component-props': {
          pagination: { pageSize: 10 },
          scroll: { x: '100%' },
          style: {
            ...initStyle?.style,
            'border-radius': '0px', //默认直角
            height: 'auto',
          },
        },
        'x-decorator-props': {
          labelStyle: {
            ...initStyle?.labelStyle,
            height: 'inherit',
            alignSelf: 'center',
            margin: '36px 0px 0px 0px', //为了与内容居中
          },
        },
      },
    },
  ],
})
