import React from 'react';
import { history,location } from 'umi';
import InformationList from './componments/informationList';

export default () => {
  const search =
    history.location.search.includes('?') || !history.location.search
      ? history.location.search
      : `?${history.location.search}`;

  return (
      <InformationList location={location|| useOutletContext()?.location}></InformationList>
  );
};
