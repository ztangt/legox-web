import React, {useEffect, useState} from 'react'
import { connect } from 'dva'
import { Modal, Button, Form, message, Col,Row, Alert } from 'antd'
import AddDataSource from './addDataSource'
import styles from './accreditImport.less'
import IUpload from '../../../componments/Upload/uploadModal';
import { env } from '../../../../../project_config/env';
function AccreditImport({ dispatch, tenement, loading, layoutG }) {
    const pathname = '/tenement';
    const { isShowAddDataSource, fileName,errorMsg } = layoutG.searchObj[pathname];
    const [formValues, setFormValues] = useState({})
    const [fileData, setFile] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)
    const [loadingFlag, setLoadingFlag] = useState(false);
    const [redisHashKey, setRedisHashKey] = useState(null);
    const [submitAlert, setSubmitAlert] = useState({ type: '', message: '' });
    const handelCancel = () => {
        dispatch({
            type: "tenement/updateStates",
            payload: {
                isShowAccredit: false
            }
        })
    }
    const addDataSource = () => {
        dispatch({
            type: "tenement/updateStates",
            payload: {
                isShowAddDataSource: true
            }
        })
    }

  useEffect(() => {

    if(redisHashKey) {
      console.log(redisHashKey);
      let interval = setInterval(()=> {
        dispatch({
          type: 'tenement/checkTenantSolImportStatus',
          payload: {
            suffix: redisHashKey,
          },
          callback(data) {
            if(data.status === '2') {
              clearInterval(interval);
              setLoadingFlag(false);
              setSubmitAlert({
                type: 'success',
                message: data.msg || '租户授权导入成功',
              })
            }
            if(data.status === '0') {
              clearInterval(interval);
              setLoadingFlag(false);
              setSubmitAlert({
                type: 'error',
                message: data?.errorType ? <>{data.errorType}点击查看<a href={data.errorLogPath}>详细</a></> : '导入失败，请联系管理员！',
              })
            }

          }
        })
      }, 5000);
      return () => {
        clearInterval(interval);
      }
    }
  }, [redisHashKey]);

    //上传文件
    const onChangeFile = (e) => {
        const file = e.target.files[0];
        setFile(file)
        // if(!this.props.fileType.includes(file.name.split('.')[1])){
        //   message.error('请上传正确的文件格式');
        //   return;
        // }
        // const isLt = file.size / 1024 / 1024 < 2;
        // if (!isLt) {
        //   message.error(`文件大小不符，必须小于2MB`, 5);
        //   return false;
        // }
        // const formData = new FormData();
        // formData.append("file", file);
        // console.log(formData,'formData');
    }
    //导入
    const importData = () => {
        if (!fileData) {
            return message.error('请导入文件')
        }
        if (!formValues.dsName) {
            return message.error('请配置数据源')
        }
        setSubmitAlert({
          type: 'warning',
          message: '导入时间可能较长，请耐心等待！',
        })
        dispatch({
            type:'tenement/addLicenseZip',
            payload:{
              ...formValues
            },
            callback:(data)=>{
              // setIsSuccess(true)
              if(data.status == 6){
                setLoadingFlag(true);
                setRedisHashKey(formValues.dsDynamic);
              }else{
                setSubmitAlert({
                  type: 'error',
                  message: data?.errorMsg ?  '执行失败，' + data.errorMsg : '系统错误，请联系管理员',
                })
              }
            }
        })
    }
    return (
        <div>
            <Modal
                open={true}
                title='授权导入'
                footer={[
                    <Button key="cancel" onClick={handelCancel} >取消</Button>,
                ]}
                onCancel={handelCancel}
                maskClosable={false}
                mask={false}
                getContainer={() => {
                    return document.getElementById('tenement_container')
                }}
                bodyStyle={{ height: '460px' }}
                width={800}
            >
                <p className={styles.textColor}>&emsp;注：此处可进行专属云授权更新或租户授权导入：<br />&emsp;&emsp;&emsp;专属云授权更新后会自动刷新专属云授权情况；<br />&emsp;&emsp;&emsp;租户授权导入后成功会自动更新“租户管理”模块信息；</p>
                <Form labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                    <Form.Item label='第一步'>
                        更新授权文件&emsp;<input type="file" id='file' onChange={onChangeFile} onClick={(event) => { event.target.value = null }} style={{ display: 'inline-block' }} />
                        {/* <IUpload
                        nameSpace='tenement'
                        requireFileSize={50}
                        // mustFileType='xlsx,xls'
                            buttonContent={<Button>选择文件</Button>}
                        /> {fileName} */}
                    </Form.Item>
                    <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item label='第二步' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                            数据库链接配置&emsp;<Button onClick={addDataSource.bind(this)}>配置</Button>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {formValues?.dsName&&<p style={{marginLeft:'-120px',height:'32px',lineHeight:'32px',color:'rgb(165,201,63)',fontSize:'24px',}}>配置成功</p>}
                        </Col>
                    </Row>
                    <Form.Item label='第三步'>
                        <Button onClick={importData.bind(this)} loading={loading.global || loadingFlag} >授权导入确定</Button>
                    </Form.Item>
                    {isSuccess&&<Form.Item label='    ' colon={false}>
                        <p style={{color:'rgb(165,201,63)',fontSize:'24px'}}>已开始执行授权导入！</p>
                    </Form.Item>}
                    {errorMsg?<div style={{color:'red'}}>
                        错误提示：{errorMsg}
                        </div>:''}
                    {submitAlert.type && <Row gutter={16}>
                      <Col span={16} offset={4}>
                        <Alert message={submitAlert.message} type={submitAlert.type} />
                      </Col>
                    </Row>}
                </Form>
            </Modal>
            {isShowAddDataSource && <AddDataSource setFormValues={setFormValues} formValues={formValues} />}
        </div>
    )
}
export default connect(({ tenement, loading, layoutG }) => ({ tenement, loading, layoutG }))(AccreditImport)
