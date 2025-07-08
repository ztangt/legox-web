import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { connect, useModel } from 'umi';
import ExportModal from '../../../components/exportModal';
import MenuButton from '../../../components/menuButton';
import { blList } from './config';
import RangModal from './rangModal';

const { Option } = Select;

function SearchCom({ dispatch, contractStamped }) {
    const [form] = Form.useForm();
    const [showAdvSearch, setShowAdvSearch] = useState(false);
    const {
        limit,
        currentPage,
        formData,

        checkList,
        typeList,
        buyWayList,
        payTypeList,
        nodeList,

        selectVisible,
        orgUserType,
        formType,
        selectedDataIds,
        selectedDatas,

        selectListInfo, //选中数据

        columns,
    } = contractStamped;

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
            type: 'contractStamped/updateStates',
            payload: {
                formType,
                orgUserType,
                selectVisible: true,
                selectedDataIds: ids,
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
            type: 'contractStamped/getList',
            payload: { ...params, start: startPage, limit },
        });
    };

    //重置
    const onReset = async () => {
        form.resetFields();
        await setDeptList({ id: [], data: [] });
        await setIdenList({ id: [], data: [] });
        await setHeadList({ id: [], data: [] });
        onFinish({}, [], [], []);
    };

    //查询
    const onFinish = (val, deptId, headId, idenId) => {
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
        let postData = {
            ...val,
            registerDeptId: deptId ? deptId.join(',') : deptList.id.join(','),
            chargeIdentityId: headId ? headId.join(',') : headList.id.join(','),
            registerIdentityId: idenId ? idenId.join(',') : idenList.id.join(','),
            performanceStartDate: performanceStartDate,
            performanceEndDate: performanceEndDate,
        };
        dispatch({
            type: 'contractStamped/updateStates',
            payload: { formData: { ...postData } },
        });
        getList(1, postData);
    };

    const [searchWord, setSearchWord] = useState(''); //合同编号
    const [acceptanceStatusTldt, setAcceptanceStatusTldt] = useState(''); //验收状态
    //头部搜索,保存表单数据
    const onSearch = (searchWord, acceptanceStatusTldt) => {
        dispatch({
            type: 'contractStamped/updateStates',
            payload: {
                formData: { searchWord, acceptanceStatusTldt },
            },
        });
        getList(1, { searchWord, acceptanceStatusTldt });
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
            type: 'contractStamped/updateStates',
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
                contractType: 'CAMS',
                contractStampStatusTldt: 1,
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
            type: 'contractStamped/updateStates',
            payload: {
                showAdvSearch: isShow,
            },
        });
    };

    const buttonEvents = {
        onExport,
        getData,
        resetListInfo,
        getListModelData,
        getExportJson,
        selectListInfo,
    };

    return (
        <div id="contractStamped_head">
            <div className={'flex pl8 pt8 flex_justify_between  flex_align_start'}>
                <div className={'flex mr20 flex_align_center mb8'}>
                    <Input.Search
                        className="mr8"
                        style={{ width: '240px' }}
                        placeholder="请输入合同编号"
                        allowClear
                        size="middle"
                        onChange={(e) => setSearchWord(e.target.value)}
                        onSearch={(value) => onSearch(value, acceptanceStatusTldt)}
                    />
                    <Select
                        style={{ width: '240px' }}
                        placeholder="请选择验收状态"
                        allowClear
                        onChange={(val) => setAcceptanceStatusTldt(val)}
                        onSelect={(value) => onSearch(searchWord, value)}
                        options={checkList}
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
                    <MenuButton {...buttonEvents} />
                </div>
            </div>
            {showAdvSearch && (
                <div className={'bg_f7 pt8 pb8'}>
                    <Form colon={false} form={form} name="basic" onFinish={onFinish}>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="合同编号" name="contractNumber">
                                    <Input placeholder="请选择合同编号" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item className="ml10 mr10" label="合同名称" name="contractName">
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
                                <Form.Item label="采购方式" name="purchaseMethodTldt">
                                    <Select placeholder="请选择采购方式" allowClear options={buyWayList} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item className="ml10 mr10" label="合同履行期限" name="performanceStartDate">
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="至" name="performanceEndDate">
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={8}>
                                <Form.Item label="承办部门" name="registerDeptId">
                                    <Input onClick={() => setShowModal('DEPT', 'registerDept')} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item className="ml10 mr10" label="经办人" name="registerIdentityId">
                                    <Input onClick={() => setShowModal('USER', 'registerIdentity')} />
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
                                <Form.Item label="支出类型" name="expenseTypeTldt">
                                    <Select placeholder="请选择支出类型" allowClear options={payTypeList} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    className="ml10 mr10"
                                    label="是否成果转化"
                                    name="isAchievementTransformationTldt"
                                >
                                    <Select
                                        placeholder="请选择是否成果转化"
                                        allowClear
                                        style={{
                                            width: '100%',
                                        }}
                                    >
                                        <Option value={1}>是</Option>
                                        <Option value={0}>否</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="办理状态" name="bizStatus">
                                    <Select placeholder="请选择办理状态" allowClear options={blList} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={8}>
                                <Form.Item label="项目负责人" name="chargeIdentityId">
                                    <Input onClick={() => setShowModal('USER', 'chargeIdentity')} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item className="ml10 mr10" label="当前审批节点" name="actName">
                                    <Select
                                        placeholder="请选择当前审批节点"
                                        allowClear
                                        options={nodeList}
                                        fieldNames={{ value: 'label' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}></Col>
                        </Row>

                        <div className={'flex_center'}>
                            <Button htmlType="submit" className={'mr8'}>
                                查询
                            </Button>
                            <Button onClick={onReset} className={'mr8'}>
                                重置
                            </Button>
                            <Button onClick={() => changeShowAdvSearch(false)}>收起</Button>
                        </div>
                    </Form>
                </div>
            )}

            {selectVisible && <RangModal orgUserType={orgUserType} onBack={onSelectBack} />}

            {exportVisible && (
                <ExportModal
                    bizSolId={bizSolId}
                    fileType={fType}
                    columns={columns}
                    listColumnCodes={columns.map((item) => item.key)}
                    exportSearchWord={exportSearchWord}
                    selectedRowKeys={getSelectListInfoIds()}
                    setExportVisible={setExportVisible}
                />
            )}
        </div>
    );
}

export default connect(({ contractStamped }) => ({
    contractStamped,
}))(SearchCom);
