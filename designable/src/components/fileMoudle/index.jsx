import Table from '@/public/columnDragTable'
import GlobalModal from '@/public/GlobalModal'
import { Button, message } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
function Index({ handelCancle, formCode, columnCode }) {
  const { targetKey, bizSolId, deployFormId, bizInfo } = useModel(
    '@@qiankunStateFromMaster'
  )
  const [fileMoudleList, setFileMoudleList] = useState([])
  const { getTemplateFileList } = useModel('preview')
  const downloadFiles = (url, name) => {
    debugger
    axios({ url: url, method: 'get', responseType: 'blob' }).then((res) => {
      try {
        //res.blob().then((blob) => {
        const blobUrl = window.URL.createObjectURL(new Blob([res.data]))
        // 这里的文件名根据实际情况从响应头或者url里获取
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = name
        a.click()
        window.URL.revokeObjectURL(blobUrl)
        //})
      } catch (e) {
        message.error('下载失败')
      }
    })
  }
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (text, obj, index) => <span>{index + 1}</span>,
    },
    {
      title: '模版名称',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, obj, index) => (
        <>
          <a
            onClick={
              obj.downloadPath &&
              downloadFiles.bind(this, obj.downloadPath, obj.fileName)
            }
          >
            下载
          </a>
        </>
      ),
    },
  ]
  useEffect(() => {
    getTemplateFileList(
      {
        bizSolId: bizSolId,
        formDeployId: deployFormId,
        procDefId: bizInfo?.procDefId,
        formCode: formCode,
        columnCode: columnCode,
      },
      (list) => {
        setFileMoudleList(list)
      }
    )
  }, [formCode, columnCode])

  return (
    <GlobalModal
      visible={true}
      title="模版下载"
      onCancel={handelCancle}
      widthType={3}
      centered
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return document.getElementById(`formShow_container_${targetKey}`)
      }}
      bodyStyle={{ padding: '0px' }}
      footer={[
        <Button key="cancel" onClick={handelCancle}>
          取消
        </Button>,
        <Button type="primary" key="submit" onClick={handelCancle}>
          确定
        </Button>,
      ]}
    >
      <Table
        dataSource={fileMoudleList}
        columns={columns}
        rowKey={'columnId'}
        scroll={{ y: 'calc(100% - 40px)' }}
        pagination={false}
        taskType="MONITOR"
        bordered={true}
      />
    </GlobalModal>
  )
}
export default Index
