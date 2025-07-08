import React,{useEffect} from 'react';
import TableList from '../../componments/role/list';
import CTM from '../../componments/commonTreeMg';
import {connect,history} from 'umi';
import { parse } from 'query-string';

// @connect(({role,loading,unitRole})=>({
//   role,
//   unitRole,
//   loading,
// }))

function Index({dispatch,role,loading,unitRole,location}) {
  const pathname=location.pathname;
  const { searchObj } = role;
  if(!searchObj[pathname]){
    return null
  }
  const {limit} = searchObj[pathname];
  
  const {currentNode, treeData, expandedKeys, treeSearchWord,leftNum} = unitRole;
  // useEffect(()=>{
  //   if(pathname=='/unitRole'){
  //     const roleType='ORGROLE';
  //     dispatch({
  //       type:'role/updateStatesSelf',
  //       payload:{
  //         pathname:pathname
  //       }
  //     })
  //     dispatch({
  //       type:'role/updateStates',
  //       payload:{
  //         roleType:roleType,
  //         limit:limit
  //       }
  //     })
  //   }
  // },[])
  const getSysRoles =(orgId,start,searchWord,limit,nodeCode)=>{
    //获取列表
    dispatch({
      type:"role/getSysRoles",
      payload:{
        start,
        limit,
        searchWord,
        roleType:'ORGROLE',
        orgId,
      }
    })
  }
  const onSearchTable=(value)=>{
    const {searchObj } =  role
    const {limit} = searchObj[pathname];
    const { orgId } = searchObj[pathname].currentNode;
    getSysRoles(orgId,searchObj[pathname].currentPage,value,limit)
    searchObj[pathname].searchWord = value
    dispatch({
      type: 'role/updateStates',
      payload:{
        searchObj
      }
    })
  }
  return (
    <div>
            <div style={{height:'100%',borderRadius:'4px'}} id='unitRole_container'>
      <CTM
          treeData={treeData}
          expandedKeys={expandedKeys}
          treeSearchWord={treeSearchWord}
          currentNode={currentNode}
          nodeType={'ORG'}
          plst={'输入单位名称、编码'}
          onSearchTable={onSearchTable.bind(this)}
          leftNum={leftNum}
          moudleName={"unitRole"}
          getData={(node)=>{
            dispatch({
              type: 'role/updateStates',
              payload:{
                selectOrgId:node.key,
                currentPage:1,
                searchWord:'',
                selectNodeCode:node.nodeCode
              }
            })
            getSysRoles(node.key,1,'',limit,node.nodeCode)
            }
          }
          UserDepartmentFiltering={true}
          tableStyle={{padding:'0px'}}
        >
          {pathname=='/unitRole'&&<TableList location={location}/>}
        </CTM>
        </div>
    </div>
  )
}

// class Index extends React.Component {
//   getSysRoles(orgId,start,searchWord,limit,nodeCode){
//     const { dispatch } = this.props
//     //获取列表
//     dispatch({
//       type:"role/getSysRoles",
//       payload:{
//         start,
//         limit,
//         searchWord,
//         roleType:'ORGROLE',
//         orgId,
//       }
//     })
//   }


//   onSearchTable(value){
//     const pathname=history.location.pathname.split('/support')?.[1];
//     const { role, dispatch } = this.props
//     const {searchObj } =  role
//     const {limit} = searchObj[pathname];
//     const { orgId } = searchObj[pathname].currentNode;
//     this.getSysRoles(orgId,searchObj[pathname].currentPage,value,limit)
//     searchObj[pathname].searchWord = value
//     dispatch({
//       type: 'role/updateStates',
//       payload:{
//         searchObj
//       }
//     })
//   }
//   render(){
//     const pathname=history.location.pathname.split('/support')?.[1];
//     const { role, dispatch,unitRole,location } = this.props;
//     const { searchObj } = role;
//     const {limit} = searchObj[pathname];
//     const {currentNode, treeData, expandedKeys, treeSearchWord} = unitRole;
//     return (
//       <div style={{height:'100%',borderRadius:'4px'}} id='unitRole_container'>
//       <CTM
//           treeData={treeData}
//           expandedKeys={expandedKeys}
//           treeSearchWord={treeSearchWord}
//           currentNode={currentNode}
//           nodeType={'ORG'}
//           plst={'输入单位名称、编码'}
//           onSearchTable={this.onSearchTable.bind(this)}
//           getData={(node)=>{
//             dispatch({
//               type: 'role/updateStates',
//               payload:{
//                 selectOrgId:node.key,
//                 currentPage:1,
//                 searchWord:'',
//                 selectNodeCode:node.nodeCode
//               }
//             })
//             this.getSysRoles(node.key,1,'',limit,node.nodeCode)
//             }
//           }
//           UserDepartmentFiltering={true}
//         >
//           <TableList location={location}/>
//         </CTM>
//         </div>
//     )
//   }

// }
export default connect(({role,loading,unitRole })=>({role,loading,unitRole }))(Index)
// export default ({location}) => {
//   return (
//       <Index location={location}/>
//   );
// }
