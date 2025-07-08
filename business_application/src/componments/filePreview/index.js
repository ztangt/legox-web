/**
 * 文件预览
 * layout：inline横排(不包含Checkbox) vertical竖着(不包含Checkbox) inline_check 横排(包含Checkbox) vertical_check竖着(包含Checkbox)
 * style自定义样式
 */
import {Checkbox,Image,Row,Col,Space,Typography,Divider} from 'antd';
import styles from './index.less';
import axios from 'axios';
import {useSetState} from 'ahooks';
import {connect} from 'dva'
function FilePreview(props){
  const {layout,style,dataSource,dispatch} = props;
  const [state,setState] = useSetState({
    imgPreviewList:[],//图片预览的数组
    visibleImg: false,//是否显示图片预览
    imgIndex: 0,//预览得几个图片
  }) 
  //img弹框，pdf打开新页签，其他的下载
  function downloadLook(src, filename, fileType,record, e) {
    e.stopPropagation()
    if (
      fileType == '.png' ||
      fileType == '.gif' ||
      fileType == '.jpg' ||
      fileType == '.jpeg'
    ) {
      let imgsList = []
      let tmpIndex = 0
      dataSource &&
        dataSource.map((item) => {
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
      setState({
        imgPreviewList: imgsList,
        visibleImg: true,
        imgIndex: tmpIndex,
      })
    } else if (fileType == '.pdf' || fileType == '.dwg') {
      let href = window.document.location.href
      let pathname = href.split('/business_application')
      window.open(`${pathname[0]}/business_application/pdfPreview?src=${src}`)
    } else if (fileType == '.docx') {
      let href = window.document.location.href
      let pathname = href.split('/business_application')
      window.open(`${pathname[0]}/business_application/filePreview?src=${src}`)
    } else if (fileType == '.xlsx') {
      let href = window.document.location.href
      let pathname = href.split('/business_application')
      window.open(`${pathname[0]}/business_application/excelPreview?src=${src}`)
    } else {
      if(src){
        download(src, filename)
      }else{
        dispatch({
          type: 'notification/getDownFileUrl',
          payload: {
              fileStorageId: record.fileId,
          },
          callback: (url) => {
            download(url, filename)
          },
        });
      }
    }
  }
  //下载
  function download(src, filename) {
    if (!src) {
      message.error('暂未生成下载地址,请保存后再进行该操作！')
      return
    }
    axios({ url: src, method: 'get', responseType: 'blob' }).then((res) => {
      try {
        const blobUrl = window.URL.createObjectURL(new Blob([res.data]))
        // 这里的文件名根据实际情况从响应头或者url里获取
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(blobUrl)
      } catch (e) {
        message.error('下载失败')
      }
    })
  }
  const verticalCheckRender=()=>{
    return (
      <Checkbox.Group
        className={styles.checkbox_list}
        // value={state.checkedValues}
        // onChange={changeCheck}
      >
        {dataSource &&
          dataSource.map((item) => {
            return (
              <Row>
                <Col span={24}>
                  <Checkbox
                    value={item.id}
                    className={styles.check_box}
                  >
                    <div className={styles.check_content}>
                      <span
                        className={styles.fielName}
                        onClick={downloadLook.bind(
                          this,
                          item.fileUrl,
                          item.fileName,
                          item.fileType,
                          item
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
    )
  }
  const inlineRender=()=>{
    return (
      <>
      {dataSource&&dataSource.map((item,index)=>{
        return (
          <>
            {index!=0?<Divider type="vertical" style={{background:'var(--ant-primary-color)'}}/>:null}
            <span
              className={styles.fielName}
              onClick={downloadLook.bind(
                this,
                item.fileUrl,
                item.fileName,
                item.fileType,
                item
              )}
              title={item.fileName}
            >
              {item.fileName}
            </span>
          </> 
        )
      })}    
      </>
    )
  }
  return (
  <>
    <div style={style?{ ...style}:{}} className={styles.file_preview_warp}>
      {layout=='vertical_check'?
      verticalCheckRender()
      :layout=='inline'?
      inlineRender()
      :null
    }
    </div>
    {state.visibleImg ? (
      <Image.PreviewGroup
      getContainer
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
  </>
  )
}
export default connect(({})=>({}))(FilePreview) 