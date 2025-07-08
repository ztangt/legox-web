import { connect } from 'dva';
import { useState, useEffect} from 'react'
import { Modal, Input, Button, message, Form, Row, Col, Upload } from 'antd';
import _ from "lodash";
import styles from '../../organization/index.less';
import IUpload from '../../../componments/Upload/uploadModal';
let tempInterval = null;
function importModal({ dispatch, searchObj,onCancel,tabNum,importData,fileExists,fileName,md5FilePath ,needfilepath,fileFullPath,getFileMD5Message}) {
    const pathname = '/organization';
    const { orgCenterId,organizationId} = searchObj[pathname];
    const [excelVal, setExcelVal] = useState('');
    useEffect(() => {
        // 如果文件存在于minio中 单位导入，单位下面不能导入部门
        if ((fileExists || fileExists === false)&&needfilepath) {
          setExcelVal(fileName);
          if (tabNum == 2) {
            dispatch({
                type: 'organization/importPost',
                payload: {
                    fileurl: needfilepath,
                    tenantId:organizationId,
                },
                callback: (importId) => {
                    tempInterval = setInterval(() => {
                        dispatch({
                            type: 'organization/importPostResult',
                            payload: {
                                importId
                            },
                            callback: (suceess, data) => {
                                if (suceess) {
                                    if (data.data.status == 'DONE') {
                                        message.success('导入完成');
                                        dispatch({
                                            type: 'organization/updateStates',
                                            payload: {
                                                importData: data.data
                                            }
                                        })
                                        clearInterval(tempInterval);
                                    }
                                } else {
                                    message.error(data.msg);
                                    clearInterval(tempInterval);
                                }
                            }
                        })
                    }, 1500);
                }
            })
        }
          // 重置fileExists（fileExists的值只有在true或false时才有用）
          dispatch({
            type: 'organization/updateStates',
            payload: {
              fileExists: ''
            }
          });
        } 
    }, [fileExists]);
    // 导入物理表
    function doUpload(options) {
        const { onSuccess, onError, file } = options;
        setExcelVal(file.name)
        const importFormData = new FormData();
        importFormData.append('fileType', tabNum == 1 ? 'userInfoMg' : 'postMg');
        importFormData.append('file', file);
        message.info('导入中')
        dispatch({
            type: 'organization/uploaderFile',
            payload: {
                importFormData,
            },
            callback: (fileStorageId) => {
                dispatch({
                    type: 'organization/getDownFileUrl',
                    payload: {
                        fileStorageId
                    },
                    callback: (fileurl) => {
                        if (tabNum == 1) {
                            dispatch({
                                type: 'organization/importUser',
                                payload: {
                                    fileurl,
                                    platFormType: 'CLOUD_PLATFORM'
                                },
                                callback: (importId) => {
                                    tempInterval = setInterval(() => {
                                        dispatch({
                                            type: 'organization/importUserResult',
                                            payload: {
                                                importId
                                            },
                                            callback: (suceess, data) => {
                                                if (suceess) {
                                                    if (data.data.status == 'DONE') {
                                                        message.success('导入完成');
                                                        dispatch({
                                                            type: 'organization/updateStates',
                                                            payload: {
                                                                importData: data.data
                                                            }
                                                        })
                                                        clearInterval(tempInterval);
                                                    }
                                                } else {
                                                    message.error(data.msg);
                                                    clearInterval(tempInterval);
                                                }
                                            }
                                        })
                                    }, 1500);
                                }
                            })
                        } else {
                            dispatch({
                                type: 'organization/importPost',
                                payload: {
                                    fileurl
                                },
                                callback: (importId) => {
                                    tempInterval = setInterval(() => {
                                        dispatch({
                                            type: 'organization/importPostResult',
                                            payload: {
                                                importId
                                            },
                                            callback: (suceess, data) => {
                                                if (suceess) {
                                                    if (data.data.status == 'DONE') {
                                                        message.success('导入完成');
                                                        dispatch({
                                                            type: 'organization/updateStates',
                                                            payload: {
                                                                importData: data.data
                                                            }
                                                        })
                                                        clearInterval(tempInterval);
                                                    }
                                                } else {
                                                    message.error(data.msg);
                                                    clearInterval(tempInterval);
                                                }
                                            }
                                        })
                                    }, 1500);
                                }
                            })
                        }
                    }
                })
            }
        })
    }



    return (
        <Modal
            title={tabNum == 1 ? '用户导入' : '岗位导入'}
            visible={true}
            width={550}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            getContainer={() =>{
                return document.getElementById('organization_container');
            }}
            footer={[
                <Button onClick={onCancel}>
                    关闭
                </Button>,
            ]}

        >
            <div className={styles.wrap_box}>
                <Row>
                    <Col span={20}>
                        <Form.Item
                            label="选择excel"
                            name=""
                        >
                            {
                                console.log(excelVal)
                            }
                            <Input value={excelVal} />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        {/* <Upload customRequest={doUpload.bind(this)} showUploadList={false}>
                            <Button>导入</Button>
                        </Upload> */}
                         <IUpload
                        //   typeName={currentNode.nodeName}
                          nameSpace='organization'
                          mustFileType='xlsx,xls'
                          requireFileSize={5}
                          buttonContent={<Button>导入</Button>}
                        //   beforeCondition={currentNode.key}
                          beforeConditionMessage='请选择一个类别'
                        />
                    </Col>
                </Row>
                <Form>
                    <fieldset className={styles.opinionDomain}>
                        <legend className={styles.opinionDomain_legend}>导入结果</legend>
                        <Row>
                            <Col>
                                <Form.Item
                                    label="总记录数"
                                    name="recordCount"
                                >
                                    <span>{JSON.stringify(importData) != '{}' ? Number(importData.errorLineCount) + Number(importData.successLineCount) : '0'}</span>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Item
                                    label="成功"
                                    name="recordSucCount"
                                >
                                    <span>{JSON.stringify(importData) != '{}' ? importData.successLineCount : '0'}</span>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Item
                                    label="失败"
                                    name="recordFailCount"
                                >
                                    <span>{JSON.stringify(importData) != '{}' ? importData.errorLineCount : '0'}</span>
                                </Form.Item>
                            </Col>
                            <Col push={2}>
                                <Form.Item
                                    label=""
                                    name=""
                                >
                                    <Button onClick={() => {
                                        if (importData.resultAttachmentUrl) {
                                            window.open(importData.resultAttachmentUrl)
                                        }
                                    }}>导出失败记录</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </fieldset>
                </Form>
            </div >
        </Modal>
    )
}



export default (connect(({ organization, layoutG, loading }) => ({
    ...organization,
    ...layoutG,
    loading
}))(importModal));