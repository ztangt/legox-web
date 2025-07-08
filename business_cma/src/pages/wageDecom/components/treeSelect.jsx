import { TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { useRequest } from 'ahooks';
import styles from './input.less';
const ReTreeSelect = ({ dispatch, type, form, wageDecom, value, changeData, index, name }) => {
    const { accountantBizSolId, economicsBizSolId, accountants, economics } = wageDecom;
    const [searchWord, setSearchWord] = useState('');
    const [isShow, setIsShow] = useState('');
    //获取数据
    const getBudgetProjectTree = (parentCode, searchWord, callback) => {
        if (type == 'accountant') {
            getBudgetProjectTree_0014(parentCode, searchWord, callback);
        } else {
            getBudgetProjectTree_0011(parentCode, searchWord, callback);
        }
    };
    //会计科目
    const getBudgetProjectTree_0014 = (parentCode, searchWord, callback) => {
        dispatch({
            type: 'wageDecom/getBudgetProjectTree_0014',
            payload: {
                bizSolId: accountantBizSolId,
                parentCode: parentCode,
                usedYear: form.getFieldValue('wageYear'),
                start: 1,
                limit: '1000',
                searchWord: searchWord,
                isExpend: true,
            },
            callback: () => {
                callback && callback();
            },
        });
    };
    //经济科目
    const getBudgetProjectTree_0011 = (parentCode, searchWord, callback) => {
        dispatch({
            type: 'wageDecom/getBudgetProjectTree_0011',
            payload: {
                bizSolId: economicsBizSolId,
                parentCode: parentCode,
                usedYear: form.getFieldValue('wageYear'),
                start: 1,
                limit: '1000',
                searchWord: searchWord,
                isExpend: true,
            },
            callback: () => {
                callback && callback();
            },
        });
    };
    //展开加载数据
    const onLoadData = ({ OBJ_CODE }) =>
        new Promise((resolve) => {
            getBudgetProjectTree(OBJ_CODE, searchWord, () => {
                console.log('1111~~~~~', accountants, economics);
                resolve(undefined);
            });
        });

    //搜索数据
    const searchWordFn = async (value) => {
        setSearchWord(value);
        getBudgetProjectTree('0', value);
    };
    // //搜索
    const { data, loading, run } = useRequest(searchWordFn, {
        debounceWait: 1000,
        manual: true,
    });
    const onSearch = (newValue) => {
        run(newValue);
    };
    //值改变
    const onChange = (value, label, extra) => {
        if (type == 'accountant') {
            changeData(index, 'accountingSubjectCode', value);
            changeData(index, 'accountingSubject', label);
            changeData(index, 'accountingSubjectBizSolId', extra.SOL_ID);
            changeData(index, 'accountingSubjectId', extra.ID);
        } else {
            changeData(index, 'economicClassificationCode', value);
            changeData(index, 'economicClassification', label);
            changeData(index, 'economicClassificationBizSolId', extra.SOL_ID);
            changeData(index, 'economicClassificationId', extra.ID);
        }
    };
    return isShow ? (
        <TreeSelect
            style={{
                width: '100%',
            }}
            placeholder="请选择"
            onSearch={onSearch}
            loadData={onLoadData}
            allowClear
            treeData={type == 'accountant' ? accountants : economics}
            fieldNames={{
                label: 'OBJ_NAME',
                value: 'OBJ_CODE',
                children: 'children',
            }}
            popupMatchSelectWidth={150}
            value={value}
            onChange={(value, label, extra) => {
                onChange(value, label, extra);
            }}
            onBlur={() => {
                setIsShow(false);
            }}
        />
    ) : name ? (
        <a
            onClick={() => {
                setIsShow(true);
            }}
            className={styles.edit_span}
        >
            {name}
        </a>
    ) : (
        <a
            onClick={() => {
                setIsShow(true);
            }}
            className={styles.edit_span}
        >
            &nbsp;&nbsp;&nbsp;
        </a>
    );
};
export default connect(({ wageDecom }) => ({
    wageDecom,
}))(ReTreeSelect);
