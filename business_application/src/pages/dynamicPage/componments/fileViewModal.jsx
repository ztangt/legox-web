import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Checkbox, Image, message, Modal, Select } from 'antd';
import IUpload from '../../../componments/Upload/uploadModal';
import GlobalModal from '../../../componments/GlobalModal';
import _ from 'lodash';
import styles from './fileViewModal.less';
import { useSetState } from 'ahooks';
import UpdateFileName from './updateFileName';
import axios from 'axios'
import {strLength} from '../../../util/util'
import { isArray } from 'xijs';
function Index({
  location,
  dispatch,
  onCancel
}) {
  const listId = location?.query?.listId || 0;
  const bizSolId = location?.query?.bizSolId || 0;
  const documentNumber = location?.query?.documentNumber || '';
  const numbers = React.useMemo(() => documentNumber.split(','), [documentNumber]);
  const formModelingName = `formModeling${bizSolId}${listId}`;
  const [state, setState] = useSetState({
    visibleImg: false,
    imgPreviewList: [],
    imgIndex: 0,
    checkedValues: [],
    sucessFiles: [],
    indeterminate: false,
    fileList: [],
    documentInfo:{},
    VOUCHER_FILE_LIST: [],
    ATTACHMENT_FILE: [],
    reNameVisible: false,
    number: numbers?.[0] || '',
  })  
  useEffect(() => {
    setState({ numer: numbers?.[0] || '' });
  }, [documentNumber]);

  useEffect(() => {
  //根据单据编号获取表单信息
    dispatch({
      type: 'dynamicPage/queryDocumentInfo',
      payload: {
        number: state.number
      },
      callback: (res) => {
        setState({
          documentInfo: res,
        })
        
      }
    })
    queryAccountVoucherFile()
  }, [state.number])
  //根据单据编号查询附件列表
  function queryAccountVoucherFile() {
    dispatch({
      type: 'dynamicPage/queryAccountVoucherFile',
      payload: {
        number: state.number
      },
      callback: (res) => {
        if (res) {
          setState({
            VOUCHER_FILE_LIST: res.VOUCHER_FILE ? res.VOUCHER_FILE : [],
            ATTACHMENT_FILE: res.ATTACHMENT_FILE ? res.ATTACHMENT_FILE : [],
            fileList: [ ...res?.EXPENSE_FILE, ...res?.ATTACHMENT_FILE, ...res?.RECEIPT_FILE, ...res?.VOUCHER_FILE],
            disableList: [...res?.EXPENSE_FILE, ...res?.ATTACHMENT_FILE, ...res?.RECEIPT_FILE],
            indeterminate: false,
            checkedValues: [],
          });
        }
      }
    })
  }
  //img弹框，pdf打开新页签，其他的下载
  function downloadLook(src, filename, fileType, e) {
    debugger
    e&&e.stopPropagation()
    e&&e.preventDefault()
    if(!src){
      printTemplate()
      return
    }
    if (
      fileType == '.png' ||
      fileType == '.gif' ||
      fileType == '.jpg' ||
      fileType == '.jpeg'
    ) {
      let imgsList = []
      let tmpIndex = 0
      state &&
        state.fileList.map((item) => {
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
      debugger
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
      let tmpInfos = state.fileList.filter(
        
        (i) => i.id == state.checkedValues[0]
      )
      let tmpInfo = tmpInfos[0]
      download(tmpInfo.fileUrl, tmpInfo.fileName)
    } else {
      dispatch({
        type: 'dynamicPage/getZip',
        payload: {
          zipName: state.number,
          filePaths: JSON.stringify([{
            bizTitle: state.number,
            fjName: [{
              label: state.number,
              list: state.checkedValues.map((item) => {
                let tmpInfos = state.fileList.filter((i) => i.id == item)
                let tmpInfo = tmpInfos[0]
                return {
                  filePath: tmpInfo.filePath,
                }
              }),
            }]
          }])
        },
        callback: (src) => {
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
                a.download = state.number + '.zip'
                a.click()
                window.URL.revokeObjectURL(blobUrl)
                //})
              } catch (e) {
                message.error('下载失败')
              }
            }
          )
        }
      })
      
    }
  }
  //下载
  function download(src, filename) {
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
  //删除
  function onDelete() {
    if (!state.checkedValues.length) {
      message.error('请选择文件')
      return
    }
    if(returnDisabled(state.checkedValues[0])){
      message.error('该文件不能操作')
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
        return document.getElementById(`${formModelingName}_upload`) || false;
      },
      onOk: async () => {
        dispatch({
          type: 'dynamicPage/deleteAccountVouchersFile',
          payload: {
            ids: state.checkedValues.join(','),
          },
          callback: (res) => {
            queryAccountVoucherFile()
          }
        })
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
    if(returnDisabled(state.checkedValues[0])){
      message.error('该文件不能操作')
      return    
    }
    setState({ reNameVisible: true })
  }
  function changeFileName(fileName) {
    // state.VOUCHER_FILE_LIST.map((item) => {
    //   if (item.id == state.checkedValues[0]) {
    //     item.fileName = fileName
    //   }
    // })
    // dispatch({
    //   type: 'dynamicPage/editFileAccountVouchersFile',
    //   payload: state.VOUCHER_FILE_LIST,
    //   callback: (res) => {
    //     queryAccountVoucherFile()
    //     setState({
    //       reNameVisible: false,
    //     })
    //   }
    // })
    dispatch({
      type: 'dynamicPage/editFileName',
      payload: {
        fileName,
        id: state.checkedValues[0]
      },
      callback: (res) => {
        queryAccountVoucherFile()
        setState({
          reNameVisible: false,
        })
      }
    })
  }
  //上传成功回调
  const uploadSuccess = (
    filePath,
    fileId,
    file,
    fileFullPath,
  ) => {
    debugger
    // setState({ sucessFiles: sucessFiles })
    let fileNames= file.name.split('.')
    let fileType = '.' + fileNames[fileNames.length - 1]
    let fileObject = {
      fileName: file.name,
      fileSize: file.size,
      fileType: fileType,
      // createTime: Math.floor(new Date().getTime() / 1000).toString(),
      // createUserName: window.localStorage.getItem('userName'),
      filePath: filePath,
      fileUrl: fileFullPath,
      fileId: fileId,
      // id: '',
    }
    let cmaAccountVoucherFile ={
      ...fileObject,
      mainTableId: state.documentInfo?.mainTableId,
      voucherNumber: state.number,
      bizInfoId: state.documentInfo?.bizId,
      bizSolId: state.documentInfo?.solId,
    }
    debugger
    dispatch({
      type: 'dynamicPage/uploadVouchersFile',
      payload: cmaAccountVoucherFile,
      callback: (res) => {
        queryAccountVoucherFile()
      }
    })
   
  }

  const beforeCondition = (file) => {
    // if (state.fileList && state.fileList.length == props.limitNumber) {
    //   message.error(`文件只能上传${props.limitNumber}条`)
    //   return false
    // }
    debugger
    const fileTypeName = file.name
    if (strLength(fileTypeName) > 150) {
      message.error(`文件名最大为75个字`)
      return false
    }
    if (
      state.fileList &&
      _.find(state.fileList, function (o) {
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
      state.fileList &&
        state.fileList.map((item) => {
          tmpCheckedValues.push(item.id)
        })
      setState({
        indeterminate: true,
        checkedValues: tmpCheckedValues,
      })
    }
  }
  //复选框的选择
const changeCheck = (list) => {
  setState(prevState => ({
    checkedValues: [...list],
    indeterminate: list.length === prevState.fileList.length
  }));
};
  //上移，下移
  function arraymove(type,fieldId) {
    if (!state.checkedValues.length) {
      message.error('请选择一个文件')
      return
    }
    if (state.checkedValues.length != 1) {
      message.error('请选择一个文件')
      return
    }
    if(returnDisabled(state.checkedValues[0])){
      message.error('该文件不能操作')
      return    
    }
    //fromIndex: number, toIndex: number,
    let fromIndex = 0
    let toIndex = 0
    state.VOUCHER_FILE_LIST.map((item, index) => {
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
      if (fromIndex == state.VOUCHER_FILE_LIST.length - 1) {
        return
      }
      toIndex = fromIndex + 1
    }
    let newData = _.cloneDeep(state.VOUCHER_FILE_LIST)
    let element = newData[fromIndex]
    element.sort = toIndex
    newData.splice(fromIndex, 1)
    newData.splice(toIndex, 0, element)
    dispatch({
      type: 'dynamicPage/editFileAccountVouchersFile',
      payload: newData,
      callback: (res) => {
        queryAccountVoucherFile()
      }
    })
  }
  function returnDisabled(id) {
    if(isArray(id)){
      return id.some(file => state.disableList.some(item => item.id === file))
    }else{
      return state.disableList.some(file => file.id === id)
    }
  }
  // 获取选中的文件URL
  function getSelectedFileUrls() {
    const selectedFiles = state.fileList.filter(file => 
      state.checkedValues.includes(file.id)
    );
    
    const fileUrls = selectedFiles.map(file =>  {return {pdfFilePath: file.filePath,pdfBucketName: file.tenantId}});
    return fileUrls;
  }
  function print(e) {
    if (!state.checkedValues.length) {
      message.error('请选择要打印的文件');
      return
    }
    if (state.checkedValues.length == 1) {
      //获取当前选中的文件信息
      let tmpInfos = state.fileList.filter(
        (i) => i.id == state.checkedValues[0]
      )
      let tmpInfo = tmpInfos[0]
      downloadLook(tmpInfo.fileUrl, tmpInfo.fileName, tmpInfo.fileType)
    } else {
      //获取表单合并打印URL
      dispatch({
        type: 'dynamicPage/getPDFMergeUrl',
        payload: {
          filePath: `BizAttachmentPDF/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}/${bizSolId}/${state.number}.pdf`,
          bucketName:localStorage.getItem('tenantId'),
          fileList: getSelectedFileUrls(),
        },
        callback: (url) => {
          downloadLook(`${url}`, `${state.number}.pdf`, '.pdf')
        },
      })
    }
  }
  function onselectNumber(value) {
    setState({
      number: value,
    })
  }
    // 打印按钮
  const printTemplate = (obj={}) => {
    //obj参数说明：showBatchPrintBtn=true显示批量打印按钮，默认不显示
    dispatch({
      type: 'formShow/getTemplateURL',
      payload: {
        deployFormId: state.documentInfo?.deployFormId,
        bizInfoId: state.documentInfo?.bizId,
        mainTableId: state.documentInfo?.mainTableId ,
        headers:{
          deployFormId: state.documentInfo?.deployFormId,
          mainTableId: state.documentInfo?.mainTableId ,
        }
      },
      callback: (url) => {
            historyPush({
                pathname: '/previewPrint',
                query: {
                    ...obj,
                    // oldFileId: form.values.FILE_ID,
                    mainTableId: state.documentInfo?.mainTableId,
                    bizInfoId: state.documentInfo?.bizId,
                    bizSolId: state.documentInfo?.solId,
                    url,
                },
                title: `打印${state.documentInfo?.mainTableId}`,
            });
        },
    });
  };
  return (
    <GlobalModal
      title={'附件查看'}
      visible={true}
      widthType={1}
      onCancel={onCancel}
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return document.getElementById(formModelingName) || false;
      }}
      footer={[<Button onClick={onCancel}>关闭</Button>]}
    >
      <div id={`${formModelingName}_upload`} className={styles.file_contaienr}>
        <div className={styles.select_header}>
          <span className={styles.select_label}>单据编号:</span>
          <Select onChange={onselectNumber} value={state.number} className={styles.select_number} defaultValue={numbers[0]}>
            {numbers && numbers?.map((item,key)=> <Select.Option value={item} key={key}>{item}</Select.Option>)}
          </Select>
        </div>

         <div className={styles.header}>
            <Button className={styles.bt} onClick={onCheckAllChange}>
              全选/取消
            </Button> 
            <IUpload
              typeName={'全部类别'}
              requireFileSize={40}
              mustFileType={'jpg,png,jpeg,doc,docx,xls,xlsx,pdf'}
              buttonContent={
                <Button className={styles.bt}>
                  上传
                </Button>
              }
              beforeCondition={beforeCondition.bind(this)}
              uploadSuccess={uploadSuccess.bind(this)}
              filePath={`BizAttachmentPDF/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}/${bizSolId}`}
              nameSpace={'dynamicPage'}
              multiple={true}
            />
            <Button className={styles.bt} onClick={downloadZip}>
              下载
            </Button>
            <Button
              className={styles.bt}
              onClick={print}
            >
              打印
            </Button>
            <Button
              className={styles.bt}
              onClick={onDelete}
              disabled={returnDisabled(state.checkedValues)}
            >
              删除
            </Button>
            <Button
              className={styles.bt}
              onClick={onReNameFile}
              disabled={returnDisabled(state.checkedValues)}
            >
              重命名
            </Button>
            <Button
              className={styles.bt}
              onClick={arraymove.bind(this, 'up')}
              disabled={returnDisabled(state.checkedValues)}
            >
              上移
            </Button>
            <Button
              className={styles.bt}
              onClick={arraymove.bind(this, 'down')}
              disabled={returnDisabled(state.checkedValues)}
            >
              下移
            </Button>
          </div>
            <div className={styles.checkbox_container}>
              <Checkbox.Group
                className={styles.checkbox_list}
                value={state.checkedValues}
                onChange={changeCheck}
              >
                {state.fileList.map((item, index) => {
                  const isLastVoucherFile = index === state.disableList.length;
                  return (
                    <React.Fragment key={item.id || `divider-${index}`}>
                      {isLastVoucherFile && (
                        <div className={styles.divider}></div>
                      )}
                      <Row>
                        <Col span={24}>
                          <Checkbox
                            value={String(item.id)}
                            className={styles.check_box}
                          >
                            <div className={styles.check_content}>
                              <span
                                className={styles.fielName}
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
                                ({item.fileSize ? `${(item.fileSize / 1024 / 1024).toFixed(4)}MB` : ''})
                              </span>
                            </div>
                          </Checkbox>
                        </Col>
                      </Row>
                    </React.Fragment>
                  );
                })}
              </Checkbox.Group>
            </div>
      </div>
      {state.reNameVisible && (
        <UpdateFileName
          setState={setState}
          changeFileName={changeFileName}
          data={state.VOUCHER_FILE_LIST}
          checkedValues={state.checkedValues}
          formModelingName={formModelingName}
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
    </GlobalModal>
  );
}

export default connect(({ dynamicPage }) => ({
  ...dynamicPage,
}))(Index);
