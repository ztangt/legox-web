import { Modal, Tree, Button,Transfer } from 'antd';
import { connect } from 'umi';
import { useEffect, useState, useRef } from 'react';
import GlobalModal from '../../../componments/GlobalModal';
import styles from './workRule.less'

function AddUser({ location, dispatch, workRule ,onCancel,nodeId}) {
    const {allRoleList,roleListTarget} = workRule
    const [targetKeys, setTargetKeys] = useState([]);
    // 确定关闭
    const onOk = ()=>{
        
        dispatch({
            type: 'workRule/saveWorkRuleRole',
            payload: {  
                workRuleId: nodeId,
                roleIds: targetKeys.join(',')||''
            },
            callback(){
                onCancel()
            }
        })
    }
    
 
    // 获取所有数据
    const getAllRuleList = ()=>{
        dispatch({
            type: 'workRule/getWorkRuleAllRole',
            payload: {
                searchWord: ''
            }
        })
    }
    const handleChange = (nextTargetKeys, direction, moveKeys) => {
        setTargetKeys(nextTargetKeys);
      };
      // 模糊搜索过滤选项
      const filterOption = (inputValue, option) => {
       return option.roleName.indexOf(inputValue) > -1;
      }
      useEffect(()=>{
        setTargetKeys([...roleListTarget])
    },[roleListTarget])

    useEffect(()=>{
        getAllRuleList()
    },[])

    return (
        <GlobalModal 
            onCancel={onCancel}
            onOk={onOk} 
            visible={true}
            title="分配角色"
            widthType={2}
            getContainer={() => {
                return document.getElementById('work_rule') || false;
            }}
            maskClosable={false}
            // style={{overflow:'hidden'}}
            mask={false}    
        >
            <div style={{height: '100%',overflow:'hidden'}}>
                <Transfer
                    dataSource={allRoleList}
                    showSearch
                    className={styles.transfer}
                    filterOption={filterOption}
                    targetKeys={targetKeys}
                    onChange={handleChange}
                    render={(item) => item.title}
                />
            </div>

        </GlobalModal>
    )
}


export default connect(({ workRule, loading })=>({ workRule, loading })) (AddUser)