import React from 'react';
import {  history,useOutletContext } from 'umi';
import SignDisk from './componments/signDisk';

export default ({location}) => {
  const search =
    history.location.search.includes('?') || !history.location.search
      ? history.location.search
      : `?${history.location.search}`;
  return (

      <SignDisk location={location|| useOutletContext()?.location}></SignDisk>
  );
};
