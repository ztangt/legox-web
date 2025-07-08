import MyIcon from '@/Icon'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { observer, useField } from '@formily/react'
import { useModel } from '@umijs/max'
import { Input } from 'antd'
import { InputProps } from 'antd/lib/index'
import { useState } from 'react'
import { initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import ModalDocNoList from './ModalDocNoList'
export const DocNo: DnFC<InputProps> = observer((props) => {
  const [isShowModal, setIsShowModal] = useState(false)
  const field = useField()
  const masterProps = useModel('@@qiankunStateFromMaster')
  const { location, bizInfo, targetKey, cutomHeaders } = masterProps
  const { delDocNo } = useModel('docNo')
  //显示文号弹框
  const showModal = (isShowModal: boolean) => {
    setIsShowModal(isShowModal)
  }
  const onOk = (currentSelectInfo: any) => {
    props.onOk?.(currentSelectInfo)
  }
  const changeInput = (e: any) => {
    if (!e.target.value) {
      //删除文号
      delDocNo(
        {
          mainTableId: cutomHeaders?.mainTableId,
          bizSolId: location.query.bizSolId,
          deployFormId: bizInfo?.formDeployId,
        },
        () => {}
      )
      field.setValue(e.target.value)
    }
  }
  return (
    <>
      <Input
        {...props}
        onClick={showModal.bind(this, true)}
        allowClear
        onChange={changeInput.bind(this)}
      />
      {isShowModal && (
        <ModalDocNoList showModal={showModal} field={field} onOk={onOk} />
      )}
    </>
  )
})
//createBehavior 创建组件的行为，locals 信息、propsSchema 可修改属性
DocNo.Behavior = createBehavior({
  name: 'DocNo',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'DocNo', //组件
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.DocNo),
  },
  designerLocales: AllLocales.DocNo, //语言
})
//createResource 创建资源基础信息，用于左侧拖拽组件
DocNo.Resource = createResource({
  icon: (
    <MyIcon
      type="icon-bumenshu"
      className="custom-icon"
      style={{ color: '#333333' }}
    />
  ),
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: '文号',
        'x-component': 'DocNo', //组件
        'x-decorator': 'FormItem',
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
      },
    },
  ],
})
