import React from 'react';
import DataRuleInfo from './componments/dataRuleInfo';


export default ({location}) => {
  return (
        <div id='dataRuleMg_container' style={{height: '100%'}}>
           <DataRuleInfo location={location}/>
        </div>

  );
}


