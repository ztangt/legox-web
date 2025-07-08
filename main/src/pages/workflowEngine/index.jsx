import React from 'react';
import WorkFlowEngine from './components/workFlowEngine.jsx';


export default ({location}) => {
  return (
        <div id='workflowEngine_container' style={{height: '100%'}}>
          <WorkFlowEngine location={{location}}/>
        </div>

  );
}
