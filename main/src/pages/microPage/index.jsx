import React from 'react';
import { MicroAppWithMemoHistory, history } from 'umi';
import { parse } from 'query-string';

export default ({}) => {
  const query = parse(history.location.search);

  const { url, microAppName } = query;
  if(!microAppName){
    return null
  }
  return (
    <>
      <MicroAppWithMemoHistory
        key={url}
        name={microAppName}
        url={`/${url}`}
        location={{...history.location,query}}
      />
    </>
  );
};
