import React from 'react'
import { PlusSquareOutlined,MinusSquareOutlined } from '@ant-design/icons';
import pluse from '../../../public/assets/pluse.svg'
import minus from '../../../public/assets/minus.svg'
import reset from '../../../public/assets/reset.svg'
import styles from './index.less'

const BpmnToolsComponent = ({handleZoom,handleReset})=>{
    return (
        <ul className={styles.tools_ul}>
           <li onClick={()=>handleZoom(0.15)}>
            <img src={pluse} title="放大"/>
           </li>
           <li className={styles.tools_minus} onClick={()=>handleZoom(-0.15)}>
            <img src={minus} title="缩小"/>    
           </li>
           <li className={styles.tools_minus} onClick={()=>handleReset()}>
            <img src={reset} title="还原" />
           </li>  
        </ul>
    )
}

export default BpmnToolsComponent