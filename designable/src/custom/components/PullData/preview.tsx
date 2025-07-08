import IconLeft from '@/Icon-left'
import { AllLocales } from '@/custom/locales'
import { AllSchemas } from '@/custom/schemas'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { getColumnCodeValue, setColumnCodeValue } from '@/utils/formUtil'
import { CloseOutlined, SlidersOutlined } from '@ant-design/icons'
import { observer, useField, useFieldSchema, useForm } from '@formily/react'
import { InputProps } from 'antd/lib/input'
import cls from 'classnames'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
import { initStyle } from '../../../service/constant'
import styles from './index.less'
import PullDataModal from './pullDataModel'
interface ExtraProps extends InputProps {
  isMultipleTree?: any //是否单选多选
  hiddenColumn?: any //隐藏字段
}
export const PullData: DnFC<ExtraProps> = observer((props) => {
  const fieldScme: any = useFieldSchema()
  const columnCode: string = fieldScme?.columnCode || ''
  const form = useForm()
  const field = useField()
  const pathSegments = field.path.segments
  const [pullDataModal, setPullDataModal] = useState(false)
  const baseProps = _.clone(props)
  delete baseProps['isMultipleTree']
  delete baseProps['hiddenColumn']
  const { toDetail } = useModel('@@qiankunStateFromMaster')
  function returnValue() {
    let TITLES = []
    let IDS = []
    let BIZIDS = []
    let SOLIDS = []
    let DRIVEINFOID = []

    let objectValue = getColumnCodeValue(form, pathSegments, columnCode)
      ?.objectValue
    console.log('objectValue', objectValue)
    if (objectValue?.[`${columnCode}`]) {
      TITLES = objectValue?.[`${columnCode}`]?.split(',')
      SOLIDS = objectValue?.[`${columnCode?.split('NAME_')?.[0]}SOLID_`]?.split(
        ','
      )
      BIZIDS = objectValue?.[`${columnCode?.split('NAME_')?.[0]}BIZID_`]?.split(
        ','
      )
      IDS = objectValue?.[`${columnCode?.split('NAME_')?.[0]}ID_`]?.split(',')
      DRIVEINFOID = objectValue?.[
        `${columnCode?.split('NAME_')?.[0]}DRIVEINFOID_`
      ]?.split(',')
    }
    // if (pathSegments.length > 1) {
    //   //在子表中
    //   const index = pathSegments[pathSegments.length - 2]
    //   const parentCode = pathSegments[pathSegments.length - 3]
    //   if (form?.values?.[`${columnCode}`]) {
    //     TITLES = form?.values?.[`${parentCode}`]?.[index]?.[columnCode]?.split(
    //       ','
    //     )
    //     SOLIDS = form?.values?.[`${parentCode}`]?.[index]?.[
    //       `${columnCode?.split('NAME_')?.[0]}SOLID_`
    //     ]?.split(',')
    //     BIZIDS = form?.values?.[`${parentCode}`]?.[index]?.[
    //       `${columnCode?.split('NAME_')?.[0]}BIZID_`
    //     ]?.split(',')
    //     IDS = form?.values?.[`${parentCode}`]?.[index]?.[
    //       `${columnCode?.split('NAME_')?.[0]}ID_`
    //     ]?.split(',')
    //     DRIVEINFOID = form?.values?.[`${parentCode}`]?.[index]?.[
    //       `${columnCode?.split('NAME_')?.[0]}DRIVEINFOID_`
    //     ]?.split(',')
    //   }
    // } else {
    //   if (
    //     form?.values?.[`${columnCode}`] ||
    //     form?.values?.[`${columnCode?.split('NAME_')?.[0]}ID_`]
    //   ) {
    //     //主表
    //     TITLES = form?.values?.[`${columnCode}`]?.split(',')
    //     SOLIDS = form?.values?.[
    //       `${columnCode?.split('NAME_')?.[0]}SOLID_`
    //     ]?.split(',')
    //     BIZIDS = form?.values?.[
    //       `${columnCode?.split('NAME_')?.[0]}BIZID_`
    //     ]?.split(',')
    //     IDS = form?.values?.[`${columnCode?.split('NAME_')?.[0]}ID_`]?.split(
    //       ','
    //     )
    //     DRIVEINFOID = form?.values?.[
    //       `${columnCode?.split('NAME_')?.[0]}DRIVEINFOID_`
    //     ]?.split(',')
    //   }
    // }
    return {
      TITLES,
      IDS,
      BIZIDS,
      SOLIDS,
      DRIVEINFOID,
    }
  }
  function onDelete(index) {
    if (
      baseProps?.readOnly ||
      baseProps?.disabled ||
      !(baseProps?.pattern == 'editable' || !baseProps?.pattern)
    ) {
      return
    }
    const { TITLES, IDS, BIZIDS, SOLIDS, DRIVEINFOID } = returnValue()
    if (IDS?.length <= 0) {
      return
    }

    //删除已拉取到的子表数据
    const values = form.values
    let tableCode = ''
    let flag = -1

    Object.keys(values).map((key) => {
      if (typeof values[key] == 'object' && values?.[key]?.[0]?.sourceMainId) {
        for (let i = values?.[key].length; i >= 0; i--) {
          const item = values?.[key][i]
          if (item?.sourceMainId == IDS[index]) {
            //根据拉取到的数据的sourceMainId判断当前数据存在于那条数据上
            tableCode = key
            flag = i
            if (tableCode && flag != -1) {
              let tableValue = form?.values?.[tableCode]
              tableValue?.splice(flag, 1)
              form.setValues({ [tableCode]: tableValue })
            }
          }
        }
        // values?.[key]?.map((item, i) => {
        //   if(item?.sourceMainId == IDS[index]) {
        //     //根据拉取到的数据的sourceMainId判断当前数据存在于那条数据上
        //     tableCode = key
        //     flag = i
        //     if (tableCode && flag != -1) {
        //       let tableValue = form?.values?.[tableCode]
        //       tableValue?.splice(flag, 1)
        //       form.setValues({ [tableCode]: tableValue })
        //     }
        //   }
        // })
      }
    })

    //删除隐藏字段数据
    TITLES?.splice(index, 1)
    IDS?.splice(index, 1)
    BIZIDS?.splice(index, 1)
    SOLIDS?.splice(index, 1)
    DRIVEINFOID?.splice(index, 1)
    const valueObj = {
      [`${columnCode}`]: TITLES.toString(),
      [`${columnCode?.split('NAME_')?.[0]}ID_`]: IDS.toString(),
      [`${columnCode?.split('NAME_')?.[0]}BIZID_`]: BIZIDS.toString(),
      [`${columnCode?.split('NAME_')?.[0]}SOLID_`]: SOLIDS.toString(),
      [`${columnCode?.split('NAME_')?.[0]}DRIVEINFOID_`]:
        IDS.length == 0 ? '' : DRIVEINFOID.toString(),
    }
    setColumnCodeValue(form, pathSegments, columnCode, valueObj, true, () => {})
    // if (pathSegments.length > 1) {
    //   //子表里面
    //   const codeIndex = pathSegments[pathSegments.length - 2]
    //   const parentCode = pathSegments[pathSegments.length - 3]
    //   const tableValue = form.values[parentCode]
    //   tableValue[codeIndex] = valueObj
    //   form.setValues({ [parentCode]: _.cloneDeep(tableValue) })
    // } else {
    //   //主表
    //   form.setValues(valueObj)
    // }
  }

  function toDetailBiz(index) {
    // if (
    //   baseProps?.readOnly ||
    //   baseProps?.disabled ||
    //   !(baseProps?.pattern == 'editable' || !baseProps?.pattern)
    // ) {
    //   return
    // }
    const { TITLES, IDS, BIZIDS, SOLIDS } = returnValue()
    toDetail(SOLIDS?.[index], BIZIDS?.[index], IDS?.[index])
  }
  function onPull() {
    if (
      baseProps?.readOnly ||
      baseProps?.disabled ||
      !(baseProps?.pattern == 'editable' || !baseProps?.pattern)
    ) {
      return
    }
    setPullDataModal(true)
  }
  useEffect(() => {
    if (field.active) {
      //根据组件的激活状态设置点击事件
      onPull()
    }
  }, [field.active])

  useEffect(() => {
    if (!pullDataModal) {
      //取消弹窗时取消激活状态
      field.onBlur()
    }
  }, [pullDataModal])

  const List = props?.value?.includes(',')
    ? props?.value?.split(',')
    : [props?.value]
  return (
    <>
      <ul
        className={cls(
          styles.pull_wrap,
          baseProps?.disabled ? styles.pull_disabled : '',
          props.redClassName
        )}
        {...baseProps}
        style={
          baseProps?.disabled
            ? { ...props.style, background: '#f5f5f5' }
            : { ...props.style }
        }
      >
        <SlidersOutlined
          className={cls(styles.pull_icon, 'click_suffix')}
          onClick={onPull.bind(this)}
          style={
            baseProps?.disabled ? { color: '#D9D9D9' } : { color: '#333333' }
          }
        />
        {props?.value &&
          field.authType != 'NONE' &&
          List.map((item, index) => {
            if (!item) {
              return
            }
            item = item?.replaceAll('%', ',')
            return (
              <li key={index}>
                {/* {window.location.href.includes('mobile') ? (
                  <a style={{ color: `rgba(0, 0, 0, 0.25)` }}>{item}</a>
                ) : ( */}
                <a
                  onClick={toDetailBiz.bind(this, index)}
                  style={baseProps?.disabled ? { color: '#333333' } : {}}
                >
                  {item}
                </a>
                {/* )} */}
                {baseProps?.readOnly ||
                baseProps?.disabled ||
                !(baseProps?.pattern == 'editable' || !baseProps?.pattern) ? (
                  ''
                ) : (
                  <CloseOutlined
                    onClick={onDelete.bind(this, index)}
                    className={styles.pull_close}
                  />
                )}
              </li>
            )
          })}
      </ul>

      {pullDataModal && (
        <PullDataModal
          {...props}
          returnValue={returnValue}
          columnCode={columnCode}
          setPullDataModal={setPullDataModal}
        />
      )}
    </>
  )
})

PullData.Behavior = createBehavior({
  name: 'PullData',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PullData',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.PullData),
  },
  designerLocales: AllLocales.PullData,
})

PullData.Resource = createResource({
  icon: <IconLeft type="icon-shujulaqu" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: '数据拉取',
        'x-decorator': 'FormItem',
        'x-component': 'PullData',
        'x-component-props': {
          isMultipleTree: 'radio',
          hiddenColumn: 'ID,SOLID,BIZID,DRIVEINFOID',
          style: {
            ...initStyle?.style,
            lineHeight: '30px',
            minHeight: '32px',
            height: 'auto',
          },
        },
        'x-decorator-props': {
          labelStyle: {
            ...initStyle?.labelStyle,
          },
        },
        'x-reactions': {
          dependencies: [
            {
              property: 'value',
              type: 'any',
            },
          ],
          fulfill: {
            run:
              "try {\n  // $props({\n  //   option: `${$form?.values['SS']}rrrr`,//sql拼接 $form?.values['SS']表单SS字段值（可任意取值拼接） USER_ID=:currentUserId  ORG_ID=:currentOrgId ORG_CODE = :currentOrgCode DEPT_ID=:currentDeptId DEPT_CODE=:currentDeptCode \n  //   preOnOK(successOnOk,mainRows){\n  //     alert('333')\n  //     successOnOk()//校验成功后的回调\n  //   } \n  // })\n} catch (e) {\n  console.log('e=', e)\n}\n",
          },
        },
      },
    },
  ],
})
