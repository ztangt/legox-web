const yesOrNo = ['否', '是'];

export const curYear = new Date().getFullYear();
const nextYear = curYear + 1;
const afterYear = curYear + 2;
export const dateList = [
    { label: `${curYear}年`, value: curYear },
    { label: `${nextYear}年`, value: nextYear },
    { label: `${afterYear}年`, value: afterYear },
];
export const getColumns = (isTop = true, shwoDownloadhandle) => {
    if (isTop) {
        return [
            {
                title: '序号',
                width: 50,
                dataIndex: 'index',
                render: (text, record, index) => index + 1,
                // fixed: 'left',
            },
            {
                title: '项目名称',

                dataIndex: 'projectName',
            },
            {
                title: '项目编码',

                dataIndex: 'projectCode',
            },
            {
                title: '操作',

                dataIndex: 'action',
                render: (text, record) => (
                    <a
                        onClick={() => {
                            shwoDownloadhandle(record);
                        }}
                    >
                        下载
                    </a>
                ),
            },
        ];
    } else {
        return [
            {
                title: '合同名称',

                dataIndex: 'contractName',
            },
            {
                title: '合同编码',

                dataIndex: 'contractNumber',
            },
            {
                title: '所属项目名称',

                dataIndex: 'projectName',
            },
            {
                title: '所属项目编码',

                dataIndex: 'projectCode',
            },
            {
                title: '操作',
                dataIndex: 'action',
                render: (text, record) => (
                    <a
                        onClick={() => {
                            shwoDownloadhandle(record);
                        }}
                    >
                        下载
                    </a>
                ),
            },
        ];
    }
};
