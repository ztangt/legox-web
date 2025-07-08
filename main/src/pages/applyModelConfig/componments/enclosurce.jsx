import {Button,Checkbox} from 'antd';
import {connect} from 'dva';
import styles from './ruleConfig.less';
import EnclosureModal from './enclosureModal';
import { useState } from 'react';
import {ArrowDownOutlined} from '@ant-design/icons';
import {getContentLength,partDownload} from '../../../util/util';
import {CHUNK_SIZE} from '../../../service/constant'
import { parse } from 'query-string';
import {history} from 'umi';
function Enclosure({query,dispatch,parentState,setParentState}){
  const {isShowEnclosurce,currentRule,checkEnclosureIds}=parentState;
  // const [checkEnclosureIds,setCheckEnclosureIds]=useState([]);
  const showReEnclosurce=()=>{
    setParentState({
      isShowEnclosurce:true,
      limit:10
    })
  }
  const onChangeEnclos=(item,index,e)=>{
    let newCheckEnclosureIds = JSON.parse(JSON.stringify(checkEnclosureIds));
    if(e.target.checked){
      newCheckEnclosureIds.push(item.enclosureId)
    }else{
      newCheckEnclosureIds.splice(index,1);
    }
    setParentState({
      checkEnclosureIds:newCheckEnclosureIds
    })
  }
  const deleteEnclos=()=>{
    let newEnclosure=[];
    currentRule.enclosure.map((item)=>{
      if(!checkEnclosureIds.includes(item.enclosureId)){
        newEnclosure.push(item)
      }
    })
    currentRule.enclosure = newEnclosure;
    console.log('currentRule=',currentRule);
    setParentState({
      currentRule,
      checkEnclosureIds:[]
    })
  }
  //下载文件
  const downFile=(id)=>{
    dispatch({
      type: 'applyModelConfig/getFileLengthURL_CommonDisk',
      payload: {
        id: id,
      },
      callback: (url) => {
        dispatch({
          type: 'applyModelConfig/putDownLoad_CommonDisk',
          payload: {
            id:id,
          },
          callback: (downUrl, downName) => {
            getContentLength(url).then((length) => {
              partDownload(downName, downUrl, 0, CHUNK_SIZE, length);
            });
          },
        });
      },
    });
  }
  console.log('checkEnclosureIds=',checkEnclosureIds);
  return (
    <div className={styles.enclosure_set}>
      <p>
        <span>附件:</span>
        <Button type="primary" onClick={showReEnclosurce}>关联</Button>
        <Button onClick={deleteEnclos.bind(this)}>删除</Button>
      </p>
      <ul>
        {!!Object.keys(currentRule).length&&currentRule.enclosure.map((item,index)=>{
          return (
            <li>
              <Checkbox
                onChange={onChangeEnclos.bind(this,item,index)}
                checked={checkEnclosureIds?checkEnclosureIds.includes(item.enclosureId):false}
                key={index}
              >
                {index+1}、{item.enclosureName}
              </Checkbox>
              {item.enclosureUrl?
              <ArrowDownOutlined onClick={downFile.bind(this,item.enclosureId)} style={{color:'#03A4FF'}}/>:
              null}
            </li>
          )
        })}
      </ul>
      {isShowEnclosurce&&<EnclosureModal query={query} setParentState={setParentState} parentState={parentState}/>}
    </div>
  )
}
export default connect(({applyModelConfig})=>{return {applyModelConfig}})(Enclosure)
