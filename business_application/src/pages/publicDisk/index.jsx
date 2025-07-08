import React from 'react';
import { history,useOutletContext } from 'umi';
import PublicDisk from './componments/publicDisk';

export default ({location}) => {
  const search =
    history.location.search.includes('?') || !history.location.search
      ? history.location.search
      : `?${history.location.search}`;
  return (
      <PublicDisk key={new Date()} location={location|| useOutletContext()?.location}></PublicDisk>
  );
};
