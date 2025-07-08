import { NavBar } from 'antd-mobile'
import styles from './index.less'
export default function Index(props){
    /***
     * back 返回事件
     * title 标题
     */
    return(
        <div className={styles.mobile_wrapper}>
            <NavBar onBack={props.back} style={{'--height': '2rem'}}>{props.title}</NavBar>
            <div className={styles.mobile_body}>
                {props.children}
            </div>
        </div>
    )
}