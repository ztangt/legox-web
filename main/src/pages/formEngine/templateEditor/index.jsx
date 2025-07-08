import React from 'react';
import TemplateEditor from './componments/templateEditor';
;

export default () => {
  return (
      <div
        id="templateEditor_container"
        style={{ height: '100%', background: '#fff' }}
      >
        <TemplateEditor />
      </div>
  );
};
