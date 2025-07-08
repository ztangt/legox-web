import React from 'react'
import './../index.less'
const Header = ({content,children})=>{
    return (
        <div className='base-info-common-msg'>
            {children}
            <h4>{content}</h4>
          </div>
    )
}

export default Header