/**
 * 更新附件名称
 */
import { Modal, Input } from 'antd'
import { useEffect } from 'react'
import { useState, useContext } from 'react'
import { useModel } from 'umi'
const UpdateFileName = (props: any) => {
  const { targetKey } = useModel('@@qiankunStateFromMaster')
  const {
    data,
    currentIndex,
    changeFileName,
    setCurrentIndex,
    setReNameVisible,
  } = props
  const [fileName, setFileName] = useState<any>()
  useEffect(() => {
    //获取文件名称
    let fileNames = data[currentIndex].fileName.split('.')
    let newFileNames = []
    fileNames.map((item: any, index: number) => {
      if (index != fileNames.length - 1) {
        newFileNames.push(item)
      }
    })
    let tmpName = newFileNames.join('.')
    setFileName(tmpName)
  }, [])
  const onVisible = () => {
    setCurrentIndex(0)
    setReNameVisible(false)
  }
  const onReName = () => {
    changeFileName(fileName + data[currentIndex].fileType)
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
