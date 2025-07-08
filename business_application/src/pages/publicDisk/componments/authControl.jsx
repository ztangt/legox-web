import { connect } from 'dva';
import { Card , Button, Modal } from 'antd';
import RelevanceModal from '../../../componments/relevanceModal/relevanceModal';
import GlobalModal from '../../../componments/GlobalModal';
import { useState } from 'react';
import Table from '../../../componments/columnDragTable'
import _ from 'lodash';
import {
  EyeOutlined,
  MessageOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons';
import styles from './authcontrol.less';

function AuthControl({ dispatch, publicDisk }) {
  const {
    authlist,
    selectedDatas,
    oldSelectedDatas,
    oldSelectedDataIds,
    selectedKeysValue,
    selectedPublicKey,
  } = publicDisk;
  const [ORGRelvanceModal, setORGRelvanceModal] = useState(false);
  const [USERRelvanceModal, setUSERRelvanceModal] = useState(false);
  const [selectedRowsKeys,setSelectedRowsKeys] = useState([])
  const accessColumns = [
    {
      title: '部门或人员',
      dataIndex: 'operation ',
      key: 'operation ',
      width: 150,
      render: (text, obj) => (
        <div>
          {obj.operation == 'ORG'
            ? obj.orgName
            : obj.operation == 'USER'
            ? obj.authUserName
            : obj.authUserName}
        </div>
      ),
    },
    {
      title: '是否可见',
      dataIndex: 'visual',
      key: 'visual',
      width: 80,
      // render: (text) => <div>{text == 0 ? <EyeOutlined /> : text == 1 ? <></> : <></>}</div>
      render: (text) => <div>{text == 1 ? <EyeOutlined /> : <></>}</div>,
    },
    {
      title: '是否可下载',
      dataIndex: 'download',
      key: 'download',
      width: 100,
      // render: (text) => <div>{text == 0 ? <VerticalAlignBottomOutlined /> : text == 1 ? <></> : <></>}</div>
      render: (text) => (
        <div>{text == 1 ? <VerticalAlignBottomOutlined /> : <></>}</div>
      ),
    },
    {
      title: '是否可查看详情',
      dataIndex: 'see',
      key: 'see',
      width: 130,
      // render: (text) => <div>{text == 0 ? <MessageOutlined /> : text == 1 ? <></> : <></>}</div>
      render: (text) => <div>{text == 1 ? <MessageOutlined /> : <></>}</div>,
    },
    {
      title: '操作',
      key: 'action',
      width: 130,
      render: (text, round) => (
        <a onClick={err.bind(this, text, round)}>删除</a>
      ),
    },
  ];
  const err = (e, text, round) => {
    let newData = _.cloneDeep(authlist);
    for (let key in newData) {
      if (authlist[key].id == text.id) {
        newData.splice(key, 1);
      }
    }
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        authlist: newData,
        commentsRows: [],
        commentsRowsKeys: '',
        radioSeeValue: 0,
        radioDownloadValue: 0,
        radioDetailValue: 0,
      },
    });
    console.log(newData, 'newData=============');
  };

  const accessSelection = {
    onChange: (rowKeys, rows) => {
      setSelectedRowsKeys(rowKeys)
      dispatch({
        type: 'publicDisk/updateStates',
        payload: {
          commentsRows: rows,
          commentsRowsKeys: rowKeys,
          radioSeeValue: rows[0].visual == 1 ? 1 : 0,
          radioDownloadValue: rows[0].download == 1 ? 1 : 0,
          radioDetailValue: rows[0].see == 1 ? 1 : 0,
        },
      });
    },
    selectedRowKeys:selectedRowsKeys
  };

  const addEveryone = () => {
    let count = 0;
    if (authlist.length > 0) {
      for (let i = 0; i < authlist.length; i++) {
        if (authlist[i].operation == 'EVERYONE') {
          count++;
        }
      }
      if (count == 0) {
        let accessList = _.cloneDeep(authlist);
        accessList.push({
          cloudDiskId: selectedPublicKey,
          operation: 'EVERYONE',
          authUserId: '',
          authUserName: '所有人',
          orgId: '',
          orgName: '',
          visual: 1,
          download: 1,
          see: 1,
          parent: selectedKeysValue,
          id: 123456,
        });
        dispatch({
          type: 'publicDisk/updateStates',
          payload: {
            authlist: accessList,
          },
        });
      }
    } else {
      let accessList = _.cloneDeep(authlist);
      accessList.push({
        cloudDiskId: selectedPublicKey,
        operation: 'EVERYONE',
        authUserId: '',
        authUserName: '所有人',
        orgId: '',
        orgName: '',
        visual: 1,
        download: 1,
        see: 1,
        parent: selectedKeysValue,
      });
      dispatch({
        type: 'publicDisk/updateStates',
        payload: {
          authlist: accessList,
        },
      });
    }
  };

  const delSelect = () => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        authlist: [],
      },
    });
  };

  const okORG = () => {
    let newAcc = JSON.parse(JSON.stringify(authlist));
    selectedDatas&&selectedDatas.map((item) => {
      let info = _.find(authlist, { orgId: item.nodeId });
      if (typeof info == 'undefined') {
        newAcc.push({
          cloudDiskId: selectedPublicKey,
          operation: 'ORG',
          authUserName: '',
          authUserId: '',
          orgId: item.nodeId,
          orgName: item.nodeName,
          visual: 1,
          download: 1,
          see: 1,
          parent: selectedKeysValue,
          id: item.nodeId,
        });
      }
    });
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        authlist: newAcc,
      },
    });
    setORGRelvanceModal(false);
    let newData = [];
    for (let key in newAcc) {
      if (newAcc[key].operation != 'EVERYONE') {
        newData.push({
          nodeName: newAcc[key].orgName,
          nodeId: newAcc[key].orgId,
        });
      }
    }
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        selectedDatas: newData,
        oldSelectedDatas: newData,
      },
    });
  };
  // 添加身份id
  const okUSER = () => {
    let newAcc = JSON.parse(JSON.stringify(authlist));
    
    selectedDatas.map((item) => {
      let info = _.find(authlist, { authUserId: item.nodeId });
      if (typeof info == 'undefined') {
        newAcc.push({
          cloudDiskId: selectedPublicKey,
          operation: 'USER',
          authUserName: item.userName,
          authUserId: item.userId,
          authIdentityId: item.identityId,
          orgId: '',
          orgName: '',
          visual: 1,
          download: 1,
          see: 1,
          parent: selectedKeysValue,
          id: item.nodeId,
        });
      }
    });
    // console.log("newAcc=0",newAcc)
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        authlist: newAcc,
      },
    });
    setUSERRelvanceModal(false);
    let newData = [];
    for (let key in newAcc) {
      if (newAcc[key].operation != 'EVERYONE') {
        newData.push({
          nodeName: newAcc[key].authUserName,
          nodeId: newAcc[key].authUserId,
        });
      }
    }
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        selectedDatas: newData,
        oldSelectedDatas: newData,
      },
    });
  };
  const cancelORG = () => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        selectedDatas: oldSelectedDatas,
        selectedDataIds: oldSelectedDataIds,
      },
    });
    setORGRelvanceModal(false);
  };
  const cancelUSER = () => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        selectedDatas: oldSelectedDatas,
        selectedDataIds: oldSelectedDataIds,
      },
    });
    setUSERRelvanceModal(false);
  };

  return (
    <>
      <div className={styles.buttons}>
        <div className={styles.buttonTitle}>选择分类</div>
        <Button type="primary" onClick={addEveryone}>
          添加所有人
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setORGRelvanceModal(true);
          }}
        >
          添加组织
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setUSERRelvanceModal(true);
          }}
        >
          添加用户
        </Button>
        <Button type="primary" onClick={delSelect}>
          移除所有
        </Button>
      </div>

      <div className={styles.authList}>
        <div className={styles.authListTitle}>已选数据</div>
        <Table
          className={styles.list}
          rowKey={(record, index) => {
            const operationMap = {
              USER: 'authUserId',
              ORG: 'orgId',
            };

            return `${index}-${record[operationMap[record.operation]]}`;
          }}
          onRow= {
            (record,index)=>{
              return {
                onClick: event => {
                  const operationMap = {
                    USER: 'authUserId',
                    ORG: 'orgId',
                  };
      
                  const rowIndex = `${index}-${record[operationMap[record.operation]]}`;
                  setSelectedRowsKeys([rowIndex])
                  dispatch({
                    type: 'publicDisk/updateStates',
                    payload: {
                      commentsRows: [record],
                      commentsRowsKeys: [rowIndex],
                      radioSeeValue: record.visual == 1 ? 1 : 0,
                      radioDownloadValue: record.download == 1 ? 1 : 0,
                      radioDetailValue: record.see == 1 ? 1 : 0,
                    },
                  });
                }
              }
            }
          }
          columns={accessColumns}
          rowSelection={{ type: 'radio', ...accessSelection }}
          dataSource={authlist}
          pagination={false}
          key={authlist}
          scroll={{y:'calc(100% - 50px)'}}
        />
      </div>
      {ORGRelvanceModal && (
        <GlobalModal
          widthType={3}
          title="选择组织机构"
          mask={false}
          visible={true}
          onOk={okORG}
          onCancel={cancelORG}
          className={styles.modalWarp}
          bodyStyle={{ padding: '16px 0px 0px 0px' }}
          getContainer={() => {
            return document.getElementById('container_public')||false;
          }}
        >
          <RelevanceModal
            nameSpace="publicDisk"
            spaceInfo={publicDisk}
            orgUserType="DEPT"
            selectButtonType="checkBox"
            treeType={'DEPT'}
            type={'INCLUDESUB'}
            nodeIds={''}
          />
        </GlobalModal>
      )}
      {USERRelvanceModal && (
        <GlobalModal
          widthType={3}
          title="选择用户"
          mask={false}
          visible={true}
          onOk={okUSER}
          onCancel={cancelUSER}
          className={styles.modalWarp}
          bodyStyle={{ padding: '16px 0 0 0' }}
          getContainer={() => {
            return document.getElementById('container_public')||false;
          }}
        >
          <RelevanceModal
            nameSpace="publicDisk"
            spaceInfo={publicDisk}
            orgUserType="USER"
            selectButtonType="checkBox"
            treeType={'DEPT'}
            type={'INCLUDESUB'}
            nodeIds={''}
          />
        </GlobalModal>
      )}
    </>
  );
}
export default connect(({ publicDisk }) => ({
  publicDisk,
}))(AuthControl);
