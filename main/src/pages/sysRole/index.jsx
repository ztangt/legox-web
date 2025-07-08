import React from 'react';
import TableList from '../../componments/role/list';


export default ({location}) => {
  return (
      <div id='sysRole_container' style={{height:'100%',background:'#ffffff'}}>
        <TableList location={location}/>
      </div>

  );
}
