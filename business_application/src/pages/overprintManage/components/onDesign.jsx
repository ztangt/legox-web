import {useEffect,useState} from 'react'
import WpsFiles from '../../../componments/WpsFile'
import styles from '../index.less'

const WpsPrintDesign = ({location})=>{
    
    return (
        <div className={styles.design} id="printDesign">
            <WpsFiles fileType="red" state={{bizInfoId:location.query.id}} location={location}></WpsFiles>
        </div>
    )
}

export default WpsPrintDesign