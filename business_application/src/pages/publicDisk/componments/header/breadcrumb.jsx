import react from 'react'
import { connect } from 'dva';
import { Card, Breadcrumb } from 'antd';
import BackImg from '../../../../../public/assets/gonext.svg'
import styles from '../publicDisk.less'

const BreadCrumb = ({selectTreeUrl,changeSelectTreeId})=>{

    return (
        <div className={styles.breadcrumb}>
            {/* <span>位置：</span> */}
            <Breadcrumb separator=">" style={{ display: 'inline-block' }}>
            {selectTreeUrl?.map((item, index) => {
                return (
                <Breadcrumb.Item 
                    onClick={()=>changeSelectTreeId(item, index)}
                    key={item.key}
                >
                    {item.title}
                </Breadcrumb.Item>
                );
            })}
            </Breadcrumb>
        </div>
    )

}

export default connect(({signDisk})=>({signDisk}))(BreadCrumb)