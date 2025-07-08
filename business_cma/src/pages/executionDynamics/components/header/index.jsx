import { Button, DatePicker, message, Modal } from 'antd';
import { connect } from 'dva';
import { useRef, useState } from 'react';
import Tabs from '../../../../components/tabs';
import { timeStampFormat } from '../../../../util/util';
import ImportModal from '../importModal';
import styles from './index.less';
const { confirm } = Modal;
const { RangePicker } = DatePicker;

const HeaderCom = (props) => {
    const [importShow, setImportShow] = useState(false); // 导入弹窗
    const getRefs = useRef({});
    // 导出
    const exportDefault = () => {
        const { dispatch } = props;
        console.log('pickerTime', props.pickerTime, timeStampFormat(new Date().getTime()));
        confirm({
            title: '确定要导出吗',
            mask: false,
            getContainer: () => {
                return (
                    document.getElementById(
                        'dom_container-panel-/business_cma/executionDynamics/executiveNotification',
                    ) || false
                );
            },
            onOk: () => {
                dispatch({
                    type: 'executionDynamics/exportWordReport',
                    payload: {
                        endDate: props.pickerTime || timeStampFormat(new Date().getTime()),
                    },
                    callback(path) {
                        if (!path) {
                            return;
                        }
                        // 这里的文件名根据实际情况从响应头或者url里获取
                        const a = document.createElement('a');
                        a.href = path;
                        a.click();
                    },
                });
            },
        });
    };
    // 导入
    const importDefault = () => {
        setImportShow(true);
    };
    // 发布
    const publishFn = () => {
        const { dispatch } = props;
        confirm({
            title: '确定要发布吗',
            mask: false,
            getContainer: () => {
                return (
                    document.getElementById(
                        'dom_container-panel-/business_cma/executionDynamics/executiveNotification',
                    ) || false
                );
            },
            onOk: () => {
                dispatch({
                    type: 'executionDynamics/publishExportWordRelease',
                    payload: {
                        endDate: props.pickerTime || timeStampFormat(new Date().getTime()),
                    },
                });
            },
        });
    };
    // 弹窗关闭
    const onCancel = () => {
        const { dispatch } = props;
        setImportShow(false);
        dispatch({
            type: 'executionDynamics/updateStates',
            payload: {
                fileName: '',
            },
        });
    };
    // confirm 确定
    const onConfirm = () => {
        getRefs.current.submit();
    };
    // finish
    const callback = (value) => {
        const { dispatch } = props;
        if (!value.filePath) {
            message.error('请选择上传文件');
            return;
        }
        if (!value.dataDate) {
            message.error('请选择日期');
            return;
        }
        console.log('string', value, timeStampFormat(new Date(value.dataDate).getTime()));
        const dateTime = timeStampFormat(new Date(value.dataDate).getTime());
        dispatch({
            type: 'executionDynamics/importReportNotification',
            payload: {
                temporary: value.temporary,
                type: value.dataStatus,
                dataTime: dateTime,
                filePath: value.filePath,
            },
            callback() {
                onCancel();
            },
        });
    };

    return (
        <div className="_margin_left_8">
            <Tabs {...props.tabs}></Tabs>
            <div className={styles.picker}>
                <DatePicker {...props.datePicker} />
                <Button onClick={exportDefault} className={styles.port}>
                    导出
                </Button>
                <Button onClick={importDefault} className={styles.port}>
                    导入
                </Button>
                <Button onClick={publishFn} className={styles.port}>
                    发布
                </Button>
            </div>
            {importShow && (
                <ImportModal callback={callback} getRefs={getRefs} onCancel={onCancel} onConfirm={onConfirm} />
            )}
        </div>
    );
};
export default connect(({ executionDynamics }) => ({ executionDynamics }))(HeaderCom);
