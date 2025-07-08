import IconLeft from '@/Icon-left'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { observer, useField, useFieldSchema, useForm } from '@formily/react'
import { Checkbox, Radio, TreeSelect } from 'antd'
import { TreeSelectProps } from 'antd/lib/tree-select'
import classnames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { useModel } from 'umi'
import { initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'
const { TreeNode } = TreeSelect
interface ExtraProps extends TreeSelectProps {
  codeTable?: string
  showModel?: string
  selectModal?: string
  onChange?: any
  dataSource?: any
  redClassName?: any //错误信息标红
}
const loop = (array: any) => {
  let newArray = []
  array &&
    array.map((item) => {
      newArray.push({
        value: item.dictInfoCode,
        label: item.dictInfoName,
      })
    })
  return newArray
}
export const BasicData: DnFC<ExtraProps> = observer((props) => {
  const [dataSource, setDataSource] = useState<any>([])
  const masterProps = useModel('@@qiankunStateFromMaster')
  const [value, setValue] = useState<any>()
  let { location } = masterProps
  let dictsList = JSON.parse(window.sessionStorage.getItem('dictsList'))
  if (location?.pathname?.includes('formDesigner')) {
    dictsList = useModel('designable')['dictsList']
  }
  // const { isInIt } = useModel('preview') //是否是新增页面，如果是新增才有首选项
  const fieldScme: any = useFieldSchema()
  const columnCode: string = fieldScme ? fieldScme.columnCode : ''
  const form = useForm()
  const field = useField()
  const ref = useRef(null)

  //获取父节点的code
  const pathSegments = field.path.segments
  useEffect(() => {
    if (props.value == 'first') {
      //表单的默认值优先级，需要按照（节点字段权限>全局字段权限>表单配置的默认值）
      //增加一个属性便于权限解析的时候知道什么时候赋值
      field.setComponentProps({
        valueType: 'first',
      })
    }
  }, [])
  useEffect(() => {
    if (
      dictsList &&
      Object.keys(dictsList).length &&
      props.codeTable &&
      !field.dataSource
    ) {
      const list = getInfosByCode(dictsList, props.codeTable)
      if (list.length) {
        setDataSource(list)
        defaultValueFn(list)
      }
    }
  }, [Object.keys(dictsList || {}).length, props.codeTable, field.dataSource])
  useEffect(() => {
    if (field.dataSource) {
      setDataSource(field.dataSource)
      defaultValueFn(field.dataSource)
    } else {
      if (!props.codeTable && !location?.pathname?.includes('formDesigner')) {
        field.setValue('')
      }
    }
  }, [field.dataSource])
  //获取列表
  const getInfosByCode = (dictsList: any, codeTable: string) => {
    return dictsList?.[props.codeTable]?.['dictInfos'] || []
  }

  //默认值的设置
  const defaultValueFn = (list: any) => {
    if (props.value == 'first') {
      // let params = getUrlParams(window.location.hash)
      if (
        location?.query?.title == '新增' ||
        decodeURI(location?.query?.title) == '新增'
      ) {
        if (props.selectModal == 'checkBox') {
          field.setValue([list?.[0]?.dictInfoCode] || [])
        } else {
          field.setValue(list?.[0]?.dictInfoCode || '')
        }
      } else {
        if (props.selectModal == 'checkBox') {
          field.setValue([])
        } else {
          field.setValue('')
        }
      }
    } else if (props.value == 'empty') {
      if (props.selectModal == 'checkBox') {
        field.setValue([])
        //setValue([])
        //return []
      } else {
        field.setValue('')
        //setValue('')
        //return ''
      }
    } else if (props.value) {
      if (props.selectModal == 'checkBox' && typeof props.value == 'string') {
        let values = props.value?.split(',')
        field.setValue([...new Set(values)])
        //setValue([...new Set(values)])
        //return [...new Set(values)]
      } else {
        field.setValue(props.value)
        //setValue(props.value)
        //return props.value
      }
    }
  }
  useEffect(() => {
    if (field.value) {
      setValue(field.value)
    } else {
      setValue('')
    }
  }, [field.value])
  const changeData = (values) => {
    console.log('wwww=======', values)
    if (typeof values == 'undefined') {
      //清空的时候是undefined，undefined的时候保存不会存储
      values = ''
    }
    props?.onChange?.(values)
    //由于父子不关联则values为数据格式的object
    let newValues = []
    if (props.selectModal == 'checkBox') {
      values &&
        values.map((item: any) => {
          newValues.push(item.value)
        })
      field.setValue(newValues)
    } else {
      field.setValue(values?.value || '')
      // newValues.push(values.value)
    }
    //setValue(newValues)
  }
  useEffect(() => {
    if (props.showModel == 'select') {
      let element = ref.current.getElementsByClassName('ant-select-selector')[0]
      let searchElement = ref.current.getElementsByClassName(
        'ant-select-selection-search'
      )[0]
      element?.setAttribute(
        'style',
        `padding:${props.style?.padding || 0}!important;`
      )
      searchElement?.setAttribute(
        'style',
        `padding:${props.style?.padding || 0}!important;`
      )
      let arrowElement = ref.current.getElementsByClassName(
        'ant-select-arrow'
      )[0]
      let paddingRight = element.style?.paddingRight?.split('px')?.[0] || 0
      arrowElement?.setAttribute('style', `right:${paddingRight}px`)
    }
  }, [])
  useEffect(() => {
    if (
      props.showModel == 'select' &&
      value &&
      ref.current.getElementsByClassName('ant-select-clear')[0]
    ) {
      let element = ref.current.getElementsByClassName('ant-select-selector')[0]
      let clearElement = ref.current.getElementsByClassName(
        'ant-select-clear'
      )[0]
      let paddingRight = element.style?.paddingRight?.split('px')?.[0] || 0
      clearElement?.setAttribute(
        'style',
        `right:${parseInt(paddingRight) + 22}px`
      )
    }
  }, [value])
  return (
    <div
      style={
        props.showModel == 'select'
          ? { width: '100%' }
          : !props.disabled
          ? { ...props.style }
          : { ...props.style, background: '#f5f5f5' }
      }
      className={styles.basic}
      ref={ref}
    >
      {props.showModel == 'select' ? (
        <TreeSelect
          className={
            value
              ? classnames(
                  styles.basic_container,
                  props.redClassName,
                  styles.hover_close
                )
              : classnames(styles.basic_container, props.redClassName)
          }
          {...props}
          showSearch
          style={
            !props.disabled
              ? { ...props.style, padding: '0px' }
              : { ...props.style, background: '#f5f5f5' }
          }
          allowClear
          treeCheckable={props.selectModal == 'checkBox' ? true : false}
          showCheckedStrategy={TreeSelect.SHOW_ALL}
          treeData={dataSource}
          multiple={props.selectModal == 'checkBox' ? true : false}
          fieldNames={{
            label: 'dictInfoName',
            value: 'dictInfoCode',
            children: 'children',
          }}
          treeCheckStrictly={props.selectModal == 'checkBox' ? true : false}
          treeNodeFilterProp={'dictInfoName'}
          labelInValue={true}
          onChange={changeData.bind(this)}
          value={
            field.authType == 'NONE' || value == 'empty' || value == 'first'
              ? ''
              : value
          }
          placeholder={props.disabled ? '' : props.placeholder}
          dropdownStyle={{ width: 'auto' }}
          popupClassName={styles.basic_popup}
        />
      ) : props.selectModal == 'checkBox' ? (
        <Checkbox.Group
          {...props}
          className={classnames(props.className, props.redClassName)}
          options={loop(dataSource)}
          style={{ minWidth: '50px' }}
          value={field.authType == 'NONE' ? '' : value}
          // value={props.authType == 'NONE' ? '' : defaultValueFn(dataSource)}
        />
      ) : (
        <Radio.Group
          {...props}
          className={classnames(props.className, props.redClassName)}
          options={loop(dataSource)}
          value={
            field.authType == 'NONE' || value == 'empty' || value == 'first'
              ? ''
              : value
          }
          // value={props.authType == 'NONE' ? '' : defaultValueFn(dataSource)}
          style={{ minWidth: '50px' }}
        />
      )}
    </div>
  )
})

BasicData.Behavior = createBehavior({
  name: 'BasicData',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'BasicData',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.BasicData, {
      default: {
        'x-decorator': 'FormItem',
        enum: [
          { label: '首项', value: 'first' },
          { label: '空', value: 'empty' },
        ],
        'x-component': 'Select',
        default: 'first',
      },
    }),
  },
  designerLocales: AllLocales.BasicData,
})

BasicData.Resource = createResource({
  icon: <IconLeft type="icon-jichushujumabiao" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: '基础数据',
        'x-decorator': 'FormItem',
        'x-component': 'BasicData',
        'x-component-props': {
          showSearch: true,
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
