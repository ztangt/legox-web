import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import Table from '@/public/columnDragTable'
import { observer, useField } from '@formily/react'
import { useModel } from '@umijs/max'
import { Button, Input, message } from 'antd'
import { useEffect, useState } from 'react'
import { initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import IndicatorModal from './IndicatorModal'
import styles from './index.less'
import LookInfo from './lookInfo'
export const PerformanceIndicator: DnFC<any> = observer((props) => {
  // const form = useForm();
  // const fieldScme: any = useFieldSchema()
  const field = useField()
  const { dataSource, setState, getPerfromanceList } = useModel(
    'performanceIndicator'
  )
  const [isShowPerforman, setIsShowPerforman] = useState(false)
  const [listSelectedRowKeys, setListSelectedRowKeys] = useState([])
  const [listSelectedRows, setListSelectedRows] = useState([])
  const [isShowLookInfo, setIsShowLookInfo] = useState(false)
  const { location, cutomHeaders } = useModel('@@qiankunStateFromMaster')
  useEffect(() => {
    //将dataSource赋值给state中的dataSource
    if (
      !location?.pathname?.includes('formDesigner') &&
      cutomHeaders?.mainTableId
    ) {
      //请求获取指标数据
      getPerfromanceList({
        mainTableId: cutomHeaders?.mainTableId,
      })
    }
  }, [cutomHeaders])
  useEffect(() => {
    field.setDataSource(dataSource)
  }, [dataSource])
  const columns = [
    {
      title: '代码',
      dataIndex: 'listCode',
      key: 'listCode',
    },
    {
      title: '指标名称',
      dataIndex: 'performanceName',
      key: 'performanceName',
    },
    {
      title: '指标类型',
      dataIndex: 'performanceType',
      key: 'performanceType',
    },
    {
      title: '指标方向',
      dataIndex: 'performanceDirect',
      key: 'performanceDirect',
    },
    {
      title: '指标值',
      dataIndex: 'performanceValue',
      key: 'performanceValue',
      render: (text: any, record: any, index: number) => {
        if (record.isParent == '1') {
          //父节点的不能编辑
          return <div>{text}</div>
        } else {
          return (
            <Input
              defaultValue={text}
              onBlur={changePerformanceValue.bind(
                this,
                record,
                index,
                'performanceValue'
              )}
            />
          )
        }
      },
    },
    {
      title: '计量单位',
      dataIndex: 'unitOfMeasurement',
      key: 'unitOfMeasurement',
    },
    {
      title: '分值（权重）',
      dataIndex: 'score',
      key: 'score',
      render: (text: any, record: any, index: number) => {
        if (record.isParent == '1') {
          //父节点的不能编辑
          return <div>{text}</div>
        } else {
          return (
            <Input
              defaultValue={text}
              onBlur={changePerformanceValue.bind(this, record, index, 'score')}
            />
          )
        }
      },
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      render: (text: any, record: any, index: number) => {
        if (record.isParent == '1') {
          //父节点的不能编辑
          return <div>{text}</div>
        } else {
          return (
            <Input
              defaultValue={text}
              onBlur={changePerformanceValue.bind(this, record, index, 'memo')}
            />
          )
        }
      },
    },
  ]
  //改变指标值
  const changePerformanceValue = (
    record: any,
    index: number,
    type: string,
    e: any
  ) => {
    let value = e.target.value
    if (type == 'score') {
      debugger
      //如果是分值的话，更改分之则改变父的分值
      let listCodes = record.listCode.toString().split('.')
      let tmpParentInfo = { parentId: '' }
      dataSource.map((item) => {
        if (item.performanceId == record.parentId) {
          item.score =
            parseFloat(item.score || '0') +
            parseFloat(value || '0') -
            parseFloat(record.score || '0')
          if (item.parentId != '0') {
            tmpParentInfo = item
          }
        }
      })
      if (listCodes.length == 3) {
        //是三级的时候同时也需要更新一级的
        dataSource.map((item) => {
          if (item.performanceId == tmpParentInfo.parentId) {
            item.score =
              parseFloat(item.score || '0') +
              parseFloat(value || '0') -
              parseFloat(record.score || '0')
          }
        })
      }
    }
    dataSource[index][type] = value
    setState({
      dataSource: JSON.parse(JSON.stringify(dataSource)),
    })
  }
  const showPerforman = () => {
    setIsShowPerforman(true)
  }
  //点击行为选中状态
  const clickRow = (record: any) => {
    setListSelectedRowKeys([record.performanceId])
    setListSelectedRows([record])
  }
  const lookInfoFn = () => {
    if (!listSelectedRowKeys.length) {
      message.error('请选择要查看的指标')
      return
    }
    setIsShowLookInfo(true)
  }
  return (
    <div className={styles.per_ind_warp}>
      <div className={styles.w_button}>
        <Button onClick={showPerforman.bind(this)}>指标挑选</Button>
        <Button>新增</Button>
        <Button onClick={lookInfoFn.bind(this)}>查看</Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        rowKey={'performanceId'}
        onRow={(record) => {
          return {
            onClick: clickRow.bind(this, record), // 点击行
          }
        }}
        rowSelection={{
          selectedRowKeys: listSelectedRowKeys,
          hideSelectAll: true,
          onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRowKeys.length == 0) {
              setListSelectedRowKeys([])
              setListSelectedRows([])
            } else if (selectedRowKeys.length == 1) {
              setListSelectedRowKeys(selectedRowKeys)
              setListSelectedRows(selectedRows)
            } else {
              setListSelectedRowKeys([selectedRowKeys[1]])
              setListSelectedRows([selectedRows[1]])
            }
          },
        }}
      />
      {isShowPerforman && (
        <IndicatorModal setIsShowPerforman={setIsShowPerforman} />
      )}
      {isShowLookInfo && (
        <LookInfo
          setIsShowLookInfo={setIsShowLookInfo}
          listSelectedRows={listSelectedRows}
        />
      )}
    </div>
  )
})

PerformanceIndicator.Behavior = createBehavior({
  name: 'PerformanceIndicator',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PerformanceIndicator',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.PerformanceIndicator),
  },
  designerLocales: AllLocales.PerformanceIndicator,
})

PerformanceIndicator.Resource = createResource({
  icon: 'DatePickerSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: '项目绩效指标',
        'x-decorator': 'FormItem',
        'x-component': 'PerformanceIndicator',
        'x-component-props': {
          style: {
            ...initStyle?.style,
            height: 'auto',
          },
        },
        'x-decorator-props': {
          labelStyle: {
            ...initStyle?.labelStyle,
            width: '0px',
            display: 'none',
          },
        },
      },
    },
  ],
})
