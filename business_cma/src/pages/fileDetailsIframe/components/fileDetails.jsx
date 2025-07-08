import { Button } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import ColumnDragTable from '../../../components/columnDragTable';
import { ORDER_WIDTH } from '../../../util/constant';
import styles from '../index.less';
import UploadFile from './uploadFile';

function fileDetails({ dispatch, fileDetailsIframe }) {
    const [currentName, setCurrentName] = useState('');
    const { fileList, isShowModal } = fileDetailsIframe;
    const {
        paramsObj,
        location,
        baseConfirmCma: baseConfirm,
        baseMessageCma: baseMessage,
        baseModalComponmentsCma: baseModalComponments,
        baseIframeModalComponmentsCma: baseIframeModalComponments,
        LOCATIONHASH,
    } = useModel('@@qiankunStateFromMaster'); //不可删除，是为了按钮调用父应用的弹窗
    console.log(baseModalComponments, 'baseModalComponments');
    console.log(paramsObj, 'url==');
    let urls = LOCATIONHASH();
    let params = getUrlParams(urls);
    const menus = JSON.parse(window.localStorage.getItem('menusList'));
    function getUrlParams(url) {
        let params = [];
        let query = url.split('?');
        if (query.length == 2) {
            let vars = query[1].split('&');
            for (let i = 0; i < vars.length; i++) {
                let pair = vars[i].split('=');
                params[pair[0]] = pair[1];
            }
        }
        return params;
    }
    useEffect(() => {
        if (params.projectId) {
            dispatch({
                type: 'fileDetailsIframe/getAllProfileInfoList',
                payload: {
                    logicCode: params.logicCode,
                    projectId: params.projectId,
                    flag: params.flag,
                },
            });
        } else {
            if (JSON.stringify(paramsObj) == '{}' || !paramsObj) {
                dispatch({
                    type: 'fileDetailsIframe/getFileDatails',
                    payload: {
                        logicCode: 'DA10001',
                    },
                });
            } else {
                dispatch({
                    type: 'fileDetailsIframe/getAllProfileInfoList',
                    payload: paramsObj,
                });
            }
        }
        if (menus.length) {
            const res = selectNodeById(menus, params.bizSolId);
            setCurrentName(res?.menuName);
        }
    }, []);
    function selectNodeById(list, targetId) {
        if (!list) return;
        let nodeTree = null;
        for (let i = 0; i < list.length; i++) {
            if (nodeTree !== null) break;
            let node = list[i];
            if (node.bizSolId === targetId) {
                nodeTree = node;
                break;
            } else {
                if (Array.isArray(node.children) && node.children.length) {
                    nodeTree = selectNodeById(node.children, targetId);
                }
            }
        }
        return nodeTree;
    }

    const columns = [
        {
            title: '项目阶段',
            dataIndex: 'PROJECT_NAME',
            render: (text, record) => {
                return {
                    children: <span>{text}</span>,
                    props: {
                        rowSpan: record.rowspan,
                    },
                };
            },
        },
        {
            title: '序号',
            dataIndex: 'NUMBER',
            width: ORDER_WIDTH,
        },
        {
            title: '文件类型',
            dataIndex: 'PROFILE_TYPE',
        },
        {
            title: '是否必填',
            dataIndex: 'IS_REQUIRED_TLDT_',
            render: (text) => <span>{text == '0' ? '否' : '是'}</span>,
        },
        {
            title: '操作',
            // dataIndex:'',
            render: (text, record) => (
                <a
                    onClick={() => {
                        downLoadUrl(record);
                    }}
                >
                    下载
                </a>
            ),
        },
    ];
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            localStorage.setItem('fileDetailData', JSON.stringify(selectedRows));
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };
    const downLoadUrl = (record) => {
        if (record.PROFILE_FILE.length) global.location.href = record.PROFILE_FILE[0].fileUrl;
    };

    function groupBy(objectArray, property) {
        return objectArray.reduce(function (acc, obj) {
            let key = obj[property];
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
        }, {});
    }
    //打包下载
    const packageDownload = () => {
        const newList = [];
        const groupList = groupBy(fileList, 'PROJECT_NAME');
        for (const key in groupList) {
            if (Object.hasOwnProperty.call(groupList, key)) {
                const element = groupList[key];
                element.forEach((item) => {
                    newList.push({
                        bizTitle: key,
                        fjName: [
                            {
                                label: item.PROFILE_TYPE,
                                list: [{ filePath: item.PROFILE_FILE && item.PROFILE_FILE[0].filePath }],
                            },
                        ],
                    });
                });
            }
        }
        const result = newList.reduce((acc, curr) => {
            const existing = acc.find((element) => element.bizTitle === curr.bizTitle);
            console.log(existing, 'existing');
            if (existing) {
                existing.fjName.push(...curr.fjName);
            } else {
                acc.push(curr);
            }
            return acc;
        }, []);
        dispatch({
            type: 'fileDetailsIframe/getFileZip',
            payload: {
                filePaths: JSON.stringify(result),
                zipName: '下载文件',
            },
        });
    };
    const goBack = () => {
        history.back();
    };
    const buttonEvents = {};

    const uploadFile = () => {
        dispatch({
            type: 'fileDetailsIframe/updateStates',
            payload: {
                isShowModal: true,
            },
        });
    };

    return (
        <div id="fileDetailsIframe">
            {/* <div className="flex_1 flex flex_justify_end mt10 mb10 pr5">
                <MenuButton />
                <Button
                    className="mr5"
                    onClick={() => {
                        packageDownload();
                    }}
                >
                    打包下载
                </Button>
            </div> */}

            <div className={styles.fileDetails_button}>
                <span>
                    {params.projectId && <Button onClick={uploadFile}>上传</Button>}
                    <Button
                        className="mr5"
                        onClick={() => {
                            packageDownload();
                        }}
                    >
                        打包下载
                    </Button>
                </span>
            </div>

            <ColumnDragTable
                taskType="MONITOR"
                tableLayout="fixed"
                modulesName="fileDetailsIframe"
                columns={columns}
                dataSource={fileList}
                pagination={false}
                bordered
                scroll={{ y: 'calc(100vh - 222px)' }}
                rowSelection={
                    (JSON.stringify(paramsObj) == '{}' || !paramsObj) && !params.projectId
                        ? {
                              ...rowSelection,
                          }
                        : false
                }
            />
            {isShowModal && <UploadFile projectId={params.projectId} logicCode={params.logicCode} flag={params.flag} />}
        </div>
    );
}
export default connect(({ fileDetailsIframe }) => ({ fileDetailsIframe }))(fileDetails);
