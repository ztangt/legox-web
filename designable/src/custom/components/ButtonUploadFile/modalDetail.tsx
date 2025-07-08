import DownMoudle from '@/components/fileMoudle'
import GlobalModal from '@/public/GlobalModal/index.jsx'
import IUpload from '@/public/Upload/uploadModal'
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons'
import { Button, Card, Col, Image, Row, message } from 'antd'
import axios from 'axios'
import * as dd from 'dingtalk-jsapi'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
import excel_img from '../../../public/assets/excel.svg'
import pdf_img from '../../../public/assets/pdf.svg'
import ppt_img from '../../../public/assets/ppt.svg'
import word_img from '../../../public/assets/word.svg'
import other_img from '../../../public/assets/其他.svg'
import styles from './index.less'
import UpdateFileName from './updateFileName'
function ModalDetail({
  dataSource,
  parentSetState,
  deleteV2BizRelAttFn,
  onOk,
  props,
  returnType,
  ayscBeforeCondition,
  uploadSuccess,
  columnCode,
  formCode,
}) {
  const { targetKey, onDetail, formJson } = useModel('@@qiankunStateFromMaster')
  const { templateColumnList } = useModel('preview')
  console.log(
    'columnCode==',
    columnCode,
    formCode,
    formJson?.form?.formCode,
    templateColumnList.some(
      (item) =>
        item.formCode === (formCode || formJson?.form?.formCode) &&
        item.columnCode === columnCode
    )
  )
  console.log('onDetail', onDetail)

  // const [newDataSource, setNewDataSource] = useState<any>([])
  const [allPage, setAllPage] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [reNameVisible, setReNameVisible] = useState<boolean>(false)
  const [visibleImg, setVisibleImg] = useState(false)
  const [showImgId, setShowImgId] = useState('')
  const { updateBizRelAttName } = useModel('buttonUploadFile')
  const [downMoudleVisible, setDownMoudleVisible] = useState(false)

  useEffect(() => {
    // setNewDataSource(dataSource)
    if (dataSource.length > 8) {
      setAllPage(Math.ceil(dataSource.length / 8))
      setCurrentPage(1)
    } else if (dataSource.length > 0) {
      setAllPage(1)
      setCurrentPage(1)
    }
  }, [])
  //改变分页
  const changePage = (type: string) => {
    let tmpPage = currentPage
    if (type == 'pre') {
      tmpPage = currentPage - 1
    } else {
      tmpPage = currentPage + 1
    }
    setCurrentPage(tmpPage)
  }
  //下载
  function download(src: any, filename: string) {
    if (!src) {
      message.info('暂未生成下载地址,请保存后再进行该操作！')
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
    axios(src, { method: 'get', responseType: 'blob' }).then((res) => {
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
  //更新附件名称
  function onReNameFile(index: number) {
    setCurrentIndex(index)
    setReNameVisible(true)
  }
  //重命名
  const changeFileName = (fileName: string) => {
    updateBizRelAttName(
      {
        targetId: dataSource[currentIndex].id,
        newName: fileName,
      },
      () => {
        dataSource.map((item: any, index: number) => {
          if (index == currentIndex) {
            item.fileName = fileName
          }
        })
        parentSetState({ dataSource: dataSource })
        setCurrentIndex(0)
        setReNameVisible(false)
      }
    )
  }
  //上移，下移
  function arraymove(fromIndex: number, toIndex: number, type: string) {
    updateBizRelAttName(
      {
        targetId: dataSource[fromIndex]['id'],
        preId: type == 'down' ? dataSource[toIndex]['id'] : '',
        nextId: type == 'up' ? dataSource[toIndex]['id'] : '',
      },
      () => {
        let newData = _.cloneDeep(dataSource)
        let element = newData[fromIndex]
        newData.splice(fromIndex, 1)
        newData.splice(toIndex, 0, element)
        //更新数据
        parentSetState({
          dataSource: newData,
        })
      }
    )
  }
  const imgRender = (fileType: string, item: any) => {
    console.log('fileType===', fileType, item)
    let src = ''
    if (
      fileType == '.png' ||
      fileType == '.gif' ||
      fileType == '.jpg' ||
      fileType == '.jpeg'
    ) {
      src = item.fileUrl
      return <Image src={src} alt={item.fileName} height={'150px'} />
    } else if (
      fileType == '.doc' ||
      fileType == '.docx' ||
      fileType == '.dot' ||
      fileType == '.dotx' ||
      fileType == '.docm'
    ) {
      src = word_img
      if (fileType == '.docx') {
        return (
          <img
            alt={item.fileName}
            src={src}
            onClick={wordPreview.bind(this, item.fileUrl, item.fileName)}
            className={styles.img_icon}
          />
        )
      }
    } else if (fileType == '.xls' || fileType == '.xlsx') {
      src = excel_img
      if (fileType == '.xlsx') {
        return (
          <img
            alt={item.fileName}
            src={src}
            onClick={excelPreview.bind(this, item.fileUrl, item.fileName)}
            className={styles.img_icon}
          />
        )
      }
    } else if (fileType == '.pdf' || fileType == '.dwg') {
      src = pdf_img
      return (
        <img
          alt={item.fileName}
          src={src}
          onClick={pdfPreview.bind(this, item.fileUrl, item.fileName)}
          className={styles.img_icon}
        />
      )
    } else if (fileType == '.ppt' || fileType == '.pptx') {
      src = ppt_img
    } else {
      src = other_img
    }
    return <img alt={item.fileName} src={src} className={styles.img_icon} />
  }
  //pdf预览
  const pdfPreview = (src: string, fileName: string) => {
    let href = window.document.location.href
    let pathname = href.split('/business_application')
    if (window.location.href.includes('/mobile')) {
      if (dd.env.platform !== 'notInDingTalk') {
        dd.ready(function () {
          dd.openLink({
            url: `${
              pathname[0]
            }/business_application/pdfPreview?src=${encodeURIComponent(src)}`,
            success: () => {},
            fail: () => {},
            complete: () => {},
          })
        })
      }
      // onDetail(`/pdfPreview?src=${src}&fileName=${fileName}`)
    } else {
      let decoSrc = decodeURIComponent(src)
      let decoSrcs = decoSrc.split('?')[0].split('/')
      let title = decoSrcs[decoSrcs.length - 1]
      decoSrcs[decoSrcs.length - 1] = encodeURIComponent(title)
      let encodeSrc = decoSrcs.join('/')
      window.open(
        `${pathname[0]}/business_application/pdfPreview?src=${encodeSrc}`
      )
    }
  }
  //word预览
  const wordPreview = (src: string, fileName: string) => {
    let href = window.document.location.href
    let pathname = href.split('/business_application')
    if (window.location.href.includes('/mobile')) {
      if (dd.env.platform !== 'notInDingTalk') {
        dd.ready(function () {
          dd.openLink({
            url: `${pathname[0]}/business_application/filePreview?src=${src}`,
            success: () => {},
            fail: () => {},
            complete: () => {},
          })
        })
      }
      // onDetail(`/pdfPreview?src=${src}&fileName=${fileName}`)
    } else {
      window.open(`${pathname[0]}/business_application/filePreview?src=${src}`)
    }
  }
  //Excel预览
  const excelPreview = (src: string, fileName: string) => {
    let href = window.document.location.href
    let pathname = href.split('/business_application')
    if (window.location.href.includes('/mobile')) {
      if (dd.env.platform !== 'notInDingTalk') {
        dd.ready(function () {
          dd.openLink({
            url: `${pathname[0]}/business_application/excelPreview?src=${src}`,
            success: () => {},
            fail: () => {},
            complete: () => {},
          })
        })
      }

      // onDetail(`/excelPreview?src=${src}&fileName=${fileName}`)
    } else {
      window.open(`${pathname[0]}/business_application/excelPreview?src=${src}`)
    }
  }
  function onDownMoudle() {
    setDownMoudleVisible(true)
  }
  function handelCancle() {
    setDownMoudleVisible(false)
  }
  const uploadSuccessFn = (
    filePath: any,
    fileId: string,
    file: any,
    fileFullPath: string,
    sucessFiles: any
  ) => {
    const callback = (fileObject: any) => {
      let newDataSource = dataSource
      newDataSource.unshift(fileObject)
      if (newDataSource.length > 8) {
        setAllPage(Math.ceil(newDataSource.length / 8))
        setCurrentPage(1)
      } else if (newDataSource.length > 0) {
        setAllPage(1)
        setCurrentPage(1)
      }
      parentSetState({ dataSource: newDataSource })
    }
    uploadSuccess(filePath, fileId, file, fileFullPath, sucessFiles, callback)
  }
  const colRender = (item: any, index) => {
    return (
      <Col span={6} key={item.id} className={styles.col_wap}>
        <Card
          hoverable
          className={styles.card_warp}
          cover={imgRender(item.fileType, item)}
        >
          <p title={item.fileName} className={styles.p_file_name}>
            {item.fileName}
          </p>
          <div className={styles.opration_warp}>
            <span onClick={download.bind(this, item.fileUrl, item.fileName)}>
              下载
            </span>
            <span
              onClick={
                props.disabled
                  ? () => {}
                  : deleteV2BizRelAttFn.bind(this, item.id)
              }
              className={props.disabled ? styles.disabled_warp : ''}
            >
              删除
            </span>
            {index != 0 && (
              <span
                onClick={
                  props.disabled
                    ? () => {}
                    : arraymove.bind(this, index, index - 1, 'up')
                }
                className={props.disabled ? styles.disabled_warp : ''}
              >
                上移
              </span>
            )}
            {index != dataSource.length && (
              <span
                onClick={
                  props.disabled
                    ? () => {}
                    : arraymove.bind(this, index, index + 1, 'down')
                }
                className={props.disabled ? styles.disabled_warp : ''}
              >
                下移
              </span>
            )}
            <span
              onClick={
                props.disabled ? () => {} : onReNameFile.bind(this, index)
              }
              className={props.disabled ? styles.disabled_warp : ''}
            >
              重命名
            </span>
          </div>
        </Card>
      </Col>
    )
  }
  return (
    <GlobalModal
      visible={true}
      title="附件详情"
      onOk={() => {}}
      onCancel={() => {
        parentSetState({ isShowDetail: false })
      }}
      bodyStyle={{
        padding: '4px 16px 8px 16px',
        position: 'relative',
      }}
      widthType={3}
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return document.getElementById(`formShow_container_${targetKey}`)
      }}
      className={styles.detail_warp}
      footer={[
        <Button
          onClick={() => {
            onOk()
            parentSetState({ isShowDetail: false })
          }}
        >
          关闭
        </Button>,
      ]}
    >
      <div className={styles.header_warp}>
        <IUpload
          typeName={'全部类别'}
          requireFileSize={props.fileSizeMax || 35}
          mustFileType={returnType(props.attachType)}
          buttonContent={<Button disabled={props.disabled}>上传</Button>}
          ayscBeforeCondition={ayscBeforeCondition.bind(this)}
          uploadSuccess={uploadSuccessFn.bind(this)}
          filePath={`BizAttachment/${new Date().getTime()}`}
          disabled={props.disabled}
        />
        {templateColumnList.length &&
        templateColumnList.some(
          (item) =>
            item.formCode === (formCode || formJson?.form?.formCode) &&
            item.columnCode === columnCode
        ) ? (
          <Button
            onClick={props.disabled ? () => {} : onDownMoudle}
            className={props.disabled ? styles.disabled_warp : ''}
            style={{
              marginLeft: '10px',
            }}
          >
            模板下载
          </Button>
        ) : null}
      </div>
      <div className={styles.content_warp}>
        <Image.PreviewGroup>
          <Row className={styles.row_warp}>
            {dataSource.map((item: any, index: number) => {
              if (
                index <= (currentPage - 1) * 8 + 3 &&
                index >= (currentPage - 1) * 8
              ) {
                return colRender(item, index)
              } else {
                return
              }
            })}
          </Row>
          <Row className={styles.row_warp}>
            {dataSource.map((item: any, index: number) => {
              if (
                index > (currentPage - 1) * 8 + 3 &&
                index <= (currentPage - 1) * 8 + 7
              ) {
                return colRender(item, index)
              } else {
                return
              }
            })}
          </Row>
        </Image.PreviewGroup>
      </div>
      {dataSource.length ? (
        <div className={styles.page_warp}>
          <CaretLeftOutlined
            onClick={changePage.bind(this, 'pre')}
            disabled={currentPage == 1}
          />
          <span>
            {currentPage}/{allPage}
          </span>
          <CaretRightOutlined
            onClick={changePage.bind(this, 'next')}
            disabled={currentPage == allPage}
          />
        </div>
      ) : null}
      {reNameVisible && (
        <UpdateFileName
          setState={parentSetState}
          data={dataSource}
          currentIndex={currentIndex}
          changeFileName={changeFileName}
          setCurrentIndex={setCurrentIndex}
          setReNameVisible={setReNameVisible}
        />
      )}
      {downMoudleVisible && (
        <DownMoudle
          handelCancle={handelCancle}
          columnCode={columnCode}
          formCode={formCode}
        />
      )}
    </GlobalModal>
  )
}
export default ModalDetail
