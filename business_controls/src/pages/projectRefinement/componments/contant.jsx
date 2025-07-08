module.exports = {
  BIZASSOCLIGIC: {
    projectCategoryCode: 'FT100017',
    projectTypeCode: 'FT100012',
    funcSubjectCode: 'FT100010',
  },
  projectColumns: {
    0: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 60,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '项目名称',
        dataIndex: 'OBJ_NAME',
        key: 'OBJ_NAME',
        render: (text, record, index) => (
          <p className="table_ellipsis" title={text}>
            {text}
          </p>
        ),
      },
      {
        title: '项目代码',
        dataIndex: 'OBJ_CODE',
        key: 'OBJ_CODE',
      },
      {
        title: '项目单位',
        dataIndex: 'PROJECT_ORG_NAME_',
        key: 'PROJECT_ORG_NAME_',
      },
      {
        title: '项目负责人',
        dataIndex: 'PROJECT_LEADER_NAME_',
        key: 'PROJECT_LEADER_NAME_',
      },
      {
        title: '功能科目',
        dataIndex: 'FUNC_SUBJECT_NAME',
        key: 'FUNC_SUBJECT_NAME',
      },
    ],
    1: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 60,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '项目名称',
        dataIndex: 'OBJ_NAME',
        key: 'OBJ_NAME',
        render: (text, record, index) => (
          <p className="table_ellipsis" title={text}>
            {text}
          </p>
        ),
      },
      {
        title: '项目代码',
        dataIndex: 'OBJ_CODE',
        key: 'OBJ_CODE',
      },
      {
        title: '项目单位',
        dataIndex: 'PROJECT_ORG_NAME_',
        key: 'PROJECT_ORG_NAME_',
      },
      {
        title: '项目金额',
        dataIndex: 'PROJECT_TOTAL_MONEY',
        key: 'PROJECT_TOTAL_MONEY',
      },
      {
        title: '项目负责人',
        dataIndex: 'PROJECT_LEADER_NAME_',
        key: 'PROJECT_LEADER_NAME_',
      },
      {
        title: '功能科目',
        dataIndex: 'FUNC_SUBJECT_NAME',
        key: 'FUNC_SUBJECT_NAME',
      },
      {
        title: '创建时间',
        dataIndex: 'TODO',
        key: 'TODO',
      },
      {
        title: '创建人',
        dataIndex: 'TODO',
        key: 'TODO',
      },
      {
        title: '状态',
        dataIndex: 'TODO',
        key: 'TODO',
      },
    ],
    2: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 60,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '项目名称',
        dataIndex: 'OBJ_NAME',
        key: 'OBJ_NAME',
        render: (text, record, index) => (
          <p className="table_ellipsis" title={text}>
            {text}
          </p>
        ),
      },
      {
        title: '项目代码',
        dataIndex: 'OBJ_CODE',
        key: 'OBJ_CODE',
      },
      {
        title: '项目单位',
        dataIndex: 'PROJECT_ORG_NAME_',
        key: 'PROJECT_ORG_NAME_',
      },
      {
        title: '项目金额',
        dataIndex: 'PROJECT_TOTAL_MONEY',
        key: 'PROJECT_TOTAL_MONEY',
      },
      {
        title: '项目负责人',
        dataIndex: 'PROJECT_LEADER_NAME_',
        key: 'PROJECT_LEADER_NAME_',
      },
      {
        title: '功能科目',
        dataIndex: 'FUNC_SUBJECT_NAME',
        key: 'FUNC_SUBJECT_NAME',
      },
      {
        title: '创建时间',
        dataIndex: 'TODO',
        key: 'TODO',
      },
      {
        title: '创建人',
        dataIndex: 'TODO',
        key: 'TODO',
      },
      {
        title: '编制期间',
        dataIndex: 'TODO',
        key: 'TODO',
      },
      {
        title: '办理状态',
        dataIndex: 'TODO',
        key: 'TODO',
      },
    ],
  },
};
