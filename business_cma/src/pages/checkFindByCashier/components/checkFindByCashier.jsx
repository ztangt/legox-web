import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import SearchLine from './searchLine';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import { BASE_WIDTH } from '../../../util/constant';
import { timeStamp } from '../../../util/util';
import ApplicationModal from './applicationModal';
import styles from '../index.less';
//
const CheckFindBy = ({ dispatch, checkFindByCashier, layoutG }) => {
    const [isShowHighSearch, setIsShowHighSearch] = useState(false);
    const [selectRowKey, setSelectRowKey] = useState({});
    const { modalShow } = layoutG;
    const { currentHeight, limit, returnCount, currentPage } = checkFindByCashier;
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
            yhName: '中国银行股份有限公司北京丰盛支行',
            yhzh: '1000005',
            zpzt_code: '3',
            lyr_: 'a9cd31bc159541868d31906c536b97fb',
            zpzt: '已使用',
            dw_: 'f00dfee0-9ad6-11e8-a5e9-000c29e5c29f',
            sfsqzf: '0',
            zph: '531105',
            zplb: '现金',
            lysj: '2022-05-31',
            dwName_: '发展规划院',
            id: '2b092663-8dbd-4025-a2ef-d9c0b4bf4d4d',
            lyrName_: '测试用户',
        },
        {
            yhName: '中国银行股份有限公司北京丰盛支行2',
            yhzh: '1000005',
            zpzt_code: '3',
            lyr_: 'a9cd31bc159541868d31906c536b9712',
            zpzt: '已使用',
            dw_: 'f00dfee0-9ad6-11e8-a5e9-000c29e5c29f',
            sfsqzf: '0',
            zph: '531105',
            zplb: '现金',
            lysj: '2022-05-31',
            dwName_: '发展规划院',
            id: '2b092663-8dbd-4025-a2ef-d9c0b4bf4d32',
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
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectRowKey(selectedRows);
        },
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
                        type: 'radio',
                        ...rowSelection,
                    }}
                    isShowHighSearch={isShowHighSearch}
                    taskType="MONITOR"
                    tableLayout="fixed"
                    key={isShowHighSearch}
                    {...tableProps}
                    className={styles.table}
                    modulesName="checkFindByCashier"
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
            {modalShow && <ApplicationModal onCancel={onCancel} />}
        </div>
    );
};
export default connect(({ checkFindByCashier, layoutG }) => ({
    checkFindByCashier,
    layoutG,
}))(CheckFindBy);
