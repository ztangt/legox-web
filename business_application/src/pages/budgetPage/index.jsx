import React, { useState } from 'react';
import { MicroAppWithMemoHistory } from 'umi';
import { message, Modal } from 'antd';
import BaseModal from '../dynamicPage/componments/baseModal';
import BaseIframeModal from '../dynamicPage/componments/baseIframeModal';
import { connect } from 'dva';
import {dataFormat } from '../../util/util';
import {CONFIRM as CONFIRMFN,MESSAGE as MESSAGEFN,QS as QSFN,LOCATIONHASH as LOCATIONHASHFN,UUID as UUIDFN,fetchAsync as fetchAsyncFn} from '../../util/globalFn';//这个是用于按钮代码中的
function Index({location,user}) {
  const { menus } = user
  const { url, bizSolId, listId, microAppName } = location.query;
  const formModelingName = `formModeling${bizSolId || 0}${listId || 0}`;
  // 通用弹框的visdle
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 通用弹框的props
  const [baseModalProps, setBaseModalProps] = useState({});

  // 通用iframe弹框的visdle
  const [isIframeModalOpen, setIsIframeModalOpen] = useState(false);
  // 通用弹框的props
  const [baseIframeModalProps, setBaseIframeModalProps] = useState({});
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
        return document.getElementById(formModelingName);
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
    } = v;
    setIsModalOpen(true);
    setBaseModalProps({
      title,
      width,
      height,
      onOk,
      onCancel,
      renderChildList,
      renderFooterList,
    });
  };

  /**
   *
   * 通用Iframe弹框
   *
   */
  const baseIframeModalComponments = (v) => {
    const { title = '提示', url, renderFooterList, rowInfoArr } = v;
    setBaseIframeModalProps({
      title,
      url,
      renderFooterList,
      rowInfoArr,
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

  const openFormDetail = (
    dragCodes,
    searchCodes,
    bizInfoId,
    record,
    isBudget,
  ) => {
    let title = '查看';
    let buttonId = '';
    var maxDataruleCodes = JSON.parse(
      localStorage.getItem('maxDataruleCodes') || '{}',
    );
    var maxDataruleCode = maxDataruleCodes[location.pathname];
    historyPush({
      pathname: '/dynamicPage/formShow',
      query: {
        bizInfoId,
        bizSolId: record.sourceBizSolId,
        beforeBizSolId: bizSolId,
        currentTab: 1,
        title,
        id: isBudget === 'new' ? record.sourceId : record.ID || record.id,
        isBudget,
        microAppName,
        url,
        buttonId,
        maxDataruleCode,
      },
    });
  };

  const openNewPage = () => {
    message.success('导出成功');
    historyPush({pathname:'/exportList'});
  };

  return (
      <>
        <MicroAppWithMemoHistory
          name={microAppName}
          url={`/${url}`}
          location={location}
          openEvent={(v1, v2, v3, v4, v5) => openFormDetail(v1, v2, v3, v4, v5)}
          baseConfirmCma={(v) => baseConfirm(v)}
          baseMessageCma={(v) => baseMessage(v)}
          baseModalComponmentsCma={(v) => baseModalComponments(v)}
          baseIframeModalComponmentsCma={(v) => baseIframeModalComponments(v)}
          openNewPage={() => openNewPage()}
          menus={menus}
          MESSAGE = {MESSAGEFN}
          QS = {QSFN}
          LOCATIONHASH= {LOCATIONHASHFN}
          UUID={UUIDFN}
          fetchAsync = {fetchAsyncFn}
          DATAFORMAT = {dataFormat}
        />
        {isModalOpen && (
          <BaseModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            {...baseModalProps}
          />
        )}

        {isIframeModalOpen && (
          <BaseIframeModal
            isIframeModalOpen={isIframeModalOpen}
            setIsIframeModalOpen={setIsIframeModalOpen}
            {...baseIframeModalProps}
          />
        )}
      </>
  );
};
export default connect(({ user }) => ({
  user
}))(Index);