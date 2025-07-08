import { dataFormat } from '../../../util/util';

export const tabsItems = [
  { label: '全部', key: '' },
  { label: '支出', key: '1' },
  { label: '收入', key: '2' },
];
// 合同类型
// export const contractTypeOptions = [
//   {
//     value: '1',
//     label: '支出',
//   },
//   {
//     value: '2',
//     label: '收入',
//   },
//   {
//     value: '3',
//     label: '其他',
//   },
// ];

// // 采购方式
// export const purchaseMethodOptions = [
//   {
//     value: '0',
//     label: '公开招标',
//   },
//   {
//     value: '1',
//     label: '邀请招标',
//   },
//   {
//     value: '2',
//     label: '竞争性谈判',
//   },
//   {
//     value: '3',
//     label: '单一来源',
//   },
//   {
//     value: '4',
//     label: '询价',
//   },
//   {
//     value: '5',
//     label: '价格谈判',
//   },
// ];

// // 合同状态
// export const contractStateOptions = [
//   {
//     value: '1',
//     label: '正常',
//   },
//   {
//     value: '2',
//     label: '解除',
//   },
//   {
//     value: '3',
//     label: '终止',
//   },
//   {
//     value: '4',
//     label: '变更中',
//   },
//   {
//     value: '5',
//     label: '解除中',
//   },
//   {
//     value: '6',
//     label: '终止中',
//   },
//   {
//     value: '7',
//     label: '验收',
//   },
// ];

export const tableColumns = ({
  setDetailModelVis,
  dispatch,
  setExecuteState,
  purchaseMethodOptions,
  contractTypeOptions,
  contractStateOptions,
  setContractNum,
}) => {
  return {
    rowKey: 'ID',
    columns: [
      {
        title: '序号',
        dataIndex: 'key',
        width: 80,
        render: (text, record, index) => <div>{index + 1}</div>,
      },
      {
        title: '合同编号',
        dataIndex: 'CONTRACT_NUMBER',
        width: 100,
        ellipsis: true,
      },
      {
        title: '合同名称',
        dataIndex: 'CONTRACT_NAME',
        width: 100,
        ellipsis: true,
      },
      {
        title: '甲方',
        dataIndex: 'PARTY_A',
        width: 100,
        ellipsis: true,
      },
      {
        title: '乙方',
        dataIndex: 'PARTY_B',
        width: 100,
        ellipsis: true,
      },
      {
        title: '申请部门',
        dataIndex: 'REGISTER_DEPT_NAME_',
        width: 100,
        ellipsis: true,
      },
      {
        title: '申请人',
        dataIndex: 'REGISTER_IDENTITY_NAME_',
        width: 100,
        ellipsis: true,
      },
      {
        title: '合同签订日期',
        dataIndex: 'CONTRACT_SIGN_DATE',
        width: 100,
        ellipsis: true,
        render: (text, record, index) => {
          return <span>{dataFormat(text)}</span>;
        },
      },
      {
        title: '合同类型',
        dataIndex: 'CONTRACT_TYPE_TLDT_',
        width: 100,
        ellipsis: true,
        render: (text, record, index) => {
          let str = '';
          contractTypeOptions.forEach((item) => {
            if (item.value === text) {
              str = item.label;
            }
          });

          return <span>{str}</span>;
        },
      },
      {
        title: '采购方式',
        dataIndex: 'PURCHASE_METHOD_TLDT_',
        width: 100,
        ellipsis: true,
        render: (text, record, index) => {
          let str = '';
          purchaseMethodOptions.forEach((item) => {
            if (item.value === text) {
              str = item.label;
            }
          });

          return <span>{str}</span>;
        },
      },
      {
        title: '合同金额',
        dataIndex: 'TOTAL_MONEY',
        width: 100,
        ellipsis: true,
        render: (text, record, index) => {
          return <span>{Number(text).toFixed(2)}</span>;
        },
      },
      {
        title: '合同剩余金额',
        dataIndex: 'BALANCE_MONEY',
        width: 100,
        ellipsis: true,
        render: (text, record, index) => {
          return <span>{Number(text).toFixed(2)}</span>;
        },
      },
      {
        title: '执行金额',
        dataIndex: 'ALREADY_MONEY',
        width: 100,
        ellipsis: true,
        render: (text, record, index) => {
          return (
            <a
              onClick={() => {
                setContractNum(record.CONTRACT_NUMBER);
                setExecuteState(record.ID);
              }}
            >
              {text ? Number(text).toFixed(2) : ''}
            </a>
          );
        },
      },
      {
        title: '执行比例',
        dataIndex: 'PAY_PLAN',
        width: 100,
        ellipsis: true,
        render: (text, record, index) => {
          if (Number(text) > 0) {
            return <span>{`${(Number(text) * 100).toFixed(2)}%`}</span>;
          } else {
            return null;
          }
        },
      },
      {
        title: '合同状态',
        dataIndex: 'CONTRACT_STATE_TLDT_',
        width: 100,
        ellipsis: true,
        render: (text, record, index) => {
          let str = '';
          contractStateOptions.forEach((item) => {
            if (item.value === text) {
              str = item.label;
            }
          });

          return <span>{str}</span>;
        },
      },
      {
        title: '验收日期',
        dataIndex: 'CHECK_TIME',
        width: 100,
        ellipsis: true,
        render: (text, record, index) => {
          return <span>{dataFormat(text)}</span>;
        },
      },
      {
        title: '调整记录',
        dataIndex: 'operation',
        width: 100,
        fixed: 'right',
        render: (text, record, index) => {
          return (
            <a
              onClick={() => {
                dispatch({
                  type: 'contractLedger/updateStates',
                  payload: {
                    contractId: record.ID,
                  },
                });
                setDetailModelVis(true);
              }}
            >
              查看
            </a>
          );
        },
      },
    ],
    // scroll: { y: 'calc(100vh - 400px)', x: 'max-content' },
    pagination: false,
  };
};

export const tableDetailColumns = ({ openFormDetail }) => {
  return {
    rowKey: 'ID',
    columns: [
      {
        title: '序号',
        dataIndex: 'key',
        width: 80,
        render: (text, record, index) => <div>{index + 1}</div>,
      },
      {
        title: '说明',
        dataIndex: 'history',
        render: (text, record, index) => {
          return (
            text && (
              <div style={{ width: '100%' }}>
                <div>
                  <a
                    onClick={() =>
                      openFormDetail({}, {}, record.sourceBizId, record, 'new')
                    }
                  >
                    {record.sourceBizTitle}
                  </a>
                </div>

                {JSON.parse(text).map((item) => {
                  console.log('item.columnName', item.columnName);
                  if (item.columnName === '执行比例') {
                    return (
                      <div>
                        <span>{item.columnName}: </span>
                        <span>{`${(Number(item.fromVal) * 100).toFixed(
                          2,
                        )}% -> `}</span>
                        <span>{`${(Number(item.toVal) * 100).toFixed(
                          2,
                        )}%`}</span>
                      </div>
                    );
                  } else if (item.columnName.includes('金额')) {
                    return (
                      <div>
                        <span>{item.columnName}: </span>
                        <span>{`${Number(item.fromVal).toFixed(2)} -> `}</span>
                        <span>{`${Number(item.toVal).toFixed(2)}`}</span>
                      </div>
                    );
                  } else {
                    return (
                      <div>
                        <span>{item.columnName}: </span>
                        <span>{`${item.fromVal} -> `}</span>
                        <span>{item.toVal}</span>
                      </div>
                    );
                  }
                })}
              </div>
            )
          );
        },
      },
      {
        title: '业务类型',
        dataIndex: 'sourceMenuName',
        width: 150,
        ellipsis: true,
      },
      {
        title: '操作人',
        dataIndex: 'registerIdentityName',
        width: 100,
      },
      {
        title: '操作时间',
        dataIndex: 'createTime',
        width: 100,
        render: (text, record, index) => {
          return <span>{dataFormat(text)}</span>;
        },
      },
      {
        title: '调整前数据',
        dataIndex: 'operation',
        width: 100,
        render: (text, record, index) => {
          if (record.sourceMenuName.includes('合同变更')) {
            return <a>查看</a>;
          } else {
            return '-';
          }
        },
      },
      {
        title: '调整后数据',
        dataIndex: 'operation',
        width: 100,
        render: (text, record, index) => {
          if (record.sourceMenuName.includes('合同变更')) {
            return <a>查看</a>;
          } else {
            return '-';
          }
        },
      },
    ],
    scroll: { y: 'calc(100vh - 450px)', x: 'max-content' },
    pagination: false,
  };
};

export const tableExecuteColumns = ({ openFormDetail }) => {
  return {
    rowKey: 'ID',
    columns: [
      {
        title: '序号',
        dataIndex: 'key',
        width: 80,
        render: (text, record, index) => (
          <a
            onClick={() =>
              openFormDetail({}, {}, record.sourceBizId, record, 'new')
            }
          >
            {index + 1}
          </a>
        ),
      },
      {
        title: '标题',
        dataIndex: 'sourceBizTitle',
        render: (text, record, index) => {
          return (
            <a
              onClick={() =>
                openFormDetail({}, {}, record.sourceBizId, record, 'new')
              }
            >
              {text}
            </a>
          );
        },
      },
      {
        title: '单据号',
        dataIndex: 'documentNumber',
      },
      {
        title: '单据类型',
        dataIndex: 'sourceMenuName',
      },
      {
        title: '金额',
        dataIndex: 'thisPayMoney',
        render: (text, record, index) => {
          return <span>{Number(text).toFixed(2)}</span>;
        },
      },
      {
        title: '登记人',
        dataIndex: 'registerIdentityName',
      },
      {
        title: '登记部门',
        dataIndex: 'registerDeptName',
      },
      {
        title: '登记时间',
        dataIndex: 'createTime',
        render: (text, record, index) => {
          return <span>{dataFormat(text)}</span>;
        },
      },
    ],
    scroll: { y: 'calc(100vh - 300px)', x: 'max-content' },
    pagination: false,
  };
};
