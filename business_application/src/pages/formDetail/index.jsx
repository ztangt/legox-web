import { useEffect, useState, useMemo } from 'react';
import styles from './index.less';
import { history, MicroAppWithMemoHistory, connect,useOutletContext } from 'umi';
import { useSetState } from 'ahooks';
import './index.less';
import * as dd from 'dingtalk-jsapi';

// function Index({ dispatch, formDetail, location, loading }) {
//   const bizSolId = location.query.bizSolId;
//   const bizInfoId = location.query.bizInfoId;
//   const bizTaskId = location.query.bizTaskId;
//   const {
//     redCol,
//     serialNumList,
//     cutomHeaders,
//     tableColumCodes,
//     commentJson,
//     signConfig,
//     leftTreeData,
//     dictsList,
//   } = formDetail;
//   const [subMap, setSubMap] = useState();
//   const [form, setForm] = useState();
//   const [state, setState] = useSetState({
//     buttonList: [], //按钮
//     buttonListAuth: [], //按钮权限
//     authList: [], //字段权限
//     bizInfo: {}, //建模信息
//   });
//   const { bizInfo } = state;
//   const setCutomHeaders = (dsDynamic, mainTableId) => {
//     if (dsDynamic) {
//       cutomHeaders.dsDynamic = dsDynamic;
//     }
//     if (mainTableId) {
//       cutomHeaders.mainTableId = mainTableId;
//     }
//     dispatch({
//       type: 'formDetail/updateStates',
//       payload: {
//         cutomHeaders,
//       },
//     });
//   };
//   function toDetail(bizSolId, bizInfoId) {
//     setUrlFromFn();
//     historyPush({
//       pathname: '/dynamicPage/formDetail',
//       query: {
//         bizSolId,
//         bizInfoId,
//         title: '查看',
//       },
//     });
//   }
//   //设置打开页面的urlForm
//   const setUrlFromFn = () => {
//     //点击“返回”，需要返回到打开这个表单的页面（注：如果打开表单的页面已经被关闭了，就返回首页）
//     const search =
//       history.location.search.includes('?') || !history.location.search
//         ? history.location.search
//         : `?${history.location.search}`;
//     dispatch({
//       type: 'formDetail/updateStates',
//       payload: {
//         urlFrom: history.location.pathname + search,
//       },
//     });
//   };
//   const setFormParams = (params) => {
//     console.log('params==', params);
//     dispatch({
//       type: 'formDetail/updateStates',
//       payload: {
//         ...params,
//       },
//     });
//   };

//   useEffect(() => {
//     init(bizInfoId, bizSolId, bizTaskId);
//     dispatch({
//       type: 'formDetail/getDictInfoList',
//       payload: {},
//     });
//     dispatch({
//       type: 'formDetail/getSignConfig',
//       payload: {},
//     });
//   }, []);

//   const init = (bizInfoId, bizSolId, bizTaskId) => {
//     // console.log('bizSolId==', bizSolId);
//     if (bizInfoId) {
//       let tmpParams = {};
//       //获取待办任务业务配置
//       if (bizInfoId == '0') {
//         tmpParams = {
//           bizSolId,
//           bizInfoId,
//           bizTaskId: bizTaskId ? bizTaskId : '',
//         };
//       } else {
//         tmpParams = {
//           // bizSolId,
//           bizInfoId,
//           bizTaskId: bizTaskId ? bizTaskId : '',
//         };
//       }
//       dispatch({
//         type: 'formDetail/getSignList',
//         payload: {
//           bizInfoId: bizInfoId,
//         },
//       });
//       dispatch({
//         type: 'formDetail/getTemporarySignList',
//         payload: {
//           bizInfoId: bizInfoId,
//         },
//       });
//       dispatch({
//         type: 'formDetail/getBacklogBizInfo', //获取bizInfo
//         payload: tmpParams,
//         callback: function (data) {
//           callbackFn(data);
//         },
//       });
//     } else {
//       if (!bizSolId) {
//         return;
//       }
//       //获取任务业务配置
//       dispatch({
//         type: 'formDetail/getBizInfo', //bizInfo
//         payload: {
//           bizSolId,
//         },
//         callback: function (data) {
//           callbackFn(data);
//         },
//       });
//     }
//   };
//   const callbackFn = (data) => {
//     console.log('data====', data);
//     setState({ bizInfo: data });
//     //字段与权限
//     getFormAuthoritys(
//       data.bizSolId,
//       data.operation,
//       data.bizInfoId,
//       data.procDefId,
//       data.actId,
//       data.formDeployId,
//     );
//     if (bizModal && bizModalProps?.bizSolId) {
//       setBizModalProps({
//         ...data,
//         currentTab: location.query.currentTab,
//         bizInfoId: bizModalProps.bizInfoId,
//       });
//       return;
//     }
//     //根据返回的数据获取bussinessForm
//     dispatch({
//       type: 'formDetail/getBussinessForm',
//       payload: {
//         bizSolId: data.bizSolId,
//         procDefId: data.procDefId,
//         formDeployId: data.formDeployId,
//       },
//     });
//     //通过按钮组获取按钮
//     dispatch({
//       type: 'formDetail/getGroupButton',
//       payload: {
//         buttonGroupId: data.buttonGroupId,
//       },
//       callback: (data) => {
//         setState({ buttonList: data });
//       },
//     });
//   };
//   const getFormAuthoritys = (
//     bizSolId,
//     optType,
//     bizInfoId,
//     procDefId,
//     actId,
//     deployFormId,
//   ) => {
//     //获取按钮和字段权限
//     dispatch({
//       type: 'formDetail/getFormAuthoritys',
//       payload: {
//         bizSolId,
//         optType: optType == 'deal' || optType == 'edit' ? 'HANDLE' : 'VIEW',
//         bizInfoId,
//         procDefId,
//         actId,
//         deployFormId,
//       },
//       callback:(buttonListAuth,authList)=>{
//         setState({
//           buttonListAuth:buttonListAuth,
//           authList:authList
//         })
//       }
//     });
//   };

//   const getSerialNum = (
//     bizInfoId,
//     actId,
//     procDefId,
//     bpmFlag,
//     deployFormId,
//     bizSolId,
//     mainTableId,
//   ) => {
//     dispatch({
//       type: 'formDetail/getSerialNum',
//       payload: {
//         bizInfoId: bizInfoId,
//         actId: actId,
//         procDefId: procDefId,
//         bpmFlag: bpmFlag,
//         deployFormId: deployFormId,
//         bizSolId: bizSolId,
//         mainTableId,
//       },
//     });
//   };

//   const setBizModal = (bizModal) => {
//     dispatch({
//       type: 'designableBiz/updateStates',
//       payload: {
//         bizModal,
//       },
//     });
//   };
//   const setBizModalProps = (bizModalProps) => {
//     dispatch({
//       type: 'designableBiz/updateStates',
//       payload: {
//         bizModalProps,
//       },
//     });
//   };
//   const setTreeTableProps = (treeTableProps) => {
//     dispatch({
//       type: 'designableBiz/updateStates',
//       payload: {
//         treeTableProps,
//       },
//     });
//   };
//   const setBizModalState = (e) => {
//     dispatch({
//       type: 'formDetail/updateStates',
//       payload: {},
//     });
//   };
//   console.log('bizInfo', bizInfo);
//   const MicroApp = useMemo(() => {
//     return (
//       <MicroAppWithMemoHistory
//         style={{ height: '100%' }}
//         name="designable"
//         url="/preview"
//         location={location|| useOutletContext()?.location}
//         toDetail={toDetail}
//         deployFormId={
//           bizInfo && Object.keys(bizInfo).length ? bizInfo.formDeployId : ''
//         }
//         bizInfoId={
//           bizInfo && Object.keys(bizInfo).length ? bizInfo.bizInfoId : ''
//         }
//         mainLoading={loading}
//         setForm={setForm}
//         bizInfo={bizInfo}
//         serialNumList={serialNumList}
//         setSubMap={setSubMap}
//         redCol={redCol}
//         subMap={subMap}
//         setCutomHeaders={setCutomHeaders}
//         cutomHeaders={cutomHeaders}
//         setBizModalProps={setBizModalProps}
//         setBizModal={setBizModal}
//         setBizModalState={setBizModalState}
//         setTreeTableProps={setTreeTableProps}
//         setFormParams={setFormParams}
//         dictsList={dictsList}
//         signConfig={signConfig}
//         tableColumCodes={tableColumCodes}
//         commentJson={commentJson}
//         leftTreeData={leftTreeData}
//         buttonList={state.buttonList}
//         buttonListAuth={state.buttonListAuth}
//         authList={state.authList}
//       />
//     );
//   }, [
//     bizInfo?.bizInfoId,
//     serialNumList,
//     redCol,
//     subMap,
//     cutomHeaders,
//     dictsList,
//     signConfig,
//     tableColumCodes,
//     commentJson,
//   ]);
//   return <div id="formShow_container">{MicroApp}</div>;
// }
// export default connect(({ formDetail, loading }) => {
//   return { formDetail, loading };
// })(Index);

export default function IndexPage({ location }) {
  useEffect(() => {
    // if (dd.env.platform !== 'notInDingTalk') {
    //   dd.ready(function () {
    //     dd.biz.navigation.setTitle({
    //       title: '单据详情',
    //       onSuccess: function (res) {
    //         // 调用成功时回调
    //         console.log(res);
    //       },
    //       onFail: function (err) {
    //         // 调用失败时回调
    //         console.log(err);
    //       },
    //     });
    //   });
    // }
  }, []);
  return (
    <div id="mobile_container">
      <MicroAppWithMemoHistory
        name="business_application"
        url="/dynamicPage/formShow"
        location={location|| useOutletContext()?.location}
      />
    </div>
  );
}
