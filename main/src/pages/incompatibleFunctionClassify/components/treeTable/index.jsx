import React,{useEffect} from 'react'
import {Tree} from 'antd'
import {connect} from 'dva'
import { history } from 'umi'
import ReSizeLeftRight from '../../../../componments/public/reSizeLeftRight'
import styles from './index.less'


const ResizeTreeTable = ({dispatch,registerTree,children,functionClassifySpace,getData})=>{
    const { treeData } = registerTree;
    const { currentNode,searchWord } = functionClassifySpace
    useEffect(()=>{
        getInit()
    },[])
    // 获取注册初始化
    const getInit = ()=>{
        dispatch({
            type: 'registerTree/getRegister',
            payload: {
                searchWord: '',
                limit: 100,
                start: 1
            },
            pathname: '/moduleResourceMg'
        })
    }

    const onSelect = (selectedKeys,info)=>{
        if (info.node) {
            dispatch({
                type: 'functionClassifySpace/updateStates',
                payload: {
                    currentNode: info.node
                }
            })
            getData(info.node)
        }
    }
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchWord);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchWord.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className={styles.siteTreeSearchValue}>{searchWord}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }
        return {
          title,
          key: item.key,
          registerCode: item.registerCode
        };
      });
      console.log("treeData=0",treeData)
    return (
        <ReSizeLeftRight 
            leftChildren={
                <div>
                    <div className={styles.title}>注册系统</div>
                    <Tree
                        // key={loading.global}
                        className={styles.tree_list}
                        onSelect={onSelect}
                        treeData={loop(treeData)}
                        selectedKeys={[currentNode.key]}
                        defaultExpandAll
                        // expandedKeys={expandedKeys}
                        showLine={{ showLeafIcon: true }}
                    />   
                </div>
            }
            rightChildren={
                <div style={{height:'100%'}} className={styles.rightChildren}>
                    {children}
                </div>
            }
        >


        </ReSizeLeftRight>
    )
}

export default connect(({registerTree,functionClassifySpace})=>({registerTree,functionClassifySpace}))(ResizeTreeTable)
