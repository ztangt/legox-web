import {Steps,Input} from 'antd';
import {connect,history} from 'umi';
import styles from './mobile.less';
import {useState,useEffect} from 'react';
import {dataFormat} from '../../util/util';
import { parse } from 'query-string';
import classnames from 'classnames';
import {MOBILEDETAILTASKSTATUS} from '../../service/constant.js';
import {MenuUnfoldOutlined} from '@ant-design/icons';
function MobileFlowDetails({dispatch}){
  const [tasks,setTasks] = useState([]);
  const query = parse(history.location.search);
  useEffect(()=>{
    dispatch({
      type:'flowDetails/getNewBpmnDetail',
      payload:{
        bizInfoId:query.bizInfoId,
        procDefId:query.procDefId,
        hasCirculate:false
      },
      callback:(data)=>{
        setTasks(data?.tasks||[]);
      }
    })
  },[])
  const titleRender=(item)=>{
    return (
      <p className={styles.title}>
        <span className={styles.t_left}>{item.actName}</span>
        <span className={styles.t_right} style={{marginRight:"0px"}}>{dataFormat(item.endTime,'YYYY-MM-DD HH:mm:ss')}</span>
        <span className={classnames(styles.t_right,styles.t_name)}>{item.ruserName}</span>
      </p>
    )
  }
  const taskStatus=(text)=>{
    return text== 0 ?'未收未办' : text== 1 ? '已收未办' : text== 2 ? '已收已办' : text==3?'已追回':'';
  }
  const descriptionRender=(item)=>{
    return (
      <div className={styles.description}>
        <p className={styles.desc_title}>
          <span style={{color:"#F35050"}}>{item.endTime?MOBILEDETAILTASKSTATUS[item.makeAction]:
          taskStatus(item.taskStatus)
          }</span>
          {item.signList&&item.signList.length?<label className={styles.desc_t_right}>
            <span>文字签批</span>
            {_.find(item.signList,function(o){return !!o.messageImgUrl})?
              <span>手写签批</span>
              :null}
          </label>:null}
        </p>
        {item.signList&&item.signList.length?<ul className={styles.desc_content}>
          {item.signList.map((item)=>{
            return <li style={{listStyleType:'disc'}}>
              {item.messageText}
              {item.messageImgUrl?<img src={item.messageImgUrl} width={30}/>:''}
              </li>
            })
          }
        </ul>:null}
      </div>
    )
  }
  const items = ()=>{
    if(tasks.length){
      return tasks.map((item,index)=>{
        return {
          title: titleRender(item),
          description:descriptionRender(item),
          status:'process',
          icon:<div 
            className={item.endTime?classnames(styles.item_icon):classnames(styles.item_icon,styles.item_icon_red)}
            ><span className={styles.icon}>{index+1}</span></div>
        }
      })
    }else{
      return [];
    }
  }
  return (
    <div className={styles.mobile_detail}>
      <p>流程详情</p>
      <Steps
        size={"small"}
        current={0}
        direction="vertical"
        items={items()}
      />
    </div>
  )
}
export default connect(({flowDetails})=>{return {flowDetails}})(MobileFlowDetails);