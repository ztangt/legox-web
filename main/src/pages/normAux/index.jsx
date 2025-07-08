import React from 'react'

import NormAux from './components/normAux'
export default ({location}) => {
  return (
    <div id='NormAux_container' style={{height:'100%'}}>
      <NormAux location={location}/>
    </div>
  )
}
