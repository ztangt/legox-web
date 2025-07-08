import GlobalModal from '@/public/GlobalModal/index.jsx'
import { Button, Image } from 'antd'
import { useModel } from 'umi'
import excel_img from '../../../public/assets/excel.svg'
import pdf_img from '../../../public/assets/pdf.svg'
import ppt_img from '../../../public/assets/ppt.svg'
import word_img from '../../../public/assets/word.svg'
import other_img from '../../../public/assets/其他.svg'
import styles from './mobileDetail.less'
const noDisabledTitle = ['.pdf', '.dwg', '.docx', '.xlsx', '.xls']
function ModalMobileDetail({
  dataSource,
  parentSetState,
  deleteV2BizRelAttFn,
  onOk,
  props,
  returnType,
  ayscBeforeCondition,
  uploadSuccess,
}) {
  const { targetKey } = useModel('@@qiankunStateFromMaster')
  const imgRender = (fileType: string, item: any) => {
    let src = ''
    if (
      fileType == '.png' ||
      fileType == '.gif' ||
      fileType == '.jpg' ||
      fileType == '.jpeg'
    ) {
      src = item.fileUrl
      return (
        <Image src={src} alt={item.fileName} rootClassName={styles.img_icon} />
      )
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
          <img alt={item.fileName} src={src} className={styles.items_icon} />
        )
      }
    } else if (
      fileType == '.xls' ||
      fileType == '.xls' ||
      fileType == '.xlsx'
    ) {
      src = excel_img
      return <img alt={item.fileName} src={src} className={styles.items_icon} />
    } else if (fileType == '.pdf' || fileType == '.dwg') {
      src = pdf_img
      return <img alt={item.fileName} src={src} className={styles.items_icon} />
    } else if (fileType == '.ppt' || fileType == '.pptx') {
      src = ppt_img
    } else {
      src = other_img
    }
    return <img alt={item.fileName} src={src} className={styles.items_icon} />
  }
  //预览
  const previewFile = (fileType: string, src: string) => {
    if (fileType == '.docx') {
      let href = window.document.location.href
      let pathname = href.split('/business_application')
      window.open(`${pathname[0]}/business_application/filePreview?src=${src}`)
    } else if (
      fileType == '.xls' ||
      fileType == '.xls' ||
      fileType == '.xlsx'
    ) {
      let href = window.document.location.href
      let pathname = href.split('/business_application')
      window.open(`${pathname[0]}/business_application/excelPreview?src=${src}`)
    } else if (fileType == '.pdf' || fileType == '.dwg') {
      let href = window.document.location.href
      let pathname = href.split('/business_application')
      window.open(`${pathname[0]}/business_application/pdfPreview?src=${src}`)
    }
  }
  return (
    <GlobalModal
      visible={true}
      title="附件详情"
      onOk={() => {}}
      onCancel={() => {
        parentSetState({ isShowDetail: false })
      }}
      bodyStyle={
        !window.location.href.includes('/mobile')
          ? {
              padding: '4px 16px 8px 16px',
              position: 'relative',
            }
          : {
              padding: '0px',
              position: 'relative',
            }
      }
      widthType={3}
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return document.getElementById(`formShow_container_${targetKey}`)
      }}
      className={styles.mobile_detail_warp}
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
      <div className={styles.list}>
        <Image.PreviewGroup>
          {dataSource.map((item) => {
            return (
              <div className={styles.list_items}>
                {imgRender(item.fileType, item)}
                <div className={styles.items_info}>
                  <span
                    className={
                      noDisabledTitle.includes(item.fileType)
                        ? styles.item_infos_text
                        : styles.disabled_warp
                    }
                    onClick={previewFile.bind(
                      this,
                      item.fileType,
                      item.fileUrl
                    )}
                  >
                    {item.fileName}
                  </span>
                  {/* <div className="text-wrapper_1-0 flex-row justify-between">
                    <span className="text_4-0">下载</span>
                    <span className="text_5-0">删除</span>
                    <span className="text_6-0">下移</span>
                    <span className="text_7-0">重命名</span>
                  </div> */}
                </div>
              </div>
            )
          })}
        </Image.PreviewGroup>
      </div>
    </GlobalModal>
  )
}
export default ModalMobileDetail
