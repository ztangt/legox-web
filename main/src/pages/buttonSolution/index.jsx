import React from 'react';
import ButtonSolution from './components/buttonSolution';


export default ({location}) => {
  return (
        <div id='buttonSolution_container' style={{height: '100%'}}>
           <ButtonSolution location={location}/>
        </div>
  );
}


