import React from 'react'

import InterfaceManagement from './componments/interfaceManagement'
export default ({location}) => {
    return (
            <div id='interfaceManagement_container' style={{height:'100%'}}>
                <InterfaceManagement location={location}/>
            </div>
    )


}