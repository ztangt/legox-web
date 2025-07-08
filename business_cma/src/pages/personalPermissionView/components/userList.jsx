import { Button, Input } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination.jsx';

const UserList = ({ dispatch, personalPermissionView }) => {
    const { searchWord, currentHeight, currentPage, returnCount, limit, orgId, userList, isInit } =
        personalPermissionView;
    //跳转
    const goNext = () => {
        historyPush({
            pathname: `/business_application/meteorological`,
            query: {
                title: '管理单位授权',
                microAppName: 'business_cma',
                url: 'manageUnit',
                mainTableId: dayjs().unix(),
            },
        });
    };

    //保存搜索关键字
    const changeSearchWord = (e) => {
        dispatch({
            type: 'personalPermissionView/updateStates',
            payload: {
                searchWord: e.target.value,
            },
        });
    };

    //搜索
    const onSearch = () => {
        getList(1);
    };

    //修改分页
    const changePage = (nextPage, size) => {
        dispatch({
            type: 'personalPermissionView/updateStates',
            payload: {
                limit: size,
            },
        });
        getList(nextPage, size);
    };

    //获取列表
    const getList = (start, size) => {
        dispatch({
            type: 'personalPermissionView/getUserListFun',
            payload: {
                searchWord: searchWord,
                orgId: orgId,
                start: start,
                limit: size ? size : limit,
                type: 'SELF_AND_CHILD', //本级含以下
            },
        });
    };

    const columns = [
        {
            title: '序号',
            width: 60,
            render: (text, record, index) => index + 1,
        },
        {
            title: '姓名',
            dataIndex: 'userName',
        },
        {
            title: '部门',
            dataIndex: 'deptName',
        },
        {
            title: '岗位',
            dataIndex: 'postName',
            render: (text, record) => (
                <div>
                    {record.isMainPost == '1'
                        ? `${text ? text : ''}【主岗】`
                        : record.isMainPost == '0'
                        ? `${text ? text : ''}【兼职】`
                        : ''}
                    {record.isLeavePost == 1 ? '【离岗】' : ''}
                </div>
            ),
        },
        {
            title: '查看',
            width: 80,
            render: (text, record) => (
                <span className={'primaryColor'} onClick={() => goSetView(record)}>
                    查看
                </span>
            ),
        },
    ];

    const goSetView = (info) => {
        console.log(info, '---->info', dayjs().unix());
        historyPush({
            pathname: `/business_application/meteorological`,
            query: {
                title: `${info.userName}权限设置查看`,
                microAppName: 'business_cma',
                url: `permissionSetView/${info.identityId}`,
                identityId: info.identityId,
                userName: info.userName,
                userId: info.userId,
            },
        });
    };

    return (
        <div className={'width_100 po_re height_100'}>
            <div className={'flex flex_justify_end width_100 pt10 pb10'} id={'personalPermissionView_list_head'}>
                <Button onClick={goNext} className={'mr20'}>
                    批量授权
                </Button>
                <Input style={{ width: '300px' }} placeholder={'请输入关键字'} onChange={changeSearchWord} />
                <Button className={'ml10'} onClick={onSearch}>
                    查询
                </Button>
            </div>

            <ColumnDragTable
                listHead={'personalPermissionView_list_head'}
                rowKey={'id'}
                taskType="MONITOR"
                tableLayout="fixed"
                modulesName="personalPermissionView"
                scroll={{ y: currentHeight }}
                dataSource={userList}
                pagination={false}
                showSorterTooltip={false}
                columns={columns}
                bordered
            />
            <IPagination
                current={currentPage}
                total={returnCount}
                onChange={changePage}
                pageSize={limit}
                isRefresh={true}
                refreshDataFn={() => {
                    isInit && getList(1);
                }}
            />
        </div>
    );
};

export default connect(({ personalPermissionView }) => ({
    personalPermissionView,
}))(UserList);
