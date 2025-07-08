import React from 'react';
import FormEngine from './componments/formEngine';


export default ({location}) => {
  return (
      <div id='formAppEngine_container' style={{height: '100%',background:'#fff'}}>
        <FormEngine location={location}/>
      </div>

  );
}


