import React from 'react';
import Print from './print';
import {  history,useOutletContext } from 'umi';

export default ({ location }) => {
  const search =
    history.location.search.includes('?') || !history.location.search
      ? history.location.search
      : `?${history.location.search}`;
  return (
      <Print location={location|| useOutletContext()?.location}/>
  );
};
