/**
 * @author zhangww
 * @description 桌面布局（all）
 */
import { connect } from 'dva';
import { history } from 'umi';
import axios from 'axios';
import classNames from 'classnames'
import React, { useState, useEffect } from 'react';
import styles from './desktopLayout.less';
import { defaultLayoutState, emptyLayoutState } from '../../../util/constant';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import ColumnAll from '../../desktopLayoutIndex/componments/columnAll';
import AddModal from './addModal';
import AddTextModal from './addTextModal';
import UpdateModal from './updateModal';
import UpdateTextModal from './updateTextModal';
import { Button, Tabs, Modal, InputNumber } from 'antd';

const { confirm } = Modal;

const { TabPane } = Tabs;

function DesktopLayout({ dispatch, desktopLayout }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    layoutState,
    isAddTextModalVisible,
    isUpdateTextModalVisible,
    isAddModalVisible,
    isUpdateModalVisible,
    addData,
    desktopHeight,
  } = desktopLayout;
  const activeKey = localStorage.getItem('desktopActiveKey') || '1';

  // 桌面类型：1个人桌面 2快捷桌面 3融合桌面
  const tableType = '1';
  // 样式类型 1：后台设置的系统样式 2：个人设置的样式
  const styleType = '1';
  const defaultHeight = 'calc(90vh - 170px)';

  useEffect(() => {
    // dispatch({
    //   type: 'desktopLayout/updateStates',
    //   payload: {
    //     showDesktopTab: true,
    //   },
    // });
    dispatch({
      type: 'desktopLayout/getColumnList',
      payload: {
        start: 1,
        limit: 100,
      },
      callback: () => {
        const ptType = '1';
        const type = '1';
        const fileName = 'deskTable';
        const jsonName = 'tablelayout.json';
        const minioUrl = localStorage.getItem('minioUrl');
        const tenantId = localStorage.getItem('tenantId');
        // 完整路径： minio地址/租户ID/deskTable/平台类型如1/类型如1/tablelayout.json
        let url = `${minioUrl}/${tenantId}/${fileName}/${ptType}/${type}/${jsonName}`;
        axios
          .get(url, {
            // 防止走缓存 带个时间戳
            params: {
              t: Date.parse(new Date()) / 1000,
            },
          })
          .then(function(res) {
            if (res.status == 200) {
              dispatch({
                type: 'desktopLayout/updateStates',
                payload: {
                  layoutState: res.data || defaultLayoutState,
                  desktopHeight: res.data?.height || '',
                  isFinsh: true,
                },
              });
            } else {
              dispatch({
                type: 'desktopLayout/updateStates',
                payload: {
                  isFinsh: true,
                },
              });
            }
          })
          .catch(function(error) {
            // here ~~   no matter
            dispatch({
              type: 'desktopLayout/updateStates',
              payload: {
                isFinsh: true,
              },
            });
          });
      },
    });
  }, []);

  function onHandleClick(text) {
    confirm({
      title: `确认要${text}吗？`,
      content: '',
      onOk() {
        switch (text) {
          case '恢复默认样式':
            dispatch({
              type: 'desktopLayout/updateTableLayout',
              payload: {
                tableType,
                styleType,
                tableStyleJson: JSON.stringify(defaultLayoutState),
              },
              callback: () => {
                window.location.reload();
              },
            });
            break;
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
                window.location.reload();
              },
            });
            break;
          case '清空样式':
            dispatch({
              type: 'desktopLayout/updateTableLayout',
              payload: {
                tableType: '3',
                styleType,
                tableStyleJson: '',
              },
              callback: () => {
                localStorage.setItem('desktopActiveKey', '2');
                window.location.reload();
              },
            });
            break;
          case '保存':
            layoutState.height = desktopHeight
            dispatch({
              type: 'desktopLayout/updateTableLayout',
              payload: {
                tableType,
                styleType,
                tableStyleJson: JSON.stringify(layoutState),
              },
            });
            break;

          default:
            break;
        }
      },
      onCancel() {},
    });
  }

  function onTabsChange(key) {
    localStorage.setItem('desktopActiveKey', key);
  }

  return (
    <div className={styles.wrapper} id="desktop_wrapper">
      <div className={styles.desc}>
        <Button
          type="primary"
          className={styles.mr_10}
          onClick={() => onHandleClick('恢复默认样式')}
        >
          恢复默认样式
        </Button>
        <Button
          type="primary"
          className={styles.mr_10}
          onClick={() => {
            // if (addData.length > 4) {
            //   message.warning('超出数量限制，最多只能新增五个栏目！');
            //   return
            // }
            dispatch({
              type: 'desktopLayout/updateStates',
              payload: {
                isAddModalVisible: true,
              },
            });
          }}
        >
          新增栏目
        </Button>
        <Button
          type="primary"
          className={styles.mr_10}
          onClick={() =>
            dispatch({
              type: 'desktopLayout/updateStates',
              payload: {
                isUpdateModalVisible: true,
              },
            })
          }
        >
          编辑栏目
        </Button>
        <Button
          type="primary"
          className={styles.mr_10}
          onClick={() => {
            dispatch({
              type: 'desktopLayout/updateStates',
              payload: {
                isAddTextModalVisible: true,
              },
            });
          }}
        >
          新增文字栏目
        </Button>
        <Button
          type="primary"
          className={styles.mr_10}
          onClick={() => {
            dispatch({
              type: 'desktopLayout/updateStates',
              payload: {
                isUpdateTextModalVisible: true,
              },
            });
          }}
        >
          编辑文字栏目
        </Button>
        <Button
          type="primary"
          className={styles.mr_10}
          onClick={() => onHandleClick('清空')}
        >
          清空
        </Button>
        <Button
          type="primary"
          className={styles.mr_10}
          onClick={() => onHandleClick('保存')}
        >
          保存
        </Button>
        <span className={classNames(styles.mr_10, styles.flex_align_center)}>高度设置</span>
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
      </div>
      <ReSizeLeftRight
        // height={defaultHeight}
        leftChildren={
          <ul className={styles.menuContainer} id="menuContainer" style={{height: defaultHeight}}>
            <p>栏目设置</p>
          </ul>
        }
        rightChildren={
          <div className={styles.layoutContainer} style={{height: defaultHeight}}>
            <ColumnAll />
          </div>
        }
      ></ReSizeLeftRight>
      
      {isAddTextModalVisible && <AddTextModal />}
      {isAddModalVisible && <AddModal />}
      {isUpdateModalVisible && <UpdateModal />}
      {isUpdateTextModalVisible && <UpdateTextModal />}
    </div>
  );
}
export default connect(({ desktopLayout }) => ({
  desktopLayout,
}))(DesktopLayout);
