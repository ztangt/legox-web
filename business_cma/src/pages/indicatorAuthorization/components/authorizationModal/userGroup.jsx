import { Checkbox, message, Modal } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import styles from './index.less';
const CheckboxGroup = Checkbox.Group;

const userGroup = ({ dispatch, indicatorNamespace, changeTargetKeys, isDisabled, getParams, id, isUnit }) => {
    const [transferData, setTransferData] = useState([]);
    const [targetKeys, setTargetKeys] = useState([]);
    const { userGroupList, rightSelectedData } = indicatorNamespace;
    // 获取数据
    const getTransferData = () => {
        dispatch({
            type: 'indicatorNamespace/getUserGroupList',
            payload: {
                limit: 1000000,
                searchWord: '',
                start: 1,
                searchType: getParams.param1,
            },
        });
    };
    useEffect(() => {
        onChange(rightSelectedData);
    }, [rightSelectedData, userGroupList]); //不可去掉
    useEffect(() => {
        getTransferData();
    }, []);

    const [checkedKeys, setCheckedKeys] = useState([]);
    const [checkedList, setCheckedList] = useState([]);
    const [indeterminate, setIndeterminate] = useState(false);
    const [checkAll, setCheckAll] = useState(false);

    useEffect(() => {
        changeTargetKeys(checkedKeys);
    }, [checkedKeys]);

    const onChange = (list) => {
        let newList = userGroupList.filter((item) => list.includes(item.key));
        setCheckedKeys(list);
        setCheckedList(newList);
        setCheckAll(list.length == userGroupList.length);
    };
    const onCheckAllChange = (e) => {
        setCheckedList(userGroupList);
        let allKeys = userGroupList.map((item) => item.key);
        setCheckedKeys(allKeys);
        setCheckAll(true);
    };

    const delChoose = (info) => {
        //查看模式的清空
        if (isDisabled) {
            Modal.confirm({
                title: '提示',
                content: `确认删除此授权？`,
                okText: '确定',
                getContainer: () => {
                    return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                },
                maskClosable: false,
                mask: false,
                onOk: () => {
                    dispatch({
                        type: 'indicatorNamespace/deleteAuthorization',
                        payload: {
                            deleteId: info.id,
                            searchType: getParams.param1,
                            deleteType: 'ONE',
                            authType: 1, //用户组的单个删除传1
                            id,
                        },
                        callback() {
                            let newKeys = checkedKeys.filter((item) => item != info.key);
                            onChange(newKeys);
                            message.success('删除授权成功！');
                        },
                    });
                },
            });
        } else {
            //非查看模式的清空
            let newKeys = checkedKeys.filter((item) => item != info.key);
            onChange(newKeys);
        }
    };
    return (
        <div className={styles.userGroupBox} style={{ height: `calc(100% - ${isUnit ? 90 : 48}px)` }}>
            <div className="flex pb10 height_100">
                <div className={styles.userGroupItemLeft}>
                    <div className={styles.allCheckBox}>
                        <Checkbox
                            disabled={isDisabled}
                            indeterminate={indeterminate}
                            onChange={onCheckAllChange}
                            checked={checkAll}
                        >
                            全选
                        </Checkbox>
                    </div>
                    <div className={styles.checkboxGroup}>
                        <CheckboxGroup value={checkedKeys} onChange={onChange}>
                            {userGroupList.map((item, index) => (
                                <div key={`Checkbox${index}`} className="mt5 mb5">
                                    <Checkbox disabled={isDisabled} value={item.key}>
                                        {item.ugName}
                                    </Checkbox>
                                </div>
                            ))}
                        </CheckboxGroup>
                    </div>
                </div>
                <div className={styles.userGroupItemRight}>
                    <div className={styles.hasChooseTitle}>
                        已选择<span style={{ color: '#1890ff' }}>（{checkedList.length}）</span>
                    </div>
                    <div className={styles.hasChooseBox}>
                        {checkedList.map((item, index) => (
                            <div
                                className="flex pl10 pt5 pb5 pr10 flex_justify_between"
                                style={{ borderBottom: '1px solid #d9d9d9' }}
                                key={`item${index}`}
                            >
                                <div>{item.ugName}</div>
                                <div className="primaryColor" onClick={() => delChoose(item)}>
                                    删除
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default connect(({ indicatorNamespace }) => ({ indicatorNamespace }))(userGroup);
