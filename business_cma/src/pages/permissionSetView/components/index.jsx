import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Empty, message, Modal, Select, Spin, Tabs } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import QuanZhong from '../../../public/assets/quanZhong.png';
import styles from '../index.less';
import { permissionLevel } from './config';
import PermissionModal from './permissionModal';
import RuleModal from './ruleModal';

const { confirm } = Modal;

const Index = ({ dispatch, permissionSetView }) => {
    const {
        loading,
        roleList,
        unitList,
        identityId,
        isInit,
        activeRole,
        sysList,
        isInitSys,
        menuList,
        activeSys,
        isInitRole,
        activeMenu,
        userName,
        isMoreRule,
        ruleInfo,
    } = permissionSetView;

    const { LOCATIONHASH } = useModel('@@qiankunStateFromMaster');
    // 初始化保存identityId
    useEffect(() => {
        let str = LOCATIONHASH();
        let newStr = str.split('?');
        if (newStr.length > 1) {
            console.log(qs.parse(newStr[1]), '---->qs.parse(newStr[1]);');
            let { identityId, userName, userId } = qs.parse(newStr[1]);
            if (identityId) {
                dispatch({
                    type: 'permissionSetView/updateStates',
                    payload: {
                        userName: userName,
                        userId: userId,
                        identityId: identityId,
                        isInit: true,
                    },
                });
            }
        }
    }, []);

    //获取角色列表和所属系统
    useEffect(() => {
        if (isInit) {
            dispatch({
                type: 'permissionSetView/getRoleListFun',
                payload: {
                    identityId: identityId,
                },
                callback: (activeRole) => {
                    getUnitList(activeRole);
                },
            });

            //获取所属系统
            dispatch({
                type: 'permissionSetView/getSysListFun',
                payload: {
                    identityId: identityId,
                },
            });
        }
    }, [isInit]);

    //初始获取菜单
    useEffect(() => {
        if (isInitSys && isInitRole) {
            getMenuList(activeSys, activeRole);
        }
    }, [isInitSys, isInitRole]);

    //获取菜单
    const getMenuList = (registerId, roleId) => {
        dispatch({
            type: 'permissionSetView/getMenuListFun',
            payload: {
                registerId,
                roleId,
            },
        });
    };

    //切换tab获取管理单位列表
    const changeTab = (key) => {
        dispatch({
            type: 'permissionSetView/updateStates',
            payload: {
                activeRole: key,
            },
        });
        getUnitList(key);
        getMenuList(activeSys, key);
    };

    //获取管理单位列表
    const getUnitList = (key) => {
        dispatch({
            type: 'permissionSetView/getUnitListFun',
            payload: {
                identityId,
                roleId: key,
            },
        });
    };

    //删除标签
    const delTag = (info) => {
        confirm({
            title: '确认删除',
            content: '确认要删除此单位吗？',
            onOk() {
                dispatch({
                    type: 'permissionSetView/deleteManageOrg',
                    payload: {
                        roleId: activeRole,
                        orgId: info.orgId,
                    },
                    callback: () => {
                        message.success('删除成功');
                        getUnitList(activeRole);
                    },
                });
            },
        });
    };

    //打开弹窗
    const [showModal, setShowModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({});
    const dealPermission = (info) => {
        if (info.authorityType != 0) {
            setModalInfo(info);
            setShowModal(true);
        }
    };

    const changeSys = (value) => {
        dispatch({
            type: 'permissionSetView/updateStates',
            payload: { activeSys: value },
        });
        getMenuList(value, activeRole);
    };

    const changeMenu = (e) => {
        dispatch({
            type: 'permissionSetView/updateStates',
            payload: { activeMenu: e.target.value },
        });
        dispatch({
            type: 'permissionSetView/getWeightFun',
            payload: {
                roleIdList: [activeRole],
                registerId: [activeSys],
                menuIdList: [e.target.value],
            },
            callback: (ruleCode) => {
                console.log(ruleCode);
                if (permissionLevel.find((item) => item.value == ruleCode)) {
                    dispatch({
                        type: 'permissionSetView/updateStates',
                        payload: {
                            ruleInfo: permissionLevel.find((item) => item.value == ruleCode),
                            isMoreRule: false,
                        },
                    });
                } else {
                    //获取自定义权重值
                    dispatch({
                        type: 'permissionSetView/getCustomWeightFun',
                        payload: {
                            dataRuleCode: ruleCode,
                            dataRuleTypeInfo: 1,
                        },
                        callback: (info) => {
                            dispatch({
                                type: 'permissionSetView/updateStates',
                                payload: {
                                    ruleInfo: {
                                        number: info.dataRuleWeight, //权重值
                                        dataRuleName: info.dataRuleName, //规则名称
                                        ruleCode: ruleCode, //规则编码
                                        searchJson: info.searchJson, //查询条件
                                    },
                                    isMoreRule: true,
                                },
                            });
                        },
                    });
                }
            },
        });
    };

    const goNext = () => {
        console.log(activeRole, identityId, '----->选中的角色id');
        historyPush({
            pathname: `/business_application/meteorological`,
            query: {
                title: '管理单位授权',
                microAppName: 'business_cma',
                url: 'manageUnit',
                mainTableId: dayjs().unix(),
                roleCheckId: activeRole,
                identityId: identityId,
            },
        });
    };

    //查看规则定义
    const [ruleVisible, setRuleVisible] = useState(false);
    const viewRule = () => {
        if (isMoreRule) {
            setRuleVisible(true);
        }
    };

    return (
        <Spin spinning={loading}>
            <div className={'p10 height_100 flex flex_direction_column'}>
                <div className={'f20 gPrimary fb  flex'}>
                    <div className={'flex_1 flex flex_justify_end'}>{`${userName}权限设置查看`}</div>
                    <div className={'flex flex_justify_end flex_1'}>
                        <Button onClick={goNext}>重新分配管理单位</Button>
                    </div>
                </div>
                {/*角色*/}
                <div className={'flex flex_align_center'} style={{ height: '60px' }}>
                    <div style={{ width: '100px' }}>角色：</div>
                    {roleList.length ? (
                        <Tabs className={'flex_1'} items={roleList} onChange={changeTab} />
                    ) : (
                        <div>暂无数据</div>
                    )}
                </div>
                {/*单位名称*/}
                <div className={`flex `} style={{ minHeight: '130px' }}>
                    <div className={'pt5 pb5 height_fit_content'} style={{ width: '100px' }}>
                        单位：
                    </div>
                    <div
                        className={'flex flex_wrap flex_1 height_fit_content'}
                        style={{ maxHeight: '260px', overflowY: 'auto' }}
                    >
                        {unitList.length ? (
                            unitList.map((item, index) => {
                                let isError = item.authorityType != 0;
                                return (
                                    <div
                                        key={index}
                                        className={`mr20  flex  ${isError ? styles.tag_box_error : styles.tag_box}`}
                                    >
                                        <div className={styles.tag_orgName} onClick={() => dealPermission(item)}>
                                            {item.orgName}
                                        </div>
                                        <CloseCircleOutlined onClick={() => delTag(item)} className={styles.tag_icon} />
                                    </div>
                                );
                            })
                        ) : (
                            <Empty />
                        )}
                    </div>
                </div>

                {/*设计相关数据规则*/}
                <div className={'flex mt20 mb10'}>
                    <div className={'flex flex_align_center'}>
                        <div>设计相关数据规则：</div>
                        <Select
                            onSelect={changeSys}
                            value={activeSys}
                            style={{ width: '260px' }}
                            options={sysList}
                            fieldNames={{ label: 'registerName', value: 'registerId' }}
                        />
                    </div>
                </div>

                <div className={'flex flex_1'} style={{ overflowY: 'hidden' }}>
                    <div className={`${styles.check_box}  mr20 flex_1`}>
                        <Checkbox.Group value={[activeMenu]} className={`flex flex_wrap mt10 width_100`}>
                            {menuList.map((item, index) => (
                                <div key={index} className={'mb10'}>
                                    <Checkbox onChange={changeMenu} value={item.menuId}>
                                        {item.menuName}
                                    </Checkbox>
                                </div>
                            ))}
                        </Checkbox.Group>
                    </div>

                    <div className={`flex_1 flex ${styles.check_box}`} style={{ minWidth: '580px' }}>
                        <div className={'flex flex_1 flex_center flex_direction_column'}>
                            {ruleInfo.dataRuleName ? (
                                <div className={'f20 g7f mb20'}>{ruleInfo.dataRuleName}</div>
                            ) : null}
                            <div className={'flex flex_align_center'}>
                                <div className={'f20 g7f '} style={{ minWidth: '80px' }}>
                                    权重值：
                                </div>
                                <div
                                    onClick={viewRule}
                                    className={isMoreRule ? styles.quanzhongText : styles.quanzhongTextClick}
                                >
                                    {' '}
                                    {isMoreRule ? ruleInfo.number : ruleInfo.label}
                                </div>
                            </div>
                        </div>
                        <div className={'flex flex_align_end flex_justify_end flex_1'}>
                            <img className={styles.quanzhongImg} src={QuanZhong} alt="" />
                        </div>
                    </div>
                </div>
            </div>

            {/*权限异常处理弹窗*/}
            {showModal ? (
                <PermissionModal
                    info={modalInfo}
                    changeVisible={setShowModal}
                    getList={() => getUnitList(activeRole)}
                />
            ) : null}

            {/*规则定义弹窗*/}
            {ruleVisible ? <RuleModal info={ruleInfo} changeVisible={setRuleVisible} /> : null}
        </Spin>
    );
};

export default connect(({ permissionSetView }) => ({
    permissionSetView,
}))(Index);
