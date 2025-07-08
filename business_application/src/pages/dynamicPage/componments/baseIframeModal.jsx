import { connect } from 'dva';
import { MicroAppWithMemoHistory } from 'umi';
import { useState, useMemo, useEffect } from 'react';
import { Modal, Button } from 'antd';
import GlobalModal from '../../../componments/GlobalModal';
function baseIframeModal({
  location,
  isIframeModalOpen,
  setIsIframeModalOpen,
  width,
  height,
  title,
  url = '',
  renderFooterList,
  rowInfoArr = [],
}) {
  const [curHeight, setCurHeight] = useState(0);
  const listId = location?.query?.listId || 0;
  const bizSolId = location?.query?.bizSolId || 0;
  const formModelingName = `formModeling${bizSolId}${listId}`;

  const handleCancel = () => {
    setIsIframeModalOpen(false);
  };

  const handleOk = () => {
    setIsIframeModalOpen(false);
  };

  const onResize = () => {
    const resizeHeight = document.documentElement.clientHeight;
    const height = resizeHeight > 460 ? resizeHeight : 460;
    setCurHeight(height);
  };

  useEffect(() => {
    sessionStorage.setItem('rowInfoArr', rowInfoArr);

    const height = window.outerHeight;
    setCurHeight(height);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);
  const renderFooter = useMemo(() => {
    if (renderFooterList && renderFooterList.length > 0) {
      return renderFooterList.reduce((pre, cur, index) => {
        let btn = '';
        if (cur.key === 'submit') {
          let btnEvent = () => {
            cur.onClick && cur.onClick();
            handleOk();
          };
          btn = (
            <Button
              key={index}
              htmlType="submit"
              onClick={btnEvent}
              {...cur.btnProps}
              // style={{ marginRight: 10 }}
            >
              {cur.label}
            </Button>
          );
        }

        if (cur.key === 'cancel') {
          let btnEvent = () => {
            cur.onClick && cur.onClick();
            handleCancel();
          };
          btn = (
            <Button
              key={index}
              onClick={btnEvent}
              // style={{ marginRight: 10 }}
              {...cur.btnProps}
            >
              {cur.label}
            </Button>
          );
        }
        if (cur.key != 'cancel' && cur.key != 'submit') {
          btn = (
            <Button
              key={index}
              onClick={cur.onClick}
              // style={{ marginRight: 10 }}
              {...cur.btnProps}
            >
              {cur.label}
            </Button>
          );
        }
        pre.push(btn);
        return pre;
      }, []);
    } else {
      return null;
    }
  }, [renderFooterList]);

  console.log('rowInfoArr', rowInfoArr, url);
  return (
    <GlobalModal
      title={title}
      visible={isIframeModalOpen}
      // width={width}
      widthType={1}
      incomingWidth={width}
      incomingHeight={height}
      // bodyStyle={{ height: `${height}px` }}
      onCancel={handleCancel}
      maskClosable={false}
      mask={false}
      footer={
        [
          renderFooter&&renderFooter.map((item) => {
            return item;
          })
        ]
      }
      getContainer={() => {
        return document.getElementById(formModelingName) || false;
      }}
    >
      <div style={{ position: 'relative', height: '100%' }}>
        <div style={{ width: '100%', height:curHeight, paddingBottom: 10 }}>
          {url.indexOf('http') > 0 ? (
            <iframe
              id="frame"
              src={url}
              title="iframe"
              width="100%"
              height="100%"
              scrolling="auto"
              frameborder={0}
            ></iframe>
          ) : (
            <MicroAppWithMemoHistory
              name="business_cma"
              url={url}
              urlQK={url}
              location={location}
              rowInfoArr={rowInfoArr}
              cache
            />
          )}
        </div>

        {/* {renderFooter && (
          <div
            style={{
              width: '100%',
              position: 'absolute',
              bottom: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {renderFooter.map((item) => {
              return item;
            })}
          </div>
        )} */}
      </div>
    </GlobalModal>
  );
}

export default connect(({ dynamicPage }) => ({
  dynamicPage,
}))(baseIframeModal);
