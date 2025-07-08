// 督办快报
import React, { useEffect, useState, useRef } from 'react';
import { Button, message } from 'antd';
import { connect } from 'dva';
import Tabs from '../../../../components/tabs';
import ImportModalReport from '../reportImportModal';
import { timeStampFormat } from '../../../../util/util';
import styles from './index.less';

const ReportComponent = (props) => {
    const { dispatch, executionDynamics, tabsKey, levelTwoTabKey, pickerTime } = props;
    const { currentNode } = executionDynamics;

    // modal弹窗
    const [importModalShow, setImportModalShow] = useState(false);

    // 导入
    const onImport = () => {
        if (Object.keys(currentNode).length == 0) {
            message.error('请选择左侧树');
            return;
        }
        if (!pickerTime) {
            message.error('请选择日期');
            return;
        }
        setImportModalShow(true);
    };

    // 在线预览
    const onLinePreview = () => {
        message.error('暂不支持预览');
        return;
    };
    // 下载
    const download = () => {
        if (Object.keys(currentNode).length == 0) {
            message.error('请选择左侧树');
            return;
        }

        const current = JSON.parse(currentNode.json);
        dispatch({
            type: 'executionDynamics/downloadSuperReport',
            payload: {
                querySubType: levelTwoTabKey,
                objCode: current.OBJ_CODE,
                objName: current.OBJ_NAME,
                nccGroupPk: current.PK_ORG,
                nccGroupCode: current.PK_GROUP,
                supervisionTime: pickerTime || timeStampFormat(new Date().getTime()),
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
    };
    // 关闭
    const handelCancel = () => {
        setImportModalShow(false);
    };
    // 确认
    const handelConfirm = (value) => {
        handelCancel();
    };
    // 获取上传后的数据，并上传到服务端
    const uploadSuccessFn = (filePath, fileFullPath) => {
        const current = JSON.parse(currentNode.json);
        dispatch({
            type: 'executionDynamics/postSuperReportImport',
            payload: {
                filePath,
                queryType: tabsKey,
                querySubType: levelTwoTabKey,
                objCode: current.OBJ_CODE,
                objName: current.OBJ_NAME,
                nccGroupPk: current.PK_ORG,
                nccGroupCode: current.PK_GROUP,
                supervisionTime: pickerTime || '',
            },
        });
    };
    return (
        <div className="_margin_left_8">
            <Tabs {...props.tabs}></Tabs>
            <div className={styles.center_right}>
                <Button className="_margin_right_8" onClick={onLinePreview}>
                    在线预览
                </Button>
                <Button className="_margin_right_8" onClick={onImport}>
                    导入
                </Button>
                <Button onClick={download}>下载</Button>
            </div>
            <Tabs key={new Date()} {...props.tabsAll}></Tabs>
            {importModalShow && (
                <ImportModalReport
                    handelCancel={handelCancel}
                    handelConfirm={handelConfirm}
                    uploadSuccessFn={uploadSuccessFn}
                />
            )}
        </div>
    );
};

export default connect(({ executionDynamics }) => ({ executionDynamics }))(ReportComponent);
