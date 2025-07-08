import { useEffect, useState, useMemo, useRef } from 'react';
import styles from './index.less';
import {  connect, history } from 'umi';
import './index.less';
import * as dd from 'dingtalk-jsapi';
import { Checkbox, Spin, Divider,message } from 'antd';
import {
  Button,
  PullToRefresh,
  FloatingBubble
} from 'antd-mobile/es';
import { TODOBIZSTATUS,DETAILTASKSTATUS } from '../../../service/constant';
import InfiniteScroll from 'react-infinite-scroll-component';
import { dataFormat, returnTaskObj } from '../../../util/util';
import { parse } from 'query-string';
function Index({ dispatch, location, recover }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const {
    tableData,
    returnCount
  } = recover;
  const query = parse(history.location.search);
  const { bizInfoId, bizSolId, mainTableId, deployFormId } = query;
  useEffect(() => {
    if (dd.env.platform !== 'notInDingTalk') {
      dd.ready(function () {
        dd.biz.navigation.setTitle({
          title: '撤回',
          onSuccess: function (res) {
            // 调用成功时回调
            console.log(res);
          },
          onFail: function (err) {
            // 调用失败时回调
            console.log(err);
          },
        });
        dd.biz.navigation.setLeft({
          control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
          text: '',//控制显示文本，空字符串表示显示默认文本
          onSuccess: (result) => {
            dd.biz.navigation.goBack({
              onSuccess: function (result) {
                /*result结构
                {}
                */
              },
              onFail: function (err) { }
            })
            //如果control为true，则onSuccess将在发生按钮点击事件被回调
          },
          onFail: function (err) { }
        });
      });
    }
    getRecallTask()
  }, []);
  function onBack(){
    if (dd.env.platform !== 'notInDingTalk') {
      dd.ready(function () {
        dd.biz.navigation.goBack({
          onSuccess: function (result) {
            /*result结构
            {}
            */
          },
          onFail: function (err) { }
        })
      });
    }else{
      window.history.back();
    }
  }
  const headers = {
      bizSolId,
      mainTableId,
      deployFormId,
      bizInfoId,
  }
  const getRecallTask = () =>{
    dispatch({
      type:'recover/recallTask',
      payload:{
        bizInfoId,
        headers
      }
    })
  }
  const revover = () => {
    if(selectedRowKeys.length>0){
      var obj = returnTaskObj(selectedRowKeys,tableData)
        dispatch({
            type:'recover/recoverTask',
            payload:{
                bizInfoId,
                recoverTask:JSON.stringify(obj),
                headers
            }
        })
    }else{
      message.error('请选择要撤回的任务')
    }
}

  return (
    <div className={styles.container}>
     {<FloatingBubble
        magnetic='x'
        style={{
          '--background':'var(--ant-primary-color)',
          '--border-radius': '3.57rem 0 0 3.57rem',
          '--size': '2.79rem',
          '--initial-position-right': '0rem',
          '--initial-position-top': '0rem',
          '--height-size': '1.75rem',
        }}
        onClick={onBack}
      >
        返回
      </FloatingBubble>}
      <Checkbox.Group
        value={selectedRowKeys}
        onChange={(v)=>{ console.log('vvv',v); setSelectedRowKeys(v)}}
        className={styles.checkgroup_container}
        
      >
      {/* <PullToRefresh
          onRefresh={() => {
            getRecallTask()
          }}
          id="scrollableDiv"
        >
        <InfiniteScroll
          dataLength={tableData.length}
          next={()=>{getRecallTask()}}
          hasMore={tableData?.length < returnCount}
          loader={<Spin className="spin_div" />}
          endMessage={
            tableData?.length == 0 ? (
              ''
            ) : (
              <span className="footer_more">没有更多啦</span>
            )
          }
          scrollableTarget="scrollableDiv"
        > */}

          {tableData.map((item) => (
            <Checkbox key={item.key} value={item.key}>
              <div className={styles.checkgroup_item}>
              <p className={styles.act}><span>环节名称:{item.stepName}</span> <a>当前环节：{item.actName}</a></p>
              <p className={styles.info}><span>办理环节</span><i>{`${item.suserName}-->${item.ruserName}（${DETAILTASKSTATUS[item.makeAction]}）`}</i></p>
              <p className={styles.info}><span>办理时间</span><i>{dataFormat(item.startTime,'YYYY年MM月DD日 HH:mm')}</i></p>
              <p className={styles.info}><span>办理状态</span><i>{TODOBIZSTATUS[item.taskStatus]}</i></p>
              </div>
            </Checkbox>
          ))}
        {/* </InfiniteScroll>
        </PullToRefresh> */}
      </Checkbox.Group>
      <div className={styles.footer}>
          <Button onClick={revover.bind(this)}>
            撤回
          </Button>
      </div>
    </div>
  );
}
export default connect(({ recover, loading }) => {
  return { recover, loading };
})(Index);
