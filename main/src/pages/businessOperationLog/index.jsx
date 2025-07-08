import React from 'react'

import BusinessOperationLog from './componments/businessOperationLog'
export default ({location}) => {
    return (
            <div id='businessOperationLog' style={{height:'100%'}}>
               <BusinessOperationLog location={location}/>
            </div>
    )


}
