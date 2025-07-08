import { MicroAppWithMemoHistory } from 'umi';
import { getParam } from '../../util/util';
import styles from './index.less';
import { useEffect, useState } from 'react';


export default () => {
  function removeHashSymbols(str) {
    return str.replace(/#/g, '');
  }

  function getUrlParameters() {
    const result = removeHashSymbols(window.location.href)
    const parsedUrl = new URL(result);
    const parameters = Object.fromEntries(parsedUrl.searchParams.entries());
    return parameters;
  }
  
  const { url, microAppName } = getUrlParameters();
  return (
    <div className={styles.portalPage}>
      <MicroAppWithMemoHistory name={microAppName} url={`/${url}`} />
    </div>
  );
};


function getUrlParameters(url) {
  const parsedUrl = new URL(url);
  const parameters = Object.fromEntries(parsedUrl.searchParams.entries());
  return parameters;
}

const url = "http://localhost:8000/portalPage?microAppName=business_cma&url=jimu?to=avc";
const parameters = getUrlParameters(url);
console.log(parameters);