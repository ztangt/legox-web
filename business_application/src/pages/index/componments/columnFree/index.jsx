/**
 * @author zhangww
 * @description 自定义栏目
 */

import React from 'react';
import { connect } from 'dva';
import { MicroAppWithMemoHistory, history } from 'umi';

function Index({ desktopLayout, id, val }) {
  // const { addData } = desktopLayout;
  const url = val;
  let pageName = '';
  let microAppName = '';
  let otherParams = '';
  function getMicroAppName() {
    microAppName = url.split('/')[0];
    pageName = url.split('/')[1];
    if (url.indexOf('?')) {
      otherParams = url.split('?')[1]
    }
  }
  getMicroAppName();

  return (
    url.indexOf('http') > -1 ?
    <iframe src={url} style={{width:'100%',height:'100%'}}></iframe> :
    <MicroAppWithMemoHistory
      name={microAppName}
      goBack={history}
      url={`/${pageName}`}
      location={history.location}
      otherParams={otherParams}
    />
  )
}

export default connect(({ desktopLayout }) => ({
  desktopLayout,
}))(Index);
