import React from 'react';
import TableList from '../../componments/role/list';


export default ({location}) => {
  return (
      <div id='allRole_container' style={{background:'#ffffff',height:'100%'}}>
        <TableList location={location}/>
      </div>

  );
}
