import React from 'react';
import { history,useOutletContext } from 'umi';
import NoticePage from './components/noticePage';


export default ({ location }) => {
  console.log(location, 'location');
  const search = history.location.search.includes('?') || !history.location.search ? history.location.search : `?${history.location.search}`
  return (
      <NoticePage location={location|| useOutletContext()?.location}></NoticePage>
  );
};