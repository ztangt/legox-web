import { DownOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Dropdown, Form, Input, InputNumber, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { connect, useModel } from 'umi';
import ExportModal from '../../../components/exportModal';
import { scriptEvent } from '../../../util/performScript';
import styles from '../index.less';
import RangModal from './rangModal';
const tailLayout = {
    wrapperCol: {
        offset: 10,
        span: 16,
    },
};

function SearchCom({ dispatch, contractArchives }) {
    const {
        limit,
        formData,
        columns,
        currentPage,
        reList, //收支合同列表 NKSZHTFL
        typeList, //合同类型 HTLX
        fundList, //经费性质 HTXZ
        fundChaList, //经费渠道 HTZJQD
        buyWayList, //采购方式 QKYCGFS
        isBusList, //是否业务合同

        orgUserType,
        selectVisible,
        formType,
        selectedDataIds,
        selectedDatas,
        selectListInfo,
    } = contractArchives;

    //获取列表
    const getList = (startPage, postData) => {
        let params = postData ? postData : formData;
        dispatch({
            type: 'contractArchives/getList',
            payload: {
                ...params,
                start: startPage,
                limit,
                isOfflineContract: 0, //添加参数：线上合同
            },
        });
    };

    const [searchWord, setSearchWord] = useState(''); //合同编号
    //头部搜索,保存表单数据
    const onSearch = (searchWord) => {
        dispatch({
            type: 'contractArchives/updateStates',
            payload: {
                formData: {
                    searchWord,
                    revenueExpenditureContractType: reList.length ? reList[0].value : '',
                },
            },
        });
        getList(1, {
            searchWord,
            revenueExpenditureContractType: reList.length ? reList[0].value : '',
        });
    };

    const [buttonList, setButtonList] = useState([]);
    const [sctiptMap, setSctiptMap] = useState({});
    // const menus = JSON.parse(globalGetMenus() || '[]');

    const {
        location,
        baseConfirmCma: baseConfirm,
        baseMessageCma: baseMessage,
        baseModalComponmentsCma: baseModalComponments,
        baseIframeModalComponmentsCma: baseIframeModalComponments,
        menus,

        parentDispatch,
        CONFIRM,
        MESSAGE,
        QS,
        LOCATIONHASH,
        UUID,
        fetchAsync,
        DATAFORMAT,
    } = useModel('@@qiankunStateFromMaster'); //不可删除，是为了按钮调用父应用的弹窗

    const { microAppName, url, bizSolId } = location.query;
    //获取按钮
    const loopGetButtonList = (tree, buttonList) => {
        tree.map((item) => {
            if (item.children && item.children.length) {
                loopGetButtonList(item.children, buttonList);
            } else if (item.bizSolId && item.bizSolId == bizSolId) {
                buttonList.push(item.buttonList);
            } else if (item.menuLink == `/${microAppName}/${url}`) {
                buttonList.push(item.buttonList);
            }
        });
        return buttonList;
    };
    useEffect(() => {
        //得倒角色功能授权授权的按钮
        if (menus) {
            //按钮
            let buttonList = [];
            let newButtonList = loopGetButtonList(menus, []);
            if (newButtonList.length) {
                buttonList = newButtonList[0];
                const groupButtonList = _.groupBy(_.orderBy(buttonList, ['groupName'], ['desc']), 'groupName');
                const sctiptMap =
                    buttonList &&
                    buttonList.reduce((pre, cur) => {
                        pre[cur.id] = [cur.beforeEvent, cur.thenEvent, cur.afterEven];
                        return pre;
                    }, {});

                setSctiptMap(sctiptMap);
                setButtonList(groupButtonList);
            }
        }
    }, [menus]);

    const buttonFn = async (code, id, rowInfo, e) => {
        try {
            let fnList = await scriptEvent(sctiptMap[id]);
            let isNull = fnList.filter((i) => i);
            if (!isNull || isNull.length === 0) {
            } else {
                fnList.forEach((item) => {
                    // 送交特殊逻辑判断
                    if (!item.includes('onRule(true)')) {
                        // 执行脚本
                        let fn = eval(item);
                        fn();
                    }
                });
            }
        } catch (e) {
            console.log(e);
        }
    };

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
            type: 'contractArchives/updateStates',
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
                revenueExpenditureContractType: reList.length ? reList[0].value : '',
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

    const [form] = Form.useForm();
    const [showAdvSearch, setShowAdvSearch] = useState(false);
    const changeShowAdvSearch = (isShow) => {
        setShowAdvSearch(isShow);
        dispatch({
            type: 'contractArchives/updateStates',
            payload: {
                showAdvSearch: isShow,
            },
        });
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

        let postData = {
            ...val,
            registerDeptId: deptId ? deptId.join(',') : deptList.id.join(','),
            // chargeIdentityId: headList.id.join(','),
            // registerIdentityId: idenList.id.join(','),
            performanceStartDate: performanceStartDate,
            performanceEndDate: performanceEndDate,
        };
        dispatch({
            type: 'contractArchives/updateStates',
            payload: { formData: { ...postData } },
        });
        getList(1, { ...postData });
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
            type: 'contractArchives/updateStates',
            payload: {
                formType,
                selectVisible: true,
                selectedDataIds: ids,
                orgUserType,
            },
        });
    };

    //重置
    const onReset = async () => {
        form.resetFields();
        await setDeptList({ id: [], data: [] });
        await setIdenList({ id: [], data: [] });
        await setHeadList({ id: [], data: [] });
        onFinish({}, []);
    };

    return (
        <div className={styles.warp} id="contractArchives_head">
            <div className={styles.searchWarp}>
                <div>
                    <Input.Search
                        className={styles.searchInput}
                        placeholder="请输入合同编号"
                        allowClear
                        size="middle"
                        onChange={(e) => setSearchWord(e.target.value)}
                        onSearch={(value) => onSearch(value)}
                    />
                    <Button
                        style={{ marginLeft: '10px' }}
                        onClick={() => {
                            changeShowAdvSearch(true);
                        }}
                    >
                        高级查询
                    </Button>
                </div>
                <div className={styles.search}>
                    {buttonList &&
                        Object.keys(buttonList).map((key, homeIndex) => {
                            if (!key || key == 'null') {
                                return buttonList[key].map((item, codeIndex) => {
                                    if (item.buttonCode != 'update')
                                        return (
                                            <Button
                                                className="ml5"
                                                onClick={() => {
                                                    buttonFn(item.buttonCode, item.id, '');
                                                }}
                                                key={`${item.buttonCode}_${homeIndex}_${codeIndex}`}
                                            >
                                                {item.buttonName}
                                            </Button>
                                        );
                                });
                            } else {
                                return (
                                    <Dropdown overlay={buttonMenu(buttonList[key])} placement="bottom">
                                        <Button className={styles.dropButton}>
                                            {key}
                                            <DownOutlined />
                                        </Button>
                                    </Dropdown>
                                );
                            }
                        })}
                </div>
            </div>
            {showAdvSearch && (
                <div>
                    <Form
                        colon={false}
                        form={form}
                        name="basic"
                        onFinish={onFinish}
                        style={{ width: '100%' }}
                        className={styles.advSearch}
                    >
                        <Row gutter={24}>
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
                                <Form.Item
                                    label="收支合同"
                                    name="revenueExpenditureContractType"
                                    initialValue={reList[0].value}
                                >
                                    <Select placeholder="请选择收支合同" allowClear options={reList} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item label="合同类型" name="contractTypeTldt">
                                    <Select placeholder="请选择合同类型" allowClear options={typeList} />
                                </Form.Item>
                            </Col>
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
                        </Row>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item label="采购方式" name="purchaseMethodTldt">
                                    <Select placeholder="请选择采购方式" allowClear options={buyWayList} />
                                </Form.Item>
                            </Col>
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
                        </Row>
                        <Row gutter={24}>
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
                        </Row>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item label="项目名称" name="projectName">
                                    <Input placeholder="请输入项目名称" />
                                </Form.Item>
                            </Col>
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
                        </Row>
                        <Row gutter={24}>
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
                        </Row>
                        <Form.Item {...tailLayout}>
                            <Button htmlType="submit">查询</Button>
                            <Button onClick={onReset} style={{ margin: '0 30px' }}>
                                重置
                            </Button>
                            <Button onClick={() => changeShowAdvSearch(false)}>取消</Button>
                        </Form.Item>
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
                />
            )}
        </div>
    );
}

export default connect(({ contractArchives }) => ({
    contractArchives,
}))(SearchCom);
