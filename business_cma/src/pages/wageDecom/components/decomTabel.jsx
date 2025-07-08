import { Select, Form, Table, Button, message, Row, Col, Checkbox } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { connect } from 'dva';
import styles from '../index.less';
import TreeSelect from './treeSelect';
import Input from './input';
import { PlusOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
function DecomRightTabel({ dispatch, wageDecom, updateDecomData, form }) {
    const {
        years,
        orgs,
        wageClasss,
        wageMonths,
        wageBatchs,
        wageItems,
        wageInfos,
        decomWageInfos,
        accountants,
        economics,
    } = wageDecom;
    const [isScroll, setIsScroll] = useState(false);
    const [isSaves, setIsSaves] = useState({});
    useEffect(() => {
        if (decomWageInfos?.resultList?.length) {
            debugger;
            let scrollHeight = document.getElementById('content_tabel').scrollHeight;
            let offsetHeight = document.getElementById('content_tabel').offsetHeight;
            if (offsetHeight < scrollHeight) {
                setIsScroll(true);
            } else {
                setIsScroll(false);
            }
        }
    }, [decomWageInfos]);
    const onResize = useCallback(() => {
        let scrollHeight = document.getElementById('content_tabel').scrollHeight;
        let offsetHeight = document.getElementById('content_tabel').offsetHeight;
        if (offsetHeight < scrollHeight) {
            setIsScroll(true);
        } else {
            setIsScroll(false);
        }
    }, []);
    useEffect(() => {
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);
    //改变数据
    const changeData = (index, name, value) => {
        decomWageInfos.resultList[index][name] = value;
        updateDecomData(decomWageInfos);
    };
    //保存数据
    const saveData = (index) => {
        dispatch({
            type: 'wageDecom/saveData',
            payload: {
                dataRow: JSON.stringify([
                    {
                        ...decomWageInfos.resultList[index],
                    },
                ]),
                type: '2',
            },
            callback: () => {
                decomWageInfos.resultList[index].state = '1';
                updateDecomData(decomWageInfos);
            },
        });
    };
    //失去焦点请求数据
    const blurAction = (index, value) => {
        console.log('ssss====', decomWageInfos.resultList[index]);
        //帐号就是预算指标库
        //先获取bizSoldId,在获取数据
        dispatch({
            type: 'wageDecom/getBizSolIdByLogicCode_0001',
            payload: {
                logicCode: '100001',
            },
            callback: (bizSolId) => {
                dispatch({
                    type: 'wageDecom/getNormNuisdictionList',
                    payload: {
                        start: 1,
                        limit: 1,
                        searchWord: value,
                        bizSolId: bizSolId,
                        usedYear: form.getFieldValue('wageYear'),
                        searchType: 3,
                    },
                    callback: (data) => {
                        //更新数据
                        decomWageInfos.resultList[index]['budgetAccount'] = data?.[0]?.BUDGET_ORG_NAME_;
                        decomWageInfos.resultList[index]['natureOfExpenditureCode'] =
                            data?.[0]?.NATURE_OF_EXPENDITURE_CODE;
                        decomWageInfos.resultList[index]['natureOfExpenditure'] = data?.[0]?.NATURE_OF_EXPENDITURE_NAME;
                        decomWageInfos.resultList[index]['natureOfFunds'] = data?.[0]?.SOURCE_OF_FUNDS_NAME;
                        decomWageInfos.resultList[index]['natureOfFundsCode'] = data?.[0]?.SOURCE_OF_FUNDS_CODE;
                        decomWageInfos.resultList[index]['availableCredit'] = data?.[0]?.AVL_BUDGET;
                        decomWageInfos.resultList[index]['cardNumberId'] = data?.[0]?.NORM_ID;
                        decomWageInfos.resultList[index]['cardNumberBizSolId'] = data?.[0]?.NORM_BIZ_SOL_ID;
                        updateDecomData(decomWageInfos);
                    },
                });
            },
        });
    };
    //插入
    const insertData = (index) => {
        let infos = {
            ...decomWageInfos.resultList[index],
            allocationAmount: 0,
            state: '0',
            // dr: 'N',
            decomposeWageId: '', //这个插入的是否应该为空TODO
            defaultState: 'N',
        };
        decomWageInfos.resultList.splice(index + 1, 0, infos);
        updateDecomData(decomWageInfos);
    };
    //删除数据
    const deleteData = (index) => {
        //如果插入的数据没有保存，则不需要调用接口，如果保存了则需要调用接口
        let id = decomWageInfos.resultList[index].decomposeWageId;
        let state = decomWageInfos.resultList[index].state;
        if (state == '0') {
            decomWageInfos.resultList.splice(index, 1);
            updateDecomData(decomWageInfos);
        } else {
            //请求接口
            dispatch({
                type: 'wageDecom/delSalaryDetails',
                payload: {
                    id: id,
                },
                callback: () => {
                    decomWageInfos.resultList.splice(index, 1);
                    updateDecomData(decomWageInfos);
                },
            });
        }
    };
    //分配金额改变应发项合计和实发合计需要改变(工资项中应发项的分配金额合计)
    const blurAmount = (index, value) => {
        let yfhj = 0;
        let kkhj = 0;
        console.log('decomWageInfos===', decomWageInfos);
        debugger;
        decomWageInfos.resultList.map((item) => {
            if (item.wageItemType == '0') {
                yfhj = yfhj + parseFloat(item.allocationAmount);
            } else if (item.wageItemType == '1') {
                kkhj = kkhj + parseFloat(item.allocationAmount);
            }
        });
        decomWageInfos.sumMap.kkhj = kkhj;
        decomWageInfos.sumMap.yfhj = yfhj;
        decomWageInfos.sumMap.sfhj = yfhj - kkhj;
        updateDecomData(decomWageInfos);
    };
    return (
        <table border="1" className={styles.table} style={{ height: '100%' }}>
            <thead>
                <tr>
                    <th colSpan={12} className={styles.background}>
                        分解工资明细
                    </th>
                </tr>
                <tr>
                    <td colSpan={10} className={styles.background}>
                        分解金额_应发项合计
                    </td>
                    <td className={styles.background} colSpan={2} style={isScroll ? { borderRight: 'unset' } : {}}>
                        {decomWageInfos?.sumMap?.yfhj ? parseFloat(decomWageInfos?.sumMap?.yfhj).toFixed(2) : ''}
                    </td>
                    <td
                        style={isScroll ? { width: '6px', borderLeft: 'unset' } : { display: 'none' }}
                        className={styles.background}
                    ></td>
                </tr>
                <tr>
                    <td colSpan={10} className={styles.background}>
                        分解金额_扣款项合计
                    </td>
                    <td className={styles.background} colSpan={2} style={isScroll ? { borderRight: 'unset' } : {}}>
                        {decomWageInfos?.sumMap?.kkhj ? parseFloat(decomWageInfos?.sumMap?.kkhj).toFixed(2) : ''}
                    </td>
                    <td
                        style={isScroll ? { width: '6px', borderLeft: 'unset' } : { display: 'none' }}
                        className={styles.background}
                    ></td>
                </tr>
                <tr>
                    <td colSpan={10} className={styles.background}>
                        分解金额_实发合计
                    </td>
                    <td className={styles.background} colSpan={2} style={isScroll ? { borderRight: 'unset' } : {}}>
                        {decomWageInfos?.sumMap?.sfhj ? parseFloat(decomWageInfos?.sumMap?.sfhj).toFixed(2) : ''}
                    </td>
                    <td
                        style={isScroll ? { width: '6px', borderLeft: 'unset' } : { display: 'none' }}
                        className={styles.background}
                    ></td>
                </tr>
                <tr>
                    <td className={styles.background}>序号</td>
                    <td className={styles.background}>选择</td>
                    <td className={styles.background}>工资项</td>
                    <td className={styles.background}>报账卡号</td>
                    <td className={styles.background}>预算科目</td>
                    <td className={styles.background}>支出性质</td>
                    <td className={styles.background}>资金性质</td>
                    <td className={styles.background}>会计科目</td>
                    <td className={styles.background}>经济分类</td>
                    <td className={styles.background}>可用额度</td>
                    <td className={styles.background}>分配金额</td>
                    <td className={styles.background} style={isScroll ? { borderRight: 'unset' } : {}}>
                        操作
                    </td>
                    <td
                        style={isScroll ? { width: '6px', borderLeft: 'unset' } : { display: 'none' }}
                        className={styles.background}
                    ></td>
                </tr>
            </thead>
            <tbody style={{ height: '100%' }} id="content_tabel">
                {decomWageInfos?.resultList?.length ? (
                    decomWageInfos?.resultList.map((item, index) => {
                        return (
                            <tr>
                                <td>{index + 1}</td>
                                <td>
                                    <Checkbox></Checkbox>
                                </td>
                                <td>{item.wageItemName}</td>
                                <td>
                                    <Input
                                        value={item.cardNumber}
                                        onChange={(e) => {
                                            changeData(index, 'cardNumber', e.target.value);
                                        }}
                                        onBlur={(e) => {
                                            blurAction(index, e.target.value);
                                        }}
                                    />
                                </td>
                                <td>{item.budgetAccount}</td>
                                <td>{item.natureOfExpenditureCode}</td>
                                <td>{item.natureOfFunds}</td>
                                {/* <td></td> */}
                                <td>
                                    <TreeSelect
                                        type="accountant"
                                        form={form}
                                        value={item.accountingSubjectCode}
                                        changeData={changeData}
                                        index={index}
                                        name={item.accountingSubject}
                                    />
                                </td>
                                {/* <td>{item.economicClassification}</td> */}
                                <td>
                                    <TreeSelect
                                        type="economic"
                                        form={form}
                                        value={item.economicClassificationCode}
                                        changeData={changeData}
                                        index={index}
                                        name={item.economicClassification}
                                    />
                                </td>
                                <td>{item.availableCredit}</td>
                                <td>
                                    <Input
                                        value={item.allocationAmount}
                                        onChange={(e) => {
                                            changeData(index, 'allocationAmount', e.target.value);
                                        }}
                                        onBlur={(e) => {
                                            blurAmount(index, e.target.value, item.allocationAmount);
                                        }}
                                    />
                                </td>
                                <td className={styles.opration_td}>
                                    <a onClick={insertData.bind(this, index)}>
                                        <PlusOutlined />
                                    </a>
                                    <a onClick={saveData.bind(this, index)}>
                                        <SaveOutlined />
                                    </a>
                                    {item.defaultState == 'N' && (
                                        <a onClick={deleteData.bind(this, index)}>
                                            <DeleteOutlined />
                                        </a>
                                    )}
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan={12}>没有找到匹配的记录</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
export default connect(({ wageDecom }) => ({
    wageDecom,
}))(DecomRightTabel);
