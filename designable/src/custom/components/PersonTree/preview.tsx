import MyIcon from '@/Icon'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC, useSelectedNode } from '@/designable/react'
import GlobalModal from '@/public/GlobalModal/index.jsx'
import RelevanceModal from '@/public/RelevanceModal/relevanceModal'
import { getColumnCodeValue, setColumnCodeValue } from '@/utils/formUtil'
import { observer, useField, useFieldSchema, useForm } from '@formily/react'
import { Input } from 'antd'
import { InputProps } from 'antd/lib/input'
import classnames from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useModel } from 'umi'
import { initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
//组件的属性，可以用antd组件的属性，也可以自定义属性
// interface ExtraProps  extends SelectProps{
//   orgUserType: string;
// }
//observer（当一个组件内部使用了 observable 对象，而你希望组件响应 observable 对象的变化时）
export const PersonTree: DnFC<InputProps> = observer((props) => {
  const { targetKey } = useModel('@@qiankunStateFromMaster')
  const fieldScme: any = useFieldSchema()
  const [dataNames, setDataNames] = useState([])
  const [dataIds, setDataIds] = useState([])
  const [isOk, setIsOk] = useState(false) //为了初始化
  const [modalDisable, setModalDisable] = useState(false)
  let columnCode: string = fieldScme ? fieldScme.name : ''
  let columnCodeId = columnCode ? columnCode.split('NAME_')[0] + 'ID_' : ''
  const form = useForm()
  const field = useField()
  //获取父节点的code
  const pathSegments = field.path.segments
  const selectedNode =
    pathSegments[0] == 'x-component-props' ? useSelectedNode() : ''
  const [activeKey, setActiveKey] = useState<boolean>(false) //是否显示弹框
  useEffect(() => {
    //初始化
    if (pathSegments[0] == 'x-component-props') {
      setDataNames(
        selectedNode.props['x-component-props'][columnCode]
          ? selectedNode.props['x-component-props'][columnCode]
          : []
      )
      setDataIds(
        selectedNode.props['x-component-props'][columnCodeId]
          ? selectedNode.props['x-component-props'][columnCodeId]
          : []
      )
    }
  }, [])
  useMemo(() => {
    console.log('111111====', dataNames)
    if (isOk) {
      var columnvalue = {
        [columnCode]: dataNames.join(','),
        [columnCodeId]: dataIds.join(','),
      }
      setColumnCodeValue(
        form,
        pathSegments,
        columnCode,
        columnvalue,
        true,
        () => {},
        selectedNode
      )
      setIsOk(false)
    }
  }, [dataNames])
  const relevanceData = useRef()
  const renderTabs = () => {
    const defaultSelectedDataIds = () => {
      if (columnCodeId) {
        var value = getColumnCodeValue(
          form,
          pathSegments,
          columnCodeId,
          selectedNode
        )?.value
        if (value) {
          return value.split(',')
        } else {
          return []
        }
      }
    }
    if (activeKey) {
      return (
        <GlobalModal
          visible={true}
          title="请选择"
          bodyStyle={{ padding: '16px 0px 0px 0px' }}
          onCancel={() => {
            setActiveKey(false)
          }}
          okText="确认"
          cancelText="取消"
          okButtonProps={{ disabled: modalDisable }}
          onOk={async () => {
            setModalDisable(true)
            setTimeout(() => {
              setModalDisable(false)
            }, 1000)
            let dataNames: any = []
            let dataIds: any = []
            //获取弹框组件的选择数据
            await relevanceData.current.getSelectedDatas().map((item: any) => {
              dataNames.push(item.userName)
              dataIds.push(item.identityId)
            })
            props?.onOk?.(relevanceData.current.getSelectedDatas())
            setActiveKey(false)
            if (columnCodeId) {
              setIsOk(true)
              setDataIds(dataIds)
              setDataNames(dataNames)
            }
          }}
          mask={false}
          maskClosable={false}
          getContainer={() => {
            return (
              document.getElementById(`formShow_container_${targetKey}`) ||
              document.getElementById(`preview_warp`)
            )
          }}
          containerId={
            window.location.href?.includes('formDesigner')
              ? 'preview_warp'
              : `formShow_container_${targetKey}`
          }
          widthType={3}
        >
          <RelevanceModal
            orgUserType={'USER'}
            defaultSelectedDataIds={defaultSelectedDataIds()}
            ref={relevanceData}
            type={props.limitorg}
            nodeIds={props.OrgTreeID_}
            selectButtonType={props.selectButtonType}
            treeType={'ALL'}
            containerId={`person_${targetKey}`}
          />
        </GlobalModal>
      )
    } else {
      return null
    }
  }
  const getValueFn = () => {
    var value = getColumnCodeValue(form, pathSegments, columnCode, selectedNode)
      ?.value
    return value
    // if (pathSegments.length > 1 && pathSegments[0] != 'x-component-props') {
    //   //包含在字表里面
    //   const index = pathSegments[pathSegments.length - 2]
    //   const parentCode = pathSegments[pathSegments.length - 3]
    //   const tabelValue = form.values[parentCode]
    //   return tabelValue?.[index]?.[columnCode]
    // } else if (pathSegments[0] == 'x-component-props') {
    //   return selectedNode?.props['x-component-props']?.[columnCode]
    // } else {
    //   return form.values[columnCode]
    // }
  }
  //改变输入框(用于清空的情况,输入框不能输入)
  const changeInput = (e: any) => {
    setIsOk(true)
    setDataIds([])
    setDataNames([])
  }
  return (
    <div
      id="user_select"
      className={classnames('user_select', props.redClassName)}
      style={{ minWidth: '80px', width: '100%' }}
    >
      {renderTabs()}
      <Input
        {...props}
        value={field.authType == 'NONE' ? '' : getValueFn()}
        onClick={() => {
          setActiveKey(true)
        }}
        placeholder={props.disabled ? '' : props.placeholder}
        allowClear
        suffix={
          <MyIcon
            className={'click_suffix'}
            type="icon-renyuanshu"
            onClick={() => {
              !props.disabled && setActiveKey(true)
            }}
            style={
              !props.disabled ? { color: '#333333' } : { color: '#D9D9D9' }
            }
          />
        }
        onChange={changeInput}
      />
    </div>
  )
})
//createBehavior 创建组件的行为，locals 信息、propsSchema 可修改属性
PersonTree.Behavior = createBehavior({
  name: 'PersonTree',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PersonTree', //组件
  designerProps: {
    droppable: true,
    propsSchema: createFieldSchema(AllSchemas.UserSelect),
  },
  designerLocales: AllLocales.PersonTree, //语言
})
//createResource 创建资源基础信息，用于左侧拖拽组件
PersonTree.Resource = createResource({
  icon: (
    <MyIcon
      type="icon-renyuanshu"
      className="custom-icon"
      style={{ color: '#333333' }}
    />
  ),
  elements: [
    {
      componentName: 'Field',
      sourceName: '人员树',
      props: {
        type: 'string',
        title: '人员树',
        'x-decorator': 'FormItem',
        'x-component': 'PersonTree', //组件
        'x-component-props': {
          allowClear: true,
          style: {
            ...initStyle?.style,
          },
        },
        'x-decorator-props': {
          labelStyle: {
            ...initStyle?.labelStyle,
          },
        },
      },
    },
  ],
})
