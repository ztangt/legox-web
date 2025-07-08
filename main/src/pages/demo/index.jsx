import React from 'react'

import OpenSystemDemo from './components/openSystemDemo'
export default ({location}) => {
    return (
            <div id='openSystem_container' style={{height:'100%'}}>
                <OpenSystemDemo location={location}/>
            </div>
    )


}
