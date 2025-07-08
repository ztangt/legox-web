import 'antd/dist/antd.less'
import { useEffect, useMemo, useState } from 'react'
// import { GlobalRegistry } from '@/designable/core/registry'
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
  ViewportPanel,
  ViewToolsWidget,
  Workspace,
  WorkspacePanel,
} from '@/designable/react'
import {
  setNpmCDNRegistry,
  SettingsForm,
} from '@/designable/react-settings-form'

import {
  FormGrid,
  FormTable,
  PortalApp,
  PortalBar,
  PortalCalendar,
  PortalCustom,
  PortalFocus,
  PortalNotice,
  PortalPie,
  PortalProfile,
  PortalTitle,
  PortalTodo,
  PortalWorkbench,
  Text,
} from '@/custom/components'
import { Field, Form } from '@/designable/antd'
import {
  createDesigner,
  GlobalRegistry,
  KeyCode,
  Shortcut,
} from '@/designable/core'
import { Spin } from 'antd'
import { useModel } from 'umi'
import {
  ActionsWidgetPortal,
  ActionsWidgetPortalHeader,
  MarkupSchemaWidget,
  PreviewWidget,
  SchemaEditorWidget,
} from '../components/widgets'
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
    PortalTitle,
    PortalNotice,
    PortalTodo,
    PortalWorkbench,
    PortalFocus,
    PortalProfile,
    PortalApp,
    PortalCalendar,
    PortalCustom,
  ])
  const [baseChartSource, setBaseChartSource] = useState([PortalBar, PortalPie])
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
  const baseSourceObj = {
    // 基础控件 有新增组件在此添加一下
    Text: Text,
    PortalTitle: PortalTitle,
    PortalNotice: PortalNotice,
    PortalTodo: PortalTodo,
    PortalWorkbench: PortalWorkbench,
    PortalFocus: PortalFocus,
    PortalProfile: PortalProfile,
    PortalApp: PortalApp,
    PortalCalendar: PortalCalendar,
    PortalCustom: PortalCustom,
  }
  const baseChartSourceObj = {
    // BaseChart: BaseChart,
    PortalBar: PortalBar,
    PortalPie: PortalPie,
  }
  const baseLayoutSourceObj = {
    FormTable: FormTable,
    // FormGrid: FormGrid,
  }
  useEffect(() => {
    if (window.location.href.includes('/business_application/portalDesigner')) {
      //筛选布局json中是否包含该控件,未配置过的控件前台不做展示
      //2023.11.13 崔晶说 不做过滤   都展示
      const arr1 = Object.keys(baseSourceObj)?.map((key) => {
        // if (JSON.stringify(sceneDefaultLayoutJson).includes(key)) {
        return baseSourceObj[key]
        // }
      })
      const arr2 = Object.keys(baseChartSourceObj)?.map((key) => {
        // if (JSON.stringify(sceneDefaultLayoutJson).includes(key)) {
        return baseChartSourceObj[key]
        // }
      })
      const arr3 = Object.keys(baseLayoutSourceObj)?.map((key) => {
        // if (JSON.stringify(sceneDefaultLayoutJson).includes(key)) {
        return baseLayoutSourceObj[key]
        // }
      })
      setBaseSource(arr1)
      setBaseChartSource(arr2)
      setBaseLayoutSource(arr3)
    }
  }, [sceneDefaultLayoutJson])
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
  const effects = (form, node) => {}

  return (
    <Spin spinning={loading}>
      <Designer engine={engine}>
        {/* <StudioPanel actions={<ActionsWidgetProtal />}> */}
        <StudioPanel
          actions={
            window.location.href.includes(
              '/business_application/portalDesigner'
            ) ? (
              <ActionsWidgetPortalHeader />
            ) : (
              <ActionsWidgetPortal />
            )
          }
        >
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
                        PortalTitle,
                        PortalNotice,
                        PortalTodo,
                        PortalBar,
                        PortalPie,
                        PortalWorkbench,
                        PortalFocus,
                        PortalProfile,
                        PortalApp,
                        PortalCalendar,
                        PortalCustom,
                        FormTable,
                        FormGrid,
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
