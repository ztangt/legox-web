import React, { useEffect, useRef, useState } from 'react';
import { MicroAppWithMemoHistory, history } from 'umi';
import { message, Modal } from 'antd';
import BaseModal from '../dynamicPage/componments/baseModal';
import BaseIframeModal from '../dynamicPage/componments/baseIframeModal';
import { connect,useOutletContext} from 'umi';
import {dataFormat } from '../../util/util';
import {CONFIRM as CONFIRMFN,MESSAGE as MESSAGEFN,QS as QSFN,LOCATIONHASH as LOCATIONHASHFN,UUID as UUIDFN,fetchAsync as fetchAsyncFn} from '../../util/globalFn';//这个是用于按钮代码中的
import TableModal from '../../componments/tabelModal/tabelModal';
/**
 * 气象
 * pageId 配置动态路由复用页面内容,例如路由相同id不同以id区分路由
 * */
const Index = ({location,dispatch,user}) => {
  const { menus } = user
  location=location||useOutletContext()?.location||{query:{}}//非空校验，防止报错
  const { url, bizSolId, microAppName, listId } = location.query;
  const [isTableModal, setIsTableModal] = useState(false);
  const [tableModalParams, setTableModalParams] = useState({}); //列表按钮弹框
  const [roundNum,setRoundNum] = useState(UUIDFN());
  // const search =
  //   history.location.search.includes('?') || !history.location.search
  //     ? history.location.search
  //     : `?${history.location.search}`;
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

  const openNewPage = () => {
    message.success('导出成功');
    historyPush('/exportList');
  };

  return (
    <>
      <MicroAppWithMemoHistory
        key={url}
        name={microAppName}
        historyCma={history}
        url={
          location.query.pageId
            ? `/${url}/${location.query.id}`
            : `/${url}`
        }
        location={location}
        baseConfirmCma={(v) => baseConfirm(v)}
        baseMessageCma={(v) => baseMessage(v)}
        baseModalComponmentsCma={(v) => baseModalComponments(v)}
        baseIframeModalComponmentsCma={(v) => baseIframeModalComponments(v)}
        openNewPage={() => openNewPage()}
        parentDispatch={dispatch}
        menus={menus}
        CONFIRM = {CONFIRMFN}
        MESSAGE = {MESSAGEFN}
        QS = {QSFN}
        LOCATIONHASH= {LOCATIONHASHFN}
        UUID={UUIDFN}
        fetchAsync = {fetchAsyncFn}
        DATAFORMAT = {dataFormat}
        setTableModalParams={setTableModalParams}
        setIsTableModal={setIsTableModal}
        divId = {roundNum}
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
      {isTableModal && (
        <TableModal
          location={location}
          tableModalParams={tableModalParams}
          setIsTableModal={setIsTableModal}
          divId = {roundNum}
        />
      )}
    </>
  );
};

export default connect(({ user }) => ({
  user
}))(Index);