import Table from '@/public/columnDragTable/index'
import { Input, Modal } from 'antd'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
import IPagination from '../../../public/iPagination'
import styles from './modal.less'
const AttachmentBizModal = ({
  onSaveAttachmentBiz,
  relBizInfoList,
  isMultiple,
  tableProps,
  onCancel,
}) => {
  const { targetKey } = useModel('@@qiankunStateFromMaster')
  const [searchWord, setSearchWord] = useState<string>()
  const [selectedRows, setSelectedRows] = useState<Array<any>>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [newSelectedRows, setNewSelectedRows] = useState<Array<any>>([]) //记录新增的数据
  const [limit, setLimit] = useState<number>(10)
  const [returnCount, setReturnCount] = useState<any>(0)
  const [dataSource, setDataSource] = useState<any>([])
  const [currentPage, setCurrentPage] = useState<any>(0)
  const { getAllWork } = useModel('designable')
  console.log('relBizInfoList=', relBizInfoList)
  //选中的信息(回显)
  useEffect(() => {
    if (relBizInfoList && relBizInfoList.length) {
      setSelectedRows(relBizInfoList)
      let keys = relBizInfoList.map((item) => {
        return item.relBizInfoId
      })
      setSelectedRowKeys(keys)
    }
    //获取全部事项列表
    getWorkList(1, limit, searchWord)
  }, [])
  const onChangeWord = (e) => {
    setSearchWord(e.target.value)
  }
  const getWorkList = (start: any, limit: any, searchWord: string) => {
    //获取全部事项列表
    getAllWork(
      {
        start,
        limit,
        searchWord,
        workRuleId: '',
      },
      (data) => {
        setReturnCount(data.returnCount)
        setDataSource(data.list)
        setCurrentPage(data.currentPage)
      }
    )
  }
  //isMultiple
  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log('selectedRows=', selectedRows)
      var srs = []
      let tmpSelectedRows =
        isMultiple == '1'
          ? selectedRows
          : [selectedRows[selectedRows.length - 1]]
      console.log('tmpSelectedRows=', tmpSelectedRows)
      for (let index = 0; index < tmpSelectedRows.length; index++) {
        //如果选中的信息已经选择过了则不需要记录了
        let isExist = relBizInfoList.filter((item: any) => {
          return item.relBizInfoId != tmpSelectedRows[index].bizInfoId
        })
        console.log('isExist==', isExist)
        const element = tmpSelectedRows[index]
        element.relBizInfoId = element.bizInfoId
        if (!relBizInfoList.length || isExist.length) {
          srs.push(element)
        }
      }
      console.log('srs===', srs)
      setNewSelectedRows(srs)
      setSelectedRowKeys(
        isMultiple == '1'
          ? selectedRowKeys
          : [selectedRowKeys[selectedRowKeys.length - 1]]
      )
    },
    getCheckboxProps: (record) => ({
      disabled:
        relBizInfoList.filter((item: any) => {
          return item.relBizInfoId == record.bizInfoId
        }).length != 0,
    }),
  }
  const clickSelect = (record: any) => {
    if (!selectedRowKeys.includes(record.bizInfoId)) {
      let tmpSelectedRows = []
      let tmpSelectedRowKeys = []
      if (isMultiple == '1') {
        newSelectedRows.push(record)
        tmpSelectedRows = _.cloneDeep(newSelectedRows)
        selectedRowKeys.push(record.bizInfoId)
        tmpSelectedRowKeys = _.cloneDeep(selectedRowKeys)
      } else {
        tmpSelectedRows = [record]
        tmpSelectedRowKeys = [record.bizInfoId]
      }
      setNewSelectedRows(tmpSelectedRows)
      setSelectedRowKeys(tmpSelectedRowKeys)
    } else {
      //移除
      let tmpKeys = selectedRowKeys.filter((i) => i != record.bizInfoId)
      let tmpSelectedRows =
        isMultiple == '1'
          ? selectedRows.filter((i) => i.bizInfoId != record.bizInfoId)
          : []
      setNewSelectedRows(tmpSelectedRows)
      setSelectedRowKeys(tmpKeys)
    }
  }
  //分页
  const changePage = (nextPage, size) => {
    setLimit(size)
    getWorkList(nextPage, size, searchWord)
  }
  return (
    <Modal
      width={800}
      visible={true}
      title={'选择关联事项'}
      onCancel={onCancel.bind(this)}
      maskClosable={false}
      mask={false}
      onOk={onSaveAttachmentBiz.bind(this, newSelectedRows)}
      bodyStyle={{
        paddingTop: '6px',
        paddingBottom: '0px',
        overflow: 'hidden',
      }}
      getContainer={() => {
        return document.getElementById(`formShow_container_${targetKey}`)
      }}
      className={styles.modal_warp}
    >
      <Input.Search
        placeholder={'请输入标题名称'}
        allowClear
        value={searchWord}
        onChange={onChangeWord.bind(this)}
        onSearch={getWorkList.bind(this, 1, limit)}
        style={{ marginBottom: '8px' }}
      />
      <Table
        {...tableProps}
        rowSelection={rowSelection}
        dataSource={dataSource}
        className={styles.modal_table}
        scroll={{ y: 'calc(100% - 40px)' }}
        bordered={true}
        onRow={(record) => {
          return {
            onClick: (event) => {
              clickSelect(record)
            }, // 点击行
          }
        }}
      />
      <IPagination
        total={returnCount}
        current={currentPage}
        pageSize={limit}
        onChange={changePage.bind(this)}
        style={{
          bottom: '48px',
          width: 'calc(100% - 48px)',
          borderTop: '1px solid rgb(240, 240, 240)',
          right: 'unset',
        }}
      />
    </Modal>
  )
}
export default AttachmentBizModal
