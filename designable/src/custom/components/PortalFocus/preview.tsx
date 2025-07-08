import IconFont from '@/Icon-font'
import IconLeft from '@/Icon-left'
import { creatPortalFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { observer } from '@formily/react'
import classnames from 'classnames'
import { useEffect, useState } from 'react'
import LeftTitle from '../../../public/leftTitle'
import { isInIconFont } from '../../../utils/utils'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'

export const PortalFocus: DnFC<any> = observer((props) => {
  const [list, setList] = useState([])

  useEffect(() => {
    setList(props?.list ? props.list : defaultList)
  }, [props?.list])

  const defaultList = [
    {
      proName: '待办',
      count: '89',
      menuCode: 'default',
      menuLink: '/waitMatter',
    },
    {
      proName: '日程',
      count: '8',
      menuCode: 'jichushujuguanli',
      menuLink: '/calendarMg',
    },
  ]

  function onLinkClick(item) {
    if (
      window.location.href?.includes('business_application') &&
      !window.location.href?.includes('portalDesigner')
    ) {
      const query = {
        menuLink: '',
        menuName: '',
      }
      query.menuLink = item.menuLink
      query.menuName = item.menuName
      if (item.linkType === 1) {
        window.localStorage.setItem('portalQuery', JSON.stringify(query))
        setTimeout(() => {
          window.location.href = `#/business_application?sys=portal&portalTitle=工作台&portalPosition=sys&registerCode=${item.registerCode}`
        }, 0)
      } else if (item.linkType === 2 || item.linkType === 3) {
        let arr = item.menuLink?.split('/')
        window.location.href = `#/business_application/portalPage?sys=portal&portalTitle=${item.menuName}&microAppName=${arr?.[0]}&url=${arr?.[1]}&portalPosition=first`
      }
    }
  }

  return (
    <div className={styles.container} {...props}>
      <LeftTitle title={props?.title ? props.title : '重点关注事项'} />
      <ul>
        {list.map((item, index) => {
          return (
            <li
              className={styles[`bg_color_${index % 5}`]}
              onClick={() => {
                onLinkClick(item)
              }}
            >
              <div className={styles.left}>
                {/* style={{fontSize: props?.topFontSize || '20px'}} */}
                <div className={styles.top}>
                  <p title={item.proName}>{item.proName}</p>
                </div>
                {/* style={{fontSize: props?.bottomFontSize || '26px'}} */}
                <div className={styles.bottom}>
                  <p title={`${item.count}${item.unit}`}>
                    {item.count}
                    {item.unit}
                  </p>
                </div>
              </div>
              <div className={styles.right}>
                <div
                  className={classnames(
                    styles.icon,
                    styles[`border_color_${index % 5}`]
                  )}
                >
                  <IconFont
                    type={`icon-${isInIconFont(item)}`}
                    style={{ color: 'white' }}
                  />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
})
PortalFocus.Behavior = createBehavior({
  name: 'PortalFocus',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PortalFocus',
  designerProps: {
    propsSchema: creatPortalFieldSchema(AllSchemas.PortalFocus),
  },
  designerLocales: AllLocales.PortalFocus,
})

PortalFocus.Resource = createResource({
  icon: <IconLeft type="icon-shurukuang" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'PortalFocus',
        'x-decorator': 'FormItem',
        'x-component': 'PortalFocus',
        'x-reactions': {
          dependencies: [
            {
              property: 'value',
              type: 'any',
            },
          ],
          fulfill: {
            run:
              "// 1.'预算金额', '执行金额', '在途金额', '可用金额'展示\nconst state = $observable({\n  list: [],\n})\n\nvar title = '重点关注事项'\nvar list = state.list\n\n$props({\n  title,\n  list,\n  // 按需求调整字体大小\n  topFontSize: '18px',  //  上面文字的大小\n  bottomFontSize: '26px',  // 下面数字的大小\n})\n\nfunction convertToWanYuan(number) {\n  return (number / 10000).toFixed();\n}\n$effect(() => {\n  $self.loading = true\n  // 预算金额\n  const promise1 = new Promise((resolve, reject) => {\n    fetch(`${window.localStorage.getItem('env')}/ic/portal/budgetMoney`, {\n      method: 'get',\n      headers: {\n        Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),\n      },\n    })\n      .then((response) => response.json())\n      .then(\n        ({ data }) => {\n          debugger\n          resolve(data)\n        },\n        () => {\n          debugger\n        }\n      )\n  })\n\n  // 执行金额\n  const promise2 = new Promise((resolve, reject) => {\n    fetch(`${window.localStorage.getItem('env')}/ic/portal/executeMoney`, {\n      method: 'get',\n      headers: {\n        Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),\n      },\n    })\n      .then((response) => response.json())\n      .then(\n        ({ data }) => {\n          resolve(data)\n        },\n        () => { }\n      )\n  })\n\n  // 在途金额\n  const promise3 = new Promise((resolve, reject) => {\n    fetch(`${window.localStorage.getItem('env')}/ic/portal/onWayMoney`, {\n      method: 'get',\n      headers: {\n        Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),\n      },\n    })\n      .then((response) => response.json())\n      .then(\n        ({ data }) => {\n          resolve(data)\n        },\n        () => { }\n      )\n  })\n\n  // 可用金额\n  const promise4 = new Promise((resolve, reject) => {\n    fetch(`${window.localStorage.getItem('env')}/ic/portal/avlMoney`, {\n      method: 'get',\n      headers: {\n        Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),\n      },\n    })\n      .then((response) => response.json())\n      .then(\n        ({ data }) => {\n          resolve(data)\n        },\n        () => { }\n      )\n  })\n\n  // 使用Promise.all方法来同时处理多个Promise对象，并在它们都完成后获得结果\n  Promise.all([promise1, promise2, promise3, promise4])\n    .then((results) => {\n      $self.loading = false\n      var tmp = [\n        {\n          proName: '预算金额', //卡片展示名称\n          menuId: '', //菜单id\n          menuCode: 'default', //卡片展示图标\n          menuLink: '/waitMatter', // 跳转地址\n          menuName: '',  // 菜单名称（面包屑展示名称，linkType为1时无用）\n          linkType: 1, // 跳转方式  1.进入系统菜单  2.门户内查看（进入子项目的路由）  3.门户内查看（iframe）\n          registerCode: 'TEST', //系统Code（linkType为1时必传）\n          count: convertToWanYuan(results[0] || 0), //卡片展示数量  convertToWanYuan为转万元方法，不需要转换时去掉\n          unit: '万元', //卡片展示单位\n        },\n        {\n          proName: '执行金额',\n          menuId: '',\n          menuCode: 'jichushujuguanli',\n          menuLink: '/calendarMg',\n          menuName: '执行金额',\n          linkType: 1,\n          registerCode: '1002',\n          count: convertToWanYuan(results[1] || 0),\n          unit: '万元',\n        },\n        {\n          proName: '在途金额',\n          menuId: '',\n          menuCode: 'default',\n          menuLink: 'business_cma/demo0',\n          menuName: '在途金额',\n          linkType: 2,\n          registerCode: '',\n          count: convertToWanYuan(results[2] || 0),\n          unit: '万元',\n        },\n        {\n          proName: '可用金额',\n          menuId: '',\n          menuCode: 'jichushujuguanli',\n          menuLink: 'business_cma/jimu?to=%2Fjmreport%2Fview%2F870549535339008000',\n          menuName: '可用金额',\n          linkType: 3,\n          registerCode: '',\n          count: convertToWanYuan(results[3] || 0),\n          unit: '万元',\n        },\n      ]\n      state.list = tmp\n    })\n    .catch((error) => {\n      $self.loading = false\n      console.error(error)\n    })\n}, [])\n\n\n//  2. 待办、已办数量  展示\n// const state = $observable({\n//   list: [],\n// })\n\n// var title = '重点关注事项'\n// var list = state.list\n\n// $props({\n//   title,\n//   list,\n// })\n\n// $effect(() => {\n//   $self.loading = true\n//   fetch(`${window.localStorage.getItem('env')}/bpm/work/taskCounts`, {\n//     method: 'get',\n//     headers: {\n//       Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),\n//     },\n//   })\n//     .then((response) => response.json())\n//     .then(\n//       ({ data }) => {\n//         $self.loading = false\n//         var tmp = [\n//           {\n//             proName: '待办数量', //卡片展示名称\n//             menuId: '', //菜单id\n//             menuCode: 'default', //卡片展示图标\n//             menuLink: '/waitMatter', // 跳转地址\n//             menuName: '',  // 菜单名称\n//             linkType: 1, // 跳转方式  1.进入系统菜单  2.门户内查看（进入子项目的路由）  3.门户内查看（iframe）\n//             registerCode: 'TEST', //系统Code（linkType为1时必传）\n//             count: data.todoNums, //卡片展示数量  convertToWanYuan为转万元方法，不需要转换时去掉\n//             unit: '个', //卡片展示单位\n//           },\n//           {\n//             proName: '已办数量', //卡片展示名称\n//             menuId: '', //菜单id\n//             menuCode: 'default', //卡片展示图标\n//             menuLink: '/waitMatter', // 跳转地址\n//             menuName: '',  // 菜单名称\n//             linkType: 1, // 跳转方式  1.进入系统菜单  2.门户内查看（进入子项目的路由）  3.门户内查看（iframe）\n//             registerCode: 'TEST', //系统Code（linkType为1时必传）\n//             count: data.doneNums, //卡片展示数量  convertToWanYuan为转万元方法，不需要转换时去掉\n//             unit: '个', //卡片展示单位\n//           },\n//         ]\n//         state.list = tmp\n//       },\n//       () => { }\n//     )\n// }, [])\n",
          },
        },
        'x-component-props': {
          style: {
            height: '400px',
            padding: '8px',
            // lineHeight: '200px',
            // ...initStyle?.style,
            // minHeight: '200px',
            // minWidth: '200px',
            // borderStyle: 'none',
          },
        },
        'x-decorator-props': {
          labelStyle: {
            // ...initStyle?.labelStyle,
            width: '0px',
          },
        },
      },
    },
  ],
})
