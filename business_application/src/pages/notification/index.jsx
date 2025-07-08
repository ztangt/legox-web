import React from 'react';
import { history,useOutletContext} from 'umi';
import Notification from './componments/notification';


export default ({location}) => {
  const search =history.location.search.includes('?') || !history.location.search? history.location.search: `?${history.location.search}`;
  return (

      <Notification location={location|| useOutletContext()?.location}></Notification>
  );
};
