import { Tabs } from 'antd';
import styles from './index.less';
const TabsCom = (props) => {
    return (
        <div className={styles.tabs}>
            <Tabs {...props}></Tabs>
        </div>
    );
};

export default TabsCom;
