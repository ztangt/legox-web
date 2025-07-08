import React, { useEffect, useRef, useState } from 'react';
import { MicroAppWithMemoHistory, history } from 'umi';
import { message, Modal } from 'antd';
import BaseModal from '../dynamicPage/componments/baseModal';
import BaseIframeModal from '../dynamicPage/componments/baseIframeModal';
import { connect,useOutletContext} from 'umi';
/**
 * 消防
 * pageId 配置动态路由复用页面内容,例如路由相同id不同以id区分路由
 * */
const Index = ({location,dispatch,user}) => {
  const { menus } = user
  location=location||useOutletContext()?.location||{query:{}}//非空校验，防止报错
  const { url, bizSolId, microAppName, listId } = location.query;
  console.log('microAppNameurl',url,microAppName);

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
        historyCccf={history}
        url={
          location.query.pageId
            ? `/${url}/${location.query.id}`
            : `/${url}`
        }
        location={location}
        baseConfirmCccf={(v) => baseConfirm(v)}
        baseMessageCccf={(v) => baseMessage(v)}
        baseModalComponmentsCccf={(v) => baseModalComponments(v)}
        baseIframeModalComponmentsCccf={(v) => baseIframeModalComponments(v)}
        openNewPage={() => openNewPage()}
        parentDispatch={dispatch}
        menus={menus}
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
