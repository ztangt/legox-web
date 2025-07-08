import { Space, Table } from 'antd';
const columns = [
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: '操作',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>删除</a>
            </Space>
        ),
    },
];
const data = [
    {
        key: '1',
        name: '张三',
        age: 32,
        address: '天津',
    },
    {
        key: '2',
        name: '李四',
        age: 42,
        address: '河北',
    },
    {
        key: '3',
        name: '王五',
        age: 32,
        address: '北京',
    },
];
const App = () => <Table columns={columns} dataSource={data} />;
export default App;
