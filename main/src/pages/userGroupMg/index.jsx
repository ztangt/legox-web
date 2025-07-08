import React from 'react';
import UserGroup from './componments/userGroup';


export default ({location}) => {
  return (
      <div id='userGroupMg_container'  style={{ height: '100%' }}>
        <UserGroup location={location}/>
      </div>

  );
}
