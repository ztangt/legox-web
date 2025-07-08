import { connect } from 'dva';
import { Space, Modal, Input, message, Form } from 'antd';
import { useEffect, useState } from 'react';
import { REQUEST_SUCCESS } from '../../../service/constant';
import ITree from '../../../componments/public/iTree';
import curStyles from './notification.less';
import { FormOutlined, PlusOutlined, MinusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import pinyinUtil from '../../../util/pinyinUtil'
import GlobalModal from '../../../componments/GlobalModal';
function NoticeTypeModal({ dispatch, notification, getNoticeList }) {
    const { noticeTypeList, noticeTypeId, noticeName, isRelease, startTime, endTime, currentPage, limit } = notification
    const [form] = Form.useForm()
    const [showModal, setShowModal] = useState(false);//展示弹窗
    const [record, setRecord] = useState(null)
    const layouts = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    const treeCategorList = [{
        noticeTypeName: '全部分类',
        id: '',
        children: noticeTypeList ? noticeTypeList : null
    }];
    console.log(treeCategorList, 'treeCategorList');
    useEffect(() => {
        if (limit > 10) {
            getNoticeList(noticeName, isRelease, startTime, endTime, 1, limit, noticeTypeId)
        }
    }, [noticeTypeId])
    const titleRender = (nodeData) => {
        return (
            <div className={curStyles.tree_title}>
                <div style={{ display: 'inline-block' }}>{nodeData.title}</div>
                <div className={curStyles.hover_opration}>
                    {nodeData.id != '' ? '' : <PlusOutlined onClick={addType.bind(this, '')} />}
                    {nodeData.id != '' ? <FormOutlined title="修改" onClick={addType.bind(this, nodeData)} /> : ''}
                    {nodeData.id != '' ? <MinusOutlined title="删除" onClick={delType.bind(this, nodeData.key)} /> : ''}
                </div>
            </div>
        )
    }
    const addType = (record) => {
        setShowModal(true)
        setRecord(record)
        console.log(record, 'record');
        if (record.key) {
            form.setFieldsValue({
                noticeTypeName: record.title,
                noticeTypeCode: record.code
            })
        }
    }
    const changeFormItem = (e) => {
        console.log(e.target.value, 'ashfj');
        let name = `${pinyinUtil.getFirstLetter(e.target.value)}`
        console.log(name, 'name--');
        form.setFieldsValue({
            noticeTypeCode: name,
        });

    }
    const checkCode = (_, value) => {
        let reg = /^[a-zA-Z][a-zA-Z0-9_]*$/;
        if (value && value.length > 50) {
            return Promise.reject(new Error('长度不能超过50!'))
        } else if (value && !reg.test(value)) {
            return Promise.reject(new Error('只能输入字母、数字、下划线，且首位必须是字母!'))
        } else {
            return Promise.resolve();
        }
    }
    const onCancel = () => {
        setShowModal(false)
        setRecord(null)
        form.resetFields()
    }
    const onOK = (values) => {
        if (!record.key) {
            console.log(values, 'values');
            dispatch({
                type: 'notification/addNoticeType',
                payload: {
                    ...values
                }
            })
            onCancel()
        } else {
            dispatch({
                type: 'notification/updateNoticeType',
                payload: {
                    noticeTypeId: record.key,
                    ...values
                }
            })
            onCancel()
        }
    }
    //删除分类
    const delType = (key) => {
        Modal.confirm({
            title: '确定删除这条类别吗？',
            icon: <ExclamationCircleOutlined />,
            content: '删除后将无法撤回',
            onOk() {
                dispatch({
                    type: 'notification/deleteNoticeType',
                    payload: {
                        noticeTypeIds: key
                    },
                });
            },
            mask: false,
            onCancel() { },
            getContainer: () => {
                return document.getElementById('notification_id') || false
            },
        });
    };
    const selectCategorInforFn = (selectedKeys, info) => {
        dispatch({
            type: 'notification/updateStates',
            payload: {
                noticeTypeId: selectedKeys[0],
                currentNoticeTypeItem: info.node
            }
        })


    }
    return (
        <div style={{ height: '100%' }}>
            {showModal && <GlobalModal
                // width={400}
                widthType={1}
                incomingWidth={400}
                incomingHeight={120}
                visible={true}
                className={curStyles.addModal}
                title={record.key ? '修改分类' : '新增分类'}
                onCancel={onCancel}
                onOk={() => { form.submit() }}
                mask={false}
                getContainer={() => {
                    return document.getElementById('notification_id') || false;
                }}
                bodyStyle={{ padding: 16 }}
            >
                <Form form={form} onFinish={onOK} {...layouts}>
                    <Form.Item name='noticeTypeName' label={'分类名称'}
                        rules={[{ required: true, message: '请输入分类名称!' }]}>
                        <Input onChange={changeFormItem.bind(this)} />
                    </Form.Item>
                    <Form.Item name='noticeTypeCode' label={'分类编码'}
                        rules={[{ required: true, message: '请输入分类编码!' },
                        { validator: checkCode }
                        ]}>
                        <Input />
                    </Form.Item>
                </Form>
            </GlobalModal>}
            <ITree
                isSearch={false}
                treeData={treeCategorList}
                onSelect={selectCategorInforFn}
                selectedKeys={noticeTypeId}
                style={{ width: 'auto' }}
                titleRender={titleRender}
                defaultExpandAll={true}
                field={{ titleName: "noticeTypeName", key: "id", children: "children" }}
            />
        </div>
    )
}
export default connect(({ notification }) => ({ notification }))(NoticeTypeModal)