import {Table,Tabs} from 'antd';
import {connect} from 'dva';
import { useEffect } from 'react';
import {CloseOutlined,CheckOutlined} from '@ant-design/icons';
import {ArrowDownOutlined} from '@ant-design/icons';
import styles from './ruleConfig.less';
const { TabPane } = Tabs;
function RuleConfig({location,dispatch,formShow}){
  const {stateObj} = formShow;
  const bizSolId = location.query.bizSolId;
  const bizInfoId = location.query.bizInfoId;
  const currentTab = location.query.currentTab;//用于区别新打开的新增页
  const bizTaskId = location.query.bizTaskId;
  const {bussinessForm,globalRule,bizInfo,nodeRule,isErrors} = stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab];
  console.log('nodeRule=',nodeRule);
  console.log('isErrors123=',isErrors);
  const columns=[
    {
      title:'序号',
      dataIndex:'index',
      render:(text,obj,index)=><span>{index+1}</span>
    },
    {
      title:'说明',
      dataIndex:'explain',
      render:(text,row)=>{
        let style={};
        let time = new Date();
        const ruleJsonContent=JSON.parse(row.ruleJsonContent);
        console.log('ruleJsonContent=',ruleJsonContent);
        if((ruleJsonContent.ruleProperty=='activeDate'&&ruleJsonContent.propertyValue>=Date.parse(time))||
            (ruleJsonContent.ruleProperty=='loseDate'&&ruleJsonContent.propertyValue<Date.parse(time))||ruleJsonContent.ruleProperty=='empty'){
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
        const ruleJsonContent=JSON.parse(row.ruleJsonContent);
        if((ruleJsonContent.ruleProperty=='activeDate'&&ruleJsonContent.propertyValue>=Date.parse(time))||
            (ruleJsonContent.ruleProperty=='loseDate'&&ruleJsonContent.propertyValue<Date.parse(time))||ruleJsonContent.ruleProperty=='empty'){
          return (
            <div>{errorIndex>=0?<CloseOutlined style={{color:'#FF5735'}}/>:(index>=0?<CheckOutlined style={{color:'green'}}/>:"")}</div>
          )
        }else{
          return null;
        }
      }
    },
  ]
  const ruleRender=(curentRule)=>{
    return (
      <div className={styles.rule_right}>
        <div>
          <p>提醒</p>
          <p>{curentRule.operationTips}</p>
        </div>
        <p>校验</p>
        <Table
          columns={columns}
          dataSource={curentRule.check?curentRule.check:[]}
          pagination={false}
        />
        <p>附件</p>
        {!!Object.keys(curentRule).length&&
        <ul>
          {curentRule.enclosure&&JSON.parse(curentRule.enclosure).map((item,index)=>{
            return <li>
              <span>{index+1}、{item.enclosureName}</span>
              {item.enclosureUrl?
              <a onClick={downFile.bind(this,item.enclosureUrl)}><ArrowDownOutlined style={{color:'#03A4FF'}}/></a>:
              null}
              </li>
          })}
        </ul>
        }
      </div>

    )
  }
  //下载文件
  const downFile=(fileId)=>{
    dispatch({
      type: 'formShow/getDownFileUrl',
      payload: {
        fileStorageId:fileId
      }
    });
  }
  //是否显示全局配置
  const isShowGlobalRuleFn=(currentRule)=>{
    if(Object.keys(currentRule).length&&(currentRule.operationTips||currentRule.check.length||currentRule.enclosure)){
      return true
    }else{
      return false
    }
  }
  return (
    <>
      {isShowGlobalRuleFn(globalRule)||isShowGlobalRuleFn(nodeRule)?
        <Tabs>
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
        <span>无</span>
      }
    </>
  )
}
export default connect(({formShow})=>{return {formShow}})(RuleConfig)
