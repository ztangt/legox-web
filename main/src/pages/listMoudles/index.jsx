import React from 'react';
import ListMoudles from './components/listMoudles';
import { history } from 'umi'

export default ({location}) => {
  // const search = history.location.search.includes('?')||!history.location.search?history.location.search:`?${history.location.search}`
  return (
        <div id='listMoudles_container' style={{height: '100%'}}>
          <ListMoudles location={location}/>
        </div>

  );
}


