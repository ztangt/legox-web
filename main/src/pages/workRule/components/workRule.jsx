import { Modal, Tree, Button } from 'antd';
import { connect } from 'umi';
import { useEffect, useState, useRef } from 'react';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import ITree from '../../../componments/public/iTree';
import styles from './workRule.less';
import AddWorkRule from './addWorkRule';
import AddUser from './addUser'
import {
  FormOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import { DEFAULT_ALL_GROUP_CODE } from '../../../service/constant';
import { dataFormat, getButton } from '../../../util/util.js';

const { confirm } = Modal;
function WorkRule({ location, dispatch, workRule, user }) {
  const {
    workRuleList,
    bizSolData,
    selectWorkRuleInfo,
    defaultBizSolCheckKeys,
    leftNum
  } = workRule;
  const [bizSolCheckKeys, setBizSolCheckKeys] = useState([]);
  const [groupCheckedKeys, setGroupCheckedKeys] = useState([]);
  const { menus } = user;
  const [isShowAdd, setIsShowAdd] = useState(false);
  const [saveData, setSaveData] = useState({});
  const [isChangeData, setIsChangeData] = useState(false);
  const [allSelectBizSolds, setAllSelectBizSolds] = useState([]);
  const [addUserModal,setAddUserModal] = useState(false);
  const [nodeId, setNodeId] = useState('') // 用户 选中事项规则id
  const cRef = useRef();
  useEffect(() => {
    //获取左侧的分组
    dispatch({
      type: 'workRule/getWorkRule',
      payload: {},
      callback: selectWorkRuleInfo => {
        dispatch({
          type: 'workRule/updateStates',
          payload: {
            selectWorkRuleInfo,
          },
        });
      },
    });
    //获取业务应用树
    dispatch({
      type: 'workRule/getBizSolTree',
      payload: {},
    });
    //获取选中事项规则的id
    dispatch({
      type: 'workRule/getBizSolRule',
      payload: {
        // workRuleId: selectWorkRuleInfo.key,
      },
      callback: data => {
        if (data) {
          setSaveData(data);
        }
      },
    });
  }, []);
  useEffect(() => {
    //合并获取全部选中的事项
    let tmpAllSelectBizSolds = [];
    Object.keys(saveData).map(item => {
      if (item != selectWorkRuleInfo.key && saveData[item]?.split(',')) {
        tmpAllSelectBizSolds = tmpAllSelectBizSolds.concat(
          saveData[item]?.split(','),
        );
      }
    });
    setAllSelectBizSolds(tmpAllSelectBizSolds);
  }, [saveData, selectWorkRuleInfo]);
  const onSelect = (selectedKeys, info) => {
    if (info.node.key == selectWorkRuleInfo.key) {
      //当前节点不能切换
      return;
    }
    //切换是否保存TODO
    if (isChangeData) {
      confirm({
        content: '是否对当前改动进行保存！',
        okText: '保存',
        mask: false,
        maskClosable: false,
        onOk: () => {
          cRef?.current?.setExpandedKeys([]);
          saveRuleBizSol(info);
        },
        onCancel: () => {
          cRef?.current?.setExpandedKeys([]);
          setIsChangeData(false);
          let tmpCheckKeys = saveData?.[info.node.key]?.split(',') || [];
          setBizSolCheckKeys(tmpCheckKeys);
          dispatch({
            type: 'workRule/updateStates',
            payload: {
              selectWorkRuleInfo: info.node,
            },
          });
        },
        getContainer: () => {
          return document.getElementById('work_rule') || false;
        },
      });
    } else {
      let tmpCheckKeys = saveData?.[info.node.key]?.split(',') || [];
      cRef?.current?.setExpandedKeys([]);
      setBizSolCheckKeys(tmpCheckKeys);
      dispatch({
        type: 'workRule/updateStates',
        payload: {
          selectWorkRuleInfo: info.node,
        },
      });
    }
  };
  const checkBizSol = (checkedKeys, e) => {
    let newCheckedKeys = [];
    e.checkedNodes.map(item => {
      if (item.nodeType == 'bizSol') {
        newCheckedKeys.push(item.key);
      }
    });
    setIsChangeData(true);
    setBizSolCheckKeys(newCheckedKeys);
  };
  const onCheck = checkedKeys => {
    setGroupCheckedKeys(checkedKeys);
  };
  const showAddModalFn = (info, e) => {
    e.stopPropagation();
    dispatch({
      type: 'workRule/updateStates',
      payload: {
        workRuleInfo: info,
      },
    });
    setIsShowAdd(true);
  };
  const showHideFn = (info, groupHide, e) => {
    e.stopPropagation();
    dispatch({
      type: 'workRule/updateGroupName',
      payload: {
        workRuleId: info.key,
        groupHide: groupHide,
        groupName: info.groupName,
      },
    });
  };
  //删除分组
  const deleteGroup = nodeData => {
    confirm({
      title: '',
      content: '确认要删除？',
      getContainer:()=>{
        return document.getElementById('work_rule') || false;
      },
      maskClosable:false,
      mask:false,
      onOk() {
        dispatch({
          type: 'workRule/deleteGroup',
          payload: {
            workRuleIds: nodeData.key,
          },
          callback: () => {
            setBizSolCheckKeys([]);
            //删除分组删除对应选中的值
            console.log('saveData==',saveData);
            delete(saveData[nodeData.key])
            console.log('saveData123==',saveData);
            setSaveData(saveData);
            //取消展开
            cRef?.current?.setExpandedKeys([]);
            setIsChangeData(false);
          },
        });
      },
    });
  };
  // 用户分配角色
  const addUser = (nodeData)=>{
    setAddUserModal(true)
    setNodeId(nodeData.key)
    getRuleList(nodeData.key)
  }
     // 右侧
     const getRuleList = (id)=>{
      dispatch({
          type: 'workRule/getWorkRuleById',
          payload: {
              workRuleId: id
          }
      })
  }
  // 关闭弹窗
  const onCancelModal = ()=>{
    setAddUserModal(false)
  }

  const titleRender = nodeData => {
    return (
      <div className={styles.gorup_tree_title}>
        <span>{nodeData.title}</span>
        <span className={styles.hover_opration}>
          {nodeData.groupCode === 'R0000' ? (
            ''
          ) : nodeData.groupHide ? (
            <>
              <FormOutlined title="修改" onClick={showAddModalFn.bind(this, nodeData)} />
              <MinusCircleOutlined
                title="是否显示"
                onClick={showHideFn.bind(this, nodeData, 0)}
              />
              <UserOutlined title="分配角色" onClick={addUser.bind(this,nodeData)}/>
              <DeleteOutlined title="删除" onClick={deleteGroup.bind(this, nodeData)} />
            </>
          ) : (
            <>
              <FormOutlined title="修改" onClick={showAddModalFn.bind(this, nodeData)} />
              <CheckCircleOutlined
                title="是否显示"
                onClick={showHideFn.bind(this, nodeData, 1)}
              />
              <UserOutlined title="分配角色" onClick={addUser.bind(this,nodeData)}/>
              <DeleteOutlined title="删除" onClick={deleteGroup.bind(this, nodeData)} />
            </>
          )}

          {/* {nodeData.groupCode != 'R0000' ? (

          ) : (
            ''
          )} */}
        </span>
      </div>
    );
  };
  console.log('bizSolData==', bizSolData);
  //保存
  const saveRuleBizSol = info => {
    saveData[selectWorkRuleInfo.key] = bizSolCheckKeys.join(',');
    if (info) {
      let tmpCheckKeys = saveData?.[info.node.key]?.split(',') || [];
      setBizSolCheckKeys(tmpCheckKeys);
      dispatch({
        type: 'workRule/updateStates',
        payload: {
          selectWorkRuleInfo: info.node,
        },
      });
    }
    setIsChangeData(false);
    dispatch({
      type: 'workRule/saveRuleBizSol',
      payload: {
        workRuleId: selectWorkRuleInfo.key,
        bizSolIds: bizSolCheckKeys.join(','),
      },
    });
  };
  const leftChildren = (
    <div className={styles.left}>
      <div className={styles.addTypesButton}>
        {getButton(menus, 'add') && (
          <Button
            type="primary"
            style={{ marginRight: '10px' }}
            onClick={showAddModalFn.bind(this, {})}
          >
            新增分组
          </Button>
        )}
        {/* {getButton(menus, 'delete') && (
          <Button type="primary" onClick={deleteGroup.bind(this)}>
            删除分组
          </Button>
        )} */}
      </div>
      <Tree
        // checkable
        selectedKeys={[selectWorkRuleInfo.key]}
        onSelect={onSelect}
        // onCheck={onCheck}
        treeData={workRuleList}
        titleRender={titleRender}
      />
    </div>
  );
  const rightChildren = (
    <div className={styles.right}>
      {getButton(menus, 'save') && (
        <Button
          onClick={() => {
            saveRuleBizSol();
          }}
          className={styles.save_biz}
          disabled={
            selectWorkRuleInfo.groupCode == DEFAULT_ALL_GROUP_CODE
              ? true
              : false
          }
        >
          保存
        </Button>
      )}
      <ITree
        isSearch={false}
        treeData={bizSolData}
        checkable={true}
        checkedKeys={bizSolCheckKeys}
        onCheck={checkBizSol}
        style={{ float: 'left' }}
        disabled={
          selectWorkRuleInfo.groupCode == DEFAULT_ALL_GROUP_CODE ? true : false
        }
        disabledKeys={allSelectBizSolds}
        ref={cRef}
        type="workRule"
      />
    </div>
  );
  return (
    <div className={styles.work_rule_warp} id="work_rule">
      <ReSizeLeftRight
        vNum={leftNum}
        suffix={'workRule'}
        leftChildren={leftChildren}
        rightChildren={rightChildren}
      />
      {isShowAdd && (
        <AddWorkRule
          handelCancle={() => {
            setIsShowAdd(false);
          }}
        />
      )}
      {
        addUserModal&&<AddUser nodeId={nodeId} onCancel={onCancelModal}/>
      }
    </div>
  );
}
export default connect(({ workRule, user }) => {
  return { workRule, user };
})(WorkRule);
