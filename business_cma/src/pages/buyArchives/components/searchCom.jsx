import { DownOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Form, Input, InputNumber, Row } from 'antd';
import { useEffect, useState } from 'react';
import { connect, useModel } from 'umi';
import ExportModal from '../../../components/exportModal';
import { scriptEvent } from '../../../util/performScript';
import styles from '../index.less';
import { tailLayout } from './config';

function SearchCom({ dispatch, buyArchives }) {
    const { limit, formData, columns, selectListInfo, currentPage } = buyArchives;
    //获取列表,传值就是开始页数和查询条件
    const getList = (startPage, postData) => {
        dispatch({
            type: 'buyArchives/getList',
            payload: { ...postData, start: startPage, limit },
        });
    };
    //头部搜索,保存表单数据
    const onSearch = (newName, newCode) => {
        let postData = {
            entrustProjectName: newName,
            entrustProjectNo: newCode,
        };
        dispatch({
            type: 'buyArchives/updateStates',
            payload: { formData: postData },
        });
        getList(1, postData);
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
        return { listInfo: selectListInfo };
    };
    const resetListInfo = () => {
        dispatch({
            type: 'buyArchives/updateStates',
            payload: {
                ids: [],
                selectListInfo: [],
            },
        });
    };
    const getListModelData = () => {
        getList(currentPage, formData);
    };
    const getExportJson = () => {
        let obj = {};
        columns.forEach((item) => {
            let { key, columnName } = item;
            obj[key] = columnName;
        });
        return {
            seniorSearchInfo: formData,
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

    const [name, setName] = useState(''); //项目名称
    const [code, setCode] = useState(''); //项目编号
    const [more, setMore] = useState(false);
    const [form] = Form.useForm();
    //查询
    const onFinish = (val) => {
        dispatch({
            type: 'contractLedger/updateStates',
            payload: { formData: { ...val } },
        });
        getList(1, { ...val });
    };
    //重置
    const onReset = () => {
        form.resetFields();
        onFinish({});
    };

    const changeShowAdvSearch = (isShow) => {
        setMore(isShow);
        dispatch({
            type: 'buyArchives/updateStates',
            payload: {
                showAdvSearch: isShow,
            },
        });
    };
    return (
        <div className={styles.warp} id="buyArchives_head">
            <div className={styles.searchWarp}>
                <div className="flex">
                    <Input.Search
                        className={styles.searchInput}
                        placeholder="请输入项目名称"
                        allowClear
                        size="middle"
                        onChange={(e) => setName(e.target.value)}
                        onSearch={(value) => onSearch(value, code)}
                    />
                    <Input.Search
                        className={styles.searchInput}
                        placeholder="请输入项目编号"
                        allowClear
                        size="middle"
                        onChange={(e) => setCode(e.target.value)}
                        onSearch={(value) => onSearch(name, value)}
                    />
                    <Button onClick={() => changeShowAdvSearch(true)}>高级查询</Button>
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
            {more && (
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
                                <Form.Item label="事项申请编号" name="purchaseRegisterNumber">
                                    <Input placeholder="请输入事项申请编号" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="事项申请名称" name="purchaseName">
                                    <Input placeholder="请输入事项申请名称" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="政采项目编号" name="entrustProjectNo">
                                    <Input placeholder="请输入项目编号" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item label="政采项目名称" name="entrustProjectName">
                                    <Input placeholder="请输入项目名称" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="采购预算项目" name="projectCode">
                                    <Input placeholder="请输入采购预算项目" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="采购预算金额" name="projectName">
                                    <InputNumber min={0} className="width_100" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item label="采购单位名称" name="registerOrgName">
                                    <Input placeholder="请输入采购单位名称" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item {...tailLayout}>
                            <Button htmlType="submit">查询</Button>
                            <Button onClick={onReset} style={{ margin: '0 30px' }}>
                                {' '}
                                重置
                            </Button>
                            <Button onClick={() => changeShowAdvSearch(false)}>收起</Button>
                        </Form.Item>
                    </Form>
                </div>
            )}
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

export default connect(({ buyArchives }) => ({
    buyArchives,
}))(SearchCom);
