import {Input,Select,Popover, Button} from 'antd';
import Tree from 'react-d3-tree';
import {CloseCircleOutlined,PlusCircleOutlined,DeleteOutlined,PlusOutlined} from '@ant-design/icons'
import { useState ,useEffect} from 'react';
import { D3OPRETOR } from '../../../service/constant';
import RuleColumsModal from './ruleColumsModal';
import './d3Tree.less';
const {Option} = Select;
function RuleSetModal({query,defaultData,updateData,dataIndex,allCol,setIsChangeConfig,id,colMainTabel}){
  const {bizSolId} = query;
  const foreignObjectProps = { width:'100%', height: 32, x:0,y:-15 };
  const [data,setData] = useState();
  const [isShowColumsModal,setIsShowColumsModal] = useState(false);
  const [selectType,setSelectType] = useState('');
  const [level,setLevel] = useState(0);
  const [selectCol,setSelectCol] = useState('');
  useEffect(()=>{
    setData(defaultData)
  },[])
  const content = (level)=>{
    return (
      <div>
        <a onClick={()=>{addChildNode(level,'children')}}>添加条件</a>
        <br/>
        <a onClick={()=>{addChildNode(level,'condition')}}>添加条件组</a>
      </div>
    )
  }
  const loopDeleteCondition =(children,level)=>{
    let deleteIndex='';
    let levels = level.split('_');
    children.map((item,index)=>{
      if(level==item.level){
        deleteIndex=index;
      }else{
        if(item.children){
          loopDeleteCondition(item.children,level)
        }else{
            //level大于当前删除的则往前更新一下
            let curLevels = item.level.split('_');
            //在同一个父级一下，位数相等，最后一个不同
            if(curLevels.length==levels.length){
              let isMax = false;
              for(let i=0;i<levels.length;i++){
                if(curLevels[i]==levels[i]){
                  isMax=true;
                }else if(i==levels.length-1&&curLevels[i]>levels[i]){
                  isMax=true;
                }else{
                  isMax=false;
                }
              }
              if(isMax){
                let newLevels = curLevels.splice(curLevels.length-1,1,curLevels[curLevels.length-1]-1);
                item.level = curLevels.join('_');
              }
            }
          }
        }
        if(children.length-1==index&&deleteIndex!==''){
          children.splice(deleteIndex,1);
        }
    })
    return children;
  }
  //删除条件组节点
  const deleteContion=(level,e)=>{
    e.preventDefault();
    setIsChangeConfig(true);
    //如果父节点中包含level则删除掉
    let newChildren = loopDeleteChildren(data.children,level);
    newChildren = loopLevel(newChildren,level);
    //const newChildren = loopDeleteCondition(data.children,level);
    setData({...data,children:JSON.parse(JSON.stringify(newChildren))});
    updateData(dataIndex,{...data,children:JSON.parse(JSON.stringify(newChildren))});
  }
  //字段显示输入框
  const clearCol=(type,level)=>{
    setIsChangeConfig(true);
    let value = 'inputNumber';
    let name = '输入框';
    let typeName='endName';
    if(level==0){
      setData({...data,[type]:value,endName:name});
      updateData(dataIndex,{...data,[type]:value,endName:name});
    }else{
      let newData = loopUpdateChild(data.children,type,level,value);
      newData = loopUpdateChild(data.children,typeName,level,name);
      setData({...data,children:JSON.parse(JSON.stringify(newData))});
      updateData(dataIndex,{...data,children:JSON.parse(JSON.stringify(newData))});
    }
  }
  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    hierarchyPointNode
  }) => {
    const level = nodeDatum.level;//节点层级
    //y需要根据深度和节点数来计算
    let num = 0;
    num = loopNum(data.children,level,[]).length;
    let y=0;
    if(hierarchyPointNode.x>0){
      y=num*60-hierarchyPointNode.x;
    }else{
      y= Math.abs(hierarchyPointNode.x)+num*60;
    }
    console.log('nodeDatum==',nodeDatum);
    return (
      <g transform={`translate(0,${y})`}>
        <foreignObject {...foreignObjectProps} id={`${level}_${id}`} style={{position:'relative'}}>
          {nodeDatum.condition?
            <>
              {level!='0'&&
              <CloseCircleOutlined
                style={{position:'absolute',top:"9px",left:'46px'}}
                onClick={deleteContion.bind(this,level)}
              />}
              <select
                style={{width:'80px',height:"32px"}}
                onChange={changeSelect.bind(this,'condition',level)}
                id={`condition_${level}_${id}`}
              >
                <option value="&&" selected={nodeDatum.condition=='&&'?true:false}>并且</option>
                <option value="||" selected={nodeDatum.condition=='||'?true:false}>或者</option>
              </select>
            </>
            :
            <>
              <span className="rule_select_col">
                <input
                  style={{width:'120px',height:"32px"}}
                  readOnly
                  id={`startCode_${level}_${id}`}
                  value={nodeDatum.startName}
                  placeholder="请选择字段"
                />
                <PlusOutlined onClick={selectColFn.bind(this,'startCode',level,nodeDatum)}/>
                </span>
              <select
                style={{width:'80px',height:"32px"}}
                onChange={changeSelect.bind(this,'operator',level)}
                id={`operator_${level}_${id}`}
              >
                {Object.keys(D3OPRETOR).map((item,index)=>{
                  return (
                    <option value={item} key={index} selected={nodeDatum.operator==item?true:false}>{D3OPRETOR[item]}</option>
                  )
                })}
              </select>
              {nodeDatum.operator!='empty'&&nodeDatum.operator!='noEmpty'?
                <span className="rule_select_col">
                <input
                  style={{width:'120px',height:"32px"}}
                  readOnly
                  id={`endCode_${level}_${id}`}
                  value={nodeDatum.endName}
                  placeholder="请选择字段"
                />
                {nodeDatum.endName?
                <CloseCircleOutlined
                  onClick={clearCol.bind(this,'endCode',level)}
                  style={{fontSize:'14px',right:'22px'}}
                  className="rule_col_close"
                />:null}
                <PlusOutlined onClick={selectColFn.bind(this,'endCode',level,nodeDatum)}/>
                </span>:null}
              {nodeDatum.endCode=='inputNumber'&&
              <input onInput={changeSelect.bind(this,'value',level)} id={`value_${level}_${id}`} value={nodeDatum.value} style={{height:"32px"}} maxLength={50}/>
              }
            </>
          }
          {nodeDatum.children?<Popover content={content(level)} title="">
           <PlusCircleOutlined style={{fontSize:'18px'}}/>
          </Popover>:
          <DeleteOutlined style={{color:'#03A4ff',fontSize:'16px'}} onClick={deleteOneNode.bind(this,level)}/>
          }
        </foreignObject>
      </g>
    )
  };
  //循环更新level
  const loopLevel = (children,level,childrenLevel)=>{
    let levels = level.split('_');
    let deleteIndex = '';
    children.map((item,index)=>{
      //level大于当前删除的则往前更新一下
      let curLevels = item.level.split('_');
      //在同一个父级一下，位数相等，最后一个不同
      if(curLevels.length==levels.length&&!childrenLevel){
        let isMax = false;
        for(let i=0;i<levels.length;i++){
          if(curLevels[i]==levels[i]){
            isMax=true;
          }else if(i==levels.length-1&&curLevels[i]>levels[i]){
            isMax=true;
          }else{
            //父节点不同则结束
            if(i!=levels.length-1&&curLevels[i]!=levels[i]){
              break;
            }
            isMax=false;
          }
        }
        if(isMax){
          let newLevels = curLevels.splice(curLevels.length-1,1,curLevels[curLevels.length-1]-1);
          item.level = curLevels.join('_');
        }
      }else if(childrenLevel){
        item.level = childrenLevel+'_'+(index+1);
      }
      if(item.children){
        if(curLevels.length==levels.length){
          item.children = loopLevel(item.children,level,item.level);
        }else{
          item.children = loopLevel(item.children,level);
        }
      }
    })
    return children;
  }
  //循环删除
  const loopDeleteChildren=(children,level)=>{
    children.map((item,index)=>{
      if(item.level==level){
        children.splice(index,1);
      }
      if(item.children){
        item.children = loopDeleteChildren(item.children,level);
      }
    })
    return children;
  }
  //删除单个节点
  const deleteOneNode = (level)=>{
    setIsChangeConfig(true);
    console.log('level==',level);
    let newChildren = loopDeleteChildren(data.children,level);
    newChildren = loopLevel(newChildren,level);
    console.log('newChildren====',newChildren);
    setData({...data,children:newChildren});
    updateData(dataIndex,{...data,children:newChildren});
  }
  const loopNum=(treeData,level,nums)=>{
    console.log('num=',nums);
    console.log('treeData=',treeData);
    treeData.map((item,index)=>{
      console.log('item=',item);
      console.log('num1=',nums);
      //比大小
      let itemLevels = item.level.split('_');
      let levels = level.split('_');
      if(item.children&&item.children.length){
        console.log('num=',nums);
        loopNum(item.children,level,nums);
      }else{
        for(let i=0;i<levels.length;i++){
          console.log('itemLevels[i]=',itemLevels[i]);
          if((levels[i]>itemLevels[i]||typeof itemLevels[i]=='undefined')){
            nums.push(1);
            break;
          }else if(levels[i]==itemLevels[i]){
            continue;
          }else{
            break;
          }
        }
      }
    })
    return nums;
  }
  const straightPathFunc = (linkData) => {
    console.log('linkData=',linkData);
    const x1 = linkData.source.y+100;
    const y1 = linkData.source.x
    const x = linkData.target.y
    const y = linkData.target.x
    //y需要根据深度和节点数来计算
    const level = linkData.target.data.level;
    let num = 0;
    num = loopNum(linkData.target.parent.data.children,level,[]).length;
    let sourceNum = 0;
    sourceNum = loopNum(data.children,linkData.source.data.level,[]).length;
    const d = `M${x1},${sourceNum*60}L${x},${sourceNum*60+num*60}`;
    return d
  };
  const loopAddChild=(treeData,level,type)=>{
    treeData.map((item)=>{
      if(item.level==level){
        if(type=='condition'){
          item.children.push({
            condition:"&&",
            children:[],
            level:`${level}_${item.children.length+1}`
          })
        }else{
          let startCode = colMainTabel?.columnList?.[0]?.formColumnCode;
          let startName = colMainTabel?.columnList?.[0]?.formColumnName;
          item.children.push({
            "startCode":startCode,
            "startName":startName,
            "operator":"==",
            "endCode":"inputNumber",
            "endName":"输入框",
            "value":"",
            level:`${level}_${item.children.length+1}`
          })
        }
      }else if(item.children&&item.children.length){
        loopAddChild(item.children,level,type)
      }
    })
    return treeData;
  }
  const addChildNode = (level,type) => {
    setIsChangeConfig(true);
    let newData = [];
    if(level=='0'){
      if(type=='condition'){
        data.children.push({
          condition:"&&",
          children:[],
          level:`${data.children.length+1}`
        })
      }else{
        let startCode = colMainTabel?.columnList?.[0]?.formColumnCode;
        let startName = colMainTabel?.columnList?.[0]?.formColumnName;
        data.children.push({
          "startCode":startCode,
          startName:startName,
          "operator":"==",
          "endCode":"inputNumber",
          "endName":"输入框",
          "value":"",
          level:`${data.children.length+1}`
        })
      }
      newData=data.children;
    }else{
      newData = loopAddChild(data.children,level,type);
    }
    setData({...data,children:JSON.parse(JSON.stringify(newData))});
    updateData(dataIndex,{...data,children:JSON.parse(JSON.stringify(newData))});
  };
  //更新数据
  const loopUpdateChild=(treeData,type,level,value)=>{
    treeData.map((item)=>{
      if(item.level==level){
        item[type]=value;
        if(type=='operator'){//为空的时候输入框和字段框不显示
          if(value=='empty'||value=='noEmpty'){
            item.value='';
            item.endCode='';
            item.endName='';
          }else{
            item.value='';
            item.endCode='inputNumber';
            item.endName="输入框"
          }
        }
        if(type=='endCode'&&value!='inputNumber'){//第二个选择框如果是字段则value显示为字段的code
          item.value=value;
        }
        if(type=='endCode'&&value=='inputNumber'){//第二个选择框如果是inputNumber则value显示为空
          item.value="";
        }
      }else if(item.children&&item.children.length){
        loopUpdateChild(item.children,type,level,value)
      }
    })
    console.log('treeData=',treeData);
    return treeData;
  }
  const changeSelect=(type,level)=>{
    setIsChangeConfig(true);
    let value="";
    if(type=='value'){//input 输入框
      let obj = document.getElementById(`${type}_${level}_${id}`);
      value=obj.value;
    }else{
      let obj = document.getElementById(`${type}_${level}_${id}`);
      console.log('obj=',obj);
      value=obj.options[obj.selectedIndex].value;
    }
    console.log('value=',value);
    console.log('level=',level);
    if(level==0){
      setData({...data,[type]:value});
      updateData(dataIndex,{...data,[type]:value});
    }else{
      let newData = loopUpdateChild(data.children,type,level,value);
      setData({...data,children:JSON.parse(JSON.stringify(newData))});
      updateData(dataIndex,{...data,children:JSON.parse(JSON.stringify(newData))});
    }
  }
  const selectColFn=(type,level,info)=>{
    setSelectType(type)
    setLevel(level);
    if(info[type] != 'inputNumber'){//为输入框的时候不需要存值，这块只是为了字段回显
      setSelectCol(info[type]);
    }else{
      setSelectCol('');
    }
    setIsShowColumsModal(true);
  }
  //找到子集的数量
  const loopData=(jsonData,nums)=>{
    nums.push(jsonData.length);
    jsonData.map((item)=>{
      if(item.children&&item.children.length){
        loopData(item.children,nums);
      }
    })
    return nums;
  }
  //获取高度
  const getHeight=(data)=>{
    if(data){
      let nums = loopData(data.children,[]);
      let num = 0;
      nums.map((item,index)=>{
        if(index==0){
          num = num+item;
        }else{
          num = num+item-1;
        }
      })
      console.log('num12346=',num);
      return `${num*32+(num-1)*30+20}px`;
    }else{
      return 'auto'
    }
  }
  const confirmColums=(tabelInfo,selectedInfos)=>{
    setIsChangeConfig(true);
   //如果是主表则不加formCode，子表才加用于区分
   let value = '';
   if(tabelInfo.tableScope=='MAIN'){
    value = selectedInfos[0]?.formColumnCode
   }else{
    value=tabelInfo.formCode+'__'+selectedInfos[0]?.formColumnCode;
   }
    let name = selectedInfos[0]?.formColumnName;
    let typeName = '';
    if(selectType=='startCode'){
      typeName = 'startName';
    }else{
      typeName = 'endName';
    }
    if(level==0){
      setData({...data,[selectType]:value,startName:name});
      updateData(dataIndex,{...data,[selectType]:value,startName:name});
    }else{
      let newData = loopUpdateChild(data.children,selectType,level,value);
      newData = loopUpdateChild(data.children,typeName,level,name);
      setData({...data,children:JSON.parse(JSON.stringify(newData))});
      updateData(dataIndex,{...data,children:JSON.parse(JSON.stringify(newData))});
    }
  }
  console.log('data====',data);
  return (
    <div style={{height:getHeight(data)}}>
      {data&&<Tree
        translate={{x:0,y:20}}
        data={data}
        //nodeSize={nodeSize}
        renderCustomNodeElement={(rd3tProps) =>
          renderForeignObjectNode({ ...rd3tProps })
        }
        pathFunc={straightPathFunc}
        zoomable={false}
        svgClassName={"d3_svg"}
      />}
      {isShowColumsModal&&
        <RuleColumsModal
          allCol={allCol}
          setIsShowColumsModal={setIsShowColumsModal}
          confirmColums={confirmColums}
          selectCol={selectCol}
          query={query}
        />
      }
    </div>
  )
}
export default RuleSetModal;
