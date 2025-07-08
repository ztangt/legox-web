import { connect, history } from 'umi';
import styles from './index.less';
import { Form, Modal, Dropdown, Menu, message } from 'antd';
import { DownOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useState, useEffect, useCallback } from 'react';
import BaseIframeModal from '../public/baseIframeModal';
import BaseModal from '../public/baseModal';
import {Button} from '@/componments/TLAntd';
import {
  formatFromValue,
  getListModelData,
  analysisTitle,
  submitFormFn,
  dealvaluesFn,
} from './formUtil';
import {
  scriptEvent,
  getCleanScript,
  fetchAPI,
  fetchDOM,
} from '../../util/performScript';
import IconFont from '../../Icon_button';
import { Footer, Dialog, Popup, Button as MobileButton } from 'antd-mobile/es'
import { returnTaskObj,dataFormat } from '../../util/util';
import MobileBackAct from './mobileBackAct';
import {CONFIRM as CONFIRMFN,MESSAGE as MESSAGEFN,QS as QSFN,LOCATIONHASH as LOCATIONHASHFN,UUID as UUIDFN,fetchAsync as fetchAsyncFn} from '../../util/globalFn';//这个是用于按钮代码中的
import { parse } from 'query-string';
const { confirm } = Modal;
function ButtonList({
  location,
  dispatch,
  form,
  dropScopeTab,
  dynamicPage,
  setIsShowRelevance,
  subMap,
  onRule,
  setTmpErrorsInfo,
  setState,
  state,
  display,
  targetKey,
  fromInitialized,
  setHistoryTextShow,
  setShowDownloadZip,
  tmpUrlFrom
}) {
    /**这块代码只能放到这个地方，放上函数外打包找不到 */
    const CONFIRM = CONFIRMFN;//这个是用于按钮代码中的
    const MESSAGE = MESSAGEFN;
    const QS = QSFN;
    const LOCATIONHASH= LOCATIONHASHFN;
    const UUID = UUIDFN;
    const fetchAsync = fetchAsyncFn;
    const DATAFORMAT = dataFormat;
    /*end*/
  const {
    bizSolId,
    bizInfoId,
    id,
    bizTaskId,
    securityId,
    isShowRule,
    relBizInfoList,
    attachmentList,
    globalRule,
    nodeRule,
    ruleData,
    actData,
    backNodes,
    updateFlag,
    buttonListAuth,
    buttonList,
    bizInfo,
    cutomHeaders,
    authList,
    bussinessForm,
    attAuthList
  } = state;
  const dictsList = JSON.parse(window.sessionStorage.getItem('dictsList'));
  const [sctiptMap, setSctiptMap] = useState({});
  const [taskDetailVisible, setTaskDetailVisible] = useState(false);
  const [backAct, setBackAct] = useState({});
  // 通用iframe弹框的visdle
  const [isIframeModalOpen, setIsIframeModalOpen] = useState(false);
  // 通用弹框的props
  const [baseIframeModalProps, setBaseIframeModalProps] = useState({});
  // 通用弹框的visdle
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 通用弹框的props
  const [baseModalProps, setBaseModalProps] = useState({});
  const [traceText, setTraceText] = useState(location.query?.isTrace=='1'?'取消跟踪':'添加跟踪');
  const [currentFnList,setCurrentFnList] = useState([]);
  const [buttonId,setButtonId] = useState('');
  const [curButtonInfo,setCurButtonInfo] = useState({});
  const [returnStrategy,setReturnStrategy] = useState();
  const [actIds,setActIds] = useState([]);
  const [buttonDisable,setButtonDisable] = useState(false);

  //解析url,获取参数
  function getUrlParams(url) {
    let params = [];
    let query = url.split('?');
    if (query.length == 2) {
      let vars = query[1].split('&');
      for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        params[pair[0]] = pair[1];
      }
    }
    return params;
  }
  //是否显示（用户在业务应用建模的时候绑定的按钮才显示，在按钮库中新增的绑定按钮不显示）
  const isShowButton = (info) => {
    const buttons = buttonListAuth.filter(
      (item) => item.buttonId == info.buttonId,
    );
    if (buttons.length) {
      return true;
    } else {
      return false;
    }
  };
  // 下载 包含普通下载zip下载
  const onButtonZipDownload =()=>{
    setShowDownloadZip(true)
  }
  // 历史正文弹窗
  const onButtonClick = ()=>{
    setHistoryTextShow(true)
  }
  useEffect(() => {
    console.log('buttonList===',buttonList);
    if(buttonList&&Object.keys(buttonList).length){
      let map = {};
      Object.keys(buttonList).map((key)=>{
        buttonList[key].map((item)=>{
          map[item.buttonId] = [ item.thenEvent]
        })
      })
      setSctiptMap(map);
    }
  }, [buttonList]);

  const fetchCallAPI = async (method, url, body) => {
    const storage = window.localStorage;

    let options = {
      method: method,
      headers: {
        Authorization: 'Bearer ' + storage.userToken,
      },
    };

    if (method != 'GET') {
      options.body = body;
    }

    let fetchUrl = method === 'GET' ? `${url}/${body}` : url;

    await fetchAPI(fetchUrl, options)
      .then((res) => {
        let titleText = res.data;
        confirm({
          title: titleText,
          content: '',
          onOk() {},
          onCancel() {},
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const fetchCheckAPI = async (method, url, body) => {
    const storage = window.localStorage;

    let options = {
      method: method,
      headers: {
        Authorization: 'Bearer ' + storage.userToken,
        ContentType: 'application/json',
      },
    };

    if (method != 'GET') {
      options.body = body;
    }

    let fetchUrl = method === 'GET' ? `${url}/${body}` : url;

    await fetchAPI(fetchUrl, options)
      .then((res) => {
        let titleText = res.data;

        confirm({
          title: titleText,
          content: '',
          onOk() {},
          onCancel() {},
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  /**
   *
   * 通用弹框
   *
   */
  const baseModalComponments = (v) => {
    const {
      title = '提示',
      width,
      height,
      onOk,
      onCancel,
      renderChildList,
      renderFooterList,
      miniName = 'monitor',
    } = v;
    debugger;
    setIsModalOpen(true);
    setBaseModalProps({
      title,
      width,
      height,
      onOk,
      onCancel,
      renderChildList,
      renderFooterList,
      miniName,
    });
  };
  //跳转（用于按钮中）
  // const historyPush=(params)=>{
  //   historyPush(params);
  // }
  /**
   *
   * 通用Iframe弹框
   *
   */
  const baseIframeModalComponments = ({
    width,
    height,
    title = '提示',
    url,
    renderFooterList,
    rowInfoArr,
    paramsObj,
  }) => {
    console.log('rowInfoArr', rowInfoArr, url);
    setBaseIframeModalProps({
      width,
      height,
      title,
      url,
      renderFooterList,
      rowInfoArr,
      paramsObj
    });
    setIsIframeModalOpen(true);
  };

   /**
   *
   * 通用message弹框
   *
   */
    const baseMessage = (msg) => {
      return {
        success: () => {
          return message.success(msg);
        },
        error: () => {
          return message.error(msg);
        },
        warning: () => {
          return message.warning(msg);
        },
      };
    };
  //暂存不做必填项的校验，送交才做，需要放的按钮中配置
  const noCheckRequrieFn = () => {
    authList.map((item) => {
      let tabelCode = '';
      if (item.tableType == 'SUB') {
        let tabelCodes = Object.keys(subMap).filter(
          (i) => subMap[i] == item.deployFormId,
        );
        tabelCode = tabelCodes[0];
      }
      item.columnAuthList.map((columnItem) => {
        //路径
        let path = columnItem.formColumnCode; //主表
        if (tabelCode) {
          //子表
          path = `${tabelCode}.*.${columnItem.formColumnCode}`;
        }
        //formColumnCode,authType
        if (columnItem.formColumnCode == 'OPERATE') {
        } else {
          form.setFieldState(path, (state) => {
            state['required'] = false; //是否是必填
          });
        }
      });
    });
  };
  //针对此文拟稿新文
  const draftNewDoc = (type)=>{
    dispatch({
      type: 'formShow/postDaftNewDoc',
      payload:{
        type,
        bizInfoId: bizInfo.bizInfoId
      },
      callback(value){
        setState({
          bizInfoId: value.newBizInfoId
        })
      }
    })
  }

  //按钮数据保存前置操作
  const buttonEvent = (buttonId, callback) => {
    callback();
  };
  //提交表单的时候校验关联文档
  const checkAttachment = ()=>{
    let newAttShowRequire = [];
    attAuthList.map((item)=>{
      if(item.formColumnCode=='REL_FILE'){
        if(item.isRequierd==1&&relBizInfoList.length==0&&item.authType=='EDIT'){
          newAttShowRequire.push('att')
        }
      }else{
        if(item.isRequierd==1&&attachmentList.length==0&&item.authType=='EDIT'){
          newAttShowRequire.push('upload')
        }
      }
    })
    if(newAttShowRequire.length!=0){
      setState({
        attShowRequire:newAttShowRequire
      })
      return false;
    }else{
      return true;
    }
  }
  //表单提交
  const submitForm = async (buttonId, params, saveCallback, isCheckForm,isNoMessage) => {
    if(isCheckForm===false){
      let values = JSON.parse(JSON.stringify(form.values));
      if(window.location.href.includes('mobile')){
        buttonId = '0'
      }
      await submitFormFn(
        buttonId,
        values,
        params,
        saveCallback,
        form,
        dispatch,
        bizInfo.bizSolId,
        subMap,
        onRule,
        bizInfo,
        cutomHeaders,
        id,
        securityId,
        location,
        sctiptMap,
        dynamicPage,
        relBizInfoList,
        attachmentList,
        globalRule,
        nodeRule,
        ruleData,
        dictsList,
        updateFlag,
        setState,
        currentFnList,
        isNoMessage,
        bizTaskId
      );
    }else{
      if(typeof isCheckForm=='function'){
        (await isCheckForm) && isCheckForm();
        form&&form.submit(async(values) => {
          //提交表单的时候校验关联文档
          // if(!checkAttachment()){
          //   return;
          // }
          if(window.location.href.includes('mobile')){
            buttonId = '0'
          }
          await submitFormFn(
            buttonId,
            values,
            params,
            saveCallback,
            form,
            dispatch,
            bizInfo.bizSolId,
            subMap,
            onRule,
            bizInfo,
            cutomHeaders,
            id,
            securityId,
            location,
            sctiptMap,
            dynamicPage,
            relBizInfoList,
            attachmentList,
            globalRule,
            nodeRule,
            ruleData,
            dictsList,
            updateFlag,
            setState,
            currentFnList,
            isNoMessage,
            bizTaskId
          );
        })
      }else{
        //做校验
        let values = JSON.parse(JSON.stringify(form.values));
        await form.validate().then(async()=>{
          if(window.location.href.includes('mobile')){
            buttonId = 0
          }
          //提交表单的时候校验关联文档
          if(!checkAttachment()){
            return;
          }
          await submitFormFn(
            buttonId,
            values,
            params,
            saveCallback,
            form,
            dispatch,
            bizInfo.bizSolId,
            subMap,
            onRule,
            bizInfo,
            cutomHeaders,
            id,
            securityId,
            location,
            sctiptMap,
            dynamicPage,
            relBizInfoList,
            attachmentList,
            globalRule,
            nodeRule,
            ruleData,
            dictsList,
            updateFlag,
            setState,
            currentFnList,
            isNoMessage,
            bizTaskId
          );
        }).catch((errors)=>{
          errorsFn(errors);
        })
      }
    }
  };
  //错误信息的校验
  const errorsFn=(errors)=>{
    if (errors.length != 0) {
      let messages = ''
      errors.map((item) => {
        form.getFieldState(item.path, (state) => {
          if (state.parent?.componentProps.isModal) {
            messages = `${messages}<${state.parent.title}.${state.title}>`
          }else if(state.decoratorProps.className=='decorator_hidden'){
            if (state.parent?.title) {
              messages = `${messages}<${state.parent.title}.${state.title}>`
            }else{
              messages = `${messages}<${state.title}>`
            }
          } else {
            // messages = `${messages}<${state.title}>`
          }
        })
      })
      if(messages){
        Modal.confirm({
          wrapClassName: 'error_modal',
          content: `请输入${messages}`,
          bodyStyle: { padding: '8px', height: '100%', overflow: 'hidden' },
          getContainer: () => {
            return document.getElementById(`formShow_container_${targetKey}`)
          },
          mask: false,
          maskClosable: false,
          cancelText: '',
        })
      }
      setTimeout(()=>{//这个暂时只能加一个延迟，当前获取不到
        //由于校验失败ant会自动给失败表单项添加类名，直接获取即可
        const errorList = (document).querySelectorAll(
          '.ant-formily-item-error-help'
        )
        if (errorList.length) {
          errorList?.[0]?.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
          })
        }
      },1)
    }
  }
  //流程指引
  const viewFlow=()=>{
    let pathname = location.pathname;
    if(window.location.href.includes('/mobile')){
      historyPush({
        pathname: `/mobile/flowDetails`,
        query: {
          bizInfoId: bizInfo.bizInfoId,
          bizSolId: bizInfo.bizSolId,
          procDefId:bizInfo.procDefId
        },
      });
    }else{
      historyPush({
        pathname: `/flowDetails`,
        query: {
          bizInfoId: bizInfo.bizInfoId,
          bizSolId: bizInfo.bizSolId,
          procDefId:bizInfo.procDefId,
          deployFormId:cutomHeaders.deployFormId || bizInfo.formDeployId,
          mainTableId:cutomHeaders.mainTableId,
          deployFormName:bussinessForm?.formBizFormName
        },
      });
    }
  }
  //驳回
  function reject() {
    if (bizTaskId) {
      dispatch({
        type: 'formShow/backNodes',
        payload: {
          bizTaskId: bizTaskId,
          headers:cutomHeaders
        },
        callback:(data)=>{
          setState({
            backNodes: data,
            isShowSend: false,
          })
        }
      });
    } else {
      message.error('当前环节不能驳回');
    }
  }
  //办结
  const completeBiz = () => {
    dispatch({
      type: 'formShow/completeBiz',
      payload: {
        bizInfoId: bizInfoId,
        bizTaskId: bizTaskId,
        headers:cutomHeaders
      },
    });
  };
  //传阅弹框
  const circulate = () => {
    setState({
      isShowCirculate: true,
    })
  };
  function onMobileClick(bizInfoId, bizInfo,buttonType){
    if(window.location.href.includes('mobile')){
      localStorage.setItem('cutomHeaders',JSON.stringify(cutomHeaders))
      localStorage.setItem('bizInfo',JSON.stringify(bizInfo))
      localStorage.setItem('actData',JSON.stringify(actData?actData:{}))
      // localStorage.setItem('commentJson',JSON.stringify(form?.values?.['commentJson']?form?.values?.['commentJson']:[]))
      dispatch({
        type: 'approve/getAuthList',
        payload: {
          bizSolId: bizInfo.bizSolId,
          procDefId: bizInfo.procDefId,
          actId: bizInfo.actId,
          deployFormId: bizInfo.formDeployId,
          bizInfoId: bizInfo.bizInfoId,
          optType: 'HANDLER',
        },
        callback:(data)=>{
          if(data?.data?.authList?.length){
            if(bizTaskId){
              window.location.href = `#/business_application/mobile/approve?bizTaskId=${bizTaskId}&buttonType=${buttonType}&workType=${location.query?.workType}&category=${location.query?.category}`
            }else{
              window.location.href = `#/business_application/mobile/approve?bizInfoId=${bizInfoId}&actId=${bizInfo.actId}&buttonType=${buttonType}&workType=${location.query?.workType}&category=${location.query?.category}`
            }
          }
          if(buttonType=='save'&&!data?.data?.authList?.length){
            if(bizTaskId){
              window.location.href = `#/business_application/mobile/choiceUser?bizTaskId=${bizTaskId}&workType=${location.query?.workType}&category=${location.query?.category}`
            }else{
              window.location.href = `#/business_application/mobile/choiceUser?bizInfoId=${bizInfoId}&actId=${bizInfo.actId}&workType=${location.query?.workType}&category=${location.query?.category}`
            }
          }
          if(buttonType=='reject'&&!data?.data?.authList?.length){
            reject();
          }
        }
      });
      return
    }
  }
  //送交
  const saveSubmit = (bizInfoId, bizInfo) => {
    if (bizTaskId) {
      dispatch({
        type: 'formShow/getTaskDealNode',
        payload: {
          bizTaskId,
        },
        callback: (bizTaskNodes,checkNodeIds) => {
          setState({
            bizTaskNodes,
            checkNodeIds,
            isShowSend: true,
            backNodes: [], //不显示驳回
          })
        },
      });
    } else {
      dispatch({
        type: 'formShow/getProcessStartNode',
        payload: {
          bizInfoId,
          actId: bizInfo.actId,
        },
        callback: (bizTaskNodes,checkNodeIds) => {
          setState({
            bizTaskNodes,
            checkNodeIds,
            isShowSend: true
          })
        },
      });
    }
  };
  //无流程的保存
  const saveNoProcDef = () => {
    dispatch({
      type: 'formShow/changeBizStatus',
      payload: {
        bizInfoId: bizInfo.bizInfoId,
        bizStatus: 2,
        headers:cutomHeaders
      },
    });
  };
  //是否置灰
  const isDisabledFn = (info) => {
    if(info.isShow == 'NONE'||buttonDisable||!fromInitialized){
      return true
    }else{
      return false
    }
  };
  //返回列表
  const backList = () => {
    const params = parse(history.location.search);
    dropScopeTab('backList');
    // if (
    //   targetKey.includes('/formShow')&&params.title!='查看'
    // ) {
    //   // let mainTableId = document.getElementById(`header_${targetKey}`)?.getAttribute('mainTableId');
    //   if (
    //     cutomHeaders.mainTableId
    //   ) {
    //     dispatch({//崔晶说去掉
    //       //关闭表单页签清空发票redis缓存
    //       type: 'user/deleteICRedis',
    //       payload: {
    //         mainTableId:cutomHeaders.mainTableId
    //       },
    //       callback: () => {
    //         dropScopeTab('backList');
    //       },
    //     });
    //   } else {
    //     dropScopeTab('backList');
    //   }
    // } else {
    //   dropScopeTab('backList');
    // }
  };
  //撤销
  const revokeBiz = () => {
    confirm({
      title: '',
      content: '确认撤销吗？',
      onOk() {
        dispatch({
          type: 'formShow/revokeBiz',
          payload: {
            bizInfoId: bizInfoId,
            headers:cutomHeaders
          },
        });
      },
      onCancel() {},
    });
  };

  const revokeMobileBiz = () =>{
    var payload = {
      bizInfoId: bizInfoId,
      headers:{
        bizSolId: bizInfoId.bizSolId,
        mainTableId: cutomHeaders.mainTableId,
        deployFormId: cutomHeaders.deployFormId || bizInfo.formDeployId,
        bizInfoId: bizInfoId,
      }
    }
    dispatch({
      type:'recover/recallTask',
      payload,
      callback:(data)=>{
        if(data.length==0){
          message.error('暂无可撤回的任务')
          return
        }
        if(data.length&&data.length==1){
          Dialog.confirm({
            content: '确认撤回吗?',
            onConfirm:  () => {
              var obj = returnTaskObj([data[0].key],data)
              dispatch({
                type: 'recover/recoverTask',
                payload: {
                  ...payload,
                  recoverTask:JSON.stringify(obj)
                }
              });

            },
          })
        }else if(data.length&&data.length>1){
          window.location.href = `#/business_application/mobile/recover?bizSolId=${bizInfoId.bizSolId}&mainTableId=${cutomHeaders.mainTableId}&deployFormId=${cutomHeaders.deployFormId || bizInfo.formDeployId}&bizInfoId=${bizInfoId}&workType=${location.query?.workType}&category=${location.query?.category}`
        }
      }
    })
  }

  // 打印按钮
  const printTemplate = (obj={}) => {
    //obj参数说明：showBatchPrintBtn=true显示批量打印按钮，默认不显示
    dispatch({
      type: 'formShow/getTemplateURL',
      payload: {
        deployFormId: cutomHeaders.deployFormId || bizInfo.formDeployId,
        bizInfoId: bizInfoId,
        mainTableId: cutomHeaders.mainTableId,
        headers:cutomHeaders
      },
      callback: (url) => {
            historyPush({
                pathname: '/previewPrint',
                query: {
                    ...obj,
                    oldFileId: form.values.FILE_ID,
                    mainTableId: cutomHeaders.mainTableId,
                    bizInfoId: bizInfoId,
                    bizSolId: bizSolId,
                    url,
                },
                title: `打印${cutomHeaders.mainTableId}`,
            });
        },
    });
  };
  const getBrowserHeight=(percent)=>{
    return window.innerHeight*(percent/100)
  }
  /**
   *
   * 通用提示框
   *
   */
  const baseConfirm = (v) => {
    const {
      title = '提示',
      content = '',
      okText = '确认',
      cancelText = '取消',
      onOk,
      onCancel,
      width,
      height,
    } = v;
    Modal.confirm({
      mask: false,
      getContainer: () => {
        return document.getElementById(`formShow_container_${targetKey}`);
      },
      title,
      content,
      okText,
      cancelText,
      onOk,
      onCancel,
      width:width,
      style: {  height: height }
    });
  };
  /*计税
   * params {statusBit:1,tabelCode:'aaaa'}
   */
  const getLaborAmountList = (buttonId, params, saveCallback) => {
    message.info(
      '本报销单实发金额会因在途劳务费单据在财务审核环节发生变化，请知悉',
    );
    let values = form.values;
    console.log('values===', values);
    // let dealvalues = dealvaluesFn(id,securityId,cutomHeaders,'',values,form,subMap)
    // values = dealvalues['values'];
    // let subData = dealvalues['subData'];
    // let deployFormId = subMap?.[params.tabelCode];
    //let list = subData.filter(info=>info.deployFormId==deployFormId);
    let list = values[params.tabelCode];
    list.map((item) => {
      Object.keys(item).map((key) => {
        let value = item[key];
        if (
          value &&
          typeof value == 'string' &&
          value.split('date_').length == 2
        ) {
          item[key] = value.split('date_')[1];
        } else if (key.includes('TLDT_')) {
          //基础数据码表
          item[key] = typeof value == 'object' ? value.join(',') : value;
        }
      });
    });
    let tmpMap = {
      ...params,
      bizSolId,
      list: list,
    };
    //赋值到表格
    // values[params.tabelCode] = [{SRK: '22222', MBKJ_TLDT_: 'empty'}];
    // form.setValues(values);
    //请求结果需要回显到表格中
    dispatch({
      type: 'formShow/getLaborAmountList',
      payload: {
        map: JSON.stringify(tmpMap),
      },
      callback: async (data) => {
        //赋值到表格
        values[params.tabelCode] = data;
        await form.setValues(values);
        typeof saveCallback == 'function' && (await saveCallback());
      },
    });
  };
  useEffect(()=>{
    if(currentFnList.length){
      try {
        let isNull = currentFnList.filter((i) => i);
        if (!isNull || isNull.length === 0) {
        } else {
          currentFnList.forEach((item) => {
            if (item.includes('onRule(true)')||item.includes('setFormAuth')) {
              let newItem = '';
              let pattern = /onRule\(true\)/g;
              let replaceStr = '//onRule(true)';
              if (pattern.test(item)) {
                newItem = item.replace(new RegExp(pattern, 'g'), replaceStr);
              }
              let pattern2 = /setFormAuth/g;
              let replaceStr2 = '//setFormAuth';
              let newString = newItem ? newItem : item;
              if (pattern2.test(newString)) {
                newItem = newString.replace(
                  new RegExp(pattern2, 'g'),
                  replaceStr2,
                );
              }
              let fn = eval(newItem);
              fn();
            } else {
              let fn = eval(item);
              fn();
            }
          });
        }
      } catch (e) {
        console.log('按钮报错', e);
      }
    }
  },[currentFnList])
  const buttonClick = async (buttonId,buttonInfo,fn) => {
    localStorage.setItem('currentButtonId', buttonId);
    // setButtonDisable(true);
    // setTimeout(()=>{
    //   setButtonDisable(false);
    // },1000)
    //清空标红
    // setTmpErrorsInfo([])
    // setState({
    //   redCol:[]
    // })
    // scriptEvent 为按钮前置、中置、后置事件列表
    let fnList = [];
    if(window.location.href.includes('mobile')){
      fnList = fn
    }else{
      fnList = await scriptEvent(sctiptMap[buttonId])
    }
    setButtonId(buttonId);
    setCurButtonInfo(buttonInfo);
    setCurrentFnList(fnList);//这个是为了保存的时候不用调用多次
  };
  const buttonMenu = (items) => {
    //console.log('items====',items);
    let tmpItems = [];
    items.map((item, index) => {
      tmpItems.push({
        key: index,
        label: (
          <span onClick={buttonClick.bind(this, item.buttonId,item)}>
            {item.buttonName}
          </span>
        ),
        // icon: item.buttonIcon && (
        //   <IconFont className="iconfont" type={`icon-${item.buttonIcon}`} />
        // ),
        disabled: isDisabledFn(item),
      });
    });
    return tmpItems;
  };
  const isShowRuleFn = () => {
    setState({
      isShowRule: !isShowRule,
    })
  };
  //如果是左树有列表的情况且需要校验
  const getCheckEncoding = (buttonId, saveCallback, filterobject) => {
    let values = form.values;
    let usedYear = location.query?.usedYear || values?.['USED_YEAR'] || new Date().getFullYear();
    dispatch({
      type: `formShow/getCheckEncoding`,
      payload: {
        bizSolId,
        usedYear,
        objCode: values['OBJ_CODE'],
        grade: values['GRADE'],
        parentCode: values['PARENT_CODE'],
        Id: location.query?.bizInfoId ? values['ID'] : '',
        filterobject: filterobject?filterobject:'',
      },
      callback: async (data) => {
        await form.setValues({
          PRESENT: data.PRESENT,
          FRONT: data.FRONT,
        });
        values['PRESENT'] = data.PRESENT;
        values['FRONT'] = data.FRONT;
        typeof saveCallback == 'function' && (await saveCallback());
      },
    });
  };

  //如果是左树有列表的情况且需要校验
  const geCheckEncodingByFilterObject = (buttonId, saveCallback, filterobject) => {
    let values = form.values;
    let usedYear = location.query?.usedYear || values?.['USED_YEAR'] || new Date().getFullYear();
    dispatch({
      type: `formShow/geCheckEncodingByFilterObject`,
      payload: {
        bizSolId,
        usedYear,
        objCode: values['OBJ_CODE'],
        grade: values['GRADE'],
        parentCode: values['PARENT_CODE'],
        Id: location.query?.bizInfoId ? values['ID'] : '',
        filterobject: filterobject?filterobject:'',
      },
      callback: async (data) => {
        await form.setValues({
          PRESENT: data.PRESENT,
          FRONT: data.FRONT,
        });
        values['PRESENT'] = data.PRESENT;
        values['FRONT'] = data.FRONT;
        typeof saveCallback == 'function' && (await saveCallback());
      },
    });
  };

  const chipsLinkData = [
    {
      code: 'save',
      buttonName: '审批',
      text: <MobileButton
      color='primary'
      fill='outline'
      className={styles.footer_item}
      >
      {/* <AaOutline  className={styles.footer_item_icon}/>
      <br /> */}
    审批
    </MobileButton>,
      type: 'link',
      fnList: [
        `(()=> {'use strict';
          // 送交(送交特殊逻辑：前置为onRule(); 并且入参为true,如果不是不用加)
          onRule(true);
        })`,
        `(()=> {'use strict';
          // 送交(送交特殊逻辑：前置为onRule(); 并且入参为true,如果不是不用加)
          submitForm(buttonId,{codeFlag:'YES'},()=>{
            onMobileClick(bizInfo.bizInfoId, bizInfo,'save')
            // saveSubmit(bizInfo.bizInfoId, bizInfo);
          })
        })`
    ]
    },
    {
      code: 'reject',
      buttonName: '驳回',
      text: <MobileButton
      fill='outline'
      color='primary'
      className={styles.footer_item}
    >
      {/* <AaOutline  className={styles.footer_item_icon}/>
      <br /> */}
      驳回
    </MobileButton>,
      type: 'link',
      fnList: [
        `((rowInfoArr)=> {'use strict';
          // 驳回
          submitForm(buttonId,{codeFlag:'NO'},(data)=>{
            onMobileClick(bizInfo.bizInfoId, bizInfo,'reject')
            // reject();
          },false)
        })`
     ]
    },
    {
      code: 'trace',
      buttonName: traceText,
      text:  <MobileButton
      fill='outline'
      color='primary'
      className={styles.footer_item}
    >
      {/* <AaOutline  className={styles.footer_item_icon}/>
      <br /> */}
      {traceText}
    </MobileButton>,
      type: 'link',
    }
  ]

  const sendChipsLinkData = [
    {
      code: 'trace',
      buttonName: traceText,
      text: <MobileButton
      color='primary'
      fill='outline'
      className={styles.footer_item}
    >
      {/* <AaOutline  className={styles.footer_item_icon}/>
      <br /> */}
      {traceText}
    </MobileButton>,
      type: 'link',
    },
    {
      code: 'revoke',
      buttonName: '撤回',
      text: <MobileButton
      color='primary'
      fill='outline'
      className={styles.footer_item}
    >
      {/* <AaOutline  className={styles.footer_item_icon}/>
      <br /> */}
      撤回
    </MobileButton>,
      type: 'link',
    }

  ]
  const dynamicChipsLinkData = [
    {
      code: 'temporary_save',
      buttonName: '暂存',
      text: <MobileButton
      color='primary'
      fill='outline'
      className={styles.footer_item}
      >
      {/* <AaOutline  className={styles.footer_item_icon}/>
      <br /> */}
    暂存
    </MobileButton>,
      type: 'link',
      fnList: [
        `(()=> {'use strict';
          // 送交(送交特殊逻辑：前置为onRule(); 并且入参为true,如果不是不用加)
          onRule(true);
        })`,
        `(()=> {'use strict';
        submitForm(buttonId,{codeFlag:'YES'},(data,values,payload)=>{
          // fetchAsync(
          //  “ic/invoice/refstatus/”,
          //  {
          //   method: "PUT",
          //   body: QS.stringify(
          //     {
          //       bizSolId:bizSolId,
          //      mainTableId:cutomHeaders?.mainTableId
          //     }
          //   )
          //  }
          //   ).then((returnData) => {
          //   });

            // TODO: 跳至列表页面
            window.history.back();
        },()=>{noCheckRequrieFn()})
        })`
    ]
    },
    {
      code: 'save',
      buttonName: '审批',
      text: <MobileButton
      color='primary'
      fill='outline'
      className={styles.footer_item}
      >
      {/* <AaOutline  className={styles.footer_item_icon}/>
      <br /> */}
    审批
    </MobileButton>,
      type: 'link',
      fnList: [
        `(()=> {'use strict';
          // 送交(送交特殊逻辑：前置为onRule(); 并且入参为true,如果不是不用加)
          onRule(true);
        })`,
        `(()=> {'use strict';
          // 送交(送交特殊逻辑：前置为onRule(); 并且入参为true,如果不是不用加)
          submitForm(buttonId,{codeFlag:'YES'},()=>{
            onMobileClick(bizInfo.bizInfoId, bizInfo,'save')
            // saveSubmit(bizInfo.bizInfoId, bizInfo);
          })
        })`
    ]
    },

  ]

  const onChipClick = (item, index) => {
    switch (item?.code) {
      case 'save':
        buttonClick('',item,item.fnList)
      break;
      case 'reject':
        buttonClick('',item,item.fnList)
      break;
      case 'temporary_save':
        debugger
        buttonClick('',item,item.fnList)
      break;
      case 'trace':
        dispatch({
          type:'formShow/traceWork',
          payload:{
            bizInfoIds: bizInfo.bizInfoId,
            traceType: traceText=='取消跟踪'?'0':'1'
          },
          callback:()=>{
            // window.location.href = `#/business_application/mobile/${location.query?.workType}List`
            setTraceText(traceText=='取消跟踪'?'添加跟踪':'取消跟踪')
          }
        })
      break;
      case 'revoke':
        revokeMobileBiz();
      break;

      default:
        break;
    }
    if(item?.text==''){

    }
  }
  // const onCloseBackAct = () =>{
  //   setState({
  //     backNodes:[]
  //   })
  // }

  // const onActClick = (item) => {
  //   //returnStrategy1：驳回上一步 2：驳回拟稿 3：自由驳回
  //   if(item.returnStrategy==3){//自由驳回只可选取一个节点
  //     setActIds([item.actId])
  //     setReturnStrategy(item.returnStrategy);
  //     return
  //   }
  //   var flag = actIds?.findIndex((actId)=>{return item.actId==actId})
  //   //1：驳回上一步 2：驳回拟稿 需全选其中某个策略下的全部节点
  //   if(flag!=-1){//当前节点已被选中 取消节点
  //     setReturnStrategy();
  //     setActIds([]);
  //   }else{
  //     setReturnStrategy(item.returnStrategy);
  //     //根据当前节点策略，选中所属该策略的所有节点
  //     var values = []
  //     backNodes.map((node)=>{ if( node.returnStrategy==item.returnStrategy){ values.push(node.actId)}})
  //     console.log('values',values);
  //     setActIds(values);
  //   }
  // };

  // const onConfirmReject = ()=>{
  //   if(!actIds?.length){
  //     message.warning('请选择驳回环节');
  //     return
  // }
  //   let targetActJson={};
  //   let returnStrategy = '';
  //   let flowTaskActList = [];
  //   actIds?.map((item)=>{
  //     let info = _.find(backNodes,{actId:item});
  //     returnStrategy = info.returnStrategy;
  //     flowTaskActList.push(info);
  //   })
  //   targetActJson={
  //     returnStrategy,
  //     flowTaskActList
  //   }
  //   dispatch({
  //     type:'formShow/processBack',
  //     payload:{
  //         bizTaskId:bizTaskId,
  //         flowAct:targetActJson,
  //         commentList:form?.values?.['commentJson'],
  //         variableJson:actData,
  //         // targetActJson:JSON.stringify(targetActJson),
  //         // commentJsonArray:JSON.stringify(form?.values?.['commentJson']),
  //         // variableJson: JSON.stringify(actData),
  //     },
  //     callback:function(){
  //       onCloseBackAct()
  //       window.location.href = `#/business_application/mobile/${location.query?.workType}List`
  //     }
  //   })
  // }

  // const returnAct = () => {//TODO
  //   return (
  //     <ul className={styles.list}>
  //       {
  //         backNodes?.map((item, index) => {
  //           return (
  //             <li key={item.actId} onClick={onActClick.bind(this, item)}>
  //               <a>
  //                 {`${item.actName}(${item.handlerName})`}
  //               </a>
  //               {actIds.toString().includes(item?.actId)? (
  //                   <CheckOutline className={styles.icon_check} />
  //                 ) : (
  //                   <span className={styles.icon_check}></span>
  //                 )}
  //             </li>
  //           );
  //         })
  //       }
  //       <MobileButton onClick={onConfirmReject} className={styles.back_button}>驳回</MobileButton>
  //     </ul>
  //   );
  // };
  // // console.log('buttonList==', buttonList);
  if(window.location.href.includes('mobile')){//TODO
    const props ={
      workType: location.query?.workType,
      setState,
      bizTaskId,
      actData,
      backNodes,
      commentList:form?.values?.['commentJson'],
      dispatch,
      category: location.query?.category
    }
    return <>
      <MobileBackAct {...props}/>
      <Footer chips={!location.query?.workType?dynamicChipsLinkData:location.query?.workType=='TODO'?chipsLinkData:location.query?.workType=='SEND'||location.query?.workType=='DONE'?sendChipsLinkData:[sendChipsLinkData[0]]} onChipClick={onChipClick} className={styles.mobile_footer}></Footer>
    </>
  }

  return (
    <div className={styles.heard} style={{display:display}}>
      <div className={styles.rule_button}>
        <QuestionCircleOutlined onClick={isShowRuleFn} style={{marginTop:'8px'}}/>
      </div>
      <div className={styles.button_list}>
        {buttonList &&
          Object.keys(buttonList).map((key) => {
            if (!key || key == 'null') {
              return buttonList[key].map((item) => {
                return (
                  <Button
                    type="primary"
                    onClick={buttonClick.bind(this, item.buttonId,item)}
                    key={item.buttonId}
                    disabled={isDisabledFn(item)}
                    icon={
                      item.buttonIcon && (
                        <IconFont
                          className="iconfont"
                          type={`icon-${item.buttonIcon}`}
                          style={{ color: 'red' }}
                        />
                      )
                    }
                  >
                    {item.buttonName}
                  </Button>
                );
              });
            } else {
              return (
                <Dropdown
                  menu={{ items: buttonMenu(buttonList[key]) }}
                  placement="bottomCenter"
                  trigger={['click']}
                >
                  <Button>
                    {key}
                    <DownOutlined />
                  </Button>
                </Dropdown>
              );
            }
          })}
        <Button type="primary" onClick={backList.bind(this)}>
          返回
        </Button>
      </div>
      {isIframeModalOpen && (
        <BaseIframeModal
          isIframeModalOpen={isIframeModalOpen}
          setIsIframeModalOpen={setIsIframeModalOpen}
          {...baseIframeModalProps}
          formModelingName={`formShow_container_${targetKey}`}
        />
      )}
      {isModalOpen && (
        <BaseModal
          location={location}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          {...baseModalProps}
          formModelingName={`formShow_container_${targetKey}`}
          parentForm={form}
          parentData = {{...state}}
        />
      )}
    </div>
  );
}
export default connect(({ formShow, loading, dynamicPage, designableBiz }) => {
  return { formShow, loading, dynamicPage, designableBiz };
})(ButtonList);
