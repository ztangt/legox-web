/**
 * @author zhangww
 * @description 融合桌面
 */
import { connect } from 'dva';
import { history } from 'umi';
import classnames from 'classnames';
import styled from 'styled-components';
import styles from './fusionDesktop.less';
import pathMatch from 'path-match';
import { useState, useEffect, Fragment } from 'react';
import _ from 'lodash';
import { setAllAppList, getFlatArr } from '../../../util/util';
import axios from 'axios';
import IconFont from '../../../Icon_manage';
import $ from './c9carousel/cloud9carousel';
import setLogoSrc from '../images/setup.png';
import addLogoSrc from '../images/addItem.png';
import { Button, message, Modal } from 'antd';
import SetModal from '../../../componments/SetModal';
import { ReactComponent as Logo } from '../images/add.svg';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { CloseOutlined, MinusOutlined } from '@ant-design/icons';
const { confirm } = Modal;

function FusionDesktop({ dispatch, fusionDesktop }) {
  const {
    allAppList,
    selectAppList,
    defalutConfiguration,
    isSetModalVisible,
  } = fusionDesktop;

  const tableType = '3';
  const styleType = '2';

  const [count, setCount] = useState(0);
  const [prevJson, setPrevJson] = useState(null);

  const allmenusIdArr = JSON.parse(localStorage.getItem('allmenusIdArr'));
  const bigIconKeyValArr = JSON.parse(localStorage.getItem('bigIconKeyValArr'));
  const iconKeyValArr = JSON.parse(localStorage.getItem('iconKeyValArr'));

  useEffect(() => {
    dispatch({
      type: 'fusionDesktop/getUserMenus',
      payload: {
        sysPlatType: 'PLATFORM_BUSS',
      },
      callback: (allAppList) => {
        let tmp = allAppList.filter((i) => !i.hideInMenu);
        let moreArr = tmp.filter((i) => !i.children?.length && i.path);

        tmp = allAppList.filter((i) => i.children?.length);

        tmp.forEach((element) => {
          element['children'] = getFlatArr(element.children).filter(
            (i) => i.path && i.path != '',
          );
        });
        tmp.push({
          menuId: 'more',
          menuName: '更多',
          children: moreArr,
        });
        // dispatch({
        //   type: 'updateStates',
        //   payload: {
        //     allAppList: tmp,
        //   },
        // });
        const id = localStorage.getItem('userInfo')
          ? JSON.parse(localStorage.getItem('userInfo')).id
          : '';
        const desktopType = localStorage.getItem(`desktopType${id}`) || 0;
        const tableConfig = JSON.parse(
          localStorage.getItem('tableConfig'),
        );
        if (
          !tableConfig ||
          (desktopType == 2 &&
            tableConfig &&
            tableConfig.TABLE_MIX.substr(0, 1) == 1)
        ) {
          const type = '3';
          const ptType = '2';
          const fileName = 'deskTable';
          const jsonName = 'tablelayout.json';
          const minioUrl = localStorage.getItem('minioUrl');
          const tenantId = localStorage.getItem('tenantId');
          const identityId = localStorage.getItem('identityId');
          // 完整路径：minio地址/租户ID/deskTable/岗人ID/平台类型如1/类型如1/tablelayout.json
          let url = `${minioUrl}/${tenantId}/${fileName}/${identityId}/${ptType}/${type}/${jsonName}`;
          axios
            .get(url, {
              // 防止走缓存 带个时间戳
              params: {
                t: Date.parse(new Date()) / 1000,
              },
            })
            .then(function (res) {
              if (res.status == 200) {
                if (res.data) {
                  const allAppList = setAllAppList(
                    tmp,
                    res.data.selectAppList,
                    res.data.defalutConfiguration,
                  );
                  dispatch({
                    type: 'fusionDesktop/updateStates',
                    payload: {
                      allAppList,
                      selectAppList: res.data.selectAppList,
                      defalutConfiguration: res.data.defalutConfiguration,
                    },
                  });
                }
              }
            })
            .catch(function (error) {
              // here ~~  没有数据  重新请求支撑的minioUrl
              const ptType = '1';
              const type = '3';
              const fileName = 'deskTable';
              const jsonName = 'tablelayout.json';
              const minioUrl = localStorage.getItem('minioUrl');
              const tenantId = localStorage.getItem('tenantId');
              // 完整路径： minio地址/租户ID/deskTable/岗人ID/平台类型如1/类型如1/tablelayout.json
              let url = `${minioUrl}/${tenantId}/${fileName}/${ptType}/${type}/${jsonName}`;
              axios
                .get(url, {
                  // 防止走缓存 带个时间戳
                  params: {
                    t: Date.parse(new Date()) / 1000,
                  },
                })
                .then(function (res) {
                  if (res.status == 200) {
                    if (res.data) {
                      const allAppList = setAllAppList(
                        tmp,
                        res.data.selectAppList,
                        res.data.defalutConfiguration,
                      );
                      dispatch({
                        type: 'fusionDesktop/updateStates',
                        payload: {
                          allAppList,
                          selectAppList: res.data.selectAppList,
                          defalutConfiguration:
                            res.data.defalutConfiguration,
                        },
                      });
                    }
                  }
                })
                .catch(function (error) {
                  dispatch({
                    type: 'fusionDesktop/updateStates',
                    payload: {
                      allAppList: tmp,
                    },
                  });
                  // here ~~   no matter
                });
            });
        } else {
          historyPush('/');
        }
      },
    });
  }, []);

  useEffect(() => {
    const showcase = $('#showcase');
    // Cloud9Carousel
    showcase.Cloud9Carousel({
      yOrigin: 140,
      yRadius: 140,
      itemClass: 'card',
      mouseWheel: true,
      bringToFront: false,
      onLoaded: function () {
        showcase.css('visibility', 'visible');
        showcase.css('display', 'none');
        showcase.fadeIn(1500);
      },
    });
  }, []);

  function tableStyleJson(v1, v2) {
    const json = {};
    json.selectAppList = v1;
    json.defalutConfiguration = v2;

    return JSON.stringify(json);
  }

  function onSingClick(i0, i1, i2) {
    if (!count) {
      setPrevJson(allAppList);
    }
    setCount(count + 1);
    const tmp = _.cloneDeep(allAppList);
    if (tmp[i1].children[i2].lock) {
      message.warning('该应用已添加到视图，无法取消！');
      return;
    }
    tmp[i1].children[i2].selected = !tmp[i1].children[i2].selected;
    dispatch({
      type: 'fusionDesktop/updateStates',
      payload: {
        allAppList: tmp,
      },
    });
  }

  function onHideClick() {
    if (count) {
      setCount(0);
      dispatch({
        type: 'fusionDesktop/updateStates',
        payload: {
          allAppList: prevJson,
        },
      });
    }
    dispatch({
      type: 'fusionDesktop/updateStates',
      payload: {
        isSetModalVisible: false,
      },
    });
  }

  function onOkClick() {
    const tmp = allAppList,
      arr = [];
    tmp.forEach((item1) => {
      if (item1.selected && !item1.lock) {
        arr.push(item1);
      }
      item1.children.forEach((item2) => {
        if (item2.selected && !item2.lock) {
          arr.push(item2);
        }
      });
    });
    if (arr.length > 10) {
      message.warning('最多只能添加10个预选菜单');
      return;
    }
    dispatch({
      type: 'fusionDesktop/updateStates',
      payload: {
        // allAppList: tmp,
        selectAppList: arr,
        isSetModalVisible: false,
      },
    });
    dispatch({
      type: 'fusionDesktop/updateTableLayout',
      payload: {
        tableType,
        styleType,
        // tableStyleJson: null
        tableStyleJson: tableStyleJson(arr, defalutConfiguration),
      },
    });
    setCount(0);
  }

  const remove = (list, startIndex) => {
    const result = Array.from(list);
    result.splice(startIndex, 1);
    return result;
  };

  function setLockItem(list, menuId, type) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].menuId == menuId) {
        list[i].lock = !list[i].lock;
        if (type) {
          list[i].selected = !list[i].selected;
        }
        break;
      }
      if (list[i].children) {
        setLockItem(list[i].children, menuId, type);
      }
    }
  }

  // 拖拽 end handle
  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    let options = selectAppList;
    let list = allAppList;
    let fif = options.filter((val) => {
      return val.menuId === result.draggableId;
    });
    const configuration = defalutConfiguration;
    for (let i = 0; i < configuration.length; i++) {
      if (configuration[i].id === destination.droppableId) {
        if (configuration[i].name !== '请添加应用') {
          message.error('此模块已有应用，请重新拖拽应用位置！');
          return;
        }
        configuration[i].idx = fif[0].menuId;
        configuration[i].name = fif[0].menuName;
        configuration[i].path = fif[0].path;
        // configuration[i].url = fif[0].menuImgUrl;
        setLockItem(list, options[source.index].menuId);
        options.splice(source.index, 1);
        dispatch({
          type: 'fusionDesktop/updateStates',
          payload: {
            allAppList: list,
            selectAppList: options,
            defalutConfiguration: configuration,
          },
        });
      }
    }
    // const resultSelectArr = selectKey;
    // resultSelectArr.splice(source.index, 1)
    // const resultSelectAppList = remove(
    //   options,
    //   source.index,
    // );

    // TODO
    dispatch({
      type: 'fusionDesktop/updateTableLayout',
      payload: {
        tableType,
        styleType,
        tableStyleJson: tableStyleJson(options, configuration),
      },
    });
  }

  function linkToPath(val) {
    if (val.name === '请添加应用') {
      return;
    }
    if (!allmenusIdArr.includes(val.idx)) {
      message.warning('此功能授权已被取消，请重新设置')
      return
    }
    if (val.path.includes('dynamicPage')) {
      let bizSolId = 0,
        listId = 0,
        formId = 0,
        otherBizSolId = '';
      const index = val.path.indexOf('?otherBizSolId');
      if (index > -1) {
        otherBizSolId = val.path.slice(index + 15);
        val.path = val.path.slice(0, index);
      }
      const arr = val.path.split('/');
      bizSolId = arr[2];
      listId = arr[3] || 0;
      formId = arr[4] || 0;
      console.log(bizSolId, listId, formId, otherBizSolId);
      if (bizSolId == 0) {
        historyPush({
          pathname: '/dynamicPage',
          query: {
            bizSolId,
            listId,
            formId,
            otherBizSolId,
          },
        });
      } else {
        dispatch({
          type: 'user/getUrlByBSId',
          payload: {
            bizSolId,
          },
          callback: (url) => {
            if (url) {
              let arr = url.split('/');
              arr = arr.filter((item) => item);
              historyPush({
                pathname: `/dynamicPage`,
                query: {
                  bizSolId,
                  microAppName: arr[0],
                  url: arr[1],
                },
              });
            } else {
              historyPush({
                pathname: '/dynamicPage',
                query: {
                  bizSolId,
                  listId,
                  formId,
                  otherBizSolId,
                },
              });
            }
          },
        });
      }
    } else {
      historyPush({
        pathname: val.path,
        
      });
    }
  }

  // app 下移 handle
  function moveDownApp(val, i) {
    let list = allAppList;
    const resultSelectAppList = selectAppList;
    setLockItem(list, val.idx);
    resultSelectAppList.push({
      menuId: val.idx,
      menuName: val.name,
      path: val.path,
      // menuImgUrl: val.url
    });

    const configuration = defalutConfiguration;
    configuration[i].id = `config${i + 1}`;
    configuration[i].idx = '';
    configuration[i].name = '请添加应用';
    configuration[i].path = '';
    // configuration[i].url = addLogoSrc;

    dispatch({
      type: 'fusionDesktop/updateStates',
      payload: {
        allAppList: list,
        selectAppList: resultSelectAppList,
        defalutConfiguration: configuration,
      },
    });
    dispatch({
      type: 'fusionDesktop/updateTableLayout',
      payload: {
        tableType,
        styleType,
        tableStyleJson: tableStyleJson(resultSelectAppList, configuration),
      },
    });
  }

  // app 关闭 handle
  function deleteApp(val, i) {
    let list = allAppList;
    setLockItem(list, val.idx, 'del');
    const configuration = defalutConfiguration;
    configuration[i].id = `config${i + 1}`;
    configuration[i].idx = '';
    configuration[i].name = '请添加应用';
    configuration[i].path = '';
    // configuration[i].url = addLogoSrc;
    dispatch({
      type: 'fusionDesktop/updateStates',
      payload: {
        allAppList: list,
        defalutConfiguration: configuration,
      },
    });
    dispatch({
      type: 'fusionDesktop/updateTableLayout',
      payload: {
        tableType,
        styleType,
        tableStyleJson: tableStyleJson(selectAppList, configuration),
      },
    });
  }

  function tableStyleJson(v1, v2) {
    const json = {};
    json.selectAppList = v1;
    json.defalutConfiguration = v2;

    return JSON.stringify(json);
  }

  function tableDefalutStyleJson() {
    const json = {};
    json.selectAppList = [];
    json.defalutConfiguration = [
      {
        id: 'config1',
        name: '请添加应用',
        url: '',
        path: '',
      },
      {
        id: 'config2',
        name: '请添加应用',
        url: '',
        path: '',
      },
      {
        id: 'config3',
        name: '请添加应用',
        url: '',
        path: '',
      },
      {
        id: 'config4',
        name: '请添加应用',
        url: '',
        path: '',
      },
      {
        id: 'config5',
        name: '请添加应用',
        url: '',
        path: '',
      },
      {
        id: 'config6',
        name: '请添加应用',
        url: '',
        path: '',
      },
    ];
    [];
    return JSON.stringify(json);
  }

  const showModal = () => {
    dispatch({
      type: 'fusionDesktop/updateStates',
      payload: {
        isSetModalVisible: true,
      },
    });
  };

  function getDefaultState() {
    // 样式类型 1：后台设置的系统样式 2：个人设置的样式
    const ptType = '1';
    const type = '3';
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
      .then(function (res) {
        if (res.status == 200) {
          dispatch({
            type: 'desktopLayout/updateTableLayout',
            payload: {
              tableType,
              styleType,
              tableStyleJson: JSON.stringify(res.data) || '',
            },
            callback: () => {
              window.location.reload();
            },
          });
        }
      })
      .catch(function (error) {
        // here ~~   no matter
        dispatch({
          type: 'desktopLayout/updateTableLayout',
          payload: {
            tableType,
            styleType,
            tableStyleJson: tableDefalutStyleJson(),
          },
          callback: () => {
            // window.location.reload();
          },
        });
      });
  }

  function onHandleClick(text) {
    confirm({
      title: `确认要${text}吗？`,
      content: '',
      onOk() {
        switch (text) {
          case '恢复默认样式':
            getDefaultState();
            break;
          case '清空':
            dispatch({
              type: 'desktopLayout/updateTableLayout',
              payload: {
                tableType,
                styleType,
                tableStyleJson: tableDefalutStyleJson(),
              },
              callback: () => {
                window.location.reload();
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

  const Card = styled.div`
    width: 460px;
    height: 100%;
    padding: 5px 0 0;
    text-align: left;
    background: #fff;
    border: 2px solid rgb(255, 255, 255);
    box-shadow: 0 1px 5px rgb(0 0 0 / 40%);
    border-radius: 6px;
    cursor: pointer;
  `;
  return (
    <div className={styles.fusionDesktop} id="fusionDesktop_id">
      <div>
        {/* <Button
          type="primary"
          onClick={() => onHandleClick('恢复默认样式')}
          style={{ marginRight: 10 }}
        >
          恢复默认样式
        </Button> */}
        <Button type="primary" onClick={() => onHandleClick('清空')}>
          清空
        </Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.wrap}>
          <div
            id="showcase"
            className={classnames(styles.showcase, styles.noselect)}
          >
            {defalutConfiguration.map((item, index) => {
              return (
                <Droppable key={item.id} droppableId={item.id}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <Fragment>
                        <Card
                          id="card"
                          className={styles.card}
                          onClick={() => linkToPath(item)}
                        >
                          {item.name !== '请添加应用' && (
                            <>
                              <CloseOutlined
                                className={styles.close}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteApp(item, index);
                                }}
                              />
                              {/* <MinusOutlined
                                className={styles.moveDown}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveDownApp(item, index);
                                }}
                              /> */}
                            </>
                          )}
                          <h2>{item.name}</h2>
                          <img src={item.name === '请添加应用' ? addLogoSrc : bigIconKeyValArr?.[item.idx] || setLogoSrc } />
                          {/* <img src={item.url} /> */}
                        </Card>
                      </Fragment>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.icon_wrap}>
            <Droppable droppableId="options" direction="horizontal">
              {(provided, snapshot) => (
                <ul ref={provided.innerRef} {...provided.droppableProps}>
                  {selectAppList.filter(i=>allmenusIdArr.includes(i.menuId)).map((item, index) => {
                    return (
                      <Draggable
                        key={item.menuId}
                        draggableId={item.menuId}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <a title={item.menuName}>
                              {item.menuId ? (
                                // <IconFont type={`icon-${item.iconName}`} />
                                <IconFont type={`icon-${iconKeyValArr[item.menuId]}`} />
                              ) : (
                                <IconFont type="icon-default" />
                              )}
                              <p>{item.menuName}</p>
                            </a>
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                  <li style={{ lineHeight: '70px' }}>
                    <a>
                      <Logo onClick={showModal} />
                    </a>
                  </li>
                </ul>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
      <SetModal
        title="常用功能"
        containerId="root-master"
        isFusion={true}
        isSetModalVisible={isSetModalVisible}
        allAppList={allAppList}
        onOkModal={onOkClick}
        onHideModal={onHideClick}
        onClickSingleApp={onSingClick}
      />
    </div>
  );
}
export default connect(({ fusionDesktop }) => ({
  fusionDesktop,
}))(FusionDesktop);
