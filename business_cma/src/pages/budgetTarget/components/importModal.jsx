import GlobalModal from '@/components/GlobalModal';
import { Button, Col, Form, Input, message, Row } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import IUpload from '../../../components/Upload/uploadModal';
import { formatSeconds } from '../../../util/util';
import styles from '../index.less';
let tempInterval = null;
let timerInterval = null;

function Index({
    dispatch,
    onCancel,
    refreshList,
    importData,
    importType,
    importLoading,
    bizSolId,
    usedYear,
    needfilepath,
    fileExists,
    fileName,
}) {
    // 耗时
    const [times, setTimes] = useState(0);
    const [excelVal, setExcelVal] = useState('');

    useEffect(() => {
        // 如果文件存在于minio中
        if (fileExists || fileExists === false) {
            setExcelVal(fileName);
            // 记录请求开始时间
            var startTime = new Date();
            dispatch({
                type: 'budgetTarget/importExcel',
                payload: {
                    bizSolId,
                    importFileUrl: needfilepath,
                    importType: importType,
                    usedYear,
                },
                callback: (importId) => {
                    // 使用setInterval每秒更新一次显示
                    timerInterval = setInterval(function () {
                        // 获取当前时间
                        let currentTime = new Date();
                        // 计算已经过去的时间
                        let elapsedTime = currentTime - startTime;
                        // 将耗时转换为更易读的格式
                        let seconds = Math.floor(elapsedTime / 1000);
                        // 在页面中显示耗时
                        setTimes(formatSeconds(seconds));
                    }, 1000); // 每秒更新一次

                    //  refresh接口
                    tempInterval = setInterval(() => {
                        dispatch({
                            type: 'budgetTarget/refreshImportExcel',
                            payload: {
                                importId,
                                // bizSolId,
                                // importType: importType,
                            },
                            callback: (success, data) => {
                                if (success) {
                                    if (data.data.status == 'DONE') {
                                        dispatch({
                                            type: 'budgetTarget/updateStates',
                                            payload: { importLoading: false },
                                        });
                                        message.success('导入完成');
                                        refreshList();
                                        dispatch({
                                            type: 'budgetTarget/updateStates',
                                            payload: {
                                                importData: data.data,
                                            },
                                        });
                                        clearInterval(tempInterval);
                                        clearInterval(timerInterval);
                                        // 大量数据导入 DOING状态下  每导入1000条会给返回count
                                    } else if (data.data.status == 'DOING') {
                                        dispatch({
                                            type: 'budgetTarget/updateStates',
                                            payload: {
                                                importData: data.data,
                                            },
                                        });
                                    }
                                } else {
                                    dispatch({
                                        type: 'budgetTarget/updateStates',
                                        payload: { importLoading: false },
                                    });
                                    message.error(data.msg);
                                    clearInterval(tempInterval);
                                    clearInterval(timerInterval);
                                }
                            },
                        });
                    }, 1500);
                },
            });
            // 重置fileExists（fileExists的值只有在true或false时才有用）
            dispatch({
                type: 'budgetTarget/updateStates',
                payload: { fileExists: '' },
            });
        }
    }, [fileExists]);

    return (
        <GlobalModal
            title={'导入'}
            open={true}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            getContainer={() => {
                return document.getElementById('budgetTarget_cma_id') || false;
            }}
            modalSize="smallBigger"
            footer={[<Button onClick={onCancel}>关闭</Button>]}
        >
            <div className="flex flex_align_start flex_justify_between">
                <Form.Item label="选择excel" name="" style={{ width: '80%' }}>
                    <Input value={excelVal} />
                </Form.Item>
                <IUpload
                    nameSpace="budgetTarget"
                    mustFileType="xlsx,xls"
                    requireFileSize={5}
                    buttonContent={<Button disabled={importLoading}>导入</Button>}
                />
            </div>
            <Form>
                <fieldset className={styles.opinionDomain}>
                    <legend className={styles.opinionDomain_legend}>导入结果</legend>
                    <Row>
                        <Col>
                            <Form.Item label="导入耗时" name="recordCount">
                                <span>{times}</span>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Item label="总记录数" name="recordCount">
                                <span>
                                    {importData?.successLineCount
                                        ? Number(importData.errorLineCount) + Number(importData.successLineCount)
                                        : '0'}
                                </span>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Item label="成功" name="recordSucCount">
                                <span>{importData?.successLineCount ? importData.successLineCount : '0'}</span>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Item label="失败" name="recordFailCount">
                                <span>{importData?.errorLineCount ? importData.errorLineCount : '0'}</span>
                            </Form.Item>
                        </Col>
                        <Col push={2}>
                            <Form.Item label="" name="">
                                <Button
                                    disabled={importLoading}
                                    onClick={() => {
                                        if (importData.resultAttachmentUrl) {
                                            window.open(importData.resultAttachmentUrl);
                                        }
                                    }}
                                >
                                    导入失败记录
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </fieldset>
            </Form>
        </GlobalModal>
    );
}

export default connect(({ budgetTarget }) => ({
    ...budgetTarget,
}))(Index);
