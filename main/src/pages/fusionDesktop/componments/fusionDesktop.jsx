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
import _ from "lodash";
import IconFont from '../../../../Icon_manage';
import $ from './c9carousel/cloud9carousel';
import setLogoSrc from '../images/setup.png';
import addLogoSrc from '../images/addItem.png';
import { Button, message } from 'antd';
import { ReactComponent as Logo } from '../images/add.svg';
import SetModal from "../../../componments/SetModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { CloseOutlined, MinusOutlined } from '@ant-design/icons';

 function FusionDesktop({ dispatch, fusionDesktop }) {

  const { allAppList, selectAppList, defalutConfiguration, isSetModalVisible } = fusionDesktop;
  console.log('defalutConfiguration',defalutConfiguration);

  const styleType = '1';
  const tableType = '3';
  const [count, setCount] = useState(0);
  const [prevJson, setPrevJson] = useState(null);

  useEffect(() => {
    const showcase = $("#showcase");
    // Cloud9Carousel
    showcase.Cloud9Carousel( {
      yOrigin: 140,
      yRadius: 140,
      itemClass: "card",
      mouseWheel: true,
      bringToFront: false,
      onLoaded: function() {
        showcase.css( 'visibility', 'visible' )
        showcase.css( 'display', 'none' )
        showcase.fadeIn( 1500 )
      }
    } )
  }, []);

  function tableStyleJson(v1, v2) {
    const json = {}
    json.selectAppList = v1;
    json.defalutConfiguration = v2;

    return JSON.stringify(json);
  }

  function onSingClick(i0, i1, i2) {
    if (!count) {
      setPrevJson(allAppList);
    }
    setCount(count+1);
    const tmp = _.cloneDeep(allAppList);
    if (tmp[i1].children[i2].lock) {
      message.warning('该应用已添加到视图，无法取消！');
      return;
    }
    tmp[i1].children[i2].selected = !tmp[i1].children[i2].selected;
    dispatch({
      type: 'fusionDesktop/updateStates',
      payload:{
        allAppList: tmp
      }
    })
  }

  function onHideClick() {
    if (count) {
      setCount(0);
      dispatch({
        type: 'fusionDesktop/updateStates',
        payload:{
          allAppList: prevJson,
        }
      })
    }
    dispatch({
      type: 'fusionDesktop/updateStates',
      payload:{
        isSetModalVisible: false
      }
    })
  }

  function onOkClick() {
    const tmp = allAppList, arr = [];
    tmp.forEach(item1 => {
      if (item1.selected && !item1.lock) {
        arr.push(item1)
      }
      item1.children.forEach(item2 => {
        if (item2.selected && !item2.lock) {
          arr.push(item2)
        }
      });
    });
    if (arr.length > 10) {
      message.warning('最多只能添加10个预选菜单')
      return
    }
    dispatch({
      type: 'fusionDesktop/updateStates',
      payload:{
        // allAppList: tmp,
        selectAppList: arr,
        isSetModalVisible: false
      }
    })
    dispatch({
      type: 'fusionDesktop/updateTableLayout',
      payload: {
        tableType,
        styleType,
        // tableStyleJson: null
        tableStyleJson: tableStyleJson(arr, defalutConfiguration)
      }
    })
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
          break;
        }
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
    let fif = options.filter(val => {
      return val.menuId === result.draggableId;
    })
    const configuration = defalutConfiguration;
    for (let i = 0; i < configuration.length; i++) {
      if (configuration[i].id === destination.droppableId) {
        if (configuration[i].name !== '请添加应用') {
          message.error('此模块已有应用，请重新拖拽应用位置！')
          return
        }
        configuration[i].idx = fif[0].menuId;
        configuration[i].name = fif[0].menuName;
        configuration[i].path = fif[0].path;
        configuration[i].url = setLogoSrc;
        setLockItem(list, options[source.index].menuId);
        options.splice(source.index, 1);
        dispatch({
          type: 'fusionDesktop/updateStates',
          payload: {
            allAppList: list,
            selectAppList: options,
            defalutConfiguration: configuration
          }
        })
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
        tableStyleJson: tableStyleJson(options, configuration)
      }
    })
  }

  function linkToPath(val) {
    // if (val.name === '请添加应用') {
    //   return;
    // }
    // if (val.path.includes('dynamicPage')) {
    //   const match = pathMatch()('/dynamicPage/:bizSolId');
    //   const path = match(val.path);
    //   const bizSolId = path.bizSolId;
    //   historyPush(`/dynamicPage?bizSolId=${bizSolId}`);
    // } else {
    //   historyPush(val.path);
    // }
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
    });

    const configuration = defalutConfiguration;
    configuration[i].id = `config${i+1}`;
    configuration[i].idx = '';
    configuration[i].name = '请添加应用';
    configuration[i].path = '';
    configuration[i].url = addLogoSrc;

    dispatch({
      type: 'fusionDesktop/updateStates',
      payload: {
        allAppList: list,
        selectAppList: resultSelectAppList,
        defalutConfiguration: configuration,
      }
    })
    dispatch({
      type: 'fusionDesktop/updateTableLayout',
      payload: {
        tableType,
        styleType,
        tableStyleJson: tableStyleJson(resultSelectAppList, configuration)
      }
    })
  }

  // app 关闭 handle
  function deleteApp(val, i) {
    let list = allAppList;
    setLockItem(list, val.idx, 'del');
    console.log('del',list);
    const configuration = defalutConfiguration;
    configuration[i].id = `config${i+1}`;
    configuration[i].idx = '';
    configuration[i].name = '请添加应用';
    configuration[i].path = '';
    configuration[i].url = addLogoSrc;
    dispatch({
      type: 'fusionDesktop/updateStates',
      payload: {
        allAppList: list,
        defalutConfiguration: configuration
      }
    })
    dispatch({
      type: 'fusionDesktop/updateTableLayout',
      payload: {
        tableType,
        styleType,
        tableStyleJson: tableStyleJson(selectAppList, configuration)
      }
    })
  }

  function tableStyleJson(v1, v2) {
    const json = {}
    json.selectAppList = v1;
    json.defalutConfiguration = v2;

    return JSON.stringify(json);
  }


  const showModal = () => {
    dispatch({
      type: 'fusionDesktop/updateStates',
      payload:{
        isSetModalVisible: true
      }
    })
  };

  const Card = styled.div `
    width: 460px;
    height: 100%;
    padding: 5px 0 0;
    text-align: left;
    background: #FFF;
    border: 2px solid rgb(255, 255, 255);
    box-shadow: 0 1px 5px rgb(0 0 0 / 40%);
    border-radius: 6px;
    cursor: pointer;
  `
   return (
    <div className={styles.fusionDesktop} id="fusionDesktop_id">
      <DragDropContext
        onDragEnd={onDragEnd}
      >
       <div className={styles.wrap}>
          <div id="showcase" className={classnames(styles.showcase, styles.noselect)}>
            {defalutConfiguration?.map((item, index)=> {
              return(
                <Droppable key={item.id} droppableId={item.id}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <Fragment>
                        <Card
                          id="card" 
                          className={styles.card}
                          onClick={()=>linkToPath(item)}
                        >
                          { item.name !== '请添加应用' &&
                           <>
                            <CloseOutlined 
                              className={styles.close}
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteApp(item, index);
                                }}
                            />
                            <MinusOutlined 
                              className={styles.moveDown}
                              onClick={(e) => {
                                e.stopPropagation();
                                moveDownApp(item, index);
                                }}
                            />
                           </>
                          }
                          <h2>{item.name}</h2>
                          <img src={item.url}/>
                        </Card>
                      </Fragment>
                    {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )
            })}
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.icon_wrap}>
              <Droppable droppableId="options" direction="horizontal">
                {(provided, snapshot) => (
                  <ul
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {selectAppList.map((item, index)=> {
                      return(
                        <Draggable key={item.menuId} draggableId={item.menuId} index={index}>
                          {(provided, snapshot) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <a title={item.menuName}>
                                {item.iconName ? <IconFont type={`icon-${item.iconName}`}/> : <IconFont type='icon-default'/> }
                                <p>{item.menuName}</p>
                              </a>
                            </li>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                    <li style={{lineHeight: '60px'}}>
                      <a>
                        <Logo width={25} height={25} onClick={showModal}/>
                      </a>
                    </li>
                  </ul>
                )}
              </Droppable>
          </div>
        </div>
      </DragDropContext>
      <SetModal 
        title="常用功能" containerId="desktop_wrapper" 
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
 export default connect(({
   fusionDesktop,
 }) => ({
   fusionDesktop,
 }))(FusionDesktop);