import { DoubleRightOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { connect, history } from 'umi';
import InputSearch from '../../../components/inputSearch';
import MenuButton from '../../../components/menuButton';
import RangModal from '../../../components/rangModal';
import TableModal from '../../../components/tabelModal/tabelModal';
import { compareList } from './config';

const FormItem = Form.Item;
// const { Search } = Input;
const gutter = { xs: 8, sm: 16, md: 24, lg: 32 };

const SearchCom = ({ dispatch, budgetTarget, buttonEvents, refInstance }) => {
    const {
        limit,
        budgetUnitList,
        governmentCode,
        partCode,
        fundsCode,
        rangVisible,
        rangType,
        formType,
        selectedDataIds,
        selectedDatas,
        initProjectCode,
        bizSolId,
        formData,
    } = budgetTarget;
    const [form] = Form.useForm();

    useImperativeHandle(refInstance, () => ({
        getSearchInfo: () => {
            let values = form.getFieldsValue(true);
            let { guankong, chargeIdentityId_name, usedDept_name, ...other } = values;
            let postDate = {
                ...guankong,
                ...other,
                usedYear: currentYear,
                economicSubjectCode: partInfo?.OBJ_CODE,
                govEconomicCode: govInfo?.OBJ_CODE,
                sourceOfFundsCode: fundsInfo?.OBJ_CODE,
                budgetOrgId_,
                searchWord,
            };
            console.log(postDate, '----->postDate');
            return postDate;
        },
    }));

    //获取编码
    useEffect(() => {
        if (initProjectCode) {
            form.setFieldsValue({ projectCode: initProjectCode });
            setShowMore(true);
        }
    }, []);

    const [showMore, setShowMore] = useState(false);
    const [currentYear, setCurrentYear] = useState(formData?.usedYear || dayjs().year());
    const [normCode, setNormCode] = useState('');
    const [searchWord, setSearchWord] = useState('');
    const [budgetOrgId_, setBudgetOrgId_] = useState('');

    //修改年限
    const changeYear = (value) => {
        setCurrentYear(value);
        getList({ usedYear: value, budgetOrgId_, searchWord });
    };
    //修改预算单位
    const changeBudgetOrgId = (value) => {
        setBudgetOrgId_(value);
        getList({ usedYear: currentYear, budgetOrgId_: value, searchWord });
    };

    const getList = (postData) => {
        //保存formData
        dispatch({
            type: 'budgetTarget/updateStates',
            payload: { formData: { ...postData } },
        });
        //获取数据
        dispatch({
            type: 'budgetTarget/getList',
            payload: { ...postData, start: 1, limit, bizSolId },
        });
    };
    //onFinish
    const onFinish = () => {
        let values = form.getFieldsValue(true);
        let { guankong, chargeIdentityId_name, usedDept_name, ...other } = values;
        let postDate = {
            ...guankong,
            ...other,
            usedYear: currentYear,
            economicSubjectCode: partInfo?.OBJ_CODE,
            govEconomicCode: govInfo?.OBJ_CODE,
            sourceOfFundsCode: fundsInfo?.OBJ_CODE,
        };
        getList(postDate);
    };

    const onReset = () => {
        form.resetFields();
        setGovInfo({});
        setPartInfo({});
        setFundsInfo({});
        getList({ usedYear: currentYear });
    };

    const [code, setCode] = useState('');
    const [codeType, setCodeType] = useState(1);
    const [isTableModal, setIsTableModal] = useState(false);
    const getPartList = () => {
        setCode(partCode);
        setCodeType(1);
        if (partInfo.OBJ_CODE) {
            setSelectCode([partInfo.OBJ_CODE]);
        }
        setIsTableModal(true);
    };
    const getGoverList = () => {
        setCode(governmentCode);
        setCodeType(2);
        if (govInfo.OBJ_CODE) {
            setSelectCode([govInfo.OBJ_CODE]);
        }
        setIsTableModal(true);
    };

    const getFundsList = () => {
        setCode(fundsCode);
        setCodeType(3);
        if (fundsInfo.OBJ_CODE) {
            setSelectCode([fundsInfo.OBJ_CODE]);
        }
        setIsTableModal(true);
    };

    const [partInfo, setPartInfo] = useState({});
    const [govInfo, setGovInfo] = useState({});
    const [fundsInfo, setFundsInfo] = useState({});
    const [selectCode, setSelectCode] = useState([]);
    const [selectCodeList, setSelectCodeList] = useState([]);
    const hideTableModal = (selectedRows, setIsTableModal) => {
        let info = selectedRows.length ? selectedRows[0] : {};
        //部门
        if (codeType === 1) {
            setPartInfo(info);
        }
        //政府
        if (codeType === 2) {
            setGovInfo(info);
        }
        //资金来源
        if (codeType === 3) {
            setFundsInfo(info);
        }
        // setSelectCode(info.OBJ_CODE ? [info.OBJ_CODE] : []);
        setSelectCodeList(selectedRows);
        setIsTableModal(false);
    };

    const getTableData = (start, limit, params, setDataSource) => {
        dispatch({
            type: 'budgetTarget/getTableList',
            payload: {
                limit,
                start,
                ...params,
                bizSolId: code,
                parentCode: 0,
                usedYear: currentYear,
            },
            callback: (data) => {
                setDataSource(data);
            },
        });
    };

    const onExpandTableModal = (expanded, record, callback) => {
        const { OBJ_CODE } = record; //parentCode
        dispatch({
            type: 'budgetTarget/getTableList',
            payload: {
                start: 1,
                limit: 1000,
                bizSolId: code,
                parentCode: OBJ_CODE,
                usedYear: currentYear,
            },
            callback: (data) => {
                callback(data.list);
            },
        });
    };
    const setShowModal = (newRangType, newFormType) => {
        dispatch({
            type: 'budgetTarget/updateStates',
            payload: {
                rangType: newRangType,
                formType: newFormType,
                selectedDataIds: form.getFieldValue(`${newFormType}`)
                    ? form.getFieldValue(`${newFormType}`).split(',')
                    : [], //获取值
                rangVisible: true,
            },
        });
    };

    const closeRangModal = () => {
        dispatch({
            type: 'budgetTarget/updateStates',
            payload: {
                rangVisible: false,
            },
        });
    };
    const onExpand = (expanded, record, callback) => {};

    //选择使用部门和项目负责人
    const getRangInfo = () => {
        //选中的数据，现在nameSpace是传值方式，后期再改吧;
        let nameValue = [];
        if (formType === 'chargeIdentityId_') {
            selectedDatas.map((item) => {
                nameValue.push(item.userName);
            });
        } else {
            selectedDatas.map((item) => {
                nameValue.push(item.nodeName);
            });
        }
        form.setFieldsValue({ [`${formType}`]: selectedDataIds.join(',') }); //保存值
        form.setFieldsValue({ [`${formType}name`]: nameValue.join(',') ? nameValue.join(',') : '' }); //保存name
        dispatch({
            type: 'budgetTarget/updateStates',
            payload: {
                rangVisible: false,
            },
        });
    };

    const tableModalParams = {
        selectionType: 'radio',
        selectedRowKeys: selectCode,
        selectedRows: selectCodeList,
        getDataSource: getTableData,
        tabelProps: {
            columns: [
                { title: '编码', dataIndex: 'OBJ_CODE' },
                { title: '名称', dataIndex: 'OBJ_NAME' },
            ],
            rowKey: 'OBJ_CODE',
        },
        advancedSearch: [
            {
                searchParam: 'searchWord',
                searchType: 'input',
                name: '编号/code',
            },
        ],
        onOk: hideTableModal,
        onExpand: onExpandTableModal,
    };

    const changeShowAdvSearch = (isShow) => {
        setShowMore(isShow);
        dispatch({
            type: 'budgetTarget/updateStates',
            payload: {
                showAdvSearch: isShow,
            },
        });
    };

    return (
        <div id="budgetTarget_head">
            <div className="flex flex_justify_between p8 flex_align_start">
                <div className="flex mr20 flex_align_center">
                    <InputNumber
                        min={1000}
                        max={9999}
                        defaultValue={currentYear}
                        onChange={changeYear}
                        style={{ width: 110, borderRadius: '4px', marginRight: '8px' }}
                    />
                    <InputSearch
                        placeholder="请输入指标编码/报账卡号查询"
                        onSearch={(value) => getList({ usedYear: currentYear, searchWord: value, budgetOrgId_ })}
                        allowClear
                        className="mr8"
                        style={{ width: 250 }}
                        onChange={(e) => setSearchWord(e.target.value)}
                    />
                    <Select
                        allowClear
                        placeholder="预算单位"
                        style={{ width: 250 }}
                        value={budgetOrgId_}
                        onChange={changeBudgetOrgId}
                        showSearch
                        optionFilterProp="children"
                    >
                        {budgetUnitList.map((item) => {
                            return (
                                <Option key={`${item.orgName}${item.id}`} value={item.orgId}>
                                    {item.orgName}
                                </Option>
                            );
                        })}
                    </Select>

                    <div
                        className="flex  ml8 antd_primary_color flex_align_center"
                        onClick={() => changeShowAdvSearch(true)}
                    >
                        <div className="mr5">高级</div>
                        <DoubleRightOutlined rotate={90} className="f10" />
                    </div>
                    {initProjectCode && (
                        <Button className="ml8" onClick={() => history.back()}>
                            返回
                        </Button>
                    )}
                </div>
                <div className="flex_1 flex flex_justify_end">
                    <MenuButton {...buttonEvents} bizSolId={bizSolId} />
                </div>
            </div>
            {/*高级查询*/}
            {showMore && (
                <div id="more" className="bg_f7 p8 width_100">
                    <Form form={form} name="basic" colon={false} onFinish={onFinish}>
                        <Row>
                            <Col span={8}>
                                <FormItem label="指标编码" name="normCode">
                                    <Input placeholder="请输入指标编码" />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="使用部门" name="usedDept_name">
                                    <Input onClick={() => setShowModal('DEPT', 'usedDept_')} />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="报账卡号" name="reimbCardNum">
                                    <Input placeholder="请输入报账卡号" />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label="项目" name="projectCode">
                                    <Input placeholder="请输入项目" />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="项目负责人" name="chargeIdentityId_name">
                                    <Input onClick={() => setShowModal('USER', 'chargeIdentityId_')} />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="部门经济分类">
                                    <Input onClick={() => getPartList()} value={partInfo.OBJ_NAME} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label="资金来源">
                                    <Input onClick={() => getFundsList()} value={fundsInfo.OBJ_NAME} />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="政府经济分类">
                                    <Input onClick={() => getGoverList()} value={govInfo.OBJ_NAME} />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem name="isEnable" label={'是否启用'}>
                                    <Select placeholder="请选择" allowClear className="mr10">
                                        <Option value={'1'}>是</Option>
                                        <Option value={'0'}>否</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={16}>
                                <FormItem label="管控总额度" className="width_100">
                                    <div className="flex">
                                        <FormItem name={['guankong', 'calculateType']} noStyle>
                                            <Select placeholder="请选择" allowClear>
                                                {compareList.map((item) => (
                                                    <Option key={`${item.value}`} value={item.value}>
                                                        {item.label}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </FormItem>
                                        <FormItem name={['guankong', 'crBudget']} noStyle>
                                            <InputNumber className="width_100 ml8" placeholder="请输入额度" />
                                        </FormItem>
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <div className="flex flex_justify_center">
                            <Button htmlType="submit">查询</Button>
                            <Button onClick={onReset} className="ml8 mr8">
                                重置
                            </Button>
                            <Button onClick={() => changeShowAdvSearch(false)}> 取消 </Button>
                        </div>
                    </Form>
                </div>
            )}
            {rangVisible && (
                <RangModal
                    containerId={'budgetTarget_cma_id'}
                    nameSpace={'budgetTarget'}
                    spaceInfo={budgetTarget}
                    orgUserType={rangType}
                    onCancel={closeRangModal}
                    onOk={getRangInfo}
                />
            )}
            {isTableModal && (
                <TableModal
                    tableModalParams={tableModalParams}
                    setIsTableModal={setIsTableModal}
                    formModelingName={'budgetTarget_cma_id'}
                />
            )}
        </div>
    );
};

const ConnectSearchCom = connect(({ budgetTarget }) => ({
    budgetTarget,
}))(SearchCom);
export default React.forwardRef((props, ref) => <ConnectSearchCom {...props} refInstance={ref} />);
