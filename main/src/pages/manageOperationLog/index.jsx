import React from 'react'

import ManageOperationLog from './componments/manageOperationLog'
export default ({location}) => {
    return (
            <div id='manageOperationLog' style={{height:'100%'}}>
               <ManageOperationLog location={location}/>
            </div>
    )


}
