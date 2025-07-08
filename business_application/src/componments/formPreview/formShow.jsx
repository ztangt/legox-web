import { Form, Button, message, Spin, Badge } from 'antd';
import { connect, history, getDvaApp, MicroAppWithMemoHistory } from 'umi';
import styles from './index.less';
import ButtonList from './buttonList';
import { useEffect, useMemo, useState, useCallback, memo } from 'react';
import { OneToOneOutlined } from '@ant-design/icons'
import BIZTASKFORM from './bizTaskForm';
import BACKNODES from './backNodesForm';
import ChangeUser from './changeUser';
import CirculateModal from './circulateModal';
import { TEMPLETE } from '../../service/constant';
import AttachmentFile from './attachmentFile';
import ReSizeLeftRight from '../public/reSizeLeftRight';
import RuleConfig from './ruleConfig';
import { checkRule, getFileContent, redColFn } from './formUtil';
import Tabs from "../TLTabs/index";
import FormShowPreview from './preview';
import FormModeling from '../../pages/dynamicPage/componments/formModeling';
import WpsFile from '../../componments/WpsFile'
import WpsPdf from '../../componments/WpsPdf'
import MainTextHistory from '../mainTextHistory';
import DownLoadZipModal from '../DownloadZipModal'
import ScreenWps from './splitScreen'

function Index({
  user,
  dispatch,
  dropScopeTab,
  formShow,
  loading,
  state,
  setState,
  location,
  getSerialNum,
  isUpdataAuth,
  setBizModal,
  setBizModalProps,
  setTreeTableProps,
  extraQuery,
  allExtraQuery,
  onTabChange,
  tabItems,
  targetKey,
  leftTreeData,
  buttonFormAuthInfo,
  onDetail,
  tmpUrlFrom
}) {
  const [form, setForm] = useState();
  const {
    bizSolId,
    bizInfoId,
    currentTab,
    bizTaskId,
    buttonList,
    buttonListAuth,
    authList,
    bizInfo,
    bussinessForm,
    formJson,
    updateCutomHeaders,
    isShowSend,
    isShowCirculate,
    backNodes,
    relType,
    isShowRule,
    nodeRule,
    redCol,
    serialCodeList,
    globalRule,
    securityId,
    ruleData,
    tableColumCodes,
    commentJson,
    signConfig,
    relBizInfoList,
    formRelBizInfoList,
    formAttachmentList,
    attachmentList,
    cutomHeaders,
    isErrors,
    id,
    updateFlag,
    intFormValues
  } = state
  const { template, bizSolName, formBizFormName, subMap, formStyle } = bussinessForm;
  const [isShowRelevance, setIsShowRelevance] = useState(false);
  const [showDownloadZip, setShowDownloadZip] = useState(false)
  const [tmpErrorsInfo, setTmpErrorsInfo] = useState([]);
  const [allTmpErrorsInfo, setAllTmpErrorsInfo] = useState([])
  const [formValues, setFormValues] = useState({});
  const [historyTextShow, setHistoryTextShow] = useState(false)
  const [isSplit, setIsSplit] = useState(false) // 是否分屏
  console.log("statesssddd", state, "template", template)

  //用于数据渲染完成按钮才能提交
  const [fromInitialized, setFromInitialized] = useState(false);
  
  useEffect(()=>{    
    if(form?.initialized){
      setFromInitialized(true)
      if(loading.effects['formShow/processSend']){//送交 loading
        setFromInitialized(false)
      }
      if(loading.effects['formShow/processStart']){//流程开始 loading
        setFromInitialized(false)
      }
    }else{
      setFromInitialized(false)

    }
  },[form?.initialized,loading.effects['formShow/processSend'],loading.effects['formShow/processStart']])

  // useEffect(()=>{//eval执行的时候只能获取初始值
  //   debugger;
  //   if(tmpErrorsInfo.length){
  //     debugger;
  //     setAllTmpErrorsInfo(allTmpErrorsInfo.concat(tmpErrorsInfo));
  //   }
  // },[tmpErrorsInfo])
  // const [isActionGetSerialNum,setIsActionGetSerialNum] = useState(false);
  // useEffect(()=>{
  //   if(isErrors.length){
  //     //debugger;
  //     // setTimeout(() => {//先这样写，错误信息不能立马取到
  //     //   let redCol = redColFn(allTmpErrorsInfo,formValues);
  //     //   setState({
  //     //     redCol
  //     //   })
  //     //   setAllTmpErrorsInfo([]);
  //     // }, 50);
  //   }else{
  //     // debugger;
  //     // setState({
  //     //   allTmpErrorsInfo:[]
  //     // })
  //   }
  // },[isErrors])
  //这个是为了有子表的时候，会有多条相同的提示，先把该条提示存储起来在去重复弹出提示就可以了
  const messageFn = (text) => {
    //提示文案，应为放在字符串中不能解析message为定义
    message.error(text);
  };
  /*
  *
  *格式errorsInfo[{
    'tableCode':'**',
    'condition':**,
    'key':'**',//多个可以都好分割
  }]
  *返回错误信息redCol,用于标红错误控件
  *redcode[{
    code:'**',
    index:'index',
  }]
  */
  const errorsInfoFn = (values, errorsInfo) => {//废弃了，但是原先的规则定义中有这个方法还得留着
    setTmpErrorsInfo(_.cloneDeep(errorsInfo));
  }
  const checkStart = async (globalRule, nodeRule, values, subData) => {
    let invertSubMap = _.invert(subMap);
    //应为包括子表数据，则需要将主表的字段和子表的合并执行
    let newValues = { ...values };
    //将子表的id转换成code
    if (subData && subData.length) {
      //包含子表的时候
      subData.map((item) => {
        newValues[`${invertSubMap[item.deployFormId]}`] = item.data;
      });
    }
    setFormValues(newValues);
    console.log('newValues==', newValues);
    //开始校验
    let arrIsErrors = await checkRule(newValues, globalRule, nodeRule, messageFn, errorsInfoFn, bizInfo, cutomHeaders);
    setAllTmpErrorsInfo(arrIsErrors.errorsInfo);
    setState({
      isErrors: arrIsErrors.isErrors,
      isShowRule: _.find(arrIsErrors.isErrors, { isError: true }) ? true : false, //判断错误的时候自动展示右侧
    })
    let errors = arrIsErrors.isErrors.filter((info) => info.isControl == 1 && info.isError);
    //let errorIndex = _.findIndex(isErrors, { 'isControl': 1, 'isError': true });
    if (errors.length) {
      return true;
    }
    return false;
  };
  const getLoopRuleSetData = async (ruleData, buttonId) => {
    let nodeRule = [];
    for (let i = 0; i < ruleData.length; i++) {
      let ruleItem = ruleData[i];
      //bussinessForm有bizInfo这个肯定会有，应为先请求的bizInfo在请求的bussinessForm接口
      let check = ruleItem.check;
      if (ruleItem.subjectId == buttonId) {
        let newCheck = [];
        if (check) {
          let checks = JSON.parse(check);
          for (let j = 0; j < checks.length; j++) {
            let item = checks[j];
            //获取内容
            if (item.ruleJsFullUrl) {
              await dispatch({
                type: 'formShow/getRuleSetData',
                payload: {
                  url: item.ruleJsFullUrl,
                },
                callback: (newData) => { },
              }).then((newData) => {
                item.ruleJsonContent = newData;
              });
            }
            newCheck.push(item);
          }
        }
        nodeRule = { ...ruleItem, check: newCheck };
      }
    }
    // console.log('nodeRule===', nodeRule);
    return nodeRule;
  };
  const onRule = async (values, subData, buttonId) => {
    // console.log('globalRule==', globalRule);
    // console.log('nodeRule===', nodeRule);
    //先解析出按钮的规则
    if (ruleData.length && bizInfo.procDefId == '0') {
      return await getLoopRuleSetData(ruleData, buttonId).then((nodeRule) => {
        setState({
          nodeRule
        })
        return checkStart(globalRule, nodeRule, values, subData).then(data => {
          return data;
        });
      });
    } else if (Object.keys(globalRule).length || Object.keys(nodeRule).length) {
      return checkStart(globalRule, nodeRule, values, subData).then(data => {
        return data;
      });
    } else {
      return false;
    }
  };

  const handelCancel = () => {
    //清空treeData,避免跟传阅树有影响
    setState({
      treeData: [],
      selectedDataIds: [],
    })
    setIsShowRelevance(false);
  };

  function onChangeTab(key) {
    onTabChange(key);
    setState({
      relType: key,
      onlyRead: state?.bizInfo?.operation == 'view' ? true : false
    })
  }
  function returnTab(item) {
    switch (item) {
      case 'ANNEX': //关联文档
        return <AttachmentFile setState={setState} state={state} targetKey={targetKey} />;
        break;
      case 'WORD': //word
        return <WpsFile setState={setState} state={state} location={location} isShowButton={location.query.currentTab} targetKey={targetKey} fileType="word" />
        break;
      case 'PDF': //pdf
        return <WpsPdf setState={setState} state={state} location={location} isShowButton={location.query.currentTab} targetKey={targetKey} fileType="pdf" />
        break;

      default:
        break;
    }
  }
  function toDetail(bizSolId, bizInfoId, id) {
    setUrlFromFn();
    // console.log('bizSolId5435', bizSolId);
    historyPush({
      pathname: '/onlyFormShow',
      query: {
        bizSolId,
        bizInfoId,
        title: '查看',
        id
      },
    });
  }
  //设置打开页面的urlForm
  const setUrlFromFn = () => {
    //点击“返回”，需要返回到打开这个表单的页面（注：如果打开表单的页面已经被关闭了，就返回首页）
    const search =
      history.location.search.includes('?') || !history.location.search
        ? history.location.search
        : `?${history.location.search}`;
    dispatch({
      type: "formShow/updateStatesGlobal",
      payload: {
        urlFrom: history.location.pathname + search
      }
    })
  }
  console.log('allTmpErrorsInfo===', bizInfo);
  const MicroApp = useMemo(() => {
    if (bizInfo && Object.keys(bizInfo).length) {
      return (
        <MicroAppWithMemoHistory
          style={{ height: '100%' }}
          name="designable"
          url="/preview"
          location={location}
          toDetail={toDetail}
          deployFormId={bizInfo.formDeployId}
          bizInfoId={bizInfo.bizInfoId}
          setForm={setForm}
          authList={authList}
          bizInfo={bizInfo}
          serialCodeList={serialCodeList}
          redCol={allTmpErrorsInfo}
          signConfig={signConfig}
          tableColumCodes={tableColumCodes}
          commentJson={commentJson}
          leftTreeData={leftTreeData}
          buttonFormAuthInfo={buttonFormAuthInfo}
          bussinessForm={bussinessForm}
          formJson={formJson}
          cutomHeaders={cutomHeaders}
          isUpdataAuth={isUpdataAuth}
          id={id}
          bizSolId={bizSolId}
          updateFlag={updateFlag}
          setBizModal={setBizModal}
          setBizModalProps={setBizModalProps}
          setTreeTableProps={setTreeTableProps}
          targetKey={targetKey}
          intFormValues={intFormValues}
          formRelBizInfoList={formRelBizInfoList}
          formAttachmentList={formAttachmentList}
          menuObj={user.menuObj}
          onDetail={onDetail}
          setFromInitialized={setFromInitialized}
          historyPush={historyPush}
          tmpUrlFrom={tmpUrlFrom}
        />
      );
    } else {
      return null
      return (
        <div style={{ textAlign: 'center', lineHeight: '10' }}>
          <Spin loading={true} />
        </div>
      )
    }
  }, [bizInfo, isErrors]);

  // 关闭正文弹窗
  const cancelMainTextHistory = () => {
    setHistoryTextShow(false)
  }
  // 关闭zip下载弹窗
  const cancelDownloadZip = () => {
    setShowDownloadZip(false)
  }
  // 点击分屏
  const onClickSplitScreen = () => {
    setIsSplit(true)
    setState({
      relType: 'FORM'
    })
  }
  // 退出分屏
  const textFillScreen = (relType) => {
    setIsSplit(false)
    setState({
      relType
    })
  }
  const leftChildren = () => {
    let title = formBizFormName ? formBizFormName : '表单';
    let newTemplate = template && JSON.parse(JSON.stringify(template))

    if (newTemplate) {
      const reg = new RegExp('WORD,PDF,')
      newTemplate = newTemplate.replace(reg, '')
      console.log("isSpliteess", isSplit, "newTemplate", newTemplate)
    }
    return (
      <Tabs
        defaultActiveKey="1"
        onChange={onChangeTab}
        activeKey={relType}
        style={{ height: '100%' }}
        className={styles.form_tab}
      >
        <Tabs.TabPane
          tab={title}
          key="FORM"
          style={{ height: '100%' }}
          className={styles.form_preview}
        >
          {MicroApp}
        </Tabs.TabPane>
        {isSplit ? newTemplate && newTemplate != '0' && newTemplate.split(',').map(item => {
          return (
            <Tabs.TabPane
              tab={<Badge offset={[10, 0]} count={item == 'ANNEX' ? Number(relBizInfoList.length + attachmentList.length) : 0}><span>{TEMPLETE[item]}</span></Badge>}
              key={item}
              className={styles.tab_scroll}
            >
              {relType == item && returnTab(item)}
            </Tabs.TabPane>
          );
        })
          : template &&
          template != '0' &&
          template.split(',').map((item) => {
            return (
              <Tabs.TabPane
                tab={<Badge offset={[10, 0]} count={item == 'ANNEX' ? Number(relBizInfoList.length + attachmentList.length) : 0}><span>{TEMPLETE[item]}</span></Badge>}
                key={item}
                className={styles.tab_scroll}
              >
                {relType == item && returnTab(item)}
              </Tabs.TabPane>
            );
          })}
        {tabItems.map((item, index) => {
          let tmpKey = (index + 2).toString();
          return (
            <Tabs.TabPane
              tab={item.label}
              key={tmpKey}
              style={{ height: '100%' }}
              className={styles.tabpane_warp}
            >
              {allExtraQuery[tmpKey] ?
                allExtraQuery[tmpKey].type == 'list' ?
                  <FormModeling location={location} extraParams={allExtraQuery[tmpKey]} key={tmpKey} />
                  :
                  <FormShowPreview location={location} isUpdataAuth={isUpdataAuth} extraQuery={allExtraQuery[tmpKey]} key={tmpKey} /> :
                null
              }
            </Tabs.TabPane>
          )
        })}
      </Tabs>
    );
  };
  const updateState = (params) => {
    setState({
      ...params
    })
  }
  console.log('isShowRelevance==', isShowRelevance,isSplit);
  return (
    <Spin spinning={!fromInitialized}>
      <div className={styles.form_detail_warp} id={`formShow_container_${targetKey}`} style={{background: window.location.href.includes('/mobile')?'#f5f5f5':''}}>

          <ButtonList
            form={form}
            subMap={subMap}
            dropScopeTab={dropScopeTab}
            setIsShowRelevance={setIsShowRelevance}
            onRule={onRule}
            setTmpErrorsInfo = {setTmpErrorsInfo}
            setState={setState}
            state={state}
            location={location}
            display={relType=='FORM'||relType=='ANNEX'?'block':'none'}
            targetKey={targetKey}
            fromInitialized={fromInitialized}
            setHistoryTextShow={setHistoryTextShow}
            setShowDownloadZip={setShowDownloadZip}
            tmpUrlFrom={tmpUrlFrom}
          />
        {isShowSend && (
          <BIZTASKFORM
            dropScopeTab={dropScopeTab}
            mainform={form}
            bizInfo={bizInfo}
            setState={setState}
            state={state}
            targetKey={targetKey}
          />
        )}
        {backNodes.length > 0 && !window.location.href.includes('/mobile') ? (
          <BACKNODES
            setState={setState}
            state={state}
            dropScopeTab={dropScopeTab}
            mainform={form}
            targetKey={targetKey}
          />
        ) : null}
        {/* <VIEWFLOW location={location} /> */}
        {/* {window.location.href.includes('mobile')?MicroApp(): }*/}
        <ScreenWps 
        leftChildren={() => {
          return <ReSizeLeftRight
            paddingNum={0}
            height={(relType == 'WORD' || relType == 'PDF') ? '100%' : !isShowSend ? `calc(100% - 54px)` : window.location.href.includes('/mobile') ? `calc(100% - 4.62rem)` : `calc(100% - 226px)`}
            leftChildren={
              <div
                className={isShowSend ? styles.spin_warp : ''}
                style={{ height: '100%' }}
              >
                {window.location.href.includes('mobile') ? MicroApp : leftChildren()}
                {/* {leftChildren()} */}
              </div>
            }
            rightChildren={isShowRule&&!isSplit ? <RuleConfig state={state} setState={setState} /> : ''}
            vRigthNumLimit={240}
            vNum={'76%'}
            isShowRight={isShowRule&&!isSplit}
          />
        }}
          setState={setState} state={state} isShowRule={isShowRule} location={location} textFillScreen={textFillScreen} isShowButton={location.query.currentTab} targetKey={targetKey} fileType="word" isSplit={isSplit}
        />
        {isShowRelevance && (
          <ChangeUser
            spaceInfo={state}
            handelCancel={handelCancel}
            bizTaskIds={bizTaskId}
            nameSpace={'formShow'}
            dropScopeTab={dropScopeTab}
            getContainerId={`formShow_container_${targetKey}`}
            bizInfo={bizInfo}
            updateState={updateState}
            targetKey={targetKey}
          />
        )}
        {isShowCirculate && <CirculateModal state={state} setState={setState} targetKey={targetKey} />}
        {historyTextShow && <MainTextHistory onCancel={cancelMainTextHistory} setState={setState} onChangeTab={onChangeTab} bizTaskId={bizTaskId} getContainerId={`formShow_container_${targetKey}`} state={state} targetKey={targetKey} />}
        {showDownloadZip && <DownLoadZipModal onCancel={cancelDownloadZip} targetKey={targetKey} />}
        {!isSplit && template?.includes('WORD') && state?.bizInfo?.operation != 'view' && <div className={styles.splitMini} title="正文分屏" onClick={onClickSplitScreen}>
          <OneToOneOutlined />
        </div>}
      </div>
    </Spin>
  );
}
export default connect(({ formShow, waitMatter, loading, dynamicPage, user }) => {
  return { formShow, waitMatter, loading, dynamicPage, user };
})(Index);
// export default connect(({ formShow, waitMatter, loading, dynamicPage }) => {
//   return { formShow, waitMatter, loading, dynamicPage };
// })(memo(Index, (prevProps, nextProps)=>{
//   console.log('prevProps, nextProps',prevProps, nextProps)
//   if(JSON.stringify(prevProps)==JSON.stringify(nextProps)){
//     debugger;
//     return true
//   }else{
//     return false
//   }
// }));
