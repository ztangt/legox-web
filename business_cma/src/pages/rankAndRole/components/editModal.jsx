import React, { useEffect, useState, useMemo, useRef } from 'react';
import { connect } from 'dva';
import { Button, message, Checkbox } from 'antd';
import { history } from 'umi';
import GlobalModal from '../../../components/GlobalModal';
import BaseForm from '../../../components/baseFormMix';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import { configData } from './config';
import { BASE_WIDTH } from '../../../util/constant';
import { modalCurrentHeight } from '../../../util/util';
import styles from '../index.less';

const EditModal = ({ dispatch, onCancel, editStatus, rangAndRole, selectRowItem, getTableList, searchLimit }) => {
    const { limit, returnCount, currentPage, rankModalList, rankEditModalSelect } = rangAndRole;
    delete configData.rankArrList[0];
    const [selectRowKey, setSelectRowKey] = useState([]);
    const [addCheckBox, setAddCheckBox] = useState([]);
    const [selectKey, setSelectKey] = useState([]);
    const [searchWord, setSearchWord] = useState('');
    const [curHeight, setCurHeight] = useState(0);
    const selectRankLevel =
        editStatus == 'EDIT' ? selectRowItem && selectRowItem.length > 0 && selectRowItem[0].cmaPositionLevel : [];
    const confirm = () => {
        if (!addCheckBox.length || !selectRowKey.length) {
            if (editStatus != 'EDIT' && !addCheckBox.length) {
                message.error('请勾选左侧职级');
                return;
            }
            if (!selectRowKey.length) {
                message.error('请勾选右侧角色列表');
                return;
            }
            onCancel();

            if (editStatus == 'ADD') {
                return;
            }
        }
        const arr =
            selectRowKey && selectRowKey.length > 0
                ? selectRowKey.map((item) => {
                      const obj = {
                          roleId: item.id,
                          roleName: item.roleName,
                          roleCode: item.roleCode,
                          roleTag: item.roleTag,
                          roleDesc: item.roleDesc,
                      };
                      return obj;
                  })
                : [];
        editStatus == 'ADD'
            ? dispatch({
                  type: 'rangAndRole/saveRankAndRole',
                  payload: {
                      cmaPositionLevelList: (addCheckBox && addCheckBox.length > 0 && addCheckBox.join(',')) || '',
                      roleList: JSON.stringify(arr),
                  },
                  callback() {
                      onCancel(true);
                      getTableList(searchWord, 1, searchLimit);
                  },
              })
            : dispatch({
                  type: 'rangAndRole/saveModalByEdit',
                  payload: {
                      cmaPositionLevelList:
                          selectRowItem && selectRowItem.length > 0 ? selectRowItem[0].cmaPositionLevel : '',
                      roleList: JSON.stringify(arr),
                  },
                  callback() {
                      onCancel(true);
                      getTableList(searchWord, 1, searchLimit);
                  },
              });
    };
    useEffect(() => {
        editModalGetList('', 1, limit);
        setCurHeight(modalCurrentHeight());
    }, []);
    useEffect(() => {
        const editSelectArr = rankEditModalSelect.length > 0 ? rankEditModalSelect.map((item) => item.roleId) : [];
        setSelectKey(editSelectArr);
    }, [rankEditModalSelect]);
    const editModalGetList = (searchWord = '', start = 1, limit) => {
        dispatch({
            type: 'rangAndRole/getEditModalList',
            payload: {
                searchWord,
                start,
                limit,
            },
        });
    };
    const onCheckboxChange = (checkedValues) => {
        setAddCheckBox(checkedValues);
    };
    // 页面变化
    const changePage = (nextPage, size) => {
        editModalGetList(searchWord, nextPage, size);
    };
    // 查询回调
    const callback = (value) => {
        setSearchWord(value.inputRoleName);
        editModalGetList(value.inputRoleName, 1, limit);
    };
    const list = [
        {
            fieldtype: 'input',
            key: 'inputRoleName',
            label: '角色名称', // label+placeholder
            required: false, // 校验
            showLabel: false, // 是否显示label
            isSearch: true, //input是否是搜索组件
        },
    ];
    const config = {
        list: list,
        callback: callback,
        initialValues: {
            inputRoleName: '',
        },
    };

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(selectedRows, 'selectedRows', selectedRowKeys);
            setSelectRowKey(selectedRows);
            setSelectKey(selectedRowKeys);
        },
        selectedRowKeys: selectKey,
    };
    const tableProps = {
        rowKey: 'id',
        columns: [
            {
                title: '序号',
                dataIndex: 'number',
                width: 60,
            },
            {
                title: '角色名称',
                dataIndex: 'roleName',
                width: BASE_WIDTH * 1.5,
            },
            {
                title: '角色编码',
                dataIndex: 'roleCode',
            },
            {
                title: '角色简称',
                dataIndex: 'roleTag',
            },
            {
                title: '角色描述',
                dataIndex: 'roleDesc',
            },
        ],
        dataSource:
            rankModalList &&
            rankModalList.length > 0 &&
            rankModalList.map((item, index) => {
                item.number = index + 1;
                return item;
            }),
        pagination: false,
        bordered: true,
        showSorterTooltip: false,
    };
    console.log('rankEditModalSelect', rankEditModalSelect, 'rankModalList', rankModalList);
    return (
        <GlobalModal
            title={editStatus == 'ADD' ? '新增' : '修改'}
            open={true}
            onCancel={onCancel}
            onOk={confirm}
            top={'3%'}
            okText="保存"
            getContainer={() => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            }}
            maskClosable={false}
            mask={false}
            modalSize="lager"
        >
            <div className={styles.rank_modal_box} id="modal_container">
                <div id="modal_list_head">
                    <BaseForm inline={true} {...config}></BaseForm>
                </div>
                <div className="_flex_justify_content_between">
                    <div className={styles.rank_modal_checkbox}>
                        {editStatus == 'EDIT' ? (
                            <div>{configData.rankLevel[selectRankLevel]}</div>
                        ) : (
                            <Checkbox.Group
                                style={{
                                    display: 'block',
                                }}
                                //   defaultValue={selectCheck}
                                onChange={onCheckboxChange}
                            >
                                {configData.rankArrList.map((item) => (
                                    <div key={item.id}>
                                        <Checkbox value={item.id}>{item.name}</Checkbox>
                                    </div>
                                ))}
                            </Checkbox.Group>
                        )}
                    </div>
                    <div className="_flex_1" style={{ width: 600 }}>
                        <ColumnDragTable
                            rowSelection={{
                                type: 'checkbox',
                                ...rowSelection,
                            }}
                            taskType="MONITOR"
                            tableLayout="fixed"
                            modulesName="rangAndRole"
                            {...tableProps}
                            scroll={{ y: curHeight, x: 'auto' }}
                        ></ColumnDragTable>
                    </div>
                    <IPagination
                        current={Number(currentPage)}
                        total={returnCount}
                        onChange={changePage}
                        pageSize={limit}
                        isRefresh={true}
                        style={{ paddingRight: 0 }}
                        refreshDataFn={() => {
                            editModalGetList(searchWord, currentPage, limit);
                        }}
                    />
                </div>
            </div>
        </GlobalModal>
    );
};

export default connect(({ rangAndRole, layoutG }) => ({
    rangAndRole,
    layoutG,
}))(EditModal);
