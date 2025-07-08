import { connect } from 'dva';
import { useState, useEffect } from 'react';
import { Input, Button, message, Form, Row, Col, Progress, Spin } from 'antd';
import IUpload from '../../../componments/Upload/uploadModal';
import GlobalModal from '../../../componments/GlobalModal';
import styles from './importModal.less';
import _ from 'lodash';
import { formatSeconds } from '../../../util/util';

let tempInterval = null;
let timerInterval = null;

function importModal({
  location,
  dispatch,
  onCancel,
  refreshList,
  importType,
  bizSolId,
  listId,
  usedYear,
  needfilepath,
  fileExists,
  fileName,
  importLoading,
  stateObj,
}) {
  
  const { cutomHeaders } = stateObj;
  const formModelingName = `formModeling${bizSolId}${listId}`;

  const [times, setTimes] = useState(0);
  const [excelVal, setExcelVal] = useState('');
  const [importData, setImportData] = useState({});

  useEffect(() => {
    // 如果文件存在于minio中
    if (fileExists || fileExists === false) {
      setExcelVal(fileName);
      // 记录请求开始时间
      var startTime = new Date();
      dispatch({
        type: 'dynamicPage/importExcel',
        payload: {
          bizSolId,
          importFileUrl: needfilepath,
          importType: importType,
          usedYear,
          cutomHeaders,
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

          tempInterval = setInterval(() => {
            dispatch({
              type: 'dynamicPage/refreshImportExcel',
              payload: {
                importId,
                // bizSolId,
                // importType,
                // cutomHeaders,
              },
              callback: (success, data) => {
                if (success) {
                  if (data.data.status == 'DONE') {
                    dispatch({
                      type: 'dynamicPage/updateStates',
                      payload: {
                        importLoading: false,
                      },
                    });
                    setImportData(data.data);
                    message.success('导入完成');
                    refreshList();
                    clearInterval(tempInterval);
                    clearInterval(timerInterval);
                  } else if (data.data.status == 'DOING') {
                    setImportData(data.data);
                  }
                } else {
                  clearInterval(tempInterval);
                  clearInterval(timerInterval);
                  setImportData({});
                  dispatch({
                    type: 'dynamicPage/updateStates',
                    payload: {
                      importLoading: false,
                    },
                  });
                  message.error(data.msg);
                }
              },
            });
          }, 1500);
        },
      });
      // 重置fileExists（fileExists的值只有在true或false时才有用）
      dispatch({
        type: 'dynamicPage/updateStates',
        payload: {
          fileExists: '',
        },
      });
    }
  }, [fileExists]);

  return (
    <GlobalModal
      title={'导入'}
      visible={true}
      widthType={1}
      onCancel={onCancel}
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return document.getElementById(formModelingName) || false;
      }}
      footer={[<Button onClick={onCancel}>关闭</Button>]}
    >
      <div className={styles.wrap_box}>
        <Row>
          <Col span={20}>
            <Form.Item label="选择excel" name="excel">
              {console.log(excelVal)}
              <Input value={excelVal} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <IUpload
              location={location}
              nameSpace="dynamicPage"
              mustFileType="xlsx,xls"
              requireFileSize={5}
              buttonContent={<Button type="primary" disabled={importLoading}>导入</Button>}
            />
          </Col>
        </Row>
        <Form>
          <fieldset className={styles.opinionDomain}>
            <legend className={styles.opinionDomain_legend}>导入结果</legend>
            <Row>
              <Col>
                <Form.Item label="导入耗时" name="times">
                  <span>{times}</span>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Item label="总记录数" name="recordCount">
                  <span>
                    {JSON.stringify(importData) != '{}'
                      ? Number(importData?.errorLineCount) +
                        Number(importData?.successLineCount)
                      : '0'}
                  </span>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Item label="成功" name="recordSucCount">
                  <span>
                    {JSON.stringify(importData) != '{}'
                      ? importData?.successLineCount
                      : '0'}
                  </span>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Item label="失败" name="recordFailCount">
                  <span>
                    {JSON.stringify(importData) != '{}'
                      ? importData?.errorLineCount
                      : '0'}
                  </span>
                </Form.Item>
              </Col>
              <Col push={2}>
                <Form.Item label="" name="err">
                  <Button
                    type="primary"
                    disabled={importLoading}
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
    </GlobalModal>
  );
}

export default connect(({ dynamicPage }) => ({
  ...dynamicPage,
}))(importModal);
