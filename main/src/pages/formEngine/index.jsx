import React from 'react';
import FormEngine from './componments/formEngine';


export default ({location}) => {
  return (
      <div id='formEngine_container' style={{height: '100%',background:'#fff'}}>
        <FormEngine location={location}/>
      </div>

  );
}


