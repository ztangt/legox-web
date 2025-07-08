import MenuButton from '@/components/menuButton';
import TableModal from '@/components/tabelModal/tabelModal';
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Tabs } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ExportModal from '../../../components/exportModal';
import { zcList } from './config'; //是否政采
import RangModal from './rangModal';

function SearchCom({ dispatch, contractLedger }) {
    const [form] = Form.useForm();
    const [showAdvSearch, setShowAdvSearch] = useState(false);
    const {
        limit,
        formData,
        currentPage,

        selectVisible,
        orgUserType,
        formType,
        selectedDataIds,
        selectedDatas,
        selectListInfo,

        reList, //收支合同列表 NKSZHTFL
        typeList, //合同类型 HTLX
        fundList, //经费性质 HTXZ
        fundChaList, //经费渠道 HTZJQD
        buyWayList, //采购方式 QKYCGFS
        isBusList, //是否业务合同
        isBigList, //是否重大合同
        columns,
        orgList, //管理单位
        funCode, //获取的编码
        tabNum,
    } = contractLedger;

    const [deptList, setDeptList] = useState({ id: [], data: [] }); //承办部门选中列表
    const [idenList, setIdenList] = useState({ id: [], data: [] }); //经办人选中列表
    const [headList, setHeadList] = useState({ id: [], data: [] }); //负责人选中列表
    //打开选人或者部门
    const setShowModal = (orgUserType, formType) => {
        let ids = [];
        if (formType == 'registerDept') {
            ids = deptList.id;
        }
        if (formType == 'registerIdentity') {
            ids = idenList.id;
        }
        if (formType == 'chargeIdentity') {
            ids = headList.id;
        }
        dispatch({
            type: 'contractLedger/updateStates',
            payload: {
                formType,
                selectVisible: true,
                selectedDataIds: ids,
                orgUserType,
            },
        });
    };
    const onSelectBack = () => {
        if (formType == 'registerDept') {
            let nameValue = selectedDatas.map((item) => item.nodeName);
            form.setFieldValue('registerDeptId', nameValue.join(','));
            setDeptList({ id: selectedDataIds, data: selectedDatas });
            return;
        }
        if (formType == 'registerIdentity') {
            let nameValue = selectedDatas.map((item) => item.userName);
            form.setFieldValue('registerIdentityId', nameValue.join(','));
            setIdenList({ id: selectedDataIds, data: selectedDatas });
            return;
        }
        if (formType == 'chargeIdentity') {
            let nameValue = selectedDatas.map((item) => item.userName);
            form.setFieldValue('chargeIdentityId', nameValue.join(','));
            setHeadList({ id: selectedDataIds, data: selectedDatas });
        }
    };

    //获取列表
    const getList = (startPage, postData) => {
        let params = postData ? postData : formData;
        dispatch({
            type: 'contractLedger/getList',
            payload: { ...params, start: startPage, limit },
        });
    };

    //重置
    const onReset = async () => {
        form.resetFields();
        await setDeptList({ id: [], data: [] });
        await setIdenList({ id: [], data: [] });
        await setHeadList({ id: [], data: [] });

        await setFunInfo({});
        await setSelectCode([]);
        await setSelectCodeList([]);

        onFinish({}, []);
    };

    //查询
    const onFinish = (val, deptId) => {
        let performanceStartDate = '';
        let performanceEndDate = '';
        if (val.performanceStartDate) {
            let formatTime = dayjs(val.performanceStartDate).format('YYYY-MM-DD');
            performanceStartDate = dayjs(formatTime).unix();
        }
        if (val.performanceEndDate) {
            let formatTime = dayjs(val.performanceEndDate).format('YYYY-MM-DD');
            performanceEndDate = dayjs(formatTime).unix();
        }

        let contractNatureCode = ''; //处理合同性质 取OBJ_CODE字段
        if (val.contractNatureCode) {
            contractNatureCode = funInfo.OBJ_CODE;
        }

        let postData = {
            revenueExpenditureContractType: formData.revenueExpenditureContractType, //单独保存Tabs的字段
            ...val,
            registerDeptId: deptId ? deptId.join(',') : deptList.id.join(','),
            performanceStartDate: performanceStartDate,
            performanceEndDate: performanceEndDate,
            contractNatureCode: contractNatureCode,
        };

        dispatch({
            type: 'contractLedger/updateStates',
            payload: { formData: { ...postData } },
        });
        getList(1, { ...postData });
    };

    const [searchWord, setSearchWord] = useState(''); //合同编号
    //头部搜索,保存表单数据
    const onSearch = (searchWord) => {
        dispatch({
            type: 'contractLedger/updateStates',
            payload: {
                formData: {
                    searchWord,
                    // revenueExpenditureContractType: reList.length ? reList[0].value : '',
                    revenueExpenditureContractType:
                        formData?.revenueExpenditureContractType || reList?.[0]?.value || '',
                },
            },
        });
        getList(1, {
            searchWord,
            // revenueExpenditureContractType: reList.length ? reList[0].value : '',
            revenueExpenditureContractType: formData?.revenueExpenditureContractType || reList?.[0]?.value || '',
        });
    };

    const { location } = useModel('@@qiankunStateFromMaster'); //不可删除，是为了按钮调用父应用的弹窗

    const { bizSolId } = location.query;

    /**
     * 这段代码是为了返回选中数据，给按钮用,不可删除
     * getData:或许选中数据
     * resetListInfo:重置选中状态
     * getListModelData:重新请求列表
     * 给配置的导出按钮传columns和formData，不可删除
     * 定义的函数名不可动,因为按钮配置那就是这么写的，让人改配置比较费劲
     **/
    const getData = () => {
        return {
            listInfo: selectListInfo,
        };
    };
    const resetListInfo = () => {
        dispatch({
            type: 'contractLedger/updateStates',
            payload: {
                ids: [],
                selectListInfo: [],
            },
        });
    };
    const getListModelData = () => {
        getList(currentPage);
    };
    const getExportJson = () => {
        let obj = {};
        columns.forEach((item) => {
            let { key, columnName } = item;
            obj[key] = columnName;
        });
        return {
            seniorSearchInfo: {
                ...formData,
                contractType: 'NK',
            },
            colJson: obj,
        };
    };

    const [exportVisible, setExportVisible] = useState(false); //导出弹框
    const [fType, setFType] = useState('');
    const [exportSearchWord, setExportSearchWord] = useState();
    //导出方法给按钮使用
    const onExport = (fileType, exportSearchWord) => {
        setFType(fileType);
        setExportSearchWord(exportSearchWord);
        setExportVisible(true);
    };
    const getSelectListInfoIds = () => {
        return selectListInfo.map((item) => {
            return item.id || item.ID;
        });
    };
    const changeShowAdvSearch = (isShow) => {
        setShowAdvSearch(isShow);
        dispatch({
            type: 'contractLedger/updateStates',
            payload: {
                showAdvSearch: isShow,
            },
        });
    };

    const [fileName, setFileName] = useState(reList.length ? reList[0].label : '文件名称');
    const changeTab = (key) => {
        let postData = { ...formData, revenueExpenditureContractType: key };
        let index = reList.findIndex((item) => item.key === key);
        dispatch({
            type: 'contractLedger/updateStates',
            payload: { formData: postData, tabNum: index + 1 },
        });
        getList(currentPage, postData);
    };

    useEffect(() => {
        setFileName(reList[tabNum - 1]?.label + '合同');
    }, [reList, tabNum]);

    const buttonEvents = {
        getData,
        resetListInfo,
        getListModelData,
        getExportJson,
        onExport,
    };

    //合同性质代码
    const [code, setCode] = useState('');
    const [codeType, setCodeType] = useState(1);
    const [isTableModal, setIsTableModal] = useState(false);
    const [funInfo, setFunInfo] = useState({});
    const [selectCode, setSelectCode] = useState([]);
    const [selectCodeList, setSelectCodeList] = useState([]);
    const getFunCodeList = () => {
        setCode(funCode);
        setCodeType(1);
        setIsTableModal(true);
    };

    const hideTableModal = (selectedRows, setIsTableModal) => {
        let info = selectedRows.length ? selectedRows[0] : {};
        //合同性质
        if (codeType === 1) {
            setFunInfo(info);
            form.setFieldValue('contractNatureCode', info ? info.OBJ_NAME : '');
        }
        // if (codeType === 2) {
        //     setFundInfo(info);
        // }
        setSelectCode(info.OBJ_CODE ? [info.OBJ_CODE] : []);
        setSelectCodeList(selectedRows);
        setIsTableModal(false);
    };
    const getTableData = (start, limit, params, setDataSource) => {
        let filterObject = '';
        let userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (userInfo.orgId) {
            filterObject = userInfo.orgId;
        }
        dispatch({
            type: 'contractLedger/getTableList',
            payload: {
                limit,
                start,
                ...params,
                bizSolId: code,
                parentCode: 0,
                usedYear: dayjs().year(),
                option: ' AND IS_ENABLE_TLDT_ = "1" ',
                isFilterObject: '1',
                filterObject: filterObject,
            },
            callback: (data) => {
                setDataSource(data);
            },
        });
    };

    const onExpandTableModal = (expanded, record, callback) => {
        const { OBJ_CODE } = record; //parentCode
        dispatch({
            type: 'contractLedger/getTableList',
            payload: {
                start: 1,
                limit: 1000,
                bizSolId: code,
                parentCode: OBJ_CODE,
                usedYear: dayjs().year(),
            },
            callback: (data) => {
                callback(data.list);
            },
        });
    };

    const onExpand = (expanded, record, callback) => {};
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
    return (
        <div id="contractLedger_head">
            <div className={'flex flex_justify_between pt8 pl8'}>
                <div className={'flex_1 mb8'}>
                    <Input.Search
                        style={{ width: '240px' }}
                        placeholder="请输入合同编号"
                        allowClear
                        size="middle"
                        onChange={(e) => setSearchWord(e.target.value)}
                        onSearch={(value) => onSearch(value)}
                    />
                    <Button
                        className={'ml8'}
                        onClick={() => {
                            changeShowAdvSearch(true);
                        }}
                    >
                        高级查询
                    </Button>
                </div>
                <div className="flex_1 flex flex_justify_end">
                    <MenuButton {...buttonEvents} bizSolId={bizSolId} />
                </div>
            </div>
            <Tabs items={reList} onChange={changeTab} type={'card'} />

            {showAdvSearch && (
                <div className={'width_100 bg_f7 pt8 pb8 pl10 pr10'}>
                    <Form colon={false} form={form} name="basic" onFinish={onFinish} style={{ width: '100%' }}>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="合同编号" name="contractNumber">
                                    <Input placeholder="请选择合同编号" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="合同名称" name="contractName">
                                    <Input placeholder="请输入合同名称" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="合同类型" name="contractTypeTldt">
                                    <Select placeholder="请选择合同类型" allowClear options={typeList} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="经费性质(收入)" name="fundNatureTldt">
                                    <Select placeholder="请选择经费性质" allowClear options={fundList} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="经费渠道" name="capitalChannelTldt">
                                    <Select placeholder="请选择经费渠道" allowClear options={fundChaList} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="采购方式" name="purchaseMethodTldt">
                                    <Select placeholder="请选择采购方式" allowClear options={buyWayList} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="部门" name="registerDeptId">
                                    <Input onClick={() => setShowModal('DEPT', 'registerDept')} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="报账卡号/预算指标编码" name="reimbCardCodeOrNormCode">
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="项目名称" name="projectName">
                                    <Input placeholder="请输入项目名称" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={8}>
                                <Form.Item label="是否业务合同" name="isBusinessContractTldt">
                                    <Select placeholder="请选择是否业务合同" allowClear options={isBusList} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="合同主要内容" name="contractContent">
                                    <Input placeholder="请输入合同主要内容" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="是否重大合同" name="isBigContractsTldt">
                                    <Select placeholder="请选择是否业务合同" allowClear options={isBigList} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="合同金额区间" name="lowerContractAmount">
                                    <InputNumber min={0} className="width_100"></InputNumber>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="至" name="upperContractAmount">
                                    <InputNumber min={0} className="width_100"></InputNumber>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="合同相对方" name="supplierOneName">
                                    <Input placeholder="请输入合同相对方" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={8}>
                                <Form.Item label="合同履行期限" name="performanceStartDate">
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="至" name="performanceEndDate">
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label={'管理单位'} name={'inChargeUnitId'}>
                                    <Select
                                        placeholder={'请选择管理单位'}
                                        options={orgList}
                                        allowClear
                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="合同性质" name={'contractNatureCode'}>
                                    <Input
                                        placeholder="请选择合同性质"
                                        // value={funInfo.OBJ_NAME}
                                        onClick={getFunCodeList}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label={'是否政采'} name={'isCcgpTldt'}>
                                    <Select
                                        placeholder={'请选择是否政采'}
                                        options={zcList}
                                        allowClear
                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <div className={'flex_center'}>
                            <Button htmlType="submit">查询</Button>
                            <Button onClick={onReset} className={'ml8 mr8'}>
                                重置
                            </Button>
                            <Button onClick={() => changeShowAdvSearch(false)}>取消</Button>
                        </div>
                    </Form>
                </div>
            )}
            {selectVisible && <RangModal orgUserType={orgUserType} form={form} onBack={onSelectBack} />}

            {exportVisible && (
                <ExportModal
                    bizSolId={bizSolId}
                    fileType={fType}
                    columns={columns}
                    listColumnCodes={columns.map((item) => item.key)}
                    exportSearchWord={exportSearchWord}
                    selectedRowKeys={getSelectListInfoIds()}
                    setExportVisible={setExportVisible}
                    id={'contractLedger_id'}
                    fileName={fileName}
                />
            )}
            {isTableModal && (
                <TableModal
                    tableModalParams={tableModalParams}
                    setIsTableModal={setIsTableModal}
                    formModelingName={'contractLedger_id'}
                />
            )}
        </div>
    );
}

export default connect(({ contractLedger }) => ({
    contractLedger,
}))(SearchCom);
