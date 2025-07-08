import GlobalModal from '@/components/GlobalModal';
import { Modal, Table, Tabs } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
const { confirm } = Modal;

const Index = ({ dispatch, permissionSetView, info, changeVisible }) => {
    const [list, setList] = useState([]);
    let [tabItems, setTabItems] = useState();

    useEffect(() => {
        console.log(info.ruleCode, 'info.ruleCode', info.searchJson);
        //获取树规则的searchJson
        dispatch({
            type: 'permissionSetView/getCustomWeightFun',
            payload: {
                dataRuleCode: info.ruleCode,
                dataRuleTypeInfo: 2,
            },
            callback: (resInfo) => {
                setTabItems([
                    { label: '列表规则', key: info.searchJson },
                    { label: '树规则', key: resInfo.searchJson },
                ]);
            },
        });

        changeTab(info.searchJson);
    }, []);

    const columns = [
        {
            title: '序号',
            render: (text, record, index) => `${index + 1}`,
        },
        {
            title: '别名',
            dataIndex: 'dbTableName',
        },
        {
            title: '字段',
            dataIndex: 'dbColumnName',
        },
        {
            title: '关系',
            dataIndex: 'relationType',
        },
        {
            title: '属性',
            dataIndex: 'propType',
        },
        {
            title: '属性值',
            dataIndex: 'propTypeValue',
        },
        {
            title: '条件',
            dataIndex: 'condition',
        },
    ];

    const changeTab = (key) => {
        dispatch({
            type: 'permissionSetView/getRuleListFun',
            payload: {
                fileStorageId: key,
            },
            callback: (resJson) => {
                setList(JSON.parse(resJson));
                console.log(JSON.parse(resJson), '??????');
            },
        });
    };
    return (
        <GlobalModal
            title="规则定义"
            open={true}
            onCancel={() => changeVisible(false)}
            maskClosable={false}
            mask={false}
            modalSize={'middle'}
            getContainer={() => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            }}
            footer={null}
        >
            <div>
                <Tabs items={tabItems} defaultActiveKey={info.searchJson} onChange={changeTab} />
                <Table
                    columns={columns}
                    dataSource={list}
                    rowKey={(record, index) => index}
                    pagination={false}
                    bordered
                />
            </div>
        </GlobalModal>
    );
};

export default connect(({ permissionSetView }) => ({
    permissionSetView,
}))(Index);
