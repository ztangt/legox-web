const yesOrNo = ['否', '是'];

export const curYear = new Date().getFullYear();
const nextYear = curYear + 1;
const afterYear = curYear + 2;
export const dateList = [
    { label: `${curYear}年`, value: curYear },
    { label: `${nextYear}年`, value: nextYear },
    { label: `${afterYear}年`, value: afterYear },
];
export const getColumns = (pageId, formYear, isSub) => {
    console.log(pageId, formYear, isSub, 'pageId, formYear, isSub');

    let arrMore =
        pageId > 2 || isSub
            ? [
                  {
                      title: '单位编码',
                      width: 200,
                      dataIndex: 'targetBudgetOrgCode',
                  },
                  {
                      title: '单位名称',
                      width: 200,
                      dataIndex: 'targetBudgetOrgName',
                  },
              ]
            : [];
    let firArr = [
        {
            title: '序号',
            width: 100,
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            fixed: 'left',
        },
        {
            title: '是否已下发',
            width: 100,
            dataIndex: 'isControlDispatched',
            render: (text, record) => yesOrNo[record.isControlDispatched],
        },
    ];
    return firArr.concat(arrMore).concat([
        {
            title: '一级项目',
            width: 200,
            dataIndex: 'firstProjectName',
        },
        {
            title: '功能科目',
            width: 200,
            dataIndex: 'functionalSubjectName',
        },
        {
            title: '二级项目',
            children: [
                {
                    title: '项目名称',
                    width: 200,
                    dataIndex: 'secondProjectName',
                },
                {
                    title: '项目类型',
                    width: 160,
                    dataIndex: 'projectTypeTldt',
                },
                {
                    title: '基建属性',
                    width: 200,
                    dataIndex: 'isInfrastructureProjectTldt',
                    render: (text, record) => yesOrNo[record.isInfrastructureProjectTldt],
                },
                {
                    title: '是否横向标识',
                    width: 120,
                    dataIndex: 'isHorizontalProjectTldt',
                    render: (text, record) => yesOrNo[record.isHorizontalProjectTldt],
                },
            ],
        },
        {
            title: '子项目',
            width: 200,
            dataIndex: 'subProjectName',
        },
        {
            title: '一下控制数',
            children: [
                {
                    title: `${formYear}年预算控制数`,
                    width: 180,
                    render: (text, record) => (
                        <div>
                            <div>{record.sumCurrentBudgetControlAmount}</div>
                            {record.summation ? (
                                <div className={'antd_primary_color fb'}>合计：{record.summation}</div>
                            ) : null}
                        </div>
                    ),
                },
                {
                    title: `${formYear + 1}年支出计划`,
                    width: 180,
                    dataIndex: 'nextYearExpenditurePlan',
                },
                {
                    title: `${formYear + 2}年支出计划`,
                    width: 180,
                    dataIndex: 'futureYear2ExpenditurePlan',
                },
            ],
        },
        {
            title: '是否纳入财政部三年支出计划',
            width: 220,
            render: (text, record) => yesOrNo[record.isIncludedInTreasury3yrPlan],
        },
        {
            title: '备注',
            width: 200,
            dataIndex: 'memo',
        },
    ]);
};
