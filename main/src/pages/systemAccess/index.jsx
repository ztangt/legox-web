import React from 'react'

import SystemAccess from './components/systemAccess'
export default ({location})=> {
  return (
        <div id='systemAccess_container' style={{height:'100%'}}><SystemAccess location={location}/></div>
  )
}
