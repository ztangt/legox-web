import { GlobalRegistry } from '@/designable/core'
import { TextWidget, useDesigner } from '@/designable/react'
import { clone } from '@/designable/shared'
import {
  transformToConfigSchema,
  transformToSchema,
  transformToTreeNode,
} from '@/designable/transformer/src'
import { observer } from '@formily/react'
import { Button, Space, message } from 'antd'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useDispatch, useModel } from 'umi'
import { initFormJson } from '../../service/constant'
import { transformToMarkupSchemaCode } from './MarkupSchemaWidget'
import Operation from './Operation'
import Release from './Release'
// console.log('useLocation',useLocation());
import { parse } from 'query-string'
export const ActionsWidget = observer(() => {
  const dispatch = useDispatch()
  const { location } = useModel('@@qiankunStateFromMaster')
  const [reaseModal, setReaseModal] = useState(false)
  const [operationModal, setOperationModal] = useState(false)
  const query = parse(`?${window.location.href.split('?')?.[1]}`)
  const { version, ctlgId, isBusiness, formId } = query
  const {
    loading,
    settingForm,
    deployFormId,
    formJson,
    formTSX,
    updateDisabled,
    setState,
    releaseForm,
    init,
    updateForm,
    addForm,
    appJsonUrl,
    getAppFormUrl,
  } = useModel('designable')
  // const { settingForm, dsTree, ctlgs, formJson, formTSX } = useSelector(
  //   (state: any) => state.designable
  // )
  const designer = useDesigner()
  const returnFormJSON = (type) => {
    const formJSON = transformToConfigSchema(designer.getCurrentTree(), type)
    var index = _.findIndex(formJSON?.formJSON, { type: 'MAIN' })
    if (index != -1) {
      if (settingForm?.formCode) {
        formJSON.formJSON[index]['formCode'] = settingForm?.formCode
      }
      if (settingForm?.formName) {
        formJSON.formJSON[index]['formName'] = settingForm?.formName
      }
    }
    const payload = {
      formName: formJSON?.form?.formName || settingForm.formName,
      ctlgId: formJSON?.form?.ctlgId || ctlgId || settingForm.ctlgId,
      formCode: formJSON?.form?.formCode || settingForm.formCode,
      bussinessTemplateCode:
        formJSON?.form?.bussinessTemplateCode ||
        settingForm.bussinessTemplateCode,
      tableId: formJSON?.form?.tableId?.split(',')?.[0] || settingForm.tableId,
      dsId:
        formJSON?.form?.dsId?.split(',')?.[0] ||
        settingForm.dsId?.split(',')?.[0],
      dsDynamic: formJSON?.form?.dsId?.split(',')?.[1] || settingForm.dsDynamic,
      formJSON: JSON.stringify(formJSON?.formJSON),
    }
    return {
      formJSON,
      payload,
    }
  }
  useEffect(() => {
    if (Object.keys(formJson).length == 0) {
      designer.setCurrentTree(transformToTreeNode(initFormJson))
    } else {
      designer.setCurrentTree(transformToTreeNode(clone(formJson)))
    }
  }, [formJson])

  useEffect(() => {
    init()
    GlobalRegistry.setDesignerLanguage('zh-cn')
  }, [])

  //发布
  function release() {
    const formJSON = transformToConfigSchema(designer.getCurrentTree())
    setState({ settingForm: { ...formJSON?.form, ...settingForm } })
    setReaseModal(true)
  }

  //更新发布成功后的回调
  function successCallback(data, type) {
    console.log('data', data)

    const schema = transformToSchema(
      designer.getCurrentTree(),
      data?.data,
      type
    )
    designer.setCurrentTree(transformToTreeNode(schema)) //针对更新或发布后未到json中的数据，重新设置一遍防止丢失
    const schemaTSX = transformToMarkupSchemaCode(designer.getCurrentTree())
    if (data.data.formTsxUrl) {
      preUpload(data.data.formTsxUrl, schemaTSX)
    }
    if (window.location.href.includes('/formDesigner')) {
      if (data.data.formJsonUrl) {
        preUpload(data.data.formJsonUrl, JSON.stringify(schema))
      }
      if (data.data.appJsonUrl && type != 'update') {
        preUpload(data.data.appJsonUrl, JSON.stringify(schema))
      }
    } else {
      if (data.data.appJsonUrl) {
        preUpload(data.data.appJsonUrl, JSON.stringify(schema))
      }
    }
    setReaseModal(false)
    setState({
      updateDisabled: false,
    })
  }
  //预上传
  async function preUpload(url, json) {
    const URLArr = url.split('/')
    const blob = new Blob([json], { type: 'text/json' })
    const file = new File([blob], URLArr[URLArr.length - 1], {
      type: 'text/plain',
    })
    await fetch(`${url}`, {
      method: 'PUT',
      body: file,
    })
  }

  function save(designer) {
    if (settingForm.isDeploy == 1) {
      //TODO校验子表
      saveData(designer)
    } else {
      saveData(designer)
    }
  }

  function releaseConfigForm(values) {
    const { formJSON, payload } = returnFormJSON('release')
    if (formJSON?.error) {
      message.error(formJSON?.error)
      return
    }

    releaseForm(
      {
        version: Number(isBusiness) != 1 ? version || settingForm?.version : '',
        formId: Number(isBusiness) != 1 ? formId || settingForm?.formId : '',
        ...payload,
        ...values,
        dsId: values?.['dsId']?.split(',')?.[0],
      },
      successCallback
    )
  }

  function saveOperation(values) {
    console.log('saveOperation', values)
  }

  //保存
  function saveData(designer) {
    if (formId && Number(isBusiness) != 1) {
      const { formJSON, payload } = returnFormJSON('update')
      if (formJSON?.error) {
        message.error(formJSON?.error)
        return
      }
      if (window.location.href.includes('appDesigner')) {
        getAppFormUrl(
          {
            deployFormId,
          },
          (data) => {
            //app设计只更新json不更新表单数据
            successCallback(
              { data: { appJsonUrl: data?.data?.appUrl } },
              'update'
            )
          }
        )

        return
      }
      //修改
      updateForm({ version, formId, ...payload }, successCallback)
    } else {
      const { formJSON, payload } = returnFormJSON('add')
      if (
        formJSON?.error &&
        (formJSON?.error == '表单分类不能为空' ||
          formJSON?.error == '主表名称不能为空' ||
          formJSON?.error == '主表编码不能为空')
      ) {
        message.error(formJSON?.error)
        return
      }
      //新增
      addForm({ ...payload }, successCallback)
    }
  }

  return (
    <Space style={{ marginRight: 10 }}>
      {operationModal && (
        <Operation
          onSubmit={saveOperation}
          onCancel={() => {
            setOperationModal(false)
          }}
          loading={false}
        />
      )}
      {reaseModal && (
        <Release
          onSubmit={releaseConfigForm}
          onCancel={() => {
            setReaseModal(false)
          }}
          loading={false}
        />
      )}
      {window.location.href.includes('formDesigner') && (
        <Button
          type="primary"
          disabled={deployFormId ? false : true}
          onClick={() => {
            setOperationModal(true)
          }}
        >
          <TextWidget>Operation</TextWidget>
        </Button>
      )}
      <Button
        type="primary"
        onClick={() => {
          if (updateDisabled) {
            message.error('基础数据码表复选方式更改,请发布新版!')
            return
          }
          save(designer)
        }}
        loading={loading}
      >
        <TextWidget>
          {formId ? (settingForm?.isDeploy == 1 ? '更新' : '保存') : '保存'}
        </TextWidget>
      </Button>
      {window.location.href.includes('formDesigner') && (
        <Button
          type="primary"
          onClick={() => {
            release()
          }}
          loading={loading}
        >
          <TextWidget>
            {settingForm?.isDeploy == 1 ? '发布新版' : '发布'}
          </TextWidget>
        </Button>
      )}{' '}
    </Space>
  )
})
