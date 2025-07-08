import React from 'react'

import XxlJob from './components/xxlJob'
export default ({location}) => {
  return (
    <div id='xxlJob_container' style={{height:'100%'}}>
      <XxlJob location={location}/>
    </div>
  )
}
