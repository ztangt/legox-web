import { Button, Col, Form, Input, message, Modal, Row, Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import IUpload from '../Upload/uploadModal';
import styles from './importModal.less';

let tempInterval = null;
function importModal({
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
    const [excelVal, setExcelVal] = useState('');

    useEffect(() => {
        // 如果文件存在于minio中
        if (fileExists || fileExists === false) {
            setExcelVal(fileName);
            dispatch({
                type: 'budgetTarget/importExcel',
                payload: {
                    bizSolId,
                    importFileUrl: needfilepath,
                    importType: importType,
                    usedYear,
                },
                callback: (importId) => {
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
                                            payload: {
                                                importLoading: false,
                                            },
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
                                    }
                                } else {
                                    dispatch({
                                        type: 'budgetTarget/updateStates',
                                        payload: {
                                            importLoading: false,
                                        },
                                    });
                                    message.error(data.msg);
                                    clearInterval(tempInterval);
                                }
                            },
                        });
                    }, 1500);
                },
            });
            // 重置fileExists（fileExists的值只有在true或false时才有用）
            dispatch({
                type: 'budgetTarget/updateStates',
                payload: {
                    fileExists: '',
                },
            });
        }
    }, [fileExists]);

    return (
        <Modal
            title={'导入'}
            open={true}
            width={550}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            getContainer={() => {
                return document.getElementById('budgetTarget_cma_id') || false;
            }}
            footer={[<Button onClick={onCancel}>关闭</Button>]}
        >
            <Spin spinning={importLoading} tip="导入中......">
                <div className={styles.wrap_box}>
                    <Row>
                        <Col span={20}>
                            <Form.Item label="选择excel" name="">
                                {console.log(excelVal)}
                                <Input value={excelVal} />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <IUpload
                                // typeName={currentNode.nodeName}
                                nameSpace="budgetTarget"
                                mustFileType="xlsx,xls"
                                requireFileSize={5}
                                buttonContent={<Button>导入</Button>}
                            />
                        </Col>
                    </Row>
                    <Form>
                        <fieldset className={styles.opinionDomain}>
                            <legend className={styles.opinionDomain_legend}>导入结果</legend>
                            <Row>
                                <Col>
                                    <Form.Item label="总记录数" name="recordCount">
                                        <span>
                                            {JSON.stringify(importData) != '{}'
                                                ? Number(importData.errorLineCount) +
                                                  Number(importData.successLineCount)
                                                : '0'}
                                        </span>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Item label="成功" name="recordSucCount">
                                        <span>
                                            {JSON.stringify(importData) != '{}' ? importData.successLineCount : '0'}
                                        </span>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Item label="失败" name="recordFailCount">
                                        <span>
                                            {JSON.stringify(importData) != '{}' ? importData.errorLineCount : '0'}
                                        </span>
                                    </Form.Item>
                                </Col>
                                <Col push={2}>
                                    <Form.Item label="" name="">
                                        <Button
                                            onClick={() => {
                                                if (importData.resultAttachmentUrl) {
                                                    window.open(importData.resultAttachmentUrl);
                                                }
                                            }}
                                        >
                                            导出失败记录
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </fieldset>
                    </Form>
                </div>
            </Spin>
        </Modal>
    );
}

export default connect(({ budgetTarget }) => ({
    ...budgetTarget,
}))(importModal);
