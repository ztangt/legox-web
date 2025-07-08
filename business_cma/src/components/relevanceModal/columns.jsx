import styles from './relevanceModal.less';
export function renderCol(orgUserType, removeOnClick, isNeedActions = true) {
    const usersCol = [
        {
            title: '姓名',
            dataIndex: 'userName',
            render: (text) => (
                <div className={styles.text} title={text}>
                    {text}
                </div>
            ),
        },
        {
            title: '所属部门',
            dataIndex: 'deptName',
            render: (text) => (
                <div className={styles.text} title={text ? text.split('>')[text.split('>').length - 1] : ''}>
                    {text ? text.split('>')[text.split('>').length - 1] : ''}
                </div>
            ),
        },
        {
            title: '所属单位',
            dataIndex: 'orgName',
            render: (text) => (
                <div className={styles.text} title={text ? text.split('>')[text.split('>').length - 1] : ''}>
                    {text ? text.split('>')[text.split('>').length - 1] : ''}
                </div>
            ),
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: 100,
            render: (text, record) => {
                return (
                    <div>
                        {isNeedActions && (
                            <a onClick={removeOnClick.bind(this, record.identityId, 'identityId')}>删除</a>
                        )}
                    </div>
                );
            },
        },
    ];
    const userGsCol = [
        {
            title: '姓名',
            dataIndex: 'nodeName',
            render: (text) => (
                <div className={styles.text} title={text}>
                    {text}
                </div>
            ),
        },
        {
            title: '描述',
            dataIndex: 'ugDesc',
            render: (text) => (
                <div className={styles.text} title={text}>
                    {text}
                </div>
            ),
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: 100,
            render: (text, record) => {
                return <a onClick={removeOnClick.bind(this, record.nodeId, 'nodeId')}>删除</a>;
            },
        },
    ];
    const postsCol = [
        {
            title: '岗位',
            dataIndex: 'nodeName',
            render: (text) => (
                <div className={styles.text} title={text}>
                    {text}
                </div>
            ),
        },
        {
            title: '所属单位',
            dataIndex: 'orgName',
            render: (text) => (
                <div className={styles.text} title={text}>
                    {text}
                </div>
            ),
        },
        {
            title: '所属部门',
            dataIndex: 'deptName',
            render: (text) => (
                <div className={styles.text} title={text}>
                    {text}
                </div>
            ),
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: 100,
            render: (text, record) => {
                return <a onClick={removeOnClick.bind(this, record.nodeId, 'nodeId')}>删除</a>;
            },
        },
    ];
    const orgsCol = [
        {
            title: '单位',
            dataIndex: 'nodeName',
            render: (text) => (
                <div className={styles.text} title={text}>
                    {text}
                </div>
            ),
        },
        {
            title: '上级单位',
            dataIndex: 'parentName',
            render: (text) => (
                <div className={styles.text} title={text}>
                    {text}
                </div>
            ),
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: 100,
            render: (text, record) => {
                return <a onClick={removeOnClick.bind(this, record.nodeId, 'nodeId')}>删除</a>;
            },
        },
    ];
    const deptsCol = [
        {
            title: '部门',
            dataIndex: 'nodeName',
            render: (text) => (
                <div className={styles.text} title={text}>
                    {text}
                </div>
            ),
        },
        {
            title: '上级部门',
            dataIndex: 'parentName',
            render: (text) => (
                <div className={styles.text} title={text}>
                    {text}
                </div>
            ),
        },
        {
            title: '单位',
            dataIndex: 'orgName',
            render: (text) => (
                <div className={styles.text} title={text}>
                    {text}
                </div>
            ),
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: 100,
            render: (text, record) => {
                return <a onClick={removeOnClick.bind(this, record.nodeId, 'nodeId')}>删除</a>;
            },
        },
    ];
    const roleCol = [
        {
            title: '角色',
            dataIndex: 'roleName',
            render: (text) => (
                <div className={styles.text} title={text}>
                    {text}
                </div>
            ),
        },
        {
            title: '角色描述',
            dataIndex: 'roleDesc',
            render: (text) => (
                <div className={styles.text} title={text}>
                    {text}
                </div>
            ),
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: 100,
            render: (text, record) => {
                return <a onClick={removeOnClick.bind(this, record.id, 'id')}>删除</a>;
            },
        },
    ];
    if (orgUserType == 'USER') {
        return usersCol;
    } else if (orgUserType == 'USERGROUP') {
        return userGsCol;
    } else if (orgUserType == 'ORG') {
        return orgsCol;
    } else if (orgUserType == 'POST') {
        return postsCol;
    } else if (orgUserType == 'DEPT') {
        return deptsCol;
    } else if (orgUserType == 'RULE') {
        return roleCol;
    } else {
        return null;
    }
}
//orgUserType == 'ORG' || orgUserType == 'DEPT' ||  orgUserType == 'POST' ||  orgUserType == 'USER_GROUP'
