import { Fragment, useState, useRef,useEffect} from 'react';
import { Table,Form,Button,Upload, Modal,Input,message} from 'antd';
import { useDispatch, useSelector, useLocation} from 'umi';
import { DownloadOutlined,ArrowUpOutlined,ArrowDownOutlined,CloseOutlined } from '@ant-design/icons';
import  styles  from './UploadFile.less';
import _ from 'lodash'
import { dataFormat } from '../../util/util';

const AttachmentBiz = (props)=>{
    const {modalTableProps,getWorrkList,onSaveAttachmentBiz,onVisible,tableProps,relType} = props
    const dispatch = useDispatch();
    const { stateObj } = useSelector(({formShow})=>({...formShow}));
    const bizSolId = useLocation().query.bizSolId;
    const bizInfoId = useLocation().query.bizInfoId;
    const currentTab = useLocation().query.currentTab;
    const { bizInfo,formRelBizInfoList,relBizInfoList,workCurrentPage,workReturnCount,workLimit,attachmentBizModal,workList,workSearchWord } = stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab];
    function onChangeWord(e){
      dispatch({
        type:'formShow/updateStates',
        payload:{
          workSearchWord:e.target.value
        }
      })
    }

  





    return(

            <Modal
              width={800}
              visible={true}
              title={'选择关联事项'}
              onCancel={onVisible.bind(this,false)}
              maskClosable={false}
              mask={false}
              onOk={onSaveAttachmentBiz.bind(this)}
              getContainer={() =>{
                  return document.getElementById('formShow_container')
              }}
              >
                <Input.Search
                className={styles.search}
                placeholder={'请输入标题名称'}
                allowClear
                value={workSearchWord}
                onChange={onChangeWord.bind(this)}
                onSearch={getWorrkList.bind(this,1,workLimit)}
                />
                <Table className={styles.atttable} {...tableProps} {...modalTableProps} dataSource={workList}/>

            </Modal>
    )
}
export default AttachmentBiz;
