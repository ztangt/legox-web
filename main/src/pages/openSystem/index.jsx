import React from 'react'

import OpenSystem from './components/openSystem'
export default ({location}) => {
    return (
            <div id='openSystem_container' style={{height:'100%'}}>
                <OpenSystem location={location}/>
            </div>
    )


}
