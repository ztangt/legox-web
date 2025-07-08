import MyIcon from '@/Icon'
import IconLeft from '@/Icon-left'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { setColumnCodeValue } from '@/utils/formUtil'
import { observer, useField, useFieldSchema, useForm } from '@formily/react'
import { Input } from 'antd'
import { InputProps } from 'antd/lib/input'
import classnames from 'classnames'
import { useEffect, useState } from 'react'
import { initStyle } from '../../../service/constant'
import { remoney } from '../../../utils/utils'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'
export const NumberPicker: DnFC<InputProps> = observer((props) => {
  // const { isInIt } = useModel('preview')
  const field = useField()
  const fieldScme: any = useFieldSchema()
  let columnCode: string = fieldScme ? fieldScme.name : ''
  const form = useForm()
  //获取父节点的code
  const pathSegments = field.path.segments
  const [value, setValue] = useState(props.value)
  const [isChange, setIsChange] = useState(false)
  const [isShowLookModal, setIsShowLookModal] = useState<any>(false) //查看
  console.log('props11wwwss==', props, field.path.segments, value)
  useEffect(() => {
    field.setComponentProps({
      onBlur: async (e) => {
        let fieldValue = e.target.value
        if (fieldValue) {
          //保存的时候必须要是不带‘,’的,且不是非法字符
          fieldValue = remoney(fieldValue)
          // await field.setValue(fieldValue)
          await setColumnCodeValue(
            form,
            field.path.segments,
            columnCode,
            fieldValue,
            true,
            () => {}
          )
          setValue(formatterFn(fieldValue))
        } else {
          await setColumnCodeValue(
            form,
            field.path.segments,
            columnCode,
            null,
            true,
            () => {}
          )
          // await field.setValue(null)
        }
        setIsChange(false)
      },
    })
  }, [])

  // useEffect(() => {
  //   if (isInIt) {
  //     formatterFn(field.value)
  //   }
  // }, [isInIt])

  // 配合公式运算
  useEffect(() => {
    // if (props.value && isNaN(props.value)) {
    //   field.setValue('')
    // } else if (typeof props.value == 'string') {
    //   field.setValue(Number(props.value))
    // }
    //isChange判断是否是用户输入。输入的话不用走这块，响应器需要走这块
    if (!isChange) {
      if (
        (typeof props.value == 'string' && props.value == '') ||
        typeof props.value == 'undefined'
      ) {
        setValue(null)
        setColumnCodeValue(
          form,
          field.path.segments,
          columnCode,
          null,
          true,
          () => {}
        )
        // field.setValue(null)
      } else if (props.value != null) {
        //field.setValue(props.value)
        if (typeof props.value == 'string' && props.value.includes(',')) {
          setValue(props.value)
        } else {
          let tmpValue = formatterFn(props.value)
          setValue(tmpValue)
          setColumnCodeValue(
            form,
            field.path.segments,
            columnCode,
            parseFloat(props.value),
            true,
            () => {}
          )
          // field.setValue(parseFloat(props.value)) //这个是必须的，表单运算哪块需要给附上格式化的值才能通过规则定义
        }
      }
    }
  }, [props.value])

  const formatterFn = (value) => {
    //let value = e.target.value
    let newValue = ''
    let tmpValues = ''
    let tmpValue = ''
    if (value || value == 0) {
      switch (props.formatter) {
        case 'THUSSECDECIMAL': //千分位两位小数
          if (value || value == 0) {
            value = parseFloat(value).toFixed(2)
          }
          //分割整数和小数部分
          tmpValues = value.split('.')
          tmpValue = `${tmpValues[0]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          if (tmpValues.length) {
            newValue = tmpValue + '.' + tmpValues[1]
          } else {
            newValue = tmpValue
          }
          break
        case 'THUSFOURDECIMAL': //千分位四位小数
          if (value || value == 0) {
            value = parseFloat(value).toFixed(4)
          }
          //分割整数和小数部分
          tmpValues = value.split('.')
          tmpValue = `${tmpValues[0]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          if (tmpValues.length) {
            newValue = tmpValue + '.' + tmpValues[1]
          } else {
            newValue = tmpValue
          }
          break
        case 'THUSSIXDECIMAL': //千分位六位小数
          if (value || value == 0) {
            value = parseFloat(value).toFixed(6)
          }
          //分割整数和小数部分
          tmpValues = value.split('.')
          tmpValue = `${tmpValues[0]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          if (tmpValues.length) {
            newValue = tmpValue + '.' + tmpValues[1]
          } else {
            newValue = tmpValue
          }
          break
        case 'SECDECIMAL': //两位
          if (value || value == 0) {
            value = parseFloat(value).toFixed(2)
          }
          newValue = value
          break
        case 'FOURDECIMAL': //四位
          if (value || value == 0) {
            value = parseFloat(value).toFixed(4)
          }
          newValue = value
        case 'SIXDECIMAL': //六位
          if (value || value == 0) {
            value = parseFloat(value).toFixed(6)
          }
          newValue = value
          break
        default:
          // TODO（给运算设置留余地 哎） 2022.12.23
          if (value || value == 0) {
            value = parseFloat(value)
          }
          newValue = value
          break
      }
      console.log('newValue==', newValue)
      console.log('newValue======', isNaN(value))
      return !isNaN(value) ? newValue : null
      //setValue(!isNaN(value) ? newValue : null)
      // field.setValue(!isNaN(value) ? newValue : null)
      //form.setValues({JE:  newValue})
    } else {
      return null
      // setValue(null)
      //field.setValue(null)
    }
  }
  const changeValue = (e) => {
    setIsChange(true)
    if (!props.changeValue) {
      props?.onChange?.(e.target.value)
      setValue(e.target.value)
      // if (e.target.value.includes(',')) {//这个不需要了，应为上面有onblur
      //   //千分位转换成数字
      //   let tmpValue = remoney(e.target.value)
      //   //field.setValue(tmpValue)
      // } else {
      //   //field.setValue(e.target.value)
      // }
    } else {
      props.changeValue?.(e.target.value, setValue, remoney)
    }
  }
  return (
    <>
      <Input
        {...props}
        className={classnames(
          styles.number_picker,
          props.className,
          props.redClassName
        )}
        value={field.authType == 'NONE' ? '' : value}
        onChange={changeValue}
        placeholder={props.disabled ? '' : props.placeholder}
        allowClear
        onClick={() => {}}
        suffix={
          <>
            {props?.onClick ? (
              !props.disabled ? (
                <MyIcon
                  type="icon-tongyong"
                  onClick={props.onClick}
                  style={{ color: '#333333' }}
                />
              ) : (
                <MyIcon
                  type="icon-chakan"
                  onClick={props.onClick}
                  style={{ color: '#333333' }}
                />
              )
            ) : null}
            {/* {props?.getDetailInfo && (
              <MyIcon
                type="iconchakan"
                onClick={
                  !props.disabled
                    ? () => {
                        setIsShowLookModal(true)
                      }
                    : () => {}
                }
              />
            )} */}
          </>
        }
      />
    </>
  )
})
//createBehavior 创建组件的行为，locals 信息、propsSchema 可修改属性
NumberPicker.Behavior = createBehavior({
  name: 'NumberPicker',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'NumberPicker', //组件
  designerProps: {
    droppable: true,
    propsSchema: createFieldSchema(AllSchemas.NumberPicker),
  },
  designerLocales: AllLocales.NumberPicker, //语言
})
//createResource 创建资源基础信息，用于左侧拖拽组件
NumberPicker.Resource = createResource({
  icon: <IconLeft type="icon-jineziduan" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      sourceName: '金额',
      props: {
        type: 'string',
        title: '金额',
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker', //组件
        'x-component-props': {
          parser: (value) => value!.replace(/\$\s?|(,*)/g, ''),
          formatter: 'SECDECIMAL',
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
