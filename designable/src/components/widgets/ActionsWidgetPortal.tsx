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

// import Workbench from '../widgets/Workbench'
export const ActionsWidgetPortal = observer(() => {
  const { location } = useModel('@@qiankunStateFromMaster')
  const { sceneId, sceneStyleUrl, sceneStylePath } = location.query
  const {
    loading,
    portalLayoutJson,
    getScene,
    updateScene,
    getFileMD5,
    sceneSection,
    getSceneStyleUrl,
  } = useModel('portalDesignable')

  const designer = useDesigner()

  // const [workModal, setWorkModal] = useState(false)

  useEffect(() => {
    GlobalRegistry.setDesignerLanguage('zh-cn')
    if (Object.keys(portalLayoutJson).length == 0) {
      designer.setCurrentTree(transformToTreeNode(initFormJson))
    } else {
      designer.setCurrentTree(transformToTreeNode(clone(portalLayoutJson)))
    }
  }, [portalLayoutJson])

  useEffect(() => {
    if (sceneStyleUrl) {
      getSceneStyleUrl(sceneStyleUrl)
      return
    }
    getScene({ sceneId })
  }, [])

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
    if (sceneSection.sceneStyleUrl) {
      let spark = new SparkMD5()
      spark.append(JSON.stringify(schema))
      getFileMD5(
        {
          isPresigned: 0,
          fileEncryption: spark.end(),
          isUpdate: 1,
          filePath: sceneStylePath,
        },
        getFileMD5Callback
      )
    }
  }

  const getFileMD5Callback = async (data, payload) => {
    const schema = transformToSchema(designer.getCurrentTree())
    if (data.presignedUploadUrl) {
      preUpload(data.presignedUploadUrl, JSON.stringify(schema), '保存')
    }
  }

  function saveOperation() {}

  return (
    <Space style={{ marginRight: 10 }}>
      {/* {workModal && (
        <Workbench
          onSubmit={saveOperation}
          onCancel={() => {
            setWorkModal(false)
          }}
          loading={false}
        />
      )}
      <Button
        type="primary"
        onClick={() => {
          setWorkModal(true)
        }}
        loading={loading}
      >
        <TextWidget>工作台设置</TextWidget>
      </Button> */}

      <Button
        type="primary"
        onClick={() => {
          saveData()
        }}
        loading={loading}
      >
        <TextWidget>保存</TextWidget>
      </Button>
    </Space>
  )
})
