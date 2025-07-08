import React from 'react';
import {history,useOutletContext } from 'umi';
import NotificationList from './componments/notificationList';


export default ({location}) => {
  const search =history.location.search.includes('?') || !history.location.search? history.location.search: `?${history.location.search}`;
  return (
      <NotificationList location={location|| useOutletContext()?.location}></NotificationList>
  );
};
