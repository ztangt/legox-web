import GlobalModal from '@/components/GlobalModal';
import { message, Modal, Table } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
const { confirm } = Modal;

const Index = ({ dispatch, permissionSetView, info, changeVisible, getList }) => {
    const [list, setList] = useState([]);
    const { activeRole, userName, roleList, identityId, userId } = permissionSetView;

    useEffect(() => {
        console.log(info, 'infoinfofinfo');
        let beyondMenuList = (info.beyondMenuList || []).map((item) => ({ name: item, type: '超权' }));
        let lackMenuList = (info.lackMenuList || []).map((item) => ({ name: item, type: '缺失' }));
        let list = [...beyondMenuList, ...lackMenuList];
        console.log(list);
        setList(list);
    }, []);

    const dealHandle = () => {
        confirm({
            title: '确认操作',
            content: '确认要处理异常吗？',
            onOk() {
                let roleName = roleList.find((item) => item.key === activeRole).roleName;
                //烦人小笋干明明可以自己查非要前端传
                let postData = {
                    roleId: activeRole, //角色id
                    roleName: roleName, //角色名称

                    identityId: identityId, //身份id
                    userName: userName, //用户名称
                    userId: userId, //用户id
                    orgId: info.orgId, //组织id
                    orgName: info.orgName, //组织名称
                    orgCode: info.orgCode, //组织编码
                    orgKind: info.orgKind, //组织类型
                };
                console.log(postData, '--->参数');
                dispatch({
                    type: 'permissionSetView/handleErrorData',
                    payload: postData,
                    callback: () => {
                        message.success('处理成功');
                        changeVisible(false);
                        getList();
                    },
                });
            },
        });
    };

    const columns = [
        {
            title: '序号',
            render: (text, record, index) => `${index + 1}`,
        },
        {
            title: '页面名称',
            dataIndex: 'name',
        },
        {
            title: '属性',
            dataIndex: 'type',
        },
    ];
    return (
        <GlobalModal
            title="权限异常处理"
            open={true}
            onCancel={() => changeVisible(false)}
            maskClosable={false}
            mask={false}
            modalSize={'middle'}
            getContainer={() => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            }}
            okText="一键处理"
            cancelText="取消"
            onOk={dealHandle}
        >
            <div>
                <div className={'g6'}>超权：与角色不符</div>
                <div className={'g6 mb10'}>缺失：缺失当前角色模块</div>
                <Table dataSource={list} rowKey={'name'} columns={columns} pagination={false} bordered />
            </div>
        </GlobalModal>
    );
};

export default connect(({ permissionSetView }) => ({
    permissionSetView,
}))(Index);
