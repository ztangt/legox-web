/**
 * 更新附件名称
 */
import { Input, Modal, message, Button } from 'antd'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
import GlobalModal from '../../../componments/GlobalModal';
import {strLength} from '../../../util/util'
const UpdateFileName = (props) => {
  const { setState, data, currentIndex, changeFileName, checkedValues,formModelingName } = props
  const [fileName, setFileName] = useState()
  const [info, setInfo] = useState({})
  useEffect(() => {
    //获取当前选中的文件信息
    let tmpInfos = data.filter((i) => i.id == checkedValues[0])
    let tmpInfo = tmpInfos ? tmpInfos[0] : {}
    //获取文件名称
    let fileNames = tmpInfo.fileName.split('.')
    let newFileNames = []
    fileNames.map((item, index) => {
      if (index != fileNames.length - 1) {
        newFileNames.push(item)
      }
    })
    let tmpName = newFileNames.join('.')
    setInfo(tmpInfo)
    setFileName(tmpName)
  }, [])
  const onVisible = () => {
    setState({ reNameVisible: false })
  }
  const onReName = () => {
    if (strLength(fileName) > 150) {
      message.error(`文件名最大为75个字`)
      return false
    }
    let tmpFileName = fileName + info.fileType
    if (
      data &&
      _.find(data, function (o) {
        return o.fileName == tmpFileName
      })
    ) {
      message.error('文件名重复，请修改你上传的文件名')
      return false
    }
    changeFileName(fileName + info.fileType)
  }
  return (
    <GlobalModal
      title={'重命名'}
      visible={true}
      widthType={1}
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return document.getElementById(formModelingName) || false;
      }}
      onCancel={onVisible.bind(this, false)}
      onOk={onReName.bind(this)}
    >
      <Input
        onChange={(e) => {
          setFileName(e.target.value)
        }}
        value={fileName}
      />
    </GlobalModal>
  )
}
export default UpdateFileName
