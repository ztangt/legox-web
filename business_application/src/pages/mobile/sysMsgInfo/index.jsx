import styles from './index.less';
import { dataFormat } from '../../../util/util'
import { Spin } from 'antd'
import { useEffect } from 'react'
import { parse } from 'query-string';
import { history, connect } from 'umi'
import {
  Button
} from 'antd-mobile/es';
function IndexPage({ location,sysMsgInfo,dispatch,loading }) {
  const { msgData } = sysMsgInfo
  const query = parse(history.location.search);

  useEffect(()=>{
    dispatch({
      type:'sysMsgInfo/getMessage',
      payload: {
        msgId: query?.msgId
      }
    })
  },[])
  // const msgInfo =  JSON.parse(msgInfo||'{}')
  function onDetail(){
    let obj = JSON.parse(msgData.targetParam||'{}')
      let query = {
        bizSolId: obj.bizSolId,
        bizInfoId: obj.bizInfoId,
        title: obj.bizTitle,
        isTrace: obj.isTrace, //是否跟踪
        workType: 'TODO', //工作事项列表类型
        id: obj.mainTableId,
        bizTaskId: obj.bizTaskId,
        category: 'SYS'
      };
      historyPush({
        pathname: `/mobile/formDetail`,
        query,
      });
  }
  return <Spin spinning={loading.effects['sysMsgInfo/getMessage']}>
          <div  className={styles.spin_container}>
            <div className={styles.container}>
              <p className={styles.title_container}>
                <span className={styles.title_container_name}>{msgData.msgTitle}</span>
                <b className={styles.title_container_time}>{dataFormat(msgData.createTime,'YYYY/MM/DD HH:MM')}</b>
              </p>
              <p className={styles.info}>
                {msgData.msgDetail}
              </p>
            </div>
            {msgData.msgType!='SYS_AUTH_WARNING'&&<Button className={styles.bt} onClick={onDetail} type='primary'>前往办理</Button>}
          </div>
        </Spin>;
}
export default connect(({ sysMsgInfo, loading }) => {
  return { sysMsgInfo, loading };
})(IndexPage);
