import { connect } from 'dva';
import { Input, Button, message, Modal, Table } from 'antd';
import styles from './iconConfig.less';
import React from 'react'
class IconConfig extends React.Component {
    render() {
        return (
            <div>
                图标配置
            </div>
        )
    }
}
export default connect(({ iconConfig, loading }) => ({
    ...iconConfig,
    loading,
}))(IconConfig);
