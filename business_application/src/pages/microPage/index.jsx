import React from 'react';
import { MicroAppWithMemoHistory, history } from 'umi';
import {CONFIRM as CONFIRMFN,MESSAGE as MESSAGEFN,QS as QSFN,LOCATIONHASH as LOCATIONHASHFN,UUID as UUIDFN,fetchAsync as fetchAsyncFn} from '../../util/globalFn';//这个是用于按钮代码中的
import {dataFormat } from '../../util/util';
export default ({location}) => {
  const { url, microAppName } = location.query;
  if(!microAppName){
    return null
  }
  return (
    <>
      <MicroAppWithMemoHistory
        key={url}
        name={microAppName}
        url={`/${url}`}
        location={location}
        CONFIRM = {CONFIRMFN}
        MESSAGE = {MESSAGEFN}
        QS = {QSFN}
        LOCATIONHASH= {LOCATIONHASHFN}
        UUID={UUIDFN}
        fetchAsync = {fetchAsyncFn}
        DATAFORMAT = {dataFormat}
      />
    </>
  );
};
