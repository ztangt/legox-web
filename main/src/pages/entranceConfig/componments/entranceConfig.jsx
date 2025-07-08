import { connect } from 'dva';
import { Input, Button, message, Modal, Table } from 'antd';
import styles from './entranceConfig.less';
import React from 'react'
class EntranceConfig extends React.Component {
    render() {
        return (
            <div>
                入口配置
            </div>
        )
    }
}
export default connect(({ entranceConfig, loading }) => ({
    ...entranceConfig,
    loading,
}))(EntranceConfig);
