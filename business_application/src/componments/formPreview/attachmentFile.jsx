import React,{useEffect,useState} from 'react';
import {connect, useLocation} from 'umi';
import {Input} from 'antd';
import styles from './attachmentFile.less'
import UploadFile from './UploadFile'
import AttachmentBiz from './attachmentBiz'
import {Tooltip} from 'antd';
const {Search} = Input;

import { Modal} from 'antd';

function Index({setState,state,targetKey}){
  const {bizInfo,attAuthList,attShowRequire} = state;
  const [attAuthInfo,setAttAuthInfo] = useState({});
  const [uploadAuthInfo,setUploadAuthInfo] = useState({});
  
  useEffect(()=>{
    if(attAuthList&&attAuthList.length){
      let tmpAttAuthInfo = {};
      let tmpUploadAuthInfo = {};
      attAuthList.map((item)=>{
        if(item.formColumnCode=='REL_FILE'){
          tmpAttAuthInfo=item;
        }else{
          tmpUploadAuthInfo = item
        }
      })
      setAttAuthInfo(tmpAttAuthInfo);
      setUploadAuthInfo(tmpUploadAuthInfo);
    }
  },[attAuthList])
  if(window.location.href.includes('/mobile')){
    return<div className={styles.mobile_container}>
                <Tooltip 
              title="* 该字段是必填字段" 
              open={attShowRequire.includes('att')?true:false}
              overlayClassName={styles.tip_warp}
              placement='topRight'
              >
        <div className={styles.list_container}>

            <h1>
              {attAuthInfo.isRequierd==1&&<span className={styles.require}>*</span>}
              关联平台内文件
            </h1>
            <AttachmentBiz 
                isAuth={typeof attAuthInfo.authType!='undefined'&&attAuthInfo.authType&&attAuthInfo.authType!='NONE'?true:false} 
                state={state} 
                setState={setState} 
                targetKey={targetKey}
                disabled={false}
              />
        
        </div>
        </Tooltip>
        <div className={styles.list_container}>
          <Tooltip 
              title="* 该字段是必填字段" 
              open={attShowRequire.includes('att')?true:false}
              overlayClassName={styles.tip_warp}
              placement='topRight'
              >
            <h1>
              {attAuthInfo.isRequierd==1&&<span className={styles.require}>*</span>}
              附件
            </h1>
            <UploadFile 
                tableColCode={''}
                fileSizeMax={100}
                attachType={'NULL'}
                relType={'ATT'}
                isAuth={typeof uploadAuthInfo.authType!='undefined'&&uploadAuthInfo.authType!='NONE'&&uploadAuthInfo.authType!=''?true:false} 
                setState={setState} 
                state={state} 
                targetKey={targetKey}
              />
            </Tooltip>
        </div>
    </div>

  }
  return (
    <div className={styles.container}>
      <table className={styles.table_outside} border={1}>
        <tr id={`att_${targetKey}`}>
          <td style={{width:'120px'}}>
            {attAuthInfo.isRequierd==1&&<span className={styles.require}>*</span>}
            关联平台内文件
          </td>
          <td>
            <Tooltip 
              title="* 该字段是必填字段" 
              open={attShowRequire.includes('att')?true:false}
              getPopupContainer={()=>{
                return document.getElementById(`att_${targetKey}`)||false
              }}
              overlayClassName={styles.tip_warp}
              placement='topRight'
            >

              <AttachmentBiz 
                isAuth={typeof attAuthInfo.authType!='undefined'&&attAuthInfo.authType&&attAuthInfo.authType!='NONE'?true:false} 
                state={state} 
                setState={setState} 
                targetKey={targetKey}
                disabled={false}
              />
            </Tooltip>
          </td>
        </tr>
        <tr id={`upload_${targetKey}`}>
          <td style={{width:'120px'}}>
            {uploadAuthInfo.isRequierd==1&&
            <span className={styles.require}>*</span>}
            附件
          </td>
          <td>
            <Tooltip 
              title="* 该字段是必填字段" 
              open={attShowRequire.includes('upload')?true:false}
              getPopupContainer={()=>{
                return document.getElementById(`upload_${targetKey}`)||false
              }}
              overlayClassName={styles.tip_warp}
              placement='topRight'
            >
              <UploadFile 
                tableColCode={''}
                fileSizeMax={100}
                attachType={'NULL'}
                relType={'ATT'}
                isAuth={typeof uploadAuthInfo.authType!='undefined'&&uploadAuthInfo.authType!='NONE'&&uploadAuthInfo.authType!=''?true:false} 
                setState={setState} 
                state={state} 
                targetKey={targetKey}
              />
            </Tooltip>
          </td>
        </tr>
      </table>
    </div>
  )
}


export default connect(({formShow})=>{return {formShow}})(Index);
