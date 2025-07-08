import IconLeft from '@/Icon-left'
import { AllLocales } from '@/custom/locales'
import { AllSchemas } from '@/custom/schemas'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { getColumnCodeValue, setColumnCodeValue } from '@/utils/formUtil'
import { PlusOutlined } from '@ant-design/icons'
import { observer, useField, useFieldSchema, useForm } from '@formily/react'
import { InputProps } from 'antd/lib/input'
import cls from 'classnames'
import _ from 'lodash'
import { useState } from 'react'
import { useModel } from 'umi'
import { initStyle } from '../../../service/constant'
import styles from './index.less'
import InvoiceModal from './invoiceChoice'

interface ExtraProps extends InputProps {
  isMultipleTree?: any //是否单选多选
  hiddenColumn?: any //隐藏字段
}
export const Invoice: DnFC<ExtraProps> = observer((props) => {
  const fieldScme: any = useFieldSchema()
  const columnCode: string = fieldScme?.columnCode || ''
  const form = useForm()
  const field = useField()
  const pathSegments = field.path.segments
  const [invoiceModal, setInvoiceModal] = useState(false)
  const [type, setType] = useState('edit')
  const baseProps = _.clone(props)
  // delete baseProps['isMultipleTree']
  // delete baseProps['hiddenColumn']
  const { cutomHeaders, bizInfo, location } = useModel(
    '@@qiankunStateFromMaster'
  )
  const { formStyle } = useModel('preview')
  const { refInvoice } = useModel('invoice')
  // function returnValue() {
  //   let value = []
  //   if (pathSegments.length > 1) {
  //     //在子表中
  //     const index = pathSegments[pathSegments.length - 2]
  //     const parentCode = pathSegments[pathSegments.length - 3]
  //     if (form?.values?.[`${parentCode}`]) {
  //       let codeValue = form?.values?.[`${parentCode}`]?.[index]?.[columnCode]
  //       value =
  //         codeValue &&
  //         form?.values?.[`${parentCode}`]?.[index]?.[columnCode]?.split(',')
  //     }
  //   } else {
  //     if (form?.values?.[`${columnCode}`]) {
  //       //主表
  //       value = form?.values?.[`${columnCode}`]?.split(',')
  //     }
  //   }
  //   return value
  // }

  function returnPayload() {
    let payload = {
      mainTableId: cutomHeaders?.mainTableId,
      bizInfoId: location.query.bizInfoId,
      bizSolId: location.query.bizSolId,
      columnCode,
    }
    if (pathSegments.length > 1) {
      // //子表里面
      // const codeIndex = pathSegments[pathSegments.length - 2]
      // const parentCode = pathSegments[pathSegments.length - 3]
      // const tableValue = form.values[parentCode]
      // payload = {
      //   ...payload,
      //   formCode: parentCode,
      //   subTableDataId: tableValue[codeIndex]['ID'],
      // }
      let columnCodeValue = getColumnCodeValue(form, pathSegments, columnCode)
      payload = {
        ...payload,
        formCode: columnCodeValue?.parentCode,
        subTableDataId: columnCodeValue?.objectValue?.['ID'],
      }
    } else {
      //主表
      payload = {
        ...payload,
        formCode: formStyle?.formCode,
      }
    }
    return payload
  }
  const onOkInvoice = (chooseLabel) => {
    setColumnCodeValue(
      form,
      pathSegments,
      columnCode,
      chooseLabel?.length,
      true,
      () => {}
    )
    // if (pathSegments.length > 1) {
    //   //子表里面
    //   const codeIndex = pathSegments[pathSegments.length - 2]
    //   const parentCode = pathSegments[pathSegments.length - 3]
    //   const tableValue = form.values[parentCode]
    //   // tableValue[codeIndex][columnCode] = chooseLabel?.join(',')
    //   tableValue[codeIndex][columnCode] = chooseLabel?.length
    //   form.setValues({ [parentCode]: _.cloneDeep(tableValue) })
    // } else {
    //   //主表
    //   // form.setValues({ [columnCode]: chooseLabel?.join(',') })
    //   form.setValues({ [columnCode]: chooseLabel?.length })
    // }
    refInvoice(
      {
        //关联票据
        invoiceIds: chooseLabel?.join(','),
        ...returnPayload(),
      },
      () => {
        setInvoiceModal(false)
      }
    )
  }
  return (
    <>
      <div
        {...baseProps}
        style={
          baseProps?.disabled
            ? { ...props.style, background: '#f5f5f5' }
            : { ...props.style }
        }
        className={cls(styles.invoice_container, props.redClassName)}
      >
        {field.authType != 'NONE' && field?.value ? (
          <a
            className={styles.invoice_num}
            style={
              baseProps?.readOnly || baseProps?.disabled
                ? { color: '#333333' }
                : {}
            }
            onClick={() => {
              setType('view')
              setInvoiceModal(true)
            }}
          >
            {field?.value}
          </a>
        ) : (
          ''
        )}

        <PlusOutlined
          className={cls(styles.invoice_icon, 'click_suffix')}
          onClick={() => {
            if (
              baseProps?.readOnly ||
              baseProps?.disabled ||
              !(baseProps?.pattern == 'editable' || !baseProps?.pattern)
            ) {
              return
            }
            setType('edit')
            setInvoiceModal(true)
          }}
          style={
            baseProps?.readOnly || baseProps?.disabled
              ? { color: '#D9D9D9' }
              : { color: '#333333' }
          }
        />
      </div>
      {invoiceModal && (
        <InvoiceModal
          onCancel={() => {
            setInvoiceModal(false)
          }}
          onOkInvoice={onOkInvoice}
          type={type}
          returnPayload={returnPayload}
        />
      )}
    </>
  )
  // return (
  //   <>
  //     <Input
  //       {...baseProps}
  //       style={
  //         baseProps?.disabled
  //           ? { ...props.style, background: '#f5f5f5' }
  //           : { ...props.style }
  //       }
  //       className={cls(styles.invoice_container, props.redClassName)}
  //       onClick={() => {
  //         setType('view')
  //         setInvoiceModal(true)
  //       }}
  //       suffix={
  //         <MyIcon
  //           type="icontongyong"
  //           onClick={() => {
  //             if (
  //               baseProps?.readOnly ||
  //               baseProps?.disabled ||
  //               !(baseProps?.pattern == 'editable' || !baseProps?.pattern)
  //             ) {
  //               return
  //             }
  //             setType('edit')
  //             setInvoiceModal(true)
  //           }}
  //           style={{ color: 'rgba(0,0,0,.25)' }}
  //         />
  //       }
  //     />
  //     {invoiceModal && (
  //       <InvoiceModal
  //         onCancel={() => {
  //           setInvoiceModal(false)
  //         }}
  //         onOkInvoice={onOkInvoice}
  //         type={type}
  //         returnPayload={returnPayload}
  //       />
  //     )}
  //   </>
  // )
})

Invoice.Behavior = createBehavior({
  name: 'Invoice',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Invoice',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Invoice),
  },
  designerLocales: AllLocales.Invoice,
})

Invoice.Resource = createResource({
  icon: <IconLeft type="icon-piaoju" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: '关联票据',
        'x-decorator': 'FormItem',
        'x-component': 'Invoice',
        'x-component-props': {
          style: {
            ...initStyle?.style,
            textAlign: 'right',
            lineHeight: '30px',
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
