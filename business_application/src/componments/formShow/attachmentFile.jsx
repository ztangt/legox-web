import React from 'react';
import ReSizeLeftRightCss from '../public/reSizeLeftRightCss';
import {connect, useLocation} from 'umi';
import ITree from '../Tree';
import {Input,Radio,Table,Button,Tag,Select,} from 'antd';
import styles from './attachmentFile.less'
import UploadFile from './UploadFile'
import AttachmentBiz from './attachmentBiz'
import { dataFormat } from '../../util/util';

const {Search} = Input;

import { Modal} from 'antd';

function Index({dispatch,formShow,onOKValue}){
  const {stateObj} = formShow;
  const bizSolId = useLocation().query.bizSolId;
  const bizInfoId = useLocation().query.bizInfoId;
  const currentTab = useLocation().query.currentTab;
  const uploadProps = {
    tableColCode:'',
    fileSizeMax:50,
    attachType:'NULL',
    relType:'ATT',
    disabled:false
  }

  const { attachmentList } = stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab]



  return (
    <div className={styles.container}>
      <table className={styles.table_outside} border={1}>
        <tr>
          <th>关联平台内文件</th>
          <th>
            <AttachmentBiz disabled={false} relType='ATT'/>
          </th>
        </tr>
        <tr>
          <td>附件</td>
          <td>
            <UploadFile {...uploadProps}/>

          </td>
        </tr>
      </table>
    </div>
  )
}


export default connect(({formShow})=>{return {formShow}})(Index);
