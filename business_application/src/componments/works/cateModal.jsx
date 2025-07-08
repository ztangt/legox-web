import {Modal} from 'antd';
import {useState} from 'react';
import ITree from '../public/iTree';
import {Button} from '@/componments/TLAntd';
function cateModal({handelCancle,categorList,submitFn,id}){
  const [checkedKeys,setCheckedKeys] = useState([]);
  const loopTree=(tree,checkedKeys,checkedIds)=>{
    tree.map((item)=>{
      if(item.children&&item.children.length){
        loopTree(item.children,checkedKeys,checkedIds)
      }else if(checkedKeys.includes(item.categoryId)){
        checkedIds.push(item.categoryId);
      }
    })
    console.log('checkedIds=',checkedIds);
    return checkedIds;
  }
  const checkFn=(checkedKeys)=>{
    let checkIds = loopTree(categorList,checkedKeys,[])
    setCheckedKeys(checkIds);
  }
  return (
    <Modal
      visible={true}
      title="移动事项分类"
      onCancel={()=>{handelCancle()}}
      getContainer={() =>{
        return document.getElementById(`${id}`)
      }}
      maskClosable={false}
      mask={false}
      footer={[
        <Button key="cancle"  onClick={()=>{handelCancle()}}>取消</Button>,
        <Button key="submit" type="primary" onClick={()=>{submitFn(checkedKeys)}}>确定</Button>,
      ]}
    >
      <div>
        目标事项分类
      </div>
      <ITree
        isSearch={false}
        treeData={categorList}
        onSelect={()=>{}}
        field={{titleName:"categoryName",key:"categoryId",children:"children"}}
        style={{width:'auto'}}
        defaultExpandAll={true}
        checkable={true}
        checkedKeys={checkedKeys}
        onCheck={(checkedKeys)=>{checkFn(checkedKeys)}}
      />
    </Modal>
  )
}
export default cateModal
