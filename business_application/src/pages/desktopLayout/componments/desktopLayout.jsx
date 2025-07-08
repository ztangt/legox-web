/**
 * @author zhangww
 * @description 桌面布局（all）
 */
import { Button, InputNumber, Modal, Spin } from 'antd'
import axios from 'axios'
import classNames from 'classnames'
import { connect } from 'dva'
import { useContext, useEffect, useState } from 'react'
import { useSelector } from 'umi'
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight'
import { MyContext } from '../../../layouts/index'
import { REQUEST_SUCCESS } from '../../../service/constant'
import { defaultLayoutState, emptyLayoutState } from '../../../util/constant'
import styles from './desktopLayout.less'
const { confirm } = Modal

import ColumnAll from '../../index/componments/columnAll'

function DesktopLayout({ dispatch, desktopLayout }) {
  const { menus } = useSelector(({ user }) => ({
    ...user,
  }))
  const collapsed = useContext(MyContext)
  const [count, setCount] = useState(0)
  const { layoutState, isOver, refreshTag, desktopHeight } = desktopLayout

  useEffect(() => {
    dispatch({
      type: 'desktopLayout/getColumnList',
      payload: {
        // sectionType: 1,
        start: 1,
        limit: 100,
      },
    })
  }, [])
  useEffect(() => {
    if (menus.length) {
      setTimeout(() => {
        getAxios()
      }, 0)
    }
    console.log('collapsed1', collapsed)
  }, [collapsed, count, refreshTag])

  const tableType = '1'
  const styleType = '2'
  const defaultHeight = 'calc(100% - 170px)'

  function getAxios() {
    dispatch({
      type: 'desktopLayout/updateStates',
      payload: {
        showDesktopTab: true,
        isOver: false,
      },
    })
    const id = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).id : ''
    const desktopType = localStorage.getItem(`desktopType${id}`) || 0
    const tableConfig = JSON.parse(localStorage.getItem('tableConfig'))
    // console.log('123xxx:',desktopType,tableConfig);
    // 1-快捷桌面
    if (desktopType == 1 && tableConfig && tableConfig.TABLE_FAST.substr(0, 1) == 1) {
      historyPush({ pathname: '/fastDesktop' })
      //2-融合桌面
    } else if (desktopType == 2 && tableConfig && tableConfig.TABLE_MIX.substr(0, 1) == 1) {
      historyPush({ pathname: '/fusionDesktop' })
      // 0- 个人桌面   2022.08.22  新用户初始下tableConfig为null  给个默认的吧？
    } else if (
      (desktopType == 0 && tableConfig && tableConfig.TABLE_PERSON.substr(0, 1) == 1) ||
      tableConfig === null
    ) {
      const type = '1'
      const ptType = '2'
      const fileName = 'deskTable'
      const jsonName = 'tablelayout.json'
      const minioUrl = localStorage.getItem('minioUrl')
      const tenantId = localStorage.getItem('tenantId')
      const identityId = localStorage.getItem('identityId')
      // debugger
      // 完整路径： minio地址/租户ID/deskTable/岗人ID/平台类型如1/类型如1/tablelayout.json
      let url = `${minioUrl}/${tenantId}/${fileName}/${identityId}/${ptType}/${type}/${jsonName}`
      axios
        .get(url, {
          // 防止走缓存 带个时间戳
          params: {
            t: Date.parse(new Date()) / 1000,
          },
        })
        .then(function (res) {
          if (res.status == REQUEST_SUCCESS) {
            dispatch({
              type: 'desktopLayout/updateStates',
              payload: {
                layoutState: res.data || defaultLayoutState,
                desktopHeight: res.data?.height || '',
                isOver: true,
              },
            })
          } else {
            dispatch({
              type: 'desktopLayout/updateStates',
              payload: {
                isOver: true,
              },
            })
          }
        })
        .catch(function (error) {
          // here ~~  没有数据  重新请求支撑的minioUrl
          const ptType = '1'
          const type = '1'
          const fileName = 'deskTable'
          const jsonName = 'tablelayout.json'
          const minioUrl = localStorage.getItem('minioUrl')
          const tenantId = localStorage.getItem('tenantId')
          // 完整路径： minio地址/租户ID/deskTable/平台类型如1/类型如1/tablelayout.json
          let url = `${minioUrl}/${tenantId}/${fileName}/${ptType}/${type}/${jsonName}`
          axios
            .get(url, {
              // 防止走缓存 带个时间戳
              params: {
                t: Date.parse(new Date()) / 1000,
              },
            })
            .then(function (res) {
              if (res.status == REQUEST_SUCCESS) {
                // count++;
                dispatch({
                  type: 'desktopLayout/updateStates',
                  payload: {
                    layoutState: res.data || defaultLayoutState,
                    desktopHeight: res.data?.height || '',
                    isOver: true,
                  },
                })
                // 无奈之举
                // if (count === 1 && res.data) {
                //   historyPush('/desktopLayout');
                //   historyPush('/');
                // }
              } else {
                dispatch({
                  type: 'desktopLayout/updateStates',
                  payload: {
                    isOver: true,
                  },
                })
              }
            })
            .catch(function (error) {
              dispatch({
                type: 'desktopLayout/updateStates',
                payload: {
                  isOver: true,
                },
              })
              // here ~~   no matter
            })
        })
    } else {
    }
  }
  function getDefaultState() {
    // 样式类型 1：后台设置的系统样式 2：个人设置的样式
    const ptType = '1'
    const type = '1'
    const fileName = 'deskTable'
    const jsonName = 'tablelayout.json'
    const minioUrl = localStorage.getItem('minioUrl')
    const tenantId = localStorage.getItem('tenantId')
    // 完整路径： minio地址/租户ID/deskTable/平台类型如1/类型如1/tablelayout.json
    let url = `${minioUrl}/${tenantId}/${fileName}/${ptType}/${type}/${jsonName}`
    axios
      .get(url, {
        // 防止走缓存 带个时间戳  
        params: {
          t: Date.parse(new Date()) / 1000,
        },
      })
      .then(function (res) {
        if (res.status == 200) {
          dispatch({
            type: 'desktopLayout/updateTableLayout',
            payload: {
              tableType,
              styleType,
              tableStyleJson: JSON.stringify(res.data) || JSON.stringify(defaultLayoutState),
            },
            callback: () => {
              dispatch({
                type: 'desktopLayout/updateStates',
                payload: {
                  desktopHeight: res.data?.height || '',
                },
              })
              setCount(count + 1)
              // window.location.reload();
            },
          })
        }
      })
      .catch(function (error) {
        // here ~~   no matter
        dispatch({
          type: 'desktopLayout/updateTableLayout',
          payload: {
            tableType,
            styleType,
            tableStyleJson: JSON.stringify(defaultLayoutState),
          },
          callback: () => {
            setCount(count + 1)
            // window.location.reload();
          },
        })
      })
  }

  function onHandleClick(text) {
    confirm({
      title: `确认要${text}吗？`,
      content: '',
      onOk() {
        switch (text) {
          case '恢复系统样式':
            getDefaultState()
            break
          case '清空':
            emptyLayoutState.height = ''
            dispatch({
              type: 'desktopLayout/updateTableLayout',
              payload: {
                tableType,
                styleType,
                tableStyleJson: JSON.stringify(emptyLayoutState),
              },
              callback: () => {
                setCount(count + 1)
                // window.location.reload();
              },
            })
            break
          case '保存':
            layoutState.height = desktopHeight
            dispatch({
              type: 'desktopLayout/updateTableLayout',
              payload: {
                tableType,
                styleType,
                tableStyleJson: JSON.stringify(layoutState),
              },
            })
            break
          // case 'close':
          //   historyPush('/');
          //   window.location.reload();
          //   break;

          default:
            break
        }
      },
      onCancel() {},
    })
  }

  return (
    <Spin spinning={!isOver}>
      <div className={styles.wrapper}>
        <div className={styles.desc}>
          {/* <h1 className={styles.mr_10}>桌面可视化布局</h1> */}
          <Button className={styles.mr_10} onClick={() => onHandleClick('恢复系统样式')}>
            恢复系统样式
          </Button>
          <Button className={styles.mr_10} onClick={() => onHandleClick('清空')}>
            清空
          </Button>
          <Button className={styles.mr_10} onClick={() => onHandleClick('保存')}>
            保存
          </Button>
          <InputNumber
            className={styles.mr_10}
            min={0}
            max={3000}
            value={desktopHeight}
            onChange={(num) =>{
              console.log(num);
              dispatch({
                type: 'desktopLayout/updateStates',
                payload: {
                  desktopHeight: num,
                },
              })}
            }
          />
          <span className={classNames(styles.mr_10, styles.flex_align_center)}>高度设置</span>
          {/* <Button type="primary" className={styles.mr_10} onClick={()=>onHandleClick('close')}>
            关闭
          </Button> */}
        </div>
        {/* <Divider /> */}
        <ReSizeLeftRight
          // height={defaultHeight}
          vNum={200}
          // isLayout={true}
          leftChildren={
            <ul className={styles.menuContainer} id="menuContainer">
              <p>栏目设置</p>
            </ul>
          }
          rightChildren={
            <div
              className={styles.layoutContainer}
              style={{ width: collapsed ? 'calc(100vw - 215px)' : 'calc(100vw - 440px)', height: desktopHeight || 'calc(100vh - 80px)' }}
            >
              {isOver && <ColumnAll />}
            </div>
          }
        ></ReSizeLeftRight>
      </div>
    </Spin>
  )
}
export default connect(({ desktopLayout }) => ({
  desktopLayout,
}))(DesktopLayout)
