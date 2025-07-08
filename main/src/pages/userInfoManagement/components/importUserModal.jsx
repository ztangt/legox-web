import { connect } from 'dva';
import { useState, useEffect } from 'react'
import { Modal, Input, Button, message, Form, Row, Col, Upload } from 'antd';
import _ from "lodash";
import styles from '../../userInfoManagement/index.less';
import IUpload from '../../../componments/Upload/uploadModal';
import GlobalModal from '../../../componments/GlobalModal';
let tempInterval = null;
function importUserModal({ dispatch, onCancel, importData, currentNode, needfilepath, fileExists, fileName,md5FilePath,getFileMD5Message,fileFullPath }) {
    const [excelVal, setExcelVal] = useState('');
    // 导入物理表
    function doUpload(options) {
        const { onSuccess, onError, file } = options;
        setExcelVal(file.name)
        const importFormData = new FormData();
        importFormData.append('fileType', 'userInfoMg');
        importFormData.append('file', file);
        dispatch({
            type: 'userInfoManagement/uploaderFile',
            payload: {
                importFormData,
            },
            callback: (fileStorageId) => {
                dispatch({
                    type: 'userInfoManagement/getDownFileUrl',
                    payload: {
                        fileStorageId
                    },
                    callback: (fileurl) => {
                        dispatch({
                            type: 'userInfoManagement/importUser',
                            payload: {
                                fileurl,
                                platFormType: 'DESIGN_PLATFORM'
                            },
                            callback: (importId) => {
                                tempInterval = setInterval(() => {
                                    dispatch({
                                        type: 'userInfoManagement/importUserResult',
                                        payload: {
                                            importId
                                        },
                                        callback: (suceess, data) => {
                                            if (suceess) {
                                                if (data.data.status == 'DONE') {
                                                    message.success('导入完成');
                                                    dispatch({
                                                        type: 'tree/getOrgChildren',
                                                        payload: {
                                                            nodeType: 'DEPT',
                                                            start:1,
                                                            limit:200
                                                        },
                                                        pathname: '/userInfoManagement',
                                                    })
                                                    dispatch({
                                                        type: 'userInfoManagement/updateStates',
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
                })
            }
        })
    }

    function beforeUpload(file) {
        let name = file.name.split('.');
        let isXlsx = name[name.length - 1] === 'xlsx';
        if(!isXlsx){
            message.error('导入的格式不是xlsx格式');
        }
        return isXlsx
    }

    useEffect(() => {
        // 如果文件存在于minio中 单位导入，单位下面不能导入部门
        if (fileExists || fileExists === false) {
          setExcelVal(fileName);
          dispatch({
            type: 'userInfoManagement/importUser',
            payload: {
              fileurl: fileExists?getFileMD5Message.fileFullPath:fileFullPath&&fileFullPath,
            },
            callback: (importId) => {
                tempInterval = setInterval(() => {
                    dispatch({
                        type: 'userInfoManagement/importUserResult',
                        payload: {
                            importId
                        },
                        callback: (success, data) => {
                            if (success) {
                                if (data.data.status == 'DONE') {
                                    message.success('导入完成');

                                    dispatch({
                                        type: 'tree/getOrgTree',
                                        payload: {
                                            parentId:'',
                                            orgKind:'ORG_',
                                            searchWord:'',
                                        },
                                        pathname: '/userInfoManagement',
                                    })
                                    dispatch({
                                        type: 'userInfoManagement/updateStates',
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
          // 重置fileExists（fileExists的值只有在true或false时才有用）
          dispatch({
            type: 'userInfoManagement/updateStates',
            payload: {
              fileExists: ''
            }
          });
        }
    }, [fileExists]);

    return (
        <GlobalModal
            title={'导入'}
            visible={true}
            // width={550}
            widthType={2}
            incomingHeight={300}
            incomingWidth={550}
            onCancel={onCancel}
            maskClosable={false}
            centered
            mask={false}
            footer={[
                <Button onClick={onCancel}>
                    关闭
                </Button>,
            ]}
            getContainer={() =>{
                return document.getElementById('userInfo_container')||false
            }}
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
                            <Input value={excelVal} style={{width:330}}/>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        {/* <Upload customRequest={doUpload.bind(this)} showUploadList={false} beforeUpload={beforeUpload} accept='.xlsx'>
                            <Button>导入</Button>
                        </Upload> */}
                        <IUpload
                          typeName={currentNode.nodeName}
                          nameSpace='userInfoManagement'
                          mustFileType='xlsx'
                          requireFileSize={5}
                          buttonContent={<Button>导入</Button>}
                          beforeCondition={currentNode.key}
                          beforeConditionMessage='请选择一个类别'
                          uploadSuccess={(filePath,fileFullPath)=>{
                            dispatch({
                                type: 'userInfoManagement/updateStates',
                                payload: {
                                    fileFullPath
                                }
                              });
                          }}
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
        </GlobalModal>
    )
}



export default (connect(({userInfoManagement}) => ({
    ...userInfoManagement
}))(importUserModal));
