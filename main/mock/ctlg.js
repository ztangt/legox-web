import { setupModules } from './index'

const {
    getSysCtlgTree,
} = setupModules

export default {
    "GET /setup/ctlg/tree": {
        code: 200,
        data: [
            {
                key: 1,
                nodeName: 'John Brown sr.',
                nodeCode: 60,
                nodeServiceNum: 'New York No. 1 Lake Park',
                createUserName: 'admin',
                createTime: 1609987896,
                nodeId: '1',
                children: [
                    {
                        key: 11,
                        nodeName: 'John Brown111111111',
                        nodeCode: 42,
                        nodeServiceNum: 'New York No. 2 Lake Park',
                        createUserName: 'admin',
                        createTime: 1609987896,
                        nodeId: '11',
                        children: []
                    },
                    {
                        key: 12,
                        nodeName: 'John Brown jr.',
                        nodeCode: 30,
                        nodeServiceNum: 'New York No. 3 Lake Park',
                        createUserName: 'admin',
                        createTime: 1609987896,
                        nodeId: '12',
                        children: [
                            {
                                key: 121,
                                nodeName: 'Jimmy Brown',
                                nodeCode: 16,
                                nodeServiceNum: 'New York No. 3 Lake Park',
                                createUserName: 'admin',
                                createTime: 1609987896,
                                nodeId: '121',
                            },
                        ],
                    },
                    {
                        key: 13,
                        nodeName: 'Jim Green sr.',
                        nodeCode: 72,
                        nodeServiceNum: 'London No. 1 Lake Park',
                        createUserName: 'admin',
                        createTime: 1609987896,
                        nodeId: '13',
                        children: [
                            {
                                key: 131,
                                nodeName: 'Jim Green',
                                nodeCode: 42,
                                nodeServiceNum: 'London No. 2 Lake Park',
                                createUserName: 'admin',
                                createTime: 1609987896,
                                nodeId: '131',
                                children: [
                                    {
                                        key: 1311,
                                        nodeName: 'Jim Green jr.',
                                        nodeCode: 25,
                                        nodeServiceNum: 'London No. 3 Lake Park',
                                        createUserName: 'admin',
                                        createTime: 1609987896,
                                        nodeId: '1311',
                                    },
                                    {
                                        key: 1312,
                                        nodeName: 'Jimmy Green sr.',
                                        nodeCode: 18,
                                        nodeServiceNum: 'London No. 4 Lake Park',
                                        createUserName: 'admin',
                                        createTime: 1609987896,
                                        nodeId: '1312'
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                key: 2,
                nodeName: 'Joe Black',
                nodeCode: 32,
                nodeServiceNum: 'Sidney No. 1 Lake Park',
                createUserName: 'admin',
                createTime: 1609987896,
                nodeId: '2'
            },
        ],

    },
    "GET /sys/org/tree": {//搜索组织机构数
        code: 200,
        data: {
            jsonResult: [
                {
                    nodeId: 23,
                    nodeName: "最高法1",
                    nodeType: "ORG",
                    isParent: 1,
                    children: [
                        {
                            nodeId: 2,
                            nodeName: "法厅机关",
                            nodeType: "ORG",
                            isParent: 1,
                            children: [
                                {
                                    nodeId: 3,
                                    nodeName: "检察院",
                                    nodeType: "ORG",
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    //获取业务应用类别树
    'GET /sys/ctlg/tree': {
        code: 200,
        msg: '',
        data: [{
            ...getSysCtlgTree(),
            children: [
                {
                    ...getSysCtlgTree(),
                    children: [
                        {
                            ...getSysCtlgTree(),
                            children: []
                        },
                    ]
                },
                {
                    ...getSysCtlgTree(),
                    children: []
                },
            ]
        }, {
            ...getSysCtlgTree(),
            children: [
                {
                    ...getSysCtlgTree(),
                },
            ]
        }, {
            ...getSysCtlgTree(),
            children: [
                {
                    ...getSysCtlgTree(),
                },
            ]
        }]
    }
}
