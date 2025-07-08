import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import SearchLine from './searchLine';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import { BASE_WIDTH } from '../../../util/constant';
import { timeStamp } from '../../../util/util';
import GrantModal from './grant'; // 发放弹窗
import styles from '../index.less';

const CheckProvideAndSell = ({ dispatch, checkProvide, layoutG }) => {
    const [isShowHighSearch, setIsShowHighSearch] = useState(false);
    const [selectRowKey, setSelectRowKey] = useState({});
    const { modalShow } = layoutG;
    const { currentHeight, limit, returnCount, currentPage } = checkProvide;
    console.log('currentHeight', currentHeight);

    useEffect(() => {
        dispatch({
            type: 'layoutG/updateStates',
            payload: {
                modalShow: false,
            },
        });
    }, []);

    const list = [
        {
            yhName: '广发银行股份有限公司北京中关村支行',
            zph: '00101',
            yhzh: '1000006',
            zplb: '1',
            lysj: '2022-10-20',
            dwName_: '发展规划院',
            zpzt: '1',
            id: '4316c784-1dbf-4a1b-9b5c-decc52b756581',
            lyrName_: '测试用户',
        },
        {
            yhName: '广发银行股份有限公司北京中关村支行',
            zph: '00101',
            yhzh: '1000006',
            zplb: '1',
            lysj: '2022-10-20',
            dwName_: '发展规划院',
            zpzt: '1',
            id: '4316c784-1dbf-4a1b-9b5c-decc52b756582',
            lyrName_: '测试用户',
        },
        {
            yhName: '广发银行股份有限公司北京中关村支行',
            zph: '00101',
            yhzh: '1000006',
            zplb: '1',
            lysj: '2022-10-22',
            dwName_: '发展规划院',
            zpzt: '2',
            id: '4316c784-1dbf-4a1b-9b5c-decc52b756583',
            lyrName_: '测试用户',
        },
        {
            yhName: '广发银行股份有限公司北京中关村支行',
            zph: '00101',
            yhzh: '1000006',
            zplb: '1',
            lysj: '2022-10-22',
            dwName_: '发展规划院',
            zpzt: '1',
            id: '4316c784-1dbf-4a1b-9b5c-decc52b756584',
            lyrName_: '测试用户',
        },
        {
            yhName: '广发银行股份有限公司北京中关村支行',
            zph: '00101',
            yhzh: '1000006',
            zplb: '1',
            lysj: '2022-10-21',
            dwName_: '发展规划院',
            zpzt: '1',
            id: '4316c784-1dbf-4a1b-9b5c-decc52b756558',
            lyrName_: '测试用户',
        },
        {
            yhName: '广发银行股份有限公司北京中关村支行',
            zph: '00101',
            yhzh: '1000006',
            zplb: '1',
            lysj: '2022-10-20',
            dwName_: '发展规划院',
            zpzt: '2',
            id: '4316c784-1dbf-4a1b-9b5c-decc52b756568',
            lyrName_: '测试用户',
        },
        {
            yhName: '广发银行股份有限公司北京中关村支行',
            zph: '00101',
            yhzh: '1000006',
            zplb: '1',
            lysj: '2022-10-20',
            dwName_: '发展规划院',
            zpzt: '2',
            id: '4316c784-1dbf-4a1b-9b5c-decc52b756578',
            lyrName_: '测试用户',
        },
        {
            yhName: '广发银行股份有限公司北京中关村支行',
            zph: '00101',
            yhzh: '1000006',
            zplb: '1',
            lysj: '2022-10-22',
            dwName_: '发展规划院',
            zpzt: '2',
            id: '4316c784-1dbf-4a1b-9b5c-decc52b756858',
            lyrName_: '测试用户',
        },
        {
            yhName: '广发银行股份有限公司北京中关村支行',
            zph: '00101',
            yhzh: '1000006',
            zplb: '1',
            lysj: '2022-10-22',
            dwName_: '发展规划院',
            zpzt: '1',
            id: '4316c784-1dbf-4a1b-9b5c-decc52b756589',
            lyrName_: '测试用户',
        },
        {
            yhName: '广发银行股份有限公司北京中关村支行',
            zph: '00101',
            yhzh: '1000006',
            zplb: '1',
            lysj: '2022-10-21',
            dwName_: '发展规划院',
            zpzt: '1',
            id: '4316c784-1dbf-4a1b-9b5c-decc52b756158',
            lyrName_: '测试用户',
        },
    ];
    const tableProps = {
        rowKey: 'id',
        columns: [
            {
                title: '序号',
                dataIndex: 'number',
                width: 60,
            },
            {
                title: '单位名称',
                dataIndex: 'dwName_',
                width: BASE_WIDTH * 1.5,
                sorter: (a, b) => a.dwName_.length - b.dwName_.length,
                render: (text) => (
                    <div className={styles.titleName} title={text}>
                        {text}
                    </div>
                ),
            },
            {
                title: '支票号',
                dataIndex: 'zph',
                sorter: (a, b) => a.zph - b.zph,
            },
            {
                title: '支票状态',
                dataIndex: 'zpzt',
                sorter: (a, b) => a.zpzt - b.zpzt,
                render: (text) => <div>{text.zpzt == 1 ? '已入库未使用' : '已领用未使用'}</div>,
            },
            {
                title: '领用人',
                dataIndex: 'lyrName_',
                sorter: (a, b) => a.lyrName_.length - b.lyrName_.length,
            },
            {
                title: '领用时间',
                dataIndex: 'lysj',
                sorter: (a, b) => timeStamp(a.lysj) - timeStamp(b.lysj),
            },
            {
                title: '银行',
                dataIndex: 'yhName',
                sorter: (a, b) => a.yhName.length - b.yhName.length,
                width: BASE_WIDTH * 2,
                render: (text) => (
                    <div className={styles.titleName} title={text}>
                        {text}
                    </div>
                ),
            },
            {
                title: '银行账户',
                dataIndex: 'yhzh',
                sorter: (a, b) => a.yhzh - b.yhzh,
            },
            {
                title: '类别',
                dataIndex: 'zplb',
                sorter: (a, b) => a.zplb - b.zplb,
                render: (text) => <div>{text == 1 ? '现金' : '转账'}</div>,
            },
        ],
        dataSource:
            list &&
            list.length > 0 &&
            list.map((item, index) => {
                item.number = index + 1;
                return item;
            }),
        pagination: false,
        bordered: true,
        showSorterTooltip: false,
    };
    // 高级显隐
    const showHigherForm = (isShow) => {
        setIsShowHighSearch(!isShow);
    };
    // 基础搜索
    const baseFindCallback = (value, list) => {
        console.log('basevalue', value);
    };
    // 高级搜索
    const higherFindCallback = (value, list) => {
        console.log('highvalue', value);
    };
    // 关闭
    const onCancel = () => {
        dispatch({
            type: 'layoutG/updateStates',
            payload: {
                modalShow: false,
            },
        });
    };
    const changePage = (nextPage, size) => {};
    // const rowSelectionObj = {
    //   selectedRowKeys: selectRowKeys,
    //   onChange: (selectedRowKeys, selectedRows) => {
    //     console.log("selectRowKeys",selectRowKeys)
    //     setSelectRowKeys(selectedRowKeys);
    //     // dispatch({
    //     //   type: `${nameSpace}/updateStates`,
    //     //   payload: {
    //     //     selectedRowKeys
    //     //   }
    //     // })
    //   }
    // }
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectRowKey(selectedRows);
        },
    };
    const getGrantModalFn = () => {
        dispatch({
            type: '',
            payload: {},
        });
    };
    return (
        <div className="common_container" id="dom_container_cma">
            <div className="_padding_left_right_16">
                <SearchLine
                    selectRowKey={selectRowKey}
                    higherFindCallback={higherFindCallback}
                    baseFindCallback={baseFindCallback}
                    showHigherForm={showHigherForm}
                />
            </div>
            <div className={styles.tableList}>
                <ColumnDragTable
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    isShowHighSearch={isShowHighSearch}
                    taskType="MONITOR"
                    tableLayout="fixed"
                    key={isShowHighSearch}
                    {...tableProps}
                    className={styles.table}
                    modulesName="checkProvide"
                    scroll={{ y: currentHeight, x: list.length > 0 ? '1600px' : 'auto' }}
                />
            </div>
            <IPagination
                current={Number(currentPage)}
                total={returnCount || 1}
                onChange={changePage}
                pageSize={limit}
                isRefresh={true}
                // refreshDataFn={()=>{getMessageList(searchWord, keyWords, currentPage, limit,)}}
            />
            {modalShow && <GrantModal onCancel={onCancel} />}
        </div>
    );
};
export default connect(({ checkProvide, layoutG }) => ({
    checkProvide,
    layoutG,
}))(CheckProvideAndSell);
