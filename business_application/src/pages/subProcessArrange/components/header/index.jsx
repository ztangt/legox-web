import React from 'react'
import {connect} from 'dva'
import {Button,Input} from 'antd'
import styles from '../../index.less'
const {Search} = Input
const Header = ({leftConfig,rightConfig,content})=>{
    return (
        <div className={styles.header}>
            <Search {...leftConfig} style={leftConfig.style}/>
            <Button {...rightConfig} style={rightConfig.style}>{content}</Button>
        </div>
    )
}

export default Header
