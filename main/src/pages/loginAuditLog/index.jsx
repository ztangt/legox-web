import React from 'react'

import LoginAuditLog from './components/loginAudit'
export default ({location}) => {
  return (
    <div id='LoginAuditLog_container' style={{height:'100%'}}>
      <LoginAuditLog location={location}/>
    </div>
  )
}
