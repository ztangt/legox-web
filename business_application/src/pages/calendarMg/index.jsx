import React from 'react';
import {  history,useOutletContext } from 'umi';
import CalendarMg from './componments/calendarMg';

export default ({ location }) => {
  const search = history.location.search.includes('?') || !history.location.search ? history.location.search : `?${history.location.search}`;
  return (
      <CalendarMg location={location|| useOutletContext()?.location}></CalendarMg>
  );
};
