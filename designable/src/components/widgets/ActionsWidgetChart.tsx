import { GlobalRegistry } from '@/designable/core'
import { TextWidget, useDesigner } from '@/designable/react'
import { clone } from '@/designable/shared'
import {
  transformToSchema,
  transformToTreeNode,
} from '@/designable/transformer/src/chartTramsformer'
import { observer } from '@formily/react'
import { Button, Space, message } from 'antd'
import { parse } from 'query-string'
import { useEffect } from 'react'
import { useModel } from 'umi'
import { initFormJson } from '../../service/constant'

export const ActionsWidgetChart = observer(() => {
  const query = parse(`?${window.location.href.split('?')?.[1]}`)
  const frontStyleUrl = query.minioUrl
  const id = query.id

  const {
    loading,
    sceneLayoutJson,
    sceneLayout,
    sceneDefaultLayoutJson,
    // getSceneLayout,
    getSceneStyleUrl,
    getChartMinioUrl,
    setState,
  } = useModel('chartPreview')

  const designer = useDesigner()
  useEffect(() => {
    GlobalRegistry.setDesignerLanguage('zh-cn')
    if (Object.keys(sceneLayoutJson).length == 0) {
      designer.setCurrentTree(transformToTreeNode(initFormJson))
    } else {
      designer.setCurrentTree(transformToTreeNode(clone(sceneLayoutJson)))
    }
  }, [sceneLayoutJson])

  // useEffect(() => {
  //   // getSceneLayout({})
  // }, [])
  // useEffect(() => {
  //   if (!sceneLayout.frontStyleUrl) {
  //     const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  //     sceneLayout['frontStyleUrl'] = `${localStorage.getItem(
  //       'minioUrl'
  //     )}/${localStorage.getItem('tenantId')}/${userInfo.identityId}/${
  //       userInfo.postId
  //     }/front/scenelayout.json`
  //     setState({ sceneLayout: sceneLayout })
  //   }
  // }, [sceneLayout.frontStyleUrl])

  useEffect(() => {
    getSceneStyleUrl(frontStyleUrl, 'sceneLayoutJson')
  }, [])

  async function preUpload(url, json) {
    const URLArr = url.split('/')
    const blob = new Blob([json], { type: 'text/json' })
    const file = new File([blob], URLArr[URLArr.length - 1], {
      type: 'text/plain',
    })
    await fetch(`${url}`, {
      method: 'PUT',
      body: file,
    }).then((response) => {
      if (response.status == 200) {
        message.success(`保存成功`)
      } else {
        message.warning(`保存失败`)
      }
    })
  }

  const getCallback = async (url) => {
    const schema = transformToSchema(designer.getCurrentTree())
    if (url) {
      preUpload(url, JSON.stringify(schema))
    }
  }

  //保存
  function saveData() {
    getChartMinioUrl({ id: id }, getCallback)
    // const schema = transformToSchema(designer.getCurrentTree())
    // preUpload(frontStyleUrl, JSON.stringify(schema))
  }
  //清空
  function clearData() {
    // designer.setCurrentTree(transformToTreeNode(clone(initFormJson)))
    // setState({
    //   sceneLayoutJson: initFormJson,
    // })
    // if (sceneLayout.frontStyleUrl) {
    //   preUpload(sceneLayout.frontStyleUrl, JSON.stringify(initFormJson))
    // }
  }
  // //恢复系统默认数据
  // function recoverDefaultData() {
  //   designer.setCurrentTree(transformToTreeNode(clone(sceneDefaultLayoutJson)))
  //   setState({
  //     sceneLayoutJson: sceneDefaultLayoutJson,
  //   })
  //   if (sceneLayout.frontStyleUrl) {
  //     preUpload(
  //       sceneLayout.frontStyleUrl,
  //       JSON.stringify(sceneDefaultLayoutJson)
  //     )
  //   }
  // }

  return (
    <Space style={{ marginRight: 10 }}>
      <Button
        type="primary"
        onClick={() => {
          saveData()
        }}
        loading={loading}
      >
        <TextWidget>保存</TextWidget>
      </Button>
      <Button
        type="primary"
        onClick={() => {
          clearData()
        }}
        loading={loading}
      >
        <TextWidget>清空</TextWidget>
      </Button>
      {/* <Button
        type="primary"
        onClick={() => {
          recoverDefaultData()
        }}
        loading={loading}
      >
        <TextWidget>恢复系统默认</TextWidget>
      </Button> */}
    </Space>
  )
})
