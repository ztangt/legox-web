import React from 'react';
import {Modal,Checkbox} from 'antd';
import styles from './index.less';
import classnames from 'classnames';
const data = [{
  "nodeId":"11",
  "nodeName":"用户中心",
  "nodeType":"MENU",
  "pid":"0",
  "isDataRule":0,
  "children":[
      {
          "nodeId":"1-1",
          "nodeName":"单位中心",
          "nodeType":"MENU",
          "pid":"11",
          "isDataRule":0,
          "children":[
              {
                  "nodeId":"1-1-1",
                  "nodeName":"单位中心1-1",
                  "nodeType":"MENU",
                  "pid":"1-1",
                  "isDataRule":0
              },
              {
                  "nodeId":"1-1-2",
                  "nodeName":"单位中心1-2",
                  "nodeType":"MENU",
                  "pid":"1-1",
                  "isDataRule":0
              }
          ]
      }
  ]
},
{
  "nodeId":"21",
  "nodeName":"用户中心",
  "nodeType":"MENU",
  "pid":"0",
  "isDataRule":0,
  "children":[
      {
          "nodeId":"2-1",
          "nodeName":"单位中心2",
          "nodeType":"MENU",
          "pid":"21",
          "isDataRule":0,
          "children":[
              {
                  "nodeId":"2-1-1",
                  "nodeName":"单位中心2-1-1",
                  "nodeType":"MENU",
                  "pid":"2-1",
                  "isDataRule":0,
                  "children":[{
                    "nodeId":"2-1-1-1",
                    "nodeName":"单位中心2-1-1-1",
                    "nodeType":"MENU",
                    "pid":"2-1-1",
                    "isDataRule":0,
                  },
                  {
                    "nodeId":"2-1-1-2",
                    "nodeName":"单位中心2-1-1-2",
                    "nodeType":"MENU",
                    "pid":"2-1-1",
                    "isDataRule":0,
                  },
                  {
                    "nodeId":"2-1-1-3",
                    "nodeName":"修改",
                    "nodeType":"BUTTON",
                    "pid":"2-1-1",
                    "isDataRule":0,
                  },
                  {
                    "nodeId":"2-1-1-4",
                    "nodeName":"删除",
                    "nodeType":"BUTTON",
                    "pid":"2-1-1",
                    "isDataRule":0,
                  }
                  ]
              },
              {
                  "nodeId":"2-1-2",
                  "nodeName":"单位中心2-1-2",
                  "nodeType":"MENU",
                  "pid":"2-1",
                  "isDataRule":0
              },
              {
                "nodeId":"2-1-3",
                "nodeName":"新增",
                "nodeType":"BUTTON",
                "pid":"2-1",
                "isDataRule":0,
              }
          ]
      }
  ]
},
]
function Index(){
  //获取一级，二级数据
  let firstData=  [];
  let sencodData = [];
  //获取三级数据
  let buttonData = [];
  const loopSencondData = (data,allNodeName,parentNodeId,firstId,allNodeId)=>{
    data.map((item)=>{
      if(item.nodeType=='BUTTON'){
        buttonData.push({
          parentNodeId:item.pid,
          nodeId:item.nodeId,
          nodeName:item.nodeName
        })
        let reNode = sencodData[`"${firstId}"`].filter(fiterItem=>fiterItem.nodeId!=parentNodeId);
        reNode.push({
          nodeName:allNodeName,
          nodeId:parentNodeId
        })
        sencodData[`"${firstId}"`] = reNode;
      }else{
        let reNode = sencodData[`"${firstId}"`].filter(fiterItem=>fiterItem.nodeId!=parentNodeId);
        let nodeName='';
        let nodeId ='';
        if(allNodeId){
          nodeName = allNodeName+','+item.nodeName;
          nodeId=allNodeId+','+item.nodeId;
        }else{
          nodeName = item.nodeName;
          nodeId=item.nodeId;
        }
        reNode.push({
          nodeName:nodeName,
          nodeId:item.nodeId,
          allNodeId:nodeId
        })
        sencodData[`"${firstId}"`] = reNode;
        if(item.children&&item.children.length){
          loopSencondData(item.children,nodeName,item.nodeId,firstId,nodeId)//下一级node
        }else{
        }
      }
    })
  }
  data.map((item)=>{
    firstData.push({
      nodeId:item.nodeId,
      nodeName:item.nodeName,
      nodeType:item.nodeType,
      pid:item.pid,
      isDataRule:item.isDataRule
    })
    if(item.children&&item.children.length){
      sencodData[`"${item.nodeId}"`]=[];
      loopSencondData(item.children,'','',item.nodeId,'');
    }
  })
  console.log('node=',sencodData);
  console.log('buttonData=',buttonData);
  return (
    <Modal
      visible={true}
      title="功能授权"
      width={'95%'}
      centered
      style={{height:"500px"}}
    >
      <div className={styles.node}>
        <div className={styles.first}>
          <div id="first" className={styles.td} style={{height:40*2+'px'}}>
          <Checkbox>用户中心</Checkbox>
          </div>
          <div id="first" className={styles.td} style={{height:40*2+'px'}}>
          <Checkbox>用户中心</Checkbox>
          </div>
          <div id="first" className={styles.td} style={{height:40*2+'px'}}>
          <Checkbox>用户中心</Checkbox>
          </div>
        </div>
        <div className={styles.sencod}>
          <div id="sencod" className={styles.td}><Checkbox>单位信息管理</Checkbox></div>
          <div id="sencod" className={styles.td}><Checkbox>单位信息管理</Checkbox></div>
          <div id="sencod" className={styles.td}><Checkbox>单位信息管理</Checkbox></div>
        </div>
        <div className={styles.third}>
          <div id="third" className={styles.td}>
            <Checkbox><span>新增</span></Checkbox>
            <Checkbox><span>删除</span></Checkbox>
          </div>
          <div id="third" className={styles.td}>
            <Checkbox><span>新增</span></Checkbox>
            <Checkbox><span>删除</span></Checkbox>
          </div>
        </div>
      </div>
    </Modal>
  )
}
export default Index;
