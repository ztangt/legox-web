import { Fragment, useState, useRef,useEffect} from 'react';
import {Button} from '@/componments/TLAntd';
import { Form, Upload, Modal, message, Input, Image, Checkbox, Spin } from 'antd';
import Table from '../columnDragTable/index'
import { useDispatch, useSelector, useLocation } from 'umi';
import { DownloadOutlined, ArrowUpOutlined, ArrowDownOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import styles from './UploadFile.less';
// import {fetch} from 'dva'
import axios from 'axios';
import _, { trim } from 'lodash'
import { dataFormat } from '../../util/util';
import IUpload from '../../componments/public/Upload/uploadModal';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PullToRefresh, Modal as MobileModal, Toast, Popup ,Button as MobileButton} from 'antd-mobile/es'
import empty_bg from '../../../public/assets/empty_bg.svg'
const UploadForm = (props) => {
  const { tableColCode, fileSizeMax, attachType, limitNumber, relType, disabled, placeholder, state, setState, targetKey, isAuth } = props
  const dispatch = useDispatch();
  const { attachmentFormList, attachmentList, reNameVisible, currentTarget, newName, currentTargetIndex, cutomHeaders, bizInfo, attShowRequire } = state;
  const fileList = attachmentList;
  const [showSrc, setShowSrc] = useState('');
  const [visibleImg, setVisibleImg] = useState(false);
  const [imgPreviewList, setImgPreviewList] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);
  const [filePath, setFilePath] = useState('');
  const [checkedIds, setCheckedIds] = useState([]);
  const [uploadVisible, setUploadVisible] = useState(false);
  const divRef = useRef(null)
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const url = document
          .getElementById('fileContainer')
          ?.getAttribute('url');
        const id = document
          .getElementById('fileContainer')
          ?.getAttribute('fileStorageId');
        const fileSize = document
        .getElementById('fileContainer')
        ?.getAttribute('fileSize');
        const fileName = document
        .getElementById('fileContainer')
        ?.getAttribute('fileName');
        const fileFullPath = document
        .getElementById('fileContainer')
        ?.getAttribute('fileFullPath');
        if (url && id && fileSize && fileName && fileFullPath)  {
          uploadSuccess(url, id, {size:fileSize,name: fileName}, fileFullPath);
        }
      });
    });

    const observeConfig = {
      attributes: true,
      childList: false,
      subtree: false,
    };
    observer.observe(divRef.current, observeConfig);

    return () => observer.disconnect();
  }, []);
  function getFileList() {
    dispatch({
      type: 'formShow/getAttachmentList',
      payload: {
        bizInfoId: bizInfo.bizInfoId,
        relType: 'ATT'
      },
      callback: (data) => {
        setState({
          attachmentList: data
        })
      }
    })
  }
  useEffect(() => {
    if (bizInfo.bizInfoId && fileList.length == 0) {//为了tab切换数据部消失
      getFileList()
      setFilePath(`BizAttachment/${bizInfo.bizInfoId}`)
    }
  }, [])
  function onDelete(fileIds, index) {//删除附件
    function onOk() {
      //请求接口
      dispatch({
        type: 'formShow/deleteV2BizRelAtt',
        payload: {
          bizInfoId: bizInfo.bizInfoId,
          columnCode: '',
          ids: fileIds,
          mainTableId: cutomHeaders.mainTableId,
          subTableId: '',
          formCode: '',
          relType: 'ATT'
        },
        callback: () => {
          if (window.location.href.includes('/mobile')) {
            let list  = attachmentList.filter((item) => !checkedIds.toString().includes(item.fileId))
            setState({
              attachmentList: list
            })
          } else {
            attachmentList.splice(index, 1)
            setState({
              attachmentList
            })
          }
          
        }
      })
    }
    if (window.location.href.includes('/mobile')) {
      MobileModal.confirm({
        content: '是否删除',
        onConfirm: onOk,
      })
    } else {
      Modal.confirm({
        title: '确认删除此附件?',
        content: '',
        okText: '删除',
        cancelText: '取消',
        mask: false,
        getContainer: () => {
          return document.getElementById(`formShow_container_${targetKey}`)
        },
        onOk
      });
    }

  }
  function arraymove(fromIndex, toIndex, type) {
    //请求接口
    dispatch({
      type: "formShow/updateBizRelAttName",
      payload: {
        targetId: attachmentList[fromIndex]['id'],
        preId: type == 'down' ? attachmentList[toIndex]['id'] : '',
        nextId: type == 'up' ? attachmentList[toIndex]['id'] : '',
      },
      callback: () => {
        var element = attachmentList[fromIndex];
        attachmentList.splice(fromIndex, 1);
        attachmentList.splice(toIndex, 0, element);
        setState({
          attachmentList
        })
      }
    })
  }
  //上移下移
  function arraymoveMobile(text) {
    if (checkedIds.length != 1) {
      Toast.show({
        icon: 'error',
        content: '请选择一条数据移动',
      })
      return
    }
    let fromIndex = fileList.findIndex((item) => { return item.fileId == checkedIds[0] })
    if (text == '上移') {
      arraymove(fromIndex, fromIndex - 1, 'up')
    }
    if (text == '下移') {
      arraymove(fromIndex, fromIndex + 1 , 'down')
    }

  }

  function onReName() {//重命名
    //let tmpName = Itrim(newName);
    let tmpName = newName.replace(/^\s*/, '')
    console.log('tmpName==', tmpName);
    if (!tmpName) {
      message.error('请输入名称')
      return;
    } else if (tmpName.length > 50) {
      message.error('字段长度不能超过50')
      return;
    }
    //请求接口更新数据
    dispatch({
      type: "formShow/updateBizRelAttName",
      payload: {
        targetId: attachmentList[currentTargetIndex].id,
        newName: tmpName + attachmentList[currentTargetIndex].fileType,
      },
      callback: () => {
        attachmentList[currentTargetIndex].fileName = tmpName + attachmentList[currentTargetIndex].fileType
        setState({
          attachmentList
        })
        onVisible(false);
      }
    })
  }
  function onReNameFile(record, index) {
    if (window.location.href.includes('/mobile')) {
      index = fileList.findIndex((item) => { return item.fileId == checkedIds[0] })
      record = fileList[index]
    }
    let fileNames = record.fileName.split('.');
    let newFileNames = [];
    fileNames.map((item, index) => {
      if (index != fileNames.length - 1) {
        newFileNames.push(item);
      }
    })
    let tmpName = newFileNames.join('.');
    setState({
      newName: tmpName,
      currentTarget: record,
      currentTargetIndex: index,
    })
    onVisible(true);
  }

  function download(src, filename) {
    if (window.location.href.includes('/mobile')) {
      let index = fileList.findIndex((item) => { return item.fileId == checkedIds[0] })
      src = fileList[index].src
      filename = fileList[index].filename

    }
    if (!src) {
      message.error('暂未生成下载地址,请保存后再进行该操作！')
      return
    }
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

  const tableProps = {
    key: fileList,
    locale: { emptyText: '暂无数据' },
    columns: [
      {
        title: '序号',
        dataIndex: 'key',
        ellipsis: true,
        render: (text, record, index) => <div >{index + 1}</div>,
        width: '60px',
      },
      {
        title: '附件名称',
        dataIndex: 'fileName',
        ellipsis: true,
        render: (text, record) => <a onClick={downloadLook.bind(this, record.fileUrl, record.fileName, record.fileType)} title={text}>{text}</a>
      },
      {
        title: '附件类型',
        dataIndex: 'fileType',
        ellipsis: true,
        width: 80,
        render: (text, record, index) => <div >{record.fileId ? `${text.split('.')[text.split('.').length - 1]}` : record.fileName.split('.')[record.fileName.split('.').length - 1]}</div>
      },
      {
        title: '附件大小',
        dataIndex: 'fileSize',
        ellipsis: true,
        width: '88px',
        render: (text, record, index) => <div >{`${(text / 1024 / 1024).toFixed(2)}MB`}</div>

      },
      {
        title: '上传人',
        dataIndex: 'createUserName',
        ellipsis: true,
        render: (text, record, index) => <div title={record.fileId ? text : window.localStorage.getItem('userName')}>{record.fileId ? text : window.localStorage.getItem('userName')}</div>

      },
      {
        title: '上传时间',
        dataIndex: 'createTime',
        ellipsis: true,
        width: '120px',
        render: (text, record, index) => <div >{text ? dataFormat(text, 'YYYY-MM-DD') : ""}</div>
      },
      {
        title: '操作',
        dataIndex: 'ey',
        ellipsis: true,
        width: '80px',
        render: (text, record, index) => {
          return (
            <div>
              {
                isAuth && bizInfo.operation != 'view' ?
                  <>
                    <DownloadOutlined onClick={download.bind(this, record.fileUrl, record.fileName)} />
                    <CloseOutlined
                      onClick={bizInfo.operation == 'view' ? () => { } : onDelete.bind(this, record.id, index)}
                      style={bizInfo.operation == 'view' ? { color: 'rgb(221 209 209)' } : {}}
                    />
                    <EditOutlined
                      onClick={bizInfo.operation == 'view' ? () => { } : onReNameFile.bind(this, record, index)}
                      style={bizInfo.operation == 'view' ? { color: 'rgb(221 209 209)' } : {}}
                    />
                    {index == 0 ? '' :
                      <ArrowUpOutlined
                        onClick={bizInfo.operation == 'view' ? () => { } : arraymove.bind(this, index, index - 1, 'up')}
                        style={bizInfo.operation == 'view' ? { color: 'rgb(221 209 209)' } : {}}
                      />}
                    {(index == 0 && index == fileList.length - 1) || index == fileList.length - 1 ? '' :
                      <ArrowDownOutlined
                        onClick={bizInfo.operation == 'view' ? () => { } : arraymove.bind(this, index, index + 1, 'down')}
                        style={bizInfo.operation == 'view' ? { color: 'rgb(221 209 209)' } : {}}
                      />}
                  </> :
                  <DownloadOutlined onClick={download.bind(this, record.fileUrl, record.fileName)} />
              }
            </div>
          )
        }
      }
    ],
    dataSource: _.cloneDeep(fileList),
    rowKey: 'fileId',
    pagination: false,
  }
  //img弹框，pdf打开新页签，其他的下载
  function downloadLook(src, filename, fileType, e) {
    e&&e.stopPropagation();
    e&&e.preventDefault();
    if (fileType == '.png' ||
      fileType == '.gif' ||
      fileType == '.jpg' ||
      fileType == '.jpeg') {
      let imgsList = []
      let tmpIndex = 0
      fileList &&
        fileList.map((item) => {
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
      setImgPreviewList(imgsList);
      setImgIndex(tmpIndex);
      setVisibleImg(true);
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
  function onVisible(visible) {
    setState({
      reNameVisible: visible
    })
  }

  function onChangeName(e) {
    setState({
      newName: e.target.value
    })
  }
  function returnType(attachType) {
    if (attachType == 'DOC') {
      return '.docx,.doc,.xls,.xlsx'
    } else if (attachType == 'PIC') {
      return '.png,.jpeg,.gif,.jpg'

    } else if (attachType == 'NULL') {
      return ''
    }

  }
  function uploadFun(filePath, fileId, file, fileFullPath){
    alert('upload')
    // let fileNames = file.name.split('.')
    // let fileType = '.' + fileNames[fileNames.length - 1]
    // let fileObject = {
    //   fileName: file.name,
    //   fileSize: file.size,
    //   fileType: fileType,
    //   sort: attachmentList.length + 1,
    //   filePath: filePath,
    //   fileUrl: fileFullPath,
    //   createTime: Math.floor(new Date() / 1000),
    //   createUserName: window.localStorage.getItem('userName'),
    //   fileId: fileId,
    // }
    // //更新数据
    // let atts = []
    // atts.push(fileObject)
    // dispatch({
    //   type: "formShow/saveAppendBizRelAtt",
    //   payload: {
    //     bizInfoId: bizInfo?.bizInfoId,
    //     bizSolId: bizInfo?.bizSolId,
    //     mainTableId: cutomHeaders?.mainTableId,
    //     subTableId: '',
    //     formCode: '',
    //     columnCode: '',
    //     atts: atts,
    //     relType: 3
    //   },
    //   callback: (data) => {
    //     fileObject.id = data?.[0];
    //     attachmentList.push(fileObject)
    //     //移除必填项错误显示
    //     let tmpAttShowRequire = attShowRequire.filter(i => i != 'upload');
    //     setState({
    //       attachmentList,
    //       attShowRequire: tmpAttShowRequire
    //     })
    //   }
    // })
  }
  //上传成功后的回调
  const uploadSuccess = (filePath, fileId, file, fileFullPath) => {
    let fileNames = file.name.split('.')
    let fileType = '.' + fileNames[fileNames.length - 1]
    let fileObject = {
      fileName: file.name,
      fileSize: file.size,
      fileType: fileType,
      sort: attachmentList.length + 1,
      filePath: filePath,
      fileUrl: fileFullPath,
      createTime: Math.floor(new Date() / 1000),
      createUserName: window.localStorage.getItem('userName'),
      fileId: fileId,
    }
    //更新数据
    let atts = []
    atts.push(fileObject)
    dispatch({
      type: "formShow/saveAppendBizRelAtt",
      payload: {
        bizInfoId: bizInfo?.bizInfoId,
        bizSolId: bizInfo?.bizSolId,
        mainTableId: cutomHeaders?.mainTableId,
        subTableId: '',
        formCode: '',
        columnCode: '',
        atts: atts,
        relType: 3
      },
      callback: (data) => {
        if(window.location.href.includes('/mobile')){
          setUploadVisible(false)
          document?.getElementById('fileContainer')?.setAttribute("fileFullPath",""); 
          document?.getElementById('fileContainer')?.setAttribute("fileName",""); 
          document?.getElementById('fileContainer')?.setAttribute("url",""); 
          document?.getElementById('fileContainer')?.setAttribute("fileStorageId",""); 
          document?.getElementById('fileContainer')?.setAttribute("fileSize","");
        }
        fileObject.id = data?.[0];
        attachmentList.push(fileObject)
        //移除必填项错误显示
        let tmpAttShowRequire = attShowRequire.filter(i => i != 'upload');
        setState({
          attachmentList,
          attShowRequire: tmpAttShowRequire
        })

      }
    })
  }
  function onCanceluploadVisible(){
    setUploadVisible(false)
  }
  function renderUploadModal() {
    return (
      <Popup
        visible={uploadVisible}
        onMaskClick={onCanceluploadVisible}
        onClose={onCanceluploadVisible}
        bodyStyle={{ height: '16.77rem', background: '#f5f5f5' }}
      >
        <div
          className={styles.bottom_contianer}
          style={{
            height: 'calc(100% - 6.39rem)',
            display: 'block',
            paddingTop: '0rem',
          }}
        >
          <IUpload
            typeName={'attUpload'}
            requireFileSize={fileSizeMax}
            mustFileType={returnType(attachType)}
            uploadSuccess={uploadSuccess.bind(this)}
            filePath={filePath}
            buttonContent={<div className={styles.bottom_item}>拍照</div>}
            location={location}
            accept={'image/*'}
            capture={'camera'}
          />
          <div
            className={styles.bottom_item}
            onClick={() => {
              window.webUni &&
                window.webUni.postMessage({
                  data: {
                    title: 'upload',
                    containerId: 'fileContainer',
                    moudleName: filePath,
                  },
                });
            }}
          >
            从相册选择
          </div>
          <IUpload
            typeName={'attUpload'}
            requireFileSize={fileSizeMax}
            mustFileType={returnType(attachType)}
            uploadSuccess={uploadSuccess.bind(this)}
            filePath={filePath}
            buttonContent={<div className={styles.bottom_item}>文件管理器</div>}
            accept={returnType(attachType)}
          />
        </div>
        <div
          className={styles.bottom_cancel}
          onClick={onCanceluploadVisible}
        >
          取消
        </div>
      </Popup>
    );
  }
  return (
    <div className={styles.container} style={{ 'pointer-events': disabled ? 'none' : '', background: disabled ? '#f5f5f5' : '' }} id={'fileContainer'} ref={divRef}>
      {
        window.location.href.includes('/mobile') ?
          <>
            {isAuth && bizInfo.operation != 'view' ? <div className={styles.mobile_bt_container}>
              <a
                style={bizInfo.operation == 'view' ? { color: 'rgb(221 209 209)' } : {}}
                onClick={bizInfo.operation == 'view' ? () => { } :()=>{setUploadVisible(true)}}
              >
                上传
              </a>
              <a
                style={bizInfo.operation == 'view' ? { color: 'rgb(221 209 209)' } : {}}
                onClick={bizInfo.operation == 'view' ? () => { } : onReNameFile.bind(this)}
              >
                重命名
              </a>
              <a
                style={bizInfo.operation == 'view' ? { color: 'rgb(221 209 209)' } : {}}
                onClick={download.bind(this)}
              >
                下载
              </a>
              <a
                style={bizInfo.operation == 'view' ? { color: 'rgb(221 209 209)' } : {}}
                onClick={bizInfo.operation == 'view' ? () => { } : onDelete.bind(this, checkedIds)}
              >
                删除
              </a>
              <a
                style={bizInfo.operation == 'view' ? { color: 'rgb(221 209 209)' } : {}}
                onClick={bizInfo.operation == 'view' ? () => { } : arraymoveMobile.bind(this, '上移')}
              >
                上移
              </a>
              <a
                style={bizInfo.operation == 'view' ? { color: 'rgb(221 209 209)' } : {}}
                onClick={bizInfo.operation == 'view' ? () => { } : arraymoveMobile.bind(this, '下移')}
              >
                下移
              </a>
            </div> : fileList.length?<a
              onClick={download.bind(this)}
            >
              下载
            </a>:''}
            <Checkbox.Group
              className={styles.sol_container}
              id="scrollableFileDiv"
              onChange={(values) => { setCheckedIds(values) }}
              value={checkedIds}
            >
              {fileList.length == 0 ? (
                <div className={styles.empty}>
                  <img src={empty_bg} />
                  <h4>暂无数据</h4>
                </div>
              ) : (
                <PullToRefresh onRefresh={getFileList}>
                  <InfiniteScroll
                    dataLength={fileList.length}
                    hasMore={false}
                    loader={<Spin className="spin_div" />}
                    // endMessage={
                    //   fileList?.length == 0 ? (
                    //     ''
                    //   ) : (
                    //     <span className="footer_more">没有更多啦</span>
                    //   )
                    // }
                    scrollableTarget="scrollableFileDiv"
                  >
                    {_.cloneDeep(fileList).length != 0 &&
                      _.cloneDeep(fileList)?.map((l, index) => {
                        return (
                          <div key={l.fileId}>
                            <Checkbox value={l.fileId}>
                              <div className={styles.check_content}>
                                <span  className={styles.fielName}  onClick={downloadLook.bind(this, l.fileUrl, l.fileName, l.fileType)}>{l.fileName}</span>
                                <span className={styles.file_size}>
                                  (
                                  {l.fileSize
                                    ? `${(l.fileSize / 1024 / 1024).toFixed(4)}MB`
                                    : ''}
                                  )
                                </span>
                              </div>
                            </Checkbox>
                          </div>
                        );
                      })}
                  </InfiniteScroll>
                </PullToRefresh>
              )}
            </Checkbox.Group>
          </> : <>
            <div className={styles.bt_container}>
              {isAuth && bizInfo.operation != 'view' ? (bizInfo.operation == 'view' ?
                <Button className={styles.bt} disabled={true}>上传附件</Button> :
                <IUpload
                  typeName={'attUpload'}
                  requireFileSize={fileSizeMax}
                  mustFileType={returnType(attachType)}
                  buttonContent={
                    <Button className={styles.bt}>上传附件</Button>
                  }
                  uploadSuccess={uploadSuccess.bind(this)}
                  filePath={filePath}
                />
              ) : null}
            </div>
            <Table {...tableProps} className={styles.atttable} />
          </>
      }
      {
        reNameVisible &&window.location.href.includes('/mobile') && <Popup
          visible={true}
          onMaskClick={onVisible.bind(this, false)}
          onClose={onVisible.bind(this, false)}
          bodyStyle={{  background: '#f5f5f5',borderRadius: '0.86rem 0.86rem 0rem 0rem' }}
          showCloseButton
        >
          <div className={styles.rename_container}>
            <h1>重命名</h1>
            <Input onChange={onChangeName.bind(this)} value={newName} />  
          </div>
        <div className={styles.footer}><MobileButton color={'primary'} onClick={onReName.bind(this)}>确定</MobileButton></div>
      </Popup>
      }
      {reNameVisible &&  !window.location.href.includes('/mobile')&& <Modal
        visible={true}
        title={'重命名'}
        onCancel={onVisible.bind(this, false)}
        maskClosable={false}
        mask={false}
        onOk={onReName.bind(this)}
        getContainer={() => {
          return document.getElementById(`formShow_container_${targetKey}`)
        }}
      >
        <Input onChange={onChangeName.bind(this)} value={newName} />
      </Modal>}
      {/* {visibleImg&&<Image
            width={200}
            style={{display:"none"}}
            src={showSrc}
            preview={{
              visible:visibleImg,
              src:showSrc,
              onVisibleChange: (value) => {
                setVisibleImg(value);
                setShowSrc('');
              },
            }}
          />} */}
      {visibleImg ? (
        <Image.PreviewGroup
          preview={{
            visible: visibleImg,
            current: imgIndex,
            onVisibleChange: (value) => {
              setImgIndex(0);
              setImgPreviewList([]);
              setVisibleImg(false);
            },
          }}
        >
          {imgPreviewList.map((item) => {
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
      {uploadVisible&&renderUploadModal()}
    </div>
  )
}
export default UploadForm
