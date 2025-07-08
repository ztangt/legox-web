import React from 'react';
import SceneConfig from './componments/sceneConfig';
export default ({ location }) => {
  return (
    <div id="sceneConfig_container" style={{ height: '100%' }}>
      <SceneConfig location={location} />
    </div>
  );
};
