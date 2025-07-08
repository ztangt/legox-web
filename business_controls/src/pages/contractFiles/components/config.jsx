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
  contractTypeOptions,
  openFormDetail,
}) => {
  return {
    rowKey: 'ID',
    columns: [
      {
        title: '序号',
        dataIndex: 'key',
        width: 80,
        render: (text, record, index) => {
          record.sourceBizSolId = record.SOL_ID;
          return (
            <a
              onClick={() => openFormDetail({}, {}, record.BIZ_ID, record, 'Y')}
            >
              {index + 1}
            </a>
          );
        },
      },
      {
        title: '合同编号',
        dataIndex: 'CONTRACT_NUMBER',
        ellipsis: true,
        render: (text, record, index) => {
          record.sourceBizSolId = record.SOL_ID;
          return (
            <a
              onClick={() => openFormDetail({}, {}, record.BIZ_ID, record, 'Y')}
            >
              {text}
            </a>
          );
        },
      },
      {
        title: '合同名称',
        dataIndex: 'CONTRACT_NAME',
        ellipsis: true,
      },
      {
        title: '合同金额',
        dataIndex: 'TOTAL_MONEY',
        width: 100,
        render: (text, record, index) => {
          return <span>{Number(text).toFixed(2)}</span>;
        },
      },
      {
        title: '签订日期',
        dataIndex: 'CONTRACT_SIGN_DATE',
        width: 100,
        render: (text, record, index) => {
          return <span>{dataFormat(text)}</span>;
        },
      },
      {
        title: '合同验收日期',
        dataIndex: 'CHECK_TIME',
        width: 120,
        render: (text, record, index) => {
          return <span>{dataFormat(text)}</span>;
        },
      },
      {
        title: '合同类型',
        dataIndex: 'CONTRACT_TYPE_TLDT_',
        width: 100,
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
        title: '申请部门',
        dataIndex: 'REGISTER_DEPT_NAME_',
        width: 100,
      },
      {
        title: '申请人',
        dataIndex: 'REGISTER_IDENTITY_NAME_',
        width: 100,
      },
      {
        title: '文档附件',
        dataIndex: 'operation',
        width: 100,
        fixed: 'right',
        render: (text, record, index) => {
          return (
            <a
              onClick={() => {
                dispatch({
                  type: 'contractFiles/updateStates',
                  payload: {
                    contractId: record.ID,
                  },
                });
                console.log('record', record);
                setDetailModelVis(true);
              }}
            >
              查看
            </a>
          );
        },
      },
    ],
    // scroll: { y: 'calc(100vh - 400px)' },
    pagination: false,
  };
};

export const tableDetailColumns = ({
  handleDownload,
  getFileList,
  openFormDetail,
}) => {
  return {
    rowKey: 'bizSolId',
    columns: [
      {
        title: '序号',
        dataIndex: 'key',
        width: 80,
        render: (text, record, index) => <div>{index + 1}</div>,
      },
      {
        title: '业务应用名称',
        dataIndex: 'sourceMenuName',
        ellipsis: true,
      },
      {
        title: '相关事项名称',
        dataIndex: 'bizTitle',
        ellipsis: true,
        render: (text, record, index) => {
          return (
            <div>{text}</div>
            // <a
            //   onClick={() =>
            //     openFormDetail(
            //       {},
            //       {},
            //       record.fjName[0]?.list[0].bizInfoId,
            //       record,
            //       'Y',
            //     )
            //   }
            // >
            // </a>
          );
        },
      },
      {
        title: '附件名称',
        dataIndex: 'fjName',
        width: 330,
        ellipsis: true,
        render: (text, record, index) => {
          return (
            <div>
              {text.map((item) => {
                return (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      marginTop: '10px',
                    }}
                  >
                    <span>{item.label}</span>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginLeft: '20px',
                      }}
                    >
                      {(item?.list || []).map((i) => {
                        return (
                          <a
                            onClick={() => {
                              console.log(i.fileUrl);
                              let link = document.createElement('a');
                              link.href = i.fileUrl;
                              link.download = i.fileName;
                              if (i.fileUrl.indexOf('?') === -1) {
                                i.fileUrl += '?download';
                              }
                              link.click();
                              link.remove();
                            }}
                          >
                            {i.fileName}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 80,
        render: (text, record, index) => {
          // const { fjName, bizTitle } = record;

          const { filePaths, zipName } = getFileList([record]);
          console.log(filePaths);
          return (
            <a
              onClick={() => {
                handleDownload({
                  filePaths,
                  zipName,
                });
              }}
            >
              下载
            </a>
          );
        },
      },
    ],
    scroll: { y: 'calc(100vh - 300px)' },
    pagination: false,
  };
};
