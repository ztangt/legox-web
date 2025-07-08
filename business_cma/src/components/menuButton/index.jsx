import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { scriptEvent } from '../../util/performScript';
//在每个页面的自定义事件，作为props传给menuButton,不可删除,暂时这么写，后续想到办法再优化
export default ({
    //报账卡管理
    openFormDetail,
    handleDelete,
    startUse,
    stopUse,
    regainItem,
    cancelRegainItem,
    warningSet,
    carryList,
    carryProject,
    onDownLoadTemplate,
    onImportClick,
    onExport,
    getRows,
    bizSolId, //业务解决方案id,优先使用传过来的
    //合同台账
    getData,
    resetListInfo,
    getListModelData,
    getExportJson,

    selectListInfo, //合同选中列表
    tabButton,
    sateType,
}) => {
    const {
        CONFIRM,
        DATAFORMAT,
        LOCATIONHASH,
        MESSAGE,
        QS,
        UUID,
        baseConfirmCma: baseConfirm,
        baseIframeModalComponmentsCma: baseIframeModalComponments,
        baseMessageCma: baseMessage,
        baseModalComponmentsCma: baseModalComponments,

        container,
        domElement,
        fetchAsync,
        location,
        menus,
        mountParcel,
        name,
        onGlobalStateChange,
        onHistoryInit,
        openNewPage,
        parentDispatch,
        parentDispatch: dispatch,
        setGlobalState,
        setLoading,
        singleSpa,
        unmountSelf,
        __globalRoutesInfo,

        setTableModalParams,
        setIsTableModal,
        divId,
    } = useModel('@@qiankunStateFromMaster'); //不可删除，是为了按钮调用父应用的弹窗

    // console.log(useModel('@@qiankunStateFromMaster'), "useModel('@@qiankunStateFromMaster')");

    if (!bizSolId) {
        bizSolId = location.query.bizSolId;
    }
    let { url, microAppName } = location.query;
    const [buttonList, setButtonList] = useState([]);
    const [sctiptMap, setSctiptMap] = useState({});

    // const removeMenuId = (str) => {
    //     let index = str.indexOf('&menuId');
    //     if (index !== -1) {
    //         str = str.substring(0, index);
    //     }
    //     return str;
    // };
    // //如果url中有menuId,去掉然后再进行与menuLink的比较,解决因为主项目多添加menuId导致按钮不显示的问题
    // url = removeMenuId(url);

    //获取按钮
    const loopGetButtonList = (tree, buttonList) => {
        tree.map((item) => {
            let resLink = `/${microAppName}/${url}`;
            if (item.children && item.children.length) {
                loopGetButtonList(item.children, buttonList);
            } else if (item.bizSolId && item.bizSolId == bizSolId) {
                buttonList.push(item.buttonList);
            } else if (item.menuLink && resLink.includes(item.menuLink)) {
                //修改判断方式，解决url跳转回来多添加参数按钮不显示问题
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
            let tabButtons = JSON.parse(tabButton || '[]'); //获取对应页签button数据
            let curTabButton = tabButtons.filter((item) => {
                return item.key == sateType;
            }); //当前页签下的button
            if (newButtonList.length) {
                buttonList = newButtonList[0];
                if (curTabButton.length) {
                    buttonList = buttonList.filter((item) => {
                        return curTabButton[0]?.value?.includes(item.buttonName);
                    });
                }
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
    }, [menus, sateType]);

    const buttonMenu = (group) => {
        return (
            <Menu>
                {group.map((item) => {
                    if (item.buttonCode != 'update') {
                        return (
                            <Menu.Item
                                key={item.buttonCode}
                                onClick={() => {
                                    buttonFn(item.buttonCode, item.id, '');
                                }}
                            >
                                <span>{item.buttonName}</span>
                            </Menu.Item>
                        );
                    }
                })}
            </Menu>
        );
    };
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
    return (
        <div className="flex flex_wrap flex_align_center">
            {buttonList &&
                Object.keys(buttonList).map((key, homeIndex) => {
                    if (!key || key == 'null') {
                        return buttonList[key].map((item, codeIndex) => {
                            if (item.buttonCode != 'update')
                                return (
                                    <Button
                                        className="ml8 mb4"
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
                            <Dropdown menu={buttonMenu(buttonList[key])} placement="bottom">
                                <Button>
                                    {key}
                                    <DownOutlined />
                                </Button>
                            </Dropdown>
                        );
                    }
                })}
        </div>
    );
};
