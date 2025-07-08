import 'antd/dist/antd.less'
import { useEffect, useMemo, useState } from 'react'
// import { GlobalRegistry } from '@/designable/core/registry'
import {
  Button,
  FormTable,
  Input,
  PortalBar,
  PortalBarCoordinate,
  PortalBarLand,
  PortalBarStacked,
  PortalLine,
  PortalLineSmooth,
  // PortalCustom,
  PortalPie,
  PortalPieDouble,
  PortalPieHollow,
  Text,
  Year,
  YearPicker,
} from '@/custom/components'
import { Field, Form } from '@/designable/antd'
import {
  GlobalRegistry,
  KeyCode,
  Shortcut,
  createDesigner,
} from '@/designable/core'
import {
  ComponentTreeWidget,
  CompositePanel,
  Designer,
  DesignerToolsWidget,
  HistoryWidget,
  OutlineTreeWidget,
  ResourceWidget,
  SettingsPanel,
  StudioPanel,
  ToolbarPanel,
  ViewPanel,
  ViewToolsWidget,
  ViewportPanel,
  Workspace,
  WorkspacePanel,
} from '@/designable/react'
import {
  SettingsForm,
  setNpmCDNRegistry,
} from '@/designable/react-settings-form'
import { onFieldInit, onFieldValueChange } from '@formily/core'
import { Spin } from 'antd'
import { useModel } from 'umi'
import {
  ActionsWidgetChart,
  MarkupSchemaWidget,
  PreviewWidget,
  SchemaEditorWidget,
} from '../components/widgets'
import { INIT_DATA } from '../service/constant'
import pinyinUtil from '../utils/pinyinUtil'
import styles from './index.less'
// import loader from '@monaco-editor/loader'
// loader.config({
//   paths: {
//     vs: `http://10.8.12.154:8088/monaco-editor/min/vs`,
//   },
// })
process.env.NODE_ENV == 'production'
  ? setNpmCDNRegistry(`${window.location.origin}/child/designable`)
  : setNpmCDNRegistry(`http://localhost:8004`)
GlobalRegistry.registerDesignerLocales({
  'zh-CN': {
    sources: {
      Inputs: '基础控件',
      Layouts: '页面布局',
      ORGTREE: '组织机构控件',
      business: '业务组件',
      DataChart: '图表组件',
    },
    icons: {
      Move: '移动',
      Selection: '选择',
      // Close: '关闭',
      PC: '电脑',
      Mobile: '手机',
      Responsive: '响应',
      Flip: '旋转',
      Redo: '回退',
      Undo: '撤回',
      Play: '预览',
      Code: '代码',
      JSON: 'JSON',
      Design: '设计',
      Clone: '复制',
      Remove: '删除',
    },
  },
})
const App = () => {
  const { loading, authLogin } = useModel('designable')
  const [baseSource, setBaseSource] = useState([
    // 基础控件 有新增组件在此添加一下
    Text,
    Button,
    Input,
    YearPicker,
    Year,
    // PortalCustom,
  ])
  const [baseChartSource, setBaseChartSource] = useState([
    PortalBar,
    PortalBarLand,
    PortalBarStacked,
    PortalBarCoordinate,
    PortalPie,
    PortalPieDouble,
    PortalPieHollow,
    PortalLine,
    PortalLineSmooth,
  ])
  const [baseLayoutSource, setBaseLayoutSource] = useState([FormTable])
  const { location } = useModel('@@qiankunStateFromMaster')
  const getNewUserToken = () => {
    let designerLastTime = parseInt(
      window.localStorage.getItem('designerLastTime')
    )
    designerLastTime = Math.floor(designerLastTime / 60000)
    let currentTime = Math.floor(new Date().getTime() / 60000)
    console.log('currentTime=', currentTime)
    console.log('designerLastTime=', designerLastTime)
    console.log('ssssss=====1222', currentTime - designerLastTime)
    if (
      currentTime - designerLastTime > 0 &&
      currentTime - designerLastTime <= 11
    ) {
      //请求刷新接口
      authLogin()
    }
  }
  useEffect(() => {
    //用于记录引擎的操作时间
    window.localStorage.setItem('designerLastTime', Date.now().toString())
    const newIntervalId = setInterval(() => {
      getNewUserToken()
    }, 600000) //10分钟
    return () => clearInterval(newIntervalId)
  }, [])
  const { sceneDefaultLayoutJson } = useModel('portalPreview')

  const engine = useMemo(
    () =>
      createDesigner({
        shortcuts: [
          new Shortcut({
            codes: [
              [KeyCode.Meta, KeyCode.S],
              [KeyCode.Control, KeyCode.S],
            ],
            handler(ctx) {
              // saveSchema(ctx.engine)
            },
          }),
        ],
        rootComponentName: 'Form',
      }),
    []
  )
  const effects = (form, node) => {
    const type = node?.props?.['x-component']
    onFieldInit('columnLength', (field) => {
      form.setFieldState('columnLength', (state) => {
        if (INIT_DATA?.[type]?.['disabled']) {
          //固定类型控件不可编辑长度
          state.disabled = true
        }
        state.validator = {
          maximum: INIT_DATA?.[type]?.['columnLength'],
        }
        if (state.value) {
          return
        }
        // state.disabled = true
        state.value = INIT_DATA?.[type]?.['columnLength']
      })
    })

    onFieldValueChange('columnName', (field) => {
      form.setFieldState('columnCode', (state) => {
        state.value = pinyinUtil
          .getFirstLetter(field.value, false)
          .toUpperCase()
      })
    })
  }

  return (
    <Spin spinning={loading}>
      <Designer engine={engine}>
        <StudioPanel actions={<ActionsWidgetChart />}>
          <CompositePanel>
            <CompositePanel.Item title="panels.Component" icon="Component">
              <ResourceWidget
                title="sources.Layouts"
                sources={baseLayoutSource}
              />
              <ResourceWidget title="sources.Inputs" sources={baseSource} />
              <ResourceWidget
                title="sources.DataChart"
                sources={baseChartSource}
              />
            </CompositePanel.Item>
            <CompositePanel.Item title="panels.OutlinedTree" icon="Outline">
              <OutlineTreeWidget />
            </CompositePanel.Item>
            <CompositePanel.Item title="panels.History" icon="History">
              <HistoryWidget />
            </CompositePanel.Item>
          </CompositePanel>
          <Workspace id="form">
            <WorkspacePanel>
              <ToolbarPanel>
                <DesignerToolsWidget />
                <ViewToolsWidget
                  use={['DESIGNABLE', 'JSONTREE', 'MARKUP', 'PREVIEW']}
                />
              </ToolbarPanel>
              <ViewportPanel style={{ height: '100%' }}>
                <ViewPanel type="DESIGNABLE" className="designable_wrap">
                  {() => (
                    <ComponentTreeWidget
                      components={{
                        Form,
                        Field,
                        Text,
                        Button,
                        Input,
                        PortalBar,
                        PortalBarLand,
                        PortalBarStacked,
                        PortalBarCoordinate,
                        PortalPie,
                        PortalPieDouble,
                        PortalPieHollow,
                        PortalLine,
                        PortalLineSmooth,
                        // PortalCustom,
                        YearPicker,
                        Year,
                        FormTable,
                      }}
                    />
                  )}
                </ViewPanel>

                <ViewPanel type="JSONTREE" scrollable={false}>
                  {(tree, onChange) => (
                    <SchemaEditorWidget tree={tree} onChange={onChange} />
                  )}
                </ViewPanel>
                <ViewPanel type="MARKUP" scrollable={false}>
                  {(tree) => <MarkupSchemaWidget tree={tree} />}
                </ViewPanel>
                <ViewPanel type="PREVIEW">
                  {(tree) => <PreviewWidget tree={tree} />}
                </ViewPanel>
              </ViewportPanel>
            </WorkspacePanel>
          </Workspace>
          <SettingsPanel title="panels.PropertySettings">
            <SettingsForm
              effects={effects}
              className={styles.design_setting_wrap}
            />
          </SettingsPanel>
        </StudioPanel>
      </Designer>
    </Spin>
  )
}
export default App
