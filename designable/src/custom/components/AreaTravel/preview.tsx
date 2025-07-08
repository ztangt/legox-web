import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import Detail from '@/public/travelDeltail'
import { observer, useField, useForm } from '@formily/react'
import { Input, message } from 'antd'
import classnames from 'classnames'
import { useState } from 'react'
import { initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'
export const AreaTravel: DnFC<any> = observer((props) => {
  const [isShowModal, setIsShowModal] = useState(false)
  //const [data, setData] = useState<string>(props.value)
  const showModal = () => {
    setIsShowModal(true)
  }
  //关联人员树，获取差旅对象的id
  const form = useForm()
  const field = useField()
  console.log('props1111===', props)
  console.log('field11111===', field)
  console.log('form===', form)
  //获取父节点的code
  const pathSegments = field.path.segments

  let traveUserCols = props.travelUser?.split('.') || []
  let tabelCode = traveUserCols.length == 3 ? traveUserCols[0] : '' //子表的话tabelcode
  const travelUsers = traveUserCols?.[traveUserCols.length - 1]?.split('NAME_')
  const traveUserIdCol =
    travelUsers && travelUsers.length == 2 ? travelUsers[0] + 'ID_' : ''
  let traveUserId = ''
  if (traveUserCols.length == 3) {
    //子表
    //得到当前行
    const index = pathSegments[pathSegments.length - 2]
    traveUserId = traveUserIdCol
      ? form.values?.[tabelCode]?.[index]?.[traveUserIdCol]
      : ''
  } else {
    //主表
    traveUserId = traveUserIdCol ? form.values?.[traveUserIdCol] : ''
  }
  //确认
  const confirmFn = (info, cityName) => {
    console.log('info===', info)
    if (!info) {
      message.error('请选择相关数据')
      return
    }
    field.setValue(cityName + '-' + info.cityName)
    let areaTravelValue = form.values['array_areaTravel'] || []
    if (pathSegments.length > 1) {
      let parentCode = ''
      //在子表中
      if (pathSegments.length > 2) {
        const index = pathSegments[pathSegments.length - 2]
        parentCode = pathSegments[pathSegments.length - 3]
        //先判断areaTravelValue是否存在当前表的当前行
        const isExist = areaTravelValue
          ? areaTravelValue.filter(
              (i) => i.tableCode == parentCode && i.index == index
            )
          : ''
        if (isExist.length) {
          //更新
          areaTravelValue &&
            areaTravelValue.map((item: any) => {
              if (item.tableCode == parentCode && item.index == index) {
                item.info = info
              }
            })
        } else {
          //新增
          areaTravelValue.push({
            tabelCode: parentCode,
            index: index,
            info: info,
          })
        }
      } else {
        //对象容器
        parentCode = pathSegments[pathSegments.length - 2]
        //先判断areaTravelValue是否存在当前表的当前行
        const isExist = areaTravelValue
          ? areaTravelValue.filter((i) => i.tableCode == parentCode)
          : ''
        if (isExist.length) {
          //更新
          areaTravelValue &&
            areaTravelValue.map((item: any) => {
              if (item.tableCode == parentCode) {
                item.info = info
              }
            })
        } else {
          //新增
          areaTravelValue.push({
            tabelCode: parentCode,
            info: info,
          })
        }
      }
      form.setValuesIn('array_areaTravel', areaTravelValue)
    } else {
      //在主表中
      //先判断areaTravelValue是否存在
      const isExist = areaTravelValue
        ? areaTravelValue.filter((i) => i.tableCode == '' && i.index == -1)
        : ''
      if (isExist.length) {
        //更新
        areaTravelValue &&
          areaTravelValue.map((item: any) => {
            if (item.tableCode == '' && item.index == -1) {
              item.info = info
            }
          })
      } else {
        //新增
        areaTravelValue.push({
          tabelCode: '',
          index: -1,
          info: info,
        })
      }
      form.setValuesIn('array_areaTravel', areaTravelValue)
    }
    props.onOk && props.onOk(info)
    setIsShowModal(false)
  }
  return (
    <>
      <Input
        {...props}
        className={classnames(
          props.className,
          props.redClassName,
          styles.area_travel
        )}
        onClick={showModal}
        allowClear
        value={field.authType == 'NONE' ? '' : props.value}
      />
      {isShowModal && (
        <Detail
          traveUserId={traveUserId}
          setIsShowModal={setIsShowModal}
          confirmFn={confirmFn}
          getTravelexpenseParams={props.getTravelexpenseParams || {}}
        />
      )}
    </>
  )
})

AreaTravel.Behavior = createBehavior({
  name: 'AreaTravel',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'AreaTravel',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.AreaTravel),
  },
  designerLocales: AllLocales.AreaTravel,
})

AreaTravel.Resource = createResource({
  icon: 'DatePickerSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: '到达地区差旅树',
        'x-decorator': 'FormItem',
        'x-component': 'AreaTravel',
        'x-component-props': {
          style: {
            ...initStyle?.style,
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
              '$props({\n  //右侧获取左侧信息的接口自定义参数\n  // getTravelexpenseParams:{\n  //   limit:100\n  // }\n})',
          },
        },
      },
    },
  ],
})
