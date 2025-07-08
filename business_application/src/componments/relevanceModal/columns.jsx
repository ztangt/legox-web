import styles from './relevanceModal.less';
export function renderCol(orgUserType,removeOnClick){
  const usersCol = [
    {
      title: '姓名',
      dataIndex: 'userName',
      ellipsis: true,
      width:'80px',
      render: text=><div className={styles.text} title={text}>{text}</div>
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
      ellipsis: true,
      render: text=><div className={styles.text} title={text}>{text?text.split('>')[text.split('>').length-1]:""}</div>
    },
    {
      title: '所属单位',
      dataIndex: 'orgName',
      ellipsis: true,
      render: text=>{
        let arrTexts = text?text.split('>'):[];
        let newText = '';
        if(arrTexts.length){
          newText = arrTexts[arrTexts.length-1];
        }
        return (
          <div className={styles.text} title={newText}>{newText}</div>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      ellipsis: true,
      width:80,
      fixed:'right',
      render: (text,record)=>{return <a onClick={removeOnClick.bind(this,record.identityId,'identityId')}>删除</a>}
    },
  ];
  const userGsCol = [
    {
      title: '姓名',
      dataIndex: 'nodeName',
      ellipsis: true,
      render: text=><div className={styles.text} title={text}>{text}</div>
    },
    {
      title: '描述',
      dataIndex: 'ugDesc',
      ellipsis: true,
      render: text=><div className={styles.text} title={text}>{text}</div>
    },
    {
      title: '操作',
      dataIndex: 'operation',
      ellipsis: true,
      width:80,
      fixed:'right',
      render: (text,record)=>{return <a onClick={removeOnClick.bind(this,record.nodeId,'nodeId')}>删除</a>}
    },
  ];
  const postsCol = [
    {
      title: '岗位',
      dataIndex: 'nodeName',
      ellipsis: true,
      render: text=><div className={styles.text} title={text}>{text}</div>
    },
    {
      title: '所属单位',
      dataIndex: 'orgName',
      ellipsis: true,
      render: text=><div className={styles.text} title={text}>{text}</div>
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
      ellipsis: true,
      render: text=><div className={styles.text} title={text}>{text}</div>
    },
    {
      title: '操作',
      dataIndex: 'operation',
      ellipsis: true,
      width:80,
      fixed:'right',
      render: (text,record)=>{return <a onClick={removeOnClick.bind(this,record.nodeId,'nodeId')}>删除</a>}
    },
  ];
  const orgsCol = [
    {
      title: '单位',
      dataIndex: 'nodeName',
      ellipsis: true,
      render: text=><div className={styles.text} title={text}>{text}</div>
    },
    {
      title: '上级单位',
      dataIndex: 'parentName',
      ellipsis: true,
      render: text=><div className={styles.text} title={text}>{text}</div>
    },
    {
      title: '操作',
      dataIndex: 'operation',
      ellipsis: true,
      width:80,
      fixed:'right',
      render: (text,record)=>{return <a onClick={removeOnClick.bind(this,record.nodeId,'nodeId')}>删除</a>}
    },
  ];
  const deptsCol = [
    {
      title: '部门',
      dataIndex: 'nodeName',
      ellipsis: true,
      render: text=><div className={styles.text} title={text}>{text}</div>
    },
    {
      title: '上级部门',
      dataIndex: 'parentName',
      ellipsis: true,
      render: text=><div className={styles.text} title={text}>{text}</div>
    },
    {
      title: '操作',
      dataIndex: 'operation',
      ellipsis: true,
      width:80,
      fixed:'right',
      render: (text,record)=>{return <a onClick={removeOnClick.bind(this,record.nodeId,'nodeId')}>删除</a>}
    },
  ];
  const roleCol = [
    {
      title: '角色',
      dataIndex: 'roleName',
      ellipsis: true,
      render: text=><div className={styles.text} title={text}>{text}</div>
    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      ellipsis: true,
      render: text=><div className={styles.text} title={text}>{text}</div>
    },
    {
      title: '操作',
      dataIndex: 'operation',
      ellipsis: true,
      width:80,
      fixed:'right',
      render: (text,record)=>{return <a onClick={removeOnClick.bind(this,record.id,'id')}>删除</a>}
    },
  ];
  const organizationCol = [
    {
      title: '名称',
      dataIndex: 'nodeName',
      ellipsis: true,
      render: text=><div className={styles.text} title={text}>{text}</div>
    },
    {
      title: '操作',
      dataIndex: 'operation',
      ellipsis: true,
      width:80,
      fixed:'right',
      render: (text,record)=>{return <a onClick={removeOnClick.bind(this,record.nodeId,'nodeId')}>删除</a>}
    },
  ]
  if(orgUserType=='USER'){
    return usersCol;
  }else if(orgUserType=='USERGROUP'){
    return userGsCol
  }else if(orgUserType=='ORG'){
    return orgsCol;
  }else if(orgUserType=='POST'){
    return postsCol
  }else if(orgUserType=='DEPT'){
    return deptsCol
  }else if(orgUserType=='RULE'){
    return roleCol
  }else if(orgUserType=='ORGANIZATION'){
    return organizationCol;
  }else{
    return null;
  }
}
//orgUserType == 'ORG' || orgUserType == 'DEPT' ||  orgUserType == 'POST' ||  orgUserType == 'USER_GROUP'
