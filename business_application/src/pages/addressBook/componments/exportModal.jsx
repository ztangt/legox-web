import { connect } from 'dva';
import { useState, useEffect } from 'react'
import { Modal, Input, Button, message, Form, Row, Col, Upload, Select } from 'antd';
import GlobalModal from '../../../componments/GlobalModal'
import styles from './addressList.less'
function ExportModal({ dispatch, onCancel, importData, currentNode, needfilepath, fileExists, fileName,userIds}) {
    const [form] = Form.useForm();
    const [inputName, setInputName] = useState(currentNode.newFileName);
    const [excelVal, setExcelVal] = useState('0');
    let timeStamp = Date.parse(new Date());
    const layouts = { labelCol: { span: 14 }, wrapperCol: { span: 10 } };
    // let selectData = []; // 选中数据
    // userIds.map((item) => {
    //     selectData.push(item.id);
    // })
    

    function openFile(url) {
        var link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.click();
    }
    function exportData() {
       if(excelVal=='1') {
         message.error('请勾选需要导出的数据！');
         return;
       }
        dispatch({
            type: 'addressBook/userExport',
            payload: {
                orgId: currentNode.key,
                fileName: inputName,
                fileType:'excel',
                identityIds: userIds.length<1?JSON.stringify([]):userIds.toString(),
                exportType: userIds.length<1?1:0
            },
            callback:function(data){
            window.location.href = data;
            dispatch({
                type: 'addressBook/updateStates',
                payload: {
                  isShowExportUnitModel: false,
                },
              });
            // openFile(data)
            }
        });
    }
    function selectModelFn(value) {
        setExcelVal(value);
        if(value == '0') {
            dispatch({
                type: 'addressBook/updateStates',
                payload: {
                  userIds: [],
                },
            });
        }
    }
    return (
        <GlobalModal
            title={'导出'}
            visible={true}
            widthType={5}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            getContainer={() =>{
                return document.getElementById('addressList_id')||false;
            }}
            footer={[
                <Button onClick={exportData} className={styles.footer_button}>
                    导出
                </Button>,
            ]}
            >
            <Form
            >

            <Row gutter={0} >
                <Col span={11}>
                    <Form.Item
                            {...layouts}
                            label="文件名"
                            rules={[
                                { required: true,message:'请输入单位名称',whitespace: true},
                                { max: 50,message:'最多输入50个字符'}

                            ]}
                        > 
                        <Input style={{width:300}} value={inputName} onChange={(e) => { setInputName(e.target.value) }}/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={0} >

                <Col span={11}>
                    <Form.Item 
                            label="文件类型"
                            {...layouts}
                        >
                        <Select value={'excel'} style={{width:300}}>
                        <Select.Option>excel</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={0} >
                <Col span={11}>
                    <Form.Item 
                            label="要导出的数据"
                            {...layouts}
                        >
                        <Select defaultValue={userIds.length>0?'1':'0'} onChange={selectModelFn} style={{width:300}}>
                            <Select.Option value="0">列表全部记录</Select.Option>
                            <Select.Option value="1">列表选中记录</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            </Form>
        </GlobalModal>
    )
}



export default connect(({
    addressBook,
    loading
  }) => ({
    addressBook,
    loading,
  }))(ExportModal);
