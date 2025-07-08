import { Modal, Empty, Button, message } from 'antd'
import { useEffect, useState } from 'react'
import styles from './index.less'
import ColumnDragTable from '@/public/columnDragTable'
import GlobalModal from '@/public/GlobalModal'
import {
  WRITE_BORDER_LIST,
  ORDER_WIDTH,
  BASE_WIDTH,
} from '../../../service/constant'
import { useModel } from 'umi'
function Index({ setState }) {
  const { targetKey } = useModel('@@qiankunStateFromMaster')
  const [selectRowKey, setSelectRowKey] = useState([
    localStorage.getItem('boardType'),
  ]) // 选中行的主键ID集合 arr
  const [selectRows, setSelectRows] = useState(
    JSON.parse(localStorage.getItem('boardTypes'))
  ) // 选中行的all data
  const tableProps = {
    rowKey: 'value',
    columns: [
      {
        title: '手写板',
        dataIndex: 'name',
        width: BASE_WIDTH * 2.5,
      },
    ],
    dataSource: WRITE_BORDER_LIST,
    pagination: false,
    bordered: true,
  }
  const rowSelection = {
    type: 'radio',
    selectedRowKeys: selectRowKey,
    // 选择框勾选 ☑️
    onChange: (selectedRowKeys, selectedRows) => {
      // if(selectedRowKeys[0]!='WINDOWS_MT'){
      //   message.error('手写板型号不匹配！')
      //   return
      // }
      setSelectRows(selectedRows)
      setSelectRowKey(selectedRowKeys)
    },
  }
  function handelCanel() {
    setState({
      tableListVisible: false,
      boardType: selectRowKey[0], //取消选中，归位到历史数据
    })
  }

  return (
    <GlobalModal
      open={true}
      title="请选择手写板型号"
      mask={false}
      maskClosable={false}
      getContainer={() => {
        return document.getElementById(`formShow_container_${targetKey}`)
      }}
      widthType={'4'}
      onCancel={handelCanel.bind(this)}
      footer={[
        <Button key="cancel" onClick={handelCanel.bind(this)}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            Modal.confirm({
              title: '信息?',
              content: `确认将${selectRows?.[0]?.name}手写板作为你的默认型号吗`,
              okText: '确定',
              cancelText: '取消',
              mask: false,
              getContainer: () => {
                return document.getElementById(
                  `formShow_container_${targetKey}`
                )
              },
              onOk: () => {
                setState({
                  tableListVisible: false,
                  boardModal: true,
                  boardType: selectRowKey[0],
                })
                localStorage.setItem('boardType', selectRowKey[0])
                localStorage.setItem('boardTypes', JSON.stringify(selectRows))
                // document.getElementById('mengtian').setAttribute('src',selectRows?.[0].src)
              },
            })
          }}
        >
          保存
        </Button>,
      ]}
    >
      <div className={styles.table}>
        <ColumnDragTable
          {...tableProps}
          rowSelection={{
            ...rowSelection,
          }}
          taskType="MONITOR"
          tableLayout="fixed"
          scroll={{ y: 165, x: 'auto' }}
          // scroll={{ y: 45, x: 'auto' }}
        />
      </div>
    </GlobalModal>
  )
}

export default Index
