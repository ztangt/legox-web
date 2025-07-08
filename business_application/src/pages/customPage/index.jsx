import React from 'react';
import { MicroAppWithMemoHistory, history } from 'umi';

export default () => {
  const tableConfig = JSON.parse(localStorage.getItem('tableConfig'));
  const url = tableConfig.TABLE_CUSTOM.split(',')[2];
  let pageName = '';
  let microAppName = '';
  let key = -1;
  // let iframeUrl = 'https://www.csdn.net/'
  function getMicroAppName() {
    if (url.indexOf('http') > -1) {
      key = 1;
      window.open(url,'_self');
      //外链
    } else {
      key = 0;
      // /business_cma/cmaHome
      // microAppName = 'business_cma';
      // pageName = 'cmaHome';
      microAppName = url.split('/')[0];
      pageName = url.split('/')[1];
      console.log('~~~',microAppName,pageName);
    }
  }
  getMicroAppName();

  return key !== -1 ? (
    // <>456</>
    <MicroAppWithMemoHistory
      name={microAppName}
      goBack={history}
      url={`/${pageName}`}
      location={history.location}
    />
  ) : (
    <></>
  );
};
