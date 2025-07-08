import { GlobalRegistry } from '@/designable/core'
import { TextWidget, useDesigner } from '@/designable/react'
import { clone } from '@/designable/shared'
import {
  transformToSchema,
  transformToTreeNode,
} from '@/designable/transformer/src/portalTramsformer'
import { observer } from '@formily/react'
import { Button, Space, message } from 'antd'
import { useEffect } from 'react'
import SparkMD5 from 'spark-md5'
import { useModel } from 'umi'
import { initFormJson } from '../../service/constant'

export const ActionsWidgetPortalHeader = observer(() => {
  const {
    loading,
    fontFlag,
    configFlag,
    sceneLayoutJson,
    getSceneLayout,
    sceneDefaultLayoutJson,
    sceneLayout,
    updateSceneLayout,
    setState,
  } = useModel('portalPreview')

  const { getFileMD5 } = useModel('portalDesignable')

  useEffect(() => {
    GlobalRegistry.setDesignerLanguage('zh-cn')
    getSceneLayout({})
  }, [])

  const designer = useDesigner()
  useEffect(() => {
    if (configFlag && fontFlag) {
      if (
        Object.keys(sceneLayoutJson).length == 0 &&
        Object.keys(sceneDefaultLayoutJson).length == 0
      ) {
        designer.setCurrentTree(transformToTreeNode(initFormJson))
      } else {
        designer.setCurrentTree(
          transformToTreeNode(
            clone(
              Object.keys(sceneLayoutJson).length
                ? sceneLayoutJson
                : sceneDefaultLayoutJson
            )
          )
        )
      }
    }
  }, [
    configFlag,
    fontFlag,
    // Object.keys(sceneLayoutJson).length,
    // Object.keys(sceneDefaultLayoutJson).length,
  ])

  // 1734751469262897154
  // 1734763701690466305
  // 1734763752663842817
  useEffect(() => {
    if (!sceneLayout.frontStylePath) {
      // sceneLayout['frontStyleUrl'] = `${localStorage.getItem(
      //   'minioUrl'
      // )}/scene/${localStorage.getItem('tenantId')}/${localStorage.getItem(
      //   'identityId'
      // )}/front/scenelayout.json`
      sceneLayout['frontStylePath'] = `scene/${localStorage.getItem(
        'tenantId'
      )}/${localStorage.getItem('identityId')}/front/scenelayout.json`
      setState({ sceneLayout: sceneLayout })
    }
  }, [sceneLayout.frontStylePath])
  //预上传
  async function preUpload(url, json, text) {
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
        message.success(`${text}成功`)
      } else {
        message.warning(`${text}失败`)
      }
    })
  }
  //保存
  function saveData() {
    const schema = transformToSchema(designer.getCurrentTree())
    if (sceneLayout.frontStylePath) {
      // preUpload(sceneLayout.frontStyleUrl, JSON.stringify(schema)).then(() => {
      //   message.success('保存成功')
      // })
      let spark = new SparkMD5()
      spark.append(JSON.stringify(schema))
      getFileMD5(
        {
          isPresigned: 0,
          fileEncryption: spark.end(),
          isUpdate: 1,
          filePath: sceneLayout.frontStylePath,
        },
        getFileMD5Callback
      )
    }
    // updateSceneLayout({})
  }

  const getFileMD5Callback = async (data, payload) => {
    const schema = transformToSchema(designer.getCurrentTree())
    if (data.presignedUploadUrl) {
      preUpload(data.presignedUploadUrl, JSON.stringify(schema), '保存')
    }
  }

  const clearSchmaCallback = async (data, payload) => {
    if (data.presignedUploadUrl) {
      preUpload(data.presignedUploadUrl, JSON.stringify(initFormJson), '清空')
    }
  }

  const recoverSchmaCallback = async (data, payload) => {
    if (data.presignedUploadUrl) {
      preUpload(
        data.presignedUploadUrl,
        JSON.stringify(sceneDefaultLayoutJson),
        '恢复'
      )
    }
  }

  //清空
  function clearData() {
    designer.setCurrentTree(transformToTreeNode(clone(initFormJson)))
    setState({
      sceneLayoutJson: initFormJson,
    })
    if (sceneLayout.frontStylePath) {
      let spark = new SparkMD5()
      spark.append(JSON.stringify(initFormJson))
      getFileMD5(
        {
          isPresigned: 0,
          fileEncryption: spark.end(),
          isUpdate: 1,
          filePath: sceneLayout.frontStylePath,
        },
        clearSchmaCallback
      )
    } else {
      message.success('恢复成功')
    }
    // if (sceneLayout.frontStyleUrl) {
    //   preUpload(sceneLayout.frontStyleUrl, JSON.stringify(initFormJson))
    // }
  }
  //恢复系统默认数据
  function recoverDefaultData() {
    designer.setCurrentTree(transformToTreeNode(clone(sceneDefaultLayoutJson)))
    setState({
      sceneLayoutJson: sceneDefaultLayoutJson,
    })
    if (sceneLayout.frontStylePath) {
      let spark = new SparkMD5()
      spark.append(JSON.stringify(sceneDefaultLayoutJson))
      getFileMD5(
        {
          isPresigned: 0,
          fileEncryption: spark.end(),
          isUpdate: 1,
          filePath: sceneLayout.frontStylePath,
        },
        recoverSchmaCallback
      )
      // preUpload(
      //   sceneLayout.frontStyleUrl,
      //   JSON.stringify(sceneDefaultLayoutJson)
      // ).then(() => {
      //   message.success('恢复成功')
      // })
    } else {
      message.success('恢复成功')
    }
  }

  function saveOperation() {}

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
      <Button
        type="primary"
        onClick={() => {
          recoverDefaultData()
        }}
        loading={loading}
      >
        <TextWidget>恢复系统默认</TextWidget>
      </Button>
    </Space>
  )
})
