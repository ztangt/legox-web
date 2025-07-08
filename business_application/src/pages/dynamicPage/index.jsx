
import React from 'react';
import { history, useOutletContext } from 'umi';
import FormModeling from './componments/formModeling';

export default ({ location }) => {
  console.log('location', useOutletContext().location);
  // const {bizSolId, listId, formId } = location.query;
  const search =
    history.location.search.includes('?') || !history.location.search
      ? history.location.search
      : `?${history.location.search}`;
  // console.log('dynamicPagessss',history.location.pathname,search, bizSolId,location);
  return (
      <FormModeling location={location||useOutletContext().location}></FormModeling>
  );
};
