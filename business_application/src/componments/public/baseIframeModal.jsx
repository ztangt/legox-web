import { connect } from 'dva';
import { history, MicroAppWithMemoHistory } from 'umi';
import { useState, useMemo, useEffect } from 'react';
import { Modal } from 'antd';
import GlobalModal from '../GlobalModal';
import {Button} from '@/componments/TLAntd';
function baseIframeModal({
  location,
  isIframeModalOpen,
  setIsIframeModalOpen,
  width,
  height,
  title,
  url,
  renderFooterList,
  rowInfoArr = [],
  formModelingName,
  paramsObj={}
}) {
  const [curHeight, setCurHeight] = useState(0);
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

  console.log('rowInfoArr', rowInfoArr, url,renderFooter);
  return (
    <GlobalModal
      title={title}
      visible={isIframeModalOpen}
      // width={width}
      widthType={1}
      incomingWidth={width}
      incomingHeight={height}
      // bodyStyle={{ height: `${height}px` ,padding:'0px'}}
      onCancel={handleCancel}
      maskClosable={false}
      mask={false}
      footer={[
        renderFooter&&renderFooter.map((item) => {
          return item;
        })
      ]}
      getContainer={() => {
        return document.getElementById(formModelingName) || false;
      }}
    >
      <div style={{ position: 'relative', height: '100%' }}>
        <div style={{ width: '100%', height: curHeight, paddingBottom: 10,overflow:'auto' }}>
          {url.indexOf('http') >= 0 ? (
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
              paramsObj={paramsObj}
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
              bottom: '0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'right',
              height:'49px',
              background:'#fff',
              borderTop:'1px solid rgba(0,0,0,.06)'
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
