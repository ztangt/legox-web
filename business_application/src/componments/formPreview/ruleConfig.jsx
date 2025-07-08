/**规则定义 */
import {Empty} from 'antd';
import {connect} from 'dva';
import { useEffect } from 'react';
import {CloseOutlined,CheckOutlined} from '@ant-design/icons';
import {ArrowDownOutlined,CloseCircleOutlined} from '@ant-design/icons';
import styles from './ruleConfig.less';
import { CHUNK_SIZE } from '../../service/constant';
import {getContentLength,partDownload} from '../../util/util'
import Table from '../columnDragTable/index';
import Tabs from "../TLTabs/index";
const { TabPane } = Tabs;
// const ={
//   check:[{
//     id:'1',
//     isControl:1,
//     ruleJsonContent:{
//       ruleProperty:'empty',
//       text:'if(values["0__DATE_AA"]==\'1661231876\'&&values["1561902102565560321__SRK"]==\'123a\'){isError=false;}else{isError=true;messageFn("111111",id)}'
//     }
//   }]
// }
function RuleConfig({dispatch,state,setState}){
  const {nodeRule,isErrors,globalRule,arrContinus} = state;
  console.log('nodeRule=',nodeRule);
  console.log('isErrors123=',isErrors);
  const columns=[
    {
      title:'序号',
      dataIndex:'index',
      width:60,
      render:(text,obj,index)=><span style={{paddingLeft:"8px"}}>{index+1}</span>
    },
    {
      title:'说明',
      dataIndex:'shows',
      render:(text,row)=>{
        let style={};
        let time = new Date();
        const ruleJsonContent=row.ruleJsonContent;
       // const ruleJsonContent=row.ruleJsonContent;
        console.log('ruleJsonContent=',ruleJsonContent);
        if((ruleJsonContent?.ruleProperty=='activeDate'&&ruleJsonContent?.propertyValue*1000<=Date.parse(time))||
            (ruleJsonContent?.ruleProperty=='loseDate'&&ruleJsonContent?.propertyValue*1000>Date.parse(time))||ruleJsonContent?.ruleProperty=='empty'){
        }else{
          style={color:'#cccccc'}
        }
        return (
          <span style={style}>{text}</span>
        )
      }
    },
    {
      title:'检验情况',
      dataIndex:'isError',
      render:(text,row)=>{
        let time = new Date();
        let errorIndex = _.findIndex(isErrors,{id:row.id,isError:true});
        let index = _.findIndex(isErrors,{id:row.id});
        console.log('row===',row);
                const ruleJsonContent=row.ruleJsonContent;
                //const ruleJsonContent=row.ruleJsonContent;
                console.log('ruleJsonContent=',ruleJsonContent);//TODO
                console.log('errorIndex=',errorIndex);
        if((ruleJsonContent?.ruleProperty=='activeDate'&&ruleJsonContent?.propertyValue*1000<=Date.parse(time))||
            (ruleJsonContent?.ruleProperty=='loseDate'&&ruleJsonContent?.propertyValue*1000>Date.parse(time))||ruleJsonContent?.ruleProperty=='empty'){
          return (
            <div>{errorIndex>=0?<CloseOutlined style={{color:'#FF5735'}}/>:(index>=0?<CheckOutlined style={{color:'green'}}/>:"")}</div>
          )
        }else{
          return null;
        }
      }
    },
  ]
  const customColumns=[
    {
      title:'序号',
      dataIndex:'index',
      width:60,
      render:(text,obj,index)=><span style={{paddingLeft:"8px"}}>{index+1}</span>
    },
    {
      title:'说明',
      dataIndex:'shows'
    },
    {
      title:'检验情况',
      dataIndex:'isError',
      render:(text,row)=>{
        let time = new Date();
        let errorIndex = _.findIndex(arrContinus,{id:row.id,isError:true});
        let index = _.findIndex(arrContinus,{id:row.id});
        const ruleJsonContent=row.ruleJsonContent;
        return (
          <div>{errorIndex>=0?<CloseOutlined style={{color:'#FF5735'}}/>:(index>=0?<CheckOutlined style={{color:'green'}}/>:"")}</div>
        )
      }
    },
  ]
  const ruleRender=(curentRule)=>{
    return (
      <div className={styles.rule_right}>
        <div className={styles.rule_message}>
          {curentRule.operationTips?<p style={{fontWeight:'bold'}}>提醒</p>:null}
          {curentRule.operationTips?
            <p>{curentRule.operationTips}</p>:
            null
          }
        </div>
        <p style={curentRule.operationTips?{marginLeft:"16px",marginBottom:"8px",fontWeight:'bold',marginTop:'16px'}:{marginLeft:"16px",marginBottom:"8px",fontWeight:'bold'}}>校验</p>
        <Table
          columns={columns}
          dataSource={curentRule.check?curentRule.check:[]}
          pagination={false}
          taskType='MONITOR'
          bordered={false}
          scroll={{
            x:'auto'
          }}
        />
        <p style={{marginTop:"16px",marginLeft:'16px',marginBottom:"8px",fontWeight:'bold'}}>自定义业务校验</p>
        <Table
          columns={customColumns}
          dataSource={curentRule.custom?(typeof curentRule.custom=='string'?JSON.parse(curentRule.custom):curentRule.custom):[]}
          pagination={false}
          taskType='MONITOR'
          bordered={false}
          scroll={{
            x:'auto'
          }}
        />
        {!!Object.keys(curentRule).length&&curentRule.enclosure&&JSON.parse(curentRule.enclosure).length?
        <p style={{margin:"16px 0px 8px 16px",fontWeight:'bold'}}>附件</p>:
        null}
        {!!Object.keys(curentRule).length&&curentRule.enclosure&&JSON.parse(curentRule.enclosure).length?
        <ul style={{marginLeft:'16px'}}>
          {curentRule.enclosure&&JSON.parse(curentRule.enclosure).map((item,index)=>{
            return <li style={{marginBottom:'8px'}}>
              <span style={{marginRight:"4px"}}>{index+1}、{item.enclosureName}</span>
              {item.enclosureUrl?
              <a onClick={downFile.bind(this,item.enclosureId)}><ArrowDownOutlined style={{color:'#03A4FF'}}/></a>:
              null}
              </li>
          })}
        </ul>:
        null
        }
      </div>

    )
  }
  //下载文件
  const downFile=(id)=>{
    dispatch({
      type: 'formShow/getFileLengthURL_CommonDisk',
      payload: {
        id: id,
      },
      callback: (url) => {
        dispatch({
          type: 'formShow/putDownLoad_CommonDisk',
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
  //是否显示全局配置
  const isShowGlobalRuleFn=(currentRule)=>{
    console.log('currentRule=',currentRule);
    if(Object.keys(currentRule).length&&(currentRule.operationTips||currentRule.check?.length||currentRule.enclosure||currentRule.custom?.length)){
      return true
    }else{
      return false
    }
  }
  const operationsRender=(
    <CloseCircleOutlined onClick={()=>{setState({isShowRule:false})}} style={{fontSize:"18px",marginRight:"8px"}}/>
  )
  console.log('nodeRule=',nodeRule);
  return (
    <div className={styles.right_rule_config_warp}>
      {isShowGlobalRuleFn(globalRule)||isShowGlobalRuleFn(nodeRule)?
        <Tabs tabBarExtraContent={operationsRender}>
          {isShowGlobalRuleFn(globalRule)&&
            <TabPane tab="全局" key="global">
              {ruleRender(globalRule)}
            </TabPane>
          }
          {isShowGlobalRuleFn(nodeRule)&&
            <TabPane tab="节点" key="node">
              {ruleRender(nodeRule)}
            </TabPane>
          }
        </Tabs>:
        <Tabs tabBarExtraContent={operationsRender} className={styles.empty_tab}>
          <TabPane tab="" key="empty">
            <Empty className={styles.empty}/>
          </TabPane>
      </Tabs>
      }
    </div>
  )
}
export default connect(({formShow})=>{return {formShow}})(RuleConfig)
