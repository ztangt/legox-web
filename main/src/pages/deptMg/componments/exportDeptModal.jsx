import { connect } from 'dva';
import { useState, useEffect } from 'react'
import { Modal, Input, Button, message, Form, Row, Col, Upload, Select} from 'antd';
import _ from "lodash";
import IUpload from '../../../componments/Upload/uploadModal';
import styles from '../../postMg/index.less';
import GlobalModal from '../../../componments/GlobalModal';
const FormItem = Form.Item;
let tempInterval = null;
function exportDeptModal({ dispatch, onCancel, importData, currentNode, needfilepath, fileExists, fileName, deptIds}) {
    console.log(currentNode.newFileName, '10-------===')
    const [excelVal, setExcelVal] = useState('0');
    const [inputName, setInputName] = useState(currentNode.newFileName);
    const layouts =  {labelCol: { span: 6},wrapperCol: { span: 18}};
    function exportData() {
       if(excelVal=='1') {
         message.error('请勾选需要导出的数据！');
         return;
       }

       dispatch({
            type: 'deptMg/deptExport',
            payload: {
                orgIds: deptIds.length<1?JSON.stringify([]):deptIds.toString(), // 列表全部记录导出全部，列表选中记录则只导出选中的数据
                fileName:inputName,
                fileType:'excel',
                exportType: deptIds.length<1?1:0
            },
            callback:function(data){
                window.open(data)
            }
        });
    }
    function selectModelFn(value) {
        setExcelVal(value);
        if(value == '0') {
            dispatch({
                type: 'deptMg/updateStates',
                payload: {
                  deptIds: [],
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
        centered
        getContainer={() =>{
            return document.getElementById('deptMg_container')||false;
        }}
        footer={[
            <Button onClick={exportData}>
                导出
            </Button>,
        ]}
        >
        <Form
        {...layouts}
        >

        <Row gutter={0} >
            <Col span={24}>
                <Form.Item
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

            <Col span={24}>
                <Form.Item
                        label="文件类型"
                    >
                    <Select value={'excel'} style={{width:300}}>
                    <Select.Option>excel</Select.Option>
                    </Select>
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={0} >
            <Col span={24}>
                <Form.Item
                        label="要导出的数据"
                    >
                    <Select defaultValue={deptIds.length>0?'1':'0'} onChange={selectModelFn} style={{width:300}}>
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



export default (connect(({deptMg}) => ({
    ...deptMg
}))(exportDeptModal));
