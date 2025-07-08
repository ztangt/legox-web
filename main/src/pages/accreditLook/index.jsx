import React from 'react';
import TableList from './componments/list';


export default ({location}) => {
  return (
      <div id='accreditLook_container' style={{height: '100%'}}>
        <TableList location={location}/>
      </div>

  );
}
