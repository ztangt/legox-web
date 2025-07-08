import { useState, useEffect } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  message,
  Row,
  Col,
  Alert,
  TreeSelect,
} from 'antd';
import IUpload from '../../../componments/Upload/uploadModal';
import GlobalModal from '../../../componments/GlobalModal';
import { connect } from 'umi';
const { confirm } = Modal
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function ImportModal({ dispatch, loading, applyModel }) {
  const [form] = Form.useForm();
  const { selectCtlgId, searchWord, currentPage, limit, ctlgTree, fileExists, fileName, md5FilePath } = applyModel;
  const [excelVal, setExcelVal] = useState('');
  const [submitAlert, setSubmitAlert] = useState({ type: '', message: '' });
  const [datasource, setDatasource] = useState([]);
  const [redisHashKey, setRedisHashKey] = useState(null);
  const [loadingFlag, setLoadingFlag] = useState(false);
  const [zipFilePath, setZipFilePath] = useState('');
  useEffect(() => {
    dispatch({
      type: 'applyModel/getDatasourceTree',
      payload: {
        tenantId: window.localStorage.getItem('tenantId'),
      },
      callback: (data) => {
        setDatasource(data.list);
      }
    });
  }, []);

  useEffect(() => {
    setExcelVal(fileName);
  }, [fileExists]);

  
  useEffect(() => {
    if(redisHashKey) {
      let interval = setInterval(()=> {
        dispatch({
          type: 'applyModel/checkBizSolImportStatus',
          payload: {
            redisHashKey: redisHashKey,
          },
          callback(data) {
            if(data.status != '1') {
              clearInterval(interval);
              setLoadingFlag(false);
            }
            if(data.status == '0') {
              let msg = data.msg || '服务器异常';
              setSubmitAlert({
                type: 'error',
                message: data?.errorLogPath ? <>导入失败，点击查看<a href={data.errorLogPath}>详细</a></> : '导入失败，' + msg,
              })
            }
            if(data.status == '2') {
              setSubmitAlert({
                type: 'success',
                message: data.msg || '导入成功',
              })
              refreshList();
            }
            
          }
        })
      }, 5000);
      return () => {
          clearInterval(interval);
      }
    }
  }, [redisHashKey]);



  // 刷新列表
  const refreshList =()=> {
    let ctlgId = form.getFieldValue('ctlgId');
    if (selectCtlgId == ctlgId) {
      dispatch({
        type: "applyModel/getBusinessList",
        payload: {
          ctlgId: ctlgId,
          start: currentPage,
          limit: limit,
          searchWord: searchWord
        }
      })
    } else {
      dispatch({
        type: "applyModel/updateStates",
        payload: {
          selectCtlgId: ctlgId
        }
      })
    }
  }

  const uploadSuccess = (filePath) =>{
    setZipFilePath(filePath);
  }
  
  // 关闭按钮
  const handelCanel = () => {
    // 判断在导入状态，弹出关闭提醒
    if(loading.global || loadingFlag) {
      confirm({
        title: '确认关闭吗?',
        icon: <ExclamationCircleOutlined />,
        content: '当前导入操作未完成，关闭后无法查看导入状态',
        onOk() {
          closeImportModal();
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }else {
      closeImportModal();
    }
  };

  // 关闭导入模态框
  const closeImportModal = ()=> {
    dispatch({
      type: 'applyModel/updateStates',
      payload: {
        isShowImportModal: false,
        fileExists: '',
        fileName: '',
        md5FileId: '',
        md5FilePath: ''
      },
    });
  }

  //提交
  const onFinish = values => {
    setSubmitAlert({
      type: 'warning',
      message: '导入时间可能较长，请耐心等待！',
    })
    delete (values['zipFile']);
    dispatch({
      type: 'applyModel/bizSolImport',
      payload: {
        ...values,
        zipFilePath: zipFilePath,
      },
      callback(data) {
        setLoadingFlag(true);
        setRedisHashKey(data.redisHashKey);
      },
      errorCallback(msg) {
        setSubmitAlert({
          type: 'error',
          message: '导入失败：' + msg || '系统错误，请联系管理员',
        })
      }
    })
  };

  // 表单项改变监听
  const onValuesChange = (changedValues, allValues) => {
    // console.log("changedValues", changedValues);
    // console.log("allValues", allValues);
    // setFormValue({
    //   formValue,
    //   ...allValues
    // });
    // console.log("formValue", formValue);
  };

  // 格式化类别树
  const ctlgTreeFn = tree => {
    tree.map(item => {
      item.value = item.nodeId;
      item.title = item.nodeName;
      if (item.children?.length) {
        ctlgTreeFn(item.children);
      }
    });
    return tree;
  };
  return (
    <GlobalModal
      visible={true}
      title="业务方案导入"
      maskClosable={false}
      onCancel={handelCanel}
      mask={false}
      centered
      widthType={1}
      incomingWidth={600}
      incomingHeight={200}
      bodyStyle={{padding:'8px'}}
      getContainer={() => {
        return document.getElementById('add_modal') || false;
      }}
      footer={[
        <Button key="cancel" disabled={submitAlert.type == 'warning'} onClick={handelCanel}>
          关闭
        </Button>,
        <Button key="submit" type="primary" loading={loading.global || loadingFlag} htmlType={"submit"} onClick={() => { form.submit() }}>
          导入
        </Button>
      ]}
    >
      <>
        <Form
          {...layout}
          colon={false}
          form={form}
          initialValues={{
            ctlgId: selectCtlgId,
          }}
          onFinish={onFinish.bind(this)}
          onValuesChange={onValuesChange}
        >
          <Row gutter={16}>
            <Col span={20}>
              <Form.Item
                label="应用类别"
                name="ctlgId"
                rules={[{ required: true, message: '应用类别不能为空' }]}
              >
                <TreeSelect
                  style={{ width: '300px' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={ctlgTreeFn(ctlgTree)}
                  placeholder="请选择应用类别"
                  treeDefaultExpandAll
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={20}>
              <Form.Item
                label="数据源"
                name="dsDynamic"
                rules={[{ required: true, message: '数据源不能为空' }]}>
                <Select
                  style={{ width: '300px' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  options={datasource}
                  placeholder="请选择数据源"
                  fieldNames={{ label: 'dsName', value: 'dsDynamic' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={20}>
              <Form.Item
                label="选择文件"
                name="zipFile"
                rules={[{ required: true, message: '请选择zip格式文件' }]}>
                <IUpload
                  // typeName={currentNode.nodeName}
                  nameSpace="applyModel"
                  mustFileType="zip"
                  requireFileSize={5}
                  uploadSuccess = {uploadSuccess}
                  //needfilepath={'temp/bizsol/import/' + new Date().getTime}
                  buttonContent={
                    <Input value={excelVal} style={{ width: '300px' }} />
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {submitAlert.type && <Row gutter={16}>
          <Col span={16} offset={4}>
            <Alert message={submitAlert.message} type={submitAlert.type} />
          </Col>
        </Row>}
      </>
    </GlobalModal>
  );
}
export default connect(({ applyModel, loading, layoutG }) => { return { applyModel, loading, layoutG } })(ImportModal)

