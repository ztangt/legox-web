import React from 'react';
import PlatformCodeRules from './components/platformCodeRules';


export default ({location}) => {
  return (
        <div id='platformCodeRules_container' style={{height: '100%'}}>
          <PlatformCodeRules location={location}/>
        </div>
  );
}
