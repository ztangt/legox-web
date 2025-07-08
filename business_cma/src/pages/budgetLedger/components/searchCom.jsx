import { DoubleRightOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { connect, useModel } from 'umi';
import MenuButton from '../../../components/menuButton';
import RangModal from '../../../components/rangModal';
import TableModal from '../../../components/tabelModal/tabelModal';

const FormItem = Form.Item;
const { Search } = Input;
const gutter = { xs: 8, sm: 16, md: 24, lg: 32 };

const SearchCom = ({ dispatch, budgetLedger, targetWarning, buttonEvents }) => {
    const {
        limit,
        // budgetUnitList,
        // governmentCode,
        // partCode,
        rangVisible,
        rangType,
        formType,
        selectedDataIds,
        selectedDatas,

        funCode,
        fundCode,
    } = budgetLedger;

    const { location, openEvent } = useModel('@@qiankunStateFromMaster');

    const { bizSolId, uuId, url } = location.query;

    //获取编码
    useEffect(() => {
        dispatch({ type: 'budgetLedger/getFunCode' });
        dispatch({ type: 'budgetLedger/getFundCode' });
        // dispatch({type: 'budgetLedger/getPartLogicCode'});

        // let menuIdKeyValArr = JSON.parse(localStorage.getItem('menuIdKeyValArr'));
        // let menuIdKey = `${ bizSolId }-0`;
        // let menuId = menuIdKeyValArr[menuIdKey];
        // dispatch({
        //     type: 'budgetLedger/getBudgetUnitList',
        //     payload: {menuId},
        // });
    }, []);

    const [showMore, setShowMore] = useState(false);
    const [currentYear, setCurrentYear] = useState(dayjs().year());
    const [normCode, setNormCode] = useState('');
    //修改年限
    const changeYear = (value) => {
        setCurrentYear(value);
        getList({ usedYear: value, objCode: normCode });
    };
    const [form] = Form.useForm();
    const getList = (postData) => {
        //保存formData
        dispatch({
            type: 'budgetLedger/updateStates',
            payload: { formData: { ...postData } },
        });
        //获取数据
        dispatch({
            type: 'budgetLedger/getList',
            payload: { ...postData, start: 1, limit },
        });
    };
    //onFinish
    const onFinish = () => {
        let values = form.getFieldsValue(true);
        let { chargeIdentityId_name, chargeOrgId_name, ...other } = values;
        let postDate = {
            ...other,
            usedYear: currentYear,
            moneySourceTldt: fundInfo?.OBJ_CODE,
            funcSubjectCode: funInfo?.OBJ_CODE,
        };
        getList(postDate);
    };

    const [code, setCode] = useState('');
    const [codeType, setCodeType] = useState(1);
    const [isTableModal, setIsTableModal] = useState(false);

    const [selectCode, setSelectCode] = useState([]);
    const [selectCodeList, setSelectCodeList] = useState([]);
    const [funInfo, setFunInfo] = useState({});
    const [fundInfo, setFundInfo] = useState({});
    const getFunCodeList = () => {
        setCode(funCode);
        setCodeType(1);
        setIsTableModal(true);
    };

    const getFundCodeList = () => {
        setCode(fundCode);
        setCodeType(2);
        setIsTableModal(true);
    };

    const hideTableModal = (selectedRows, setIsTableModal) => {
        let info = selectedRows.length ? selectedRows[0] : {};
        //功能分类
        if (codeType === 1) {
            setFunInfo(info);
        }
        //资金来源
        if (codeType === 2) {
            setFundInfo(info);
        }
        setSelectCode(info.OBJ_CODE ? [info.OBJ_CODE] : []);
        setSelectCodeList(selectedRows);
        setIsTableModal(false);
    };

    const getTableData = (start, limit, params, setDataSource) => {
        dispatch({
            type: 'budgetLedger/getTableList',
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
            type: 'budgetLedger/getTableList',
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
            type: 'budgetLedger/updateStates',
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
            type: 'budgetLedger/updateStates',
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
        if (formType === 'chargeIdentityId') {
            selectedDatas.map((item) => {
                nameValue.push(item.userName);
            });
        } else {
            selectedDatas.map((item) => {
                nameValue.push(item.nodeName);
            });
        }
        form.setFieldsValue({ [`${formType}`]: selectedDataIds.join(',') }); //保存值
        form.setFieldsValue({ [`${formType}_name`]: nameValue.join(',') ? nameValue.join(',') : '' }); //保存name
        dispatch({
            type: 'budgetLedger/updateStates',
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
            type: 'budgetLedger/updateStates',
            payload: {
                showAdvSearch: isShow,
            },
        });
    };

    return (
        <div id="budgetLedger_head">
            <div className="flex flex_justify_between p8 flex_align_start">
                <div className="flex mr20 flex_align_center">
                    <InputNumber
                        min={1000}
                        max={9999}
                        defaultValue={currentYear}
                        onChange={changeYear}
                        className="mr10"
                        style={{ width: 110, borderRadius: '4px', marginRight: '8px' }}
                    />
                    <Search
                        placeholder="请输入指标编码查询"
                        onSearch={(value) => getList({ usedYear: currentYear, objCode: value })}
                        allowClear
                        style={{ width: 200 }}
                        onChange={(e) => setNormCode(e.target.value)}
                    />
                    <div className="flex  ml8 primaryColor flex_align_center" onClick={() => changeShowAdvSearch(true)}>
                        <div className="mr5">高级</div>
                        <DoubleRightOutlined rotate={90} className="f10" />
                    </div>
                </div>
                <div className="flex_1 flex flex_justify_end">
                    <MenuButton {...buttonEvents} />
                </div>
            </div>
            {/*高级查询*/}
            {showMore && (
                <div id="more" className="bg_f7 p8 width_100">
                    <Form form={form} name="basic" colon={false} onFinish={onFinish}>
                        <Row>
                            <Col span={8}>
                                <FormItem label="项目名称" name="objName">
                                    <Input placeholder="请输入项目名称" />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="项目编码" name="objCode">
                                    <Input placeholder="请输入项目编码" />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="功能分类">
                                    <Input value={funInfo.OBJ_NAME} onClick={getFunCodeList} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label="项目负责人" name="chargeIdentityId_name">
                                    <Input onClick={() => setShowModal('USER', 'chargeIdentityId')} />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="负责部门" name="chargeOrgId_name">
                                    <Input onClick={() => setShowModal('DEPT', 'chargeOrgId')} />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="资金来源">
                                    <Input value={fundInfo.OBJ_NAME} onClick={getFundCodeList} />
                                </FormItem>
                            </Col>
                        </Row>
                        <div className="flex flex_justify_center">
                            <Button htmlType="submit">查询</Button>
                            <Button onClick={() => form.resetFields()} className="ml8 mr8">
                                重置
                            </Button>
                            <Button onClick={() => changeShowAdvSearch(false)}> 取消 </Button>
                        </div>
                    </Form>
                </div>
            )}
            {rangVisible && (
                <RangModal
                    containerId={'budgetLedger_id'}
                    nameSpace={'budgetLedger'}
                    spaceInfo={budgetLedger}
                    orgUserType={rangType}
                    onCancel={closeRangModal}
                    onOk={getRangInfo}
                />
            )}
            {isTableModal && (
                <TableModal
                    tableModalParams={tableModalParams}
                    setIsTableModal={setIsTableModal}
                    formModelingName={'budgetLedger_id'}
                />
            )}
        </div>
    );
};

export default connect(({ budgetLedger, targetWarning }) => ({
    budgetLedger,
    targetWarning,
}))(SearchCom);
