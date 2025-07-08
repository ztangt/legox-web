import { Select } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import GlobalModal from '../../../../components/GlobalModal';
import RulesForm from '../rulesForm';
import styles from './index.less';

const { Option } = Select;
// 新增/修改弹窗
const RulesModal = ({
    dispatch,
    onCancel,
    modalStatus,
    fundTypeList,
    classifyList,
    warningLevelList,
    rulesAndRangeNameList,
    rulesAndRangeEqualStatusList,
    rulesDefinedNameList,
    rulesAndRangeTextList,
    rulesAndRangeAndList,
    rulesAndRangeTotalList,
    selectRowKey,
    rulesModelSpaces,
    selectedKeys,
    getListData,
    monitorName,
    searchWord,
    orgCode,
    objCode,
}) => {
    const { limit, start } = rulesModelSpaces;
    // base 普通表单
    const [formRef, setFormRef] = useState({});
    // 数据范围
    const [rangeData, setRangeData] = useState(false);
    // 数据定义
    const [rangeAddRows, setRangeAddRows] = useState(false);
    const { backRulesModalData } = rulesModelSpaces;
    const rangeDefineList = backRulesModalData.ruleDef && JSON.parse(backRulesModalData.ruleDef);
    const rangeArr =
        rangeDefineList &&
        rangeDefineList.length > 0 &&
        rangeDefineList.map((item) => {
            const obj = {
                ruleDefined: item.field,
                rulesDefinedRange: item.op,
                rulesDefinedTextType: item.dataType,
                rulesDefinedInput: item.dataType == 'text' ? item.value : '',
                rulesDefinedSelectItem: item.dataType == 'select' ? item.value : undefined, // todo
                definedAndOrType: item.ruleOp,
                rulesDefinedMin: item.min,
                rulesDefinedMax: item.max,
            };
            return obj;
        });
    const rangeDataArr = backRulesModalData.dataScopeRule && JSON.parse(backRulesModalData.dataScopeRule);

    const rangeDataList =
        rangeDataArr &&
        rangeDataArr.length > 0 &&
        rangeDataArr.map((item) => {
            const obj = {
                rangeDataName: item.field,
                rangeDataRules: item.op,
                rangeDataText: item.dataType,
                rangeDataType: item.ruleOp,
                rangeDataInput: item.dataType == 'text' ? item.value : '',
                rangeDataSelect: item.dataType == 'select' ? item.value : '',
                rulesDataMin: item.min,
                rulesDataMax: item.max,
                rangeDataTotalCount: item.scopeOp,
            };
            return obj;
        });

    const initialValues = {
        classifyName: backRulesModalData.classCode || '',
        fundType: backRulesModalData.fundTypeCode || '',
        warningLevel: backRulesModalData.warnLevCode || '',
        rulesName: backRulesModalData.ruleName || '',
        formTextDescription: backRulesModalData.ruleDesc || '',
        dataRangeMultiSelect: (backRulesModalData.dataScopeCode && backRulesModalData.dataScopeCode.split(',')) || [],
        rangeDefines: rangeArr || [],
        rangeDataList: rangeDataList || [],
    };
    useEffect(() => {
        if (modalStatus == 'EDIT') {
            if (backRulesModalData.dataScopeCode) {
                setRangeData(true);
            }
        }
    }, [initialValues]);

    /**
     * 设置普通表单的ref
     */
    const getFormRef = (formRef) => {
        setFormRef(formRef);
    };

    /**
     * 普通 回调函数
     */
    const callback = (value) => {
        console.log('value-callback', value);
        if (value) {
            // 分类名称
            const classCode = value.classifyName;
            const className = classifySelect(classCode)[0].dictInfoName;
            // 资金类型
            const fundTypeCode = value.fundType;
            const fundTypeCodeName = fundTypeNameSelect(fundTypeCode)[0].dictInfoName;
            // 预警等级
            const warnLevCode = value.warningLevel;
            const warnLevName = warningLevelSelect(warnLevCode)[0].dictInfoName;
            // 规则名称
            const ruleName = value.rulesName;
            const ruleDef =
                value.rangeDefines &&
                value.rangeDefines.map((item) => {
                    const obj = {
                        field: item.ruleDefined,
                        op: item.rulesDefinedRange,
                        value:
                            item.rulesDefinedTextType == 'text'
                                ? item.rulesDefinedInput || ''
                                : item.rulesDefinedSelectItem,
                        dataType: item.rulesDefinedTextType,
                        ruleOp: item.definedAndOrType,
                        min: item.rulesDefinedMin,
                        max: item.rulesDefinedMax,
                    };
                    return obj;
                });
            console.log('ruleDef', ruleDef);
            const ruleDesc = value.formTextDescription;
            const dataScopeRule =
                value.rangeDataList &&
                value.rangeDataList.map((item) => {
                    const obj = {
                        field: item.rangeDataName,
                        op: item.rangeDataRules,
                        value: item.rangeDataText == 'text' ? item.rangeDataInput || '' : item.rangeDataSelect,
                        dataType: item.rangeDataText,
                        ruleOp: item.rangeDataType,
                        min: item.rulesDataMin,
                        max: item.rulesDataMax,
                        scopeOp: item.rangeDataTotalCount,
                    };
                    return obj;
                });
            const dataScopeCode = value.dataRangeMultiSelect ? value.dataRangeMultiSelect.join(',') : '';
            // console.log('dataScopeCode', dataScopeCode);
            // console.log('dataScopeRule', dataScopeRule);
            // 新增
            if (modalStatus == 'ADD') {
                dispatch({
                    type: 'rulesModelSpaces/postRulesAddRules',
                    payload: {
                        dataScopeCode: dataScopeCode,
                        ruleDesc,
                        dataScopeRule: JSON.stringify(dataScopeRule) || '',
                        ruleDef: JSON.stringify(ruleDef) || '',
                        ruleName,
                        className,
                        warnLevName,
                        fundType: fundTypeCodeName,
                        nccOrgCode: objCode,
                        nccOrgName: monitorName,
                        fundTypeCode,
                        classCode,
                        warnLevCode,
                        orgCode,
                    },
                    callback: () => {
                        getListData(searchWord, objCode, 1, limit);
                    },
                });
                onCancel();
            }
            // 编辑
            if (modalStatus == 'EDIT') {
                dispatch({
                    type: 'rulesModelSpaces/putRulesPutRules',
                    payload: {
                        id: Array.isArray(selectRowKey) ? selectRowKey.join(',') : selectRowKey,
                        dataScopeCode: dataScopeCode,
                        ruleDesc,
                        dataScopeRule: JSON.stringify(dataScopeRule) || '',
                        ruleDef: JSON.stringify(ruleDef) || '',
                        ruleName,
                        className,
                        warnLevName,
                        fundType: fundTypeCodeName,
                        nccOrgCode: objCode,
                        nccOrgName: monitorName,
                        fundTypeCode,
                        classCode,
                        warnLevCode,
                    },
                    callback: () => {
                        getListData(searchWord, objCode, start, limit);
                    },
                });
                onCancel();
            }
        }
    };
    // 分类名称
    const classifySelect = (classifyName) => {
        const className = classifyList.filter((item) => {
            return item.dictInfoCode == classifyName;
        });
        return className;
    };
    // 资金类型
    const fundTypeNameSelect = (fundType) => {
        return fundTypeList.filter((item) => item.dictInfoCode == fundType);
    };
    // 预警等级
    const warningLevelSelect = (warningLevel) => {
        return warningLevelList.filter((item) => item.dictInfoCode == warningLevel);
    };
    // 确定
    const confirm = () => {
        formRef.current.submit();
    };

    // 顶部表单
    const headList = [
        {
            fieldtype: 'select',
            key: 'classifyName',
            label: '分类名称',
            showLabel: true,
            required: true,
            isSearch: false,
            list: classifyList,
            option: {},
        },
        {
            fieldtype: 'input',
            key: 'rulesName',
            label: '规则名称',
            showLabel: true,
            required: true,
            isSearch: false,
            placeholder: '请输入规则名称',
        },
        {
            fieldtype: 'select',
            key: 'fundType',
            label: '适用资金类型',
            showLabel: true,
            required: true,
            isSearch: false,
            list: fundTypeList,
            option: {},
        },
        {
            fieldtype: 'select',
            key: 'warningLevel',
            label: '预警等级',
            showLabel: true,
            required: true,
            isSearch: false,
            list: warningLevelList,
            option: {},
        },
    ];
    // 数据范围增加是否显示
    const rangeDataClick = () => {
        setRangeData(true);
    };
    // 关闭数据范围显示
    const setRangeDataClose = () => {
        setRangeData(false);
    };
    // 数据定义增加是否显示
    const rangeDefinedClick = () => {
        setRangeAddRows(true);
    };

    const config = {
        headList,
        getFormRef: getFormRef,
        callback: callback,
        colOffset: 1,
        colSpan: 11,
        needRangeButtonText: '增加数据范围',
        addDataCondition: true,
        initialValues:
            modalStatus == 'EDIT'
                ? {
                      ...initialValues,
                  }
                : null,
        rangeDataClick,
        rangeDefinedClick,
        rangeData,
        rangeAddRows,
        setRangeDataClose,
        rulesAndRangeNameList,
        rulesDefinedNameList,
        rulesAndRangeEqualStatusList,
        rulesAndRangeTextList,
        rulesAndRangeAndList,
        rulesAndRangeTotalList,
        modalStatus,
    };
    console.log('config-1', config);
    return (
        <div>
            <GlobalModal
                open={true}
                onCancel={onCancel}
                title={modalStatus == 'ADD' ? '新增规则' : '修改规则'}
                onOk={confirm}
                top={'2%'}
                getContainer={() => {
                    return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                }}
                maskClosable={false}
                mask={false}
                modalSize="lager"
            >
                <div className={styles.doubt}>
                    <RulesForm {...config}></RulesForm>
                </div>
            </GlobalModal>
        </div>
    );
};

export default connect(({ rulesModelSpaces }) => ({
    rulesModelSpaces,
}))(RulesModal);
