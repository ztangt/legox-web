import { Spin } from 'antd';
import { connect } from 'dva';
import styles from '../index.less';
import UnitTree from './unitTree';
import UserList from './userList';

const Index = ({ dispatch, personalPermissionView }) => {
    const { loading } = personalPermissionView;
    return (
        <Spin spinning={loading}>
            <div className={'flex  pl10 pr10 height_100'}>
                <div className={'pt10 width_25'} style={{ minWidth: '250px' }}>
                    <div className={styles.item_box}>
                        <UnitTree />
                    </div>
                </div>
                <div className={'ml10 flex_1'}>
                    <UserList />
                </div>
            </div>
        </Spin>
    );
};

export default connect(({ personalPermissionView }) => ({
    personalPermissionView,
}))(Index);
