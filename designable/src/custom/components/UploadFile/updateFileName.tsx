/**
 * 更新附件名称
 */
import { strLength } from '@/utils/utils'
import { Input, Modal, message } from 'antd'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
const UpdateFileName = (props: any) => {
  const masterProps = useModel('@@qiankunStateFromMaster')
  let { targetKey } = masterProps
  const { setState, data, currentIndex, changeFileName, checkedValues } = props
  const [fileName, setFileName] = useState<any>()
  const [info, setInfo] = useState<any>({})
  useEffect(() => {
    //获取当前选中的文件信息
    let tmpInfos = data.filter((i) => i.id == checkedValues[0])
    let tmpInfo = tmpInfos ? tmpInfos[0] : {}
    //获取文件名称
    let fileNames = tmpInfo.fileName.split('.')
    let newFileNames = []
    fileNames.map((item: any, index: number) => {
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
      _.find(data, function (o: any) {
        return o.fileName == tmpFileName
      })
    ) {
      message.error('文件名重复，请修改你上传的文件名')
      return false
    }
    changeFileName(fileName + info.fileType)
  }
  return (
    <Modal
      visible={true}
      title={'重命名'}
      onCancel={onVisible.bind(this, false)}
      maskClosable={false}
      mask={false}
      onOk={onReName.bind(this)}
      getContainer={() => {
        return document.getElementById(`formShow_container_${targetKey}`)
      }}
      width={400}
      bodyStyle={{ height: '140px' }}
    >
      <Input
        onChange={(e) => {
          setFileName(e.target.value)
        }}
        value={fileName}
      />
    </Modal>
  )
}
export default UpdateFileName
