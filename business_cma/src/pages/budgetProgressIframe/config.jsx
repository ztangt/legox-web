import { formattingMoney } from '@/util/util';
import { Progress } from 'antd';
import dayjs from 'dayjs';
const twoColors = { '0%': '#108ee9', '100%': '#87d068' };

export const getColumns = () => {
    return [
        {
            title: '报账卡（预算指标）',
            dataIndex: 'reimbCardNum',
        },
        {
            title: '子项目名称',
            dataIndex: 'subProjectName',
        },
        {
            title: '预算金额',
            dataIndex: 'allSumBudget',
            render: (text, record) => {
                return <div>{formattingMoney(text)}</div>;
            },
        },
        {
            title: '执行金额',
            dataIndex: 'executeBudgetAccount',
            render: (text, record) => {
                return <div>{formattingMoney(text)}</div>;
            },
        },
        {
            title: '执行进度（%）',
            dataIndex: 'executeBudgetRate',
            width: 360,
            render: (text, record) => {
                let percent = text * 100;
                return (
                    <div className="flex flex_align_center flex_justify_between">
                        <Progress strokeColor={twoColors} format={() => ``} percent={percent} size="small" />
                        <div>{percent}%</div>
                    </div>
                );
            },
        },
        {
            title: '序时进度（%）',
            dataIndex: 'annexType',
            width: 360,
            render: (text, record) => {
                let month = dayjs().month() + 1;
                let percent = ((month / 12) * 100).toFixed(2);
                return (
                    <div className="flex flex_align_center flex_justify_between">
                        <Progress strokeColor={twoColors} format={() => ``} percent={percent} size="small" />
                        <div>{percent}%</div>
                    </div>
                );
            },
        },
    ];
};
