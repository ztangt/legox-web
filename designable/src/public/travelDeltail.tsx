import ColumnDragTable from '@/public/columnDragTable/index.jsx'
import IPagination from '@/public/iPagination.jsx'
import { Input, Tree } from 'antd'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
import GlobalModal from '../public/GlobalModal'
import ReSizeLeftRight from './reSizeLeftRight/reSizeLeftRight.jsx'
import travelStyles from './travelDetail.less'
const columns = [
  {
    title: '城市',
    dataIndex: 'cityName',
    key: 'cityName',
    render: (text) => <div style={{ minWidth: '48px' }}>{text}</div>,
  },
  {
    title: '级别',
    dataIndex: 'gradeName',
    key: 'gradeName',
    render: (text) => <div style={{ minWidth: '48px' }}>{text}</div>,
  },
  {
    title: '出差标准',
    dataIndex: 'travelStandardFee',
    key: 'travelStandardFee',
    render: (text) => <div style={{ minWidth: '68px' }}>{text}</div>,
  },
  {
    title: '旺季时间',
    dataIndex: 'hotTimeChoice',
    key: 'hotTimeChoice',
    render: (text) => <div style={{ minWidth: '68px' }}>{text}</div>,
  },
  {
    title: '旺季标准',
    dataIndex: 'hotStandardFee',
    key: 'hotStandardFee',
    render: (text) => <div style={{ minWidth: '68px' }}>{text}</div>,
  },
  {
    title: '公杂费补助',
    dataIndex: 'incidentalSubsidyFee',
    key: 'incidentalSubsidyFee',
    render: (text) => <div style={{ minWidth: '88px' }}>{text}</div>,
  },
  {
    title: '餐饮补助',
    dataIndex: 'foodSubsidyFee',
    key: 'foodSubsidyFee',
    render: (text) => <div style={{ minWidth: '68px' }}>{text}</div>,
  },
  {
    title: '其他补助',
    dataIndex: 'otherSubsidyFee',
    key: 'otherSubsidyFee',
    render: (text) => <div style={{ minWidth: '68px' }}>{text}</div>,
  },
]
function Detail({
  traveUserId,
  setIsShowModal,
  confirmFn,
  getTravelexpenseParams,
}) {
  const [cityName, setCityName] = useState<string>('')
  const [info, setInfo] = useState<string>('')
  const [searchWord, setSearchWord] = useState<string>('')
  const [selectCityCode, setSelectCityCode] = useState<string>('')
  const [selectCityName, setSelectCityName] = useState<string>('')
  const { targetKey } = useModel('@@qiankunStateFromMaster')
  console.log('selectCityName=', selectCityName)
  const {
    area,
    travelexpense,
    setState,
    getIcCity,
    getTravelexpense,
    limit,
    returnCount,
    currentPage,
  } = useModel('travel')
  useEffect(() => {
    //清空数据
    setState({ travelexpense: [], limit: 10, returnCount: 0, currentPage: 0 })
  }, [])
  //获取左侧地区树
  useEffect(() => {
    getIcCity({ cityName: cityName })
  }, [cityName])
  //获取右侧信息
  const onSelect = (selectedKeys: any, info: any) => {
    setSelectCityCode(selectedKeys[selectedKeys.length - 1])
    console.log('info=', info, getTravelexpenseParams)
    setSelectCityName(info.node.cityName)
    getTravelexpense({
      cityCode: selectedKeys[selectedKeys.length - 1],
      searchWord: '',
      start: 1,
      limit,
      identityId: traveUserId,
      registerFlag:
        window.localStorage.getItem('clientType') == 'PC'
          ? 'PLATFORM_SYS'
          : window.localStorage.getItem('clientType') == 'FRONT'
          ? 'PLATFORM_BUSS'
          : 'PLATFORM_MIC',
      ...getTravelexpenseParams,
    })
  }
  const onSearch = (value: any) => {
    setSearchWord(value)
    getTravelexpense({
      cityCode: selectCityCode,
      searchWord: value,
      start: 1,
      limit,
      identityId: traveUserId,
      registerFlag:
        window.localStorage.getItem('clientType') == 'PC'
          ? 'PLATFORM_SYS'
          : window.localStorage.getItem('clientType') == 'FRONT'
          ? 'PLATFORM_BUSS'
          : 'PLATFORM_MIC',
    })
  }
  const changePage = (nextPage: number, size: number) => {
    setState({ limit: size })
    getTravelexpense({
      cityCode: selectCityCode,
      searchWord: searchWord,
      start: nextPage,
      limit: size,
      identityId: traveUserId,
      registerFlag:
        window.localStorage.getItem('clientType') == 'PC'
          ? 'PLATFORM_SYS'
          : window.localStorage.getItem('clientType') == 'FRONT'
          ? 'PLATFORM_BUSS'
          : 'PLATFORM_MIC',
    })
  }
  const leftRender = () => {
    return (
      <div className={travelStyles.tree} style={{ paddingTop: '8px' }}>
        <Input.Search
          className={travelStyles.tree_search}
          placeholder={'请输入地区名称'}
          allowClear
          onSearch={(value: any) => {
            setCityName(value)
          }}
          style={{ width: '160px' }}
        />
        <Tree
          style={{
            overflow: 'auto',
            height: 'calc(100% - 32px)',
            paddingTop: '8px',
          }}
          onSelect={onSelect}
          treeData={area}
          fieldNames={{
            title: 'cityName',
            key: 'cityCode',
            children: 'children',
          }}
          showLine={{ showLeafIcon: true }}
          showIcon={true}
        />
      </div>
    )
  }
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setInfo(selectedRows[selectedRows.length - 1])
    },
  }
  const rightChildren = () => {
    return (
      <div
        className={travelStyles.right}
        style={{ paddingTop: '10px', overflow: 'hidden' }}
      >
        <div className={travelStyles.table_search}>
          <Input.Search
            className={travelStyles.ts_input}
            placeholder={'请输入关键词'}
            allowClear
            onSearch={(value: any) => {
              onSearch(value)
            }}
          />
        </div>
        <ColumnDragTable
          columns={columns}
          dataSource={travelexpense}
          rowKey={'travelId'}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          scroll={{ y: 'calc(100% - 40px)', x: 'auto' }}
          pagination={false}
          taskType="CATEGORY"
        />
        <IPagination
          pageSize={limit}
          current={currentPage}
          total={returnCount}
          onChange={changePage}
          style={{ width: 'inherit' }}
        />
      </div>
    )
  }
  return (
    <GlobalModal
      visible={true}
      onCancel={() => {
        setIsShowModal(false)
      }}
      widthType={3}
      title="信息"
      wrapClassName={travelStyles.travel_modal}
      onOk={confirmFn.bind(this, info, selectCityName)}
      mask={false}
      maskClosable={false}
      getContainer={() => {
        return document.getElementById(`formShow_container_${targetKey}`)
      }}
      bodyStyle={{ position: 'relative' }}
    >
      <ReSizeLeftRight
        level={1}
        height={'100%'}
        leftChildren={leftRender()}
        rightChildren={rightChildren()}
        vNum={168}
        vLeftNumLimit={100}
        vRigthNumLimit={700}
        suffix={`travel_${targetKey}`}
      />
    </GlobalModal>
  )
}
export default Detail
