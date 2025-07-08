const indicatorConfig = {
    columns: (props) => {
        const baseArr = [
            {
                title: '报账卡号',
                dataIndex: 'reimbCardNum',
            },
            {
                title: '管控总额度',
                dataIndex: 'crBudget',
                width: 150,
            },
            {
                title: '实际可用余额',
                dataIndex: 'actualBudget',
                width: 150,
            },
            {
                title: '预算单位',
                dataIndex: 'budgetOrgName',
                width: 180,
            },
            {
                title: '资金来源',
                dataIndex: 'moneySourceTldt',
            },
            {
                title: '预算项目',
                dataIndex: 'projectName',
            },
            // {
            //     title: '当前授权',
            //     width: 100,
            //     fixed: 'right',
            //     render(text, record) {
            //         return (
            //             <a>
            //                 <span onClick={() => props.lookOver(record)}>查看</span>
            //             </a>
            //         );
            //     },
            // },
        ].map((item) => ({
            ...item,
            key: item.dataIndex,
            columnCode: item.dataIndex,
            columnName: item.title,
        }));

        // return baseArr
        return props.searchType == 1
            ? baseArr
            : [
                  ...baseArr,
                  {
                      title: '指标编码',
                      dataIndex: 'normCode',
                  },
              ].map((item) => ({
                  ...item,
                  key: item.dataIndex,
                  columnCode: item.dataIndex,
                  columnName: item.title,
              }));
    },
    departColumns: (props) => {
        let arr = [
            {
                title: '部门',
                dataIndex: 'orgName',
            },
            {
                title: '操作',
                render(record) {
                    return props.isDisabled ? (
                        ''
                    ) : (
                        <a>
                            <span onClick={() => props.delete(record)}>删除</span>
                        </a>
                    );
                },
            },
        ];
        if (props.isDisabled) {
            arr = [arr[0]];
        }
        return arr;
    },
};

export default indicatorConfig;
