import React from 'react';
import TenantSettings from './components/TenantSettings';
;

export default () => {
  return (
      <div
        id="tenantSettings_container"
        style={{ height: '100%', padding: '8px' }}
      >
        <TenantSettings />
      </div>
  );
};
