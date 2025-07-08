import React from 'react';
import Design from './design.jsx';
import { history } from 'umi'
import { parse } from 'query-string';

export default () => {
  const query = parse(history.location.search);
  return (
        <div id={`moudleDesign_container_${query.moudleId}_${query.ctlgId}`} style={{height: '100%'}}>
          <Design/> 
        </div>

  );
}


