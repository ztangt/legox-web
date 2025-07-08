import IconLeft from '@/Icon-left'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import Table from '@/public/columnDragTable/index'
import { dataFormat } from '@/utils/utils'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import { observer, useField, useFieldSchema, useForm } from '@formily/react'
import { useSetState } from 'ahooks'
import { Button, message } from 'antd'
import { TableProps } from 'antd/lib/table'
import classnames from 'classnames'
import _ from 'lodash'
import { useEffect } from 'react'
import { useModel } from 'umi'
import { initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import AttachmentBizModal from './attachmentBizModal'
import styles from './index.less'

interface State {
  attachmentBizModal: boolean //单据弹框
}
const returnTableProps = (
  isModal: boolean,
  placeholder?: string,
  onDelete?: any,
  arraymove?: any,
  bizList?: any,
  field?: any
) => {
  let columns = [
    {
      title: '序号',
      dataIndex: 'key',
      ellipsis: true,
      render: (text, record, index) => <div>{index + 1}</div>,
      width: '60px',
      fixed: 'left',
    },
    {
      title: '标题',
      dataIndex: 'bizTitle',
      ellipsis: true,
      render: (text) => <span title={text}>{text}</span>,
    },
    {
      title: '业务类型',
      dataIndex: 'bizSolName',
      ellipsis: true,
      render: (text) => <span title={text}>{text}</span>,
    },
    {
      title: '办理状态',
      dataIndex: 'bizStatus',
      width: '80px',
      ellipsis: true,
      render: (text) => (
        <div>{text == '0' ? '待发' : text == '1' ? '待办' : '办结'}</div>
      ),
    },
    {
      title: '拟稿人',
      dataIndex: 'draftUserName',
      ellipsis: true,
      render: (text) => <span title={text}>{text}</span>,
    },
    {
      title: '拟稿时间',
      dataIndex: 'draftTime',
      width: '120px',
      ellipsis: true,
      render: (text) => <div>{dataFormat(text, 'YYYY-MM-DD')}</div>,
    },
  ]
  if (!window.location.href.includes('/mobile')) {
    columns = columns.concat({
      title: '操作',
      dataIndex: 'operation',
      width: '80px',
      ellipsis: true,
      fixed: 'right',
      render: (text, record, index) => (
        <div className={styles.operation}>
          <CloseOutlined
            onClick={onDelete.bind(this, index)}
            disabled={!field.editable}
          />
          {index == 0 ? (
            ''
          ) : (
            <ArrowUpOutlined
              onClick={arraymove.bind(this, index, index - 1)}
              disabled={!field.editable}
            />
          )}
          {(index == 0 && index == bizList.length - 1) ||
          index == bizList.length - 1 ? (
            ''
          ) : (
            <ArrowDownOutlined
              onClick={arraymove.bind(this, index, index + 1)}
              disabled={!field.editable}
            />
          )}
        </div>
      ),
    })
  }

  let modalcolumns = columns.filter((item) => item.dataIndex != 'operation')
  let tableProps = {
    columns: isModal ? modalcolumns : columns,
    rowKey: isModal ? 'bizInfoId' : 'relBizInfoId',
    pagination: false,
    locale: { emptyText: placeholder ? placeholder : '暂无数据' },
    scroll: { x: 'auto' },
  }
  return tableProps
}
export const AttachmentBiz: DnFC<TableProps<any>> = observer((props: any) => {
  const field = useField()
  const [state, setState] = useSetState<State>({
    attachmentBizModal: false,
  })
  const masterProps = useModel('@@qiankunStateFromMaster')
  const { redCol } = masterProps
  const form = useForm()
  const fieldScme: any = useFieldSchema()
  const columnCode: string = fieldScme ? fieldScme.columnCode : ''
  //        atts.push({relType:'FORM',columnCode: item,relBizInfoIds:formRelBizInfoList[item].map((item)=>item.relBizInfoId)});
  useEffect(() => {
    if (field.dataSource && field.dataSource.length) {
      let att_array = form.values['attachment_array'] || []
      console.log('att_array=', att_array)
      console.log('field.dataSource=', field.dataSource)
      let attsInfo = {
        relType: 'FORM',
        columnCode: columnCode,
        relBizInfoIds: field.dataSource.map((item) => item.relBizInfoId),
      }
      //debugger;
      let tmpArray = []
      if (att_array.length) {
        att_array.map((item) => {
          if (item.columnCode == columnCode) {
            tmpArray.push(attsInfo)
          } else {
            tmpArray.push(item)
          }
        })
      } else {
        tmpArray.push(attsInfo)
      }
      //debugger;
      form.setValuesIn('attachment_array', tmpArray)
      field.setValue('noempty') //这个是为了在规则定义中判断是否为空的情况
      //debugger;
    } else {
      field.setValue('') //这个是为了在规则定义中判断是否为空的情况
    }
  }, [field.dataSource])
  const onSaveAttachmentBiz = (relBizInfoList: any) => {
    console.log('relBizInfoList=', relBizInfoList)
    if (relBizInfoList.length == 0) {
      message.error('请至少选择一条关联数据！')
      return
    }
    let tmpDataSource = field.dataSource || []
    let relBizList = tmpDataSource.concat(relBizInfoList)
    setState({ attachmentBizModal: false })
    field.setDataSource(relBizList)
  }
  console.log('fielf====', field)
  //关闭
  const onCancel = () => {
    setState({ attachmentBizModal: false })
  }
  //删除
  const onDelete = (index) => {
    console.log('index===', index)
    let dataSource = _.cloneDeep(field.dataSource)
    dataSource.splice(index, 1)
    console.log('dataSource=', dataSource)
    field.setDataSource(dataSource)
  }
  //上移下移
  const arraymove = (fromIndex, toIndex) => {
    var element = field.dataSource[fromIndex]
    let dataSource = _.cloneDeep(field.dataSource)
    dataSource.splice(fromIndex, 1)
    dataSource.splice(toIndex, 0, element)
    field.setDataSource(dataSource)
  }
  //redcol包含此字段编码的时候则背景变成红色
  const getClassName = () => {
    if (
      redCol &&
      redCol.length &&
      redCol.filter((i) => i.code == `0__${columnCode}`).length
    ) {
      return true
    } else {
      return false
    }
  }
  return (
    <div
      className={classnames(
        styles.upload_warp,
        props.redClassName ? styles.redClassName : ''
      )}
    >
      <div className={styles.header}>
        <Button
          onClick={
            field.authType != 'NONE'
              ? () => {
                  setState({ attachmentBizModal: true })
                }
              : () => {}
          }
          disabled={!field.editable}
          className={styles.button_left}
        >
          引用
        </Button>
      </div>
      <Table
        {...props}
        dataSource={props.authType != 'NONE' ? field.dataSource : []}
        pagination={false}
        bordered={true}
        {...returnTableProps(
          false,
          props.placeholder,
          onDelete,
          arraymove,
          field.dataSource || [],
          field
        )}
      />
      {state.attachmentBizModal && (
        <AttachmentBizModal
          onVisible={() => {
            setState({ attachmentBizModal: false })
          }}
          onSaveAttachmentBiz={onSaveAttachmentBiz}
          tableProps={returnTableProps(true)}
          relBizInfoList={field.dataSource || []}
          isMultiple={props.isMultiple}
          onCancel={onCancel}
        />
      )}
    </div>
  )
})
AttachmentBiz.Behavior = createBehavior({
  name: 'AttachmentBiz',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'AttachmentBiz', //组件
  designerProps: {
    droppable: true,
    propsSchema: createFieldSchema(AllSchemas.AttachmentBiz),
  },
  designerLocales: AllLocales.AttachmentBiz, //语言
})

AttachmentBiz.Resource = createResource({
  icon: <IconLeft type="icon-guanlianwenjian" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        title: '关联文件',
        'x-decorator': 'FormItem',
        'x-component': 'AttachmentBiz', //组件
        'x-component-props': {
          style: {
            ...initStyle?.style,
            height: 'auto',
            padding: '0px',
          },
          isMultiple: '1',
        },
        'x-decorator-props': {
          labelStyle: {
            ...initStyle?.labelStyle,
            height: 'inherit',
            alignSelf: 'center',
          },
        },
      },
    },
  ],
})
