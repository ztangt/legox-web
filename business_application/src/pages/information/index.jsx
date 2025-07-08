import React from 'react';
import { history,useOutletContext } from 'umi';
import Information from './componments/information';

export default () => {
  // const search =
  //   history.location.search.includes('?') || !history.location.search
  //     ? history.location.search
  //     : `?${history.location.search}`;
  return (
      <Information location={location|| useOutletContext()?.location}></Information>
  ); 
};
