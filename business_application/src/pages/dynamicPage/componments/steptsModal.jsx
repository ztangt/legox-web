import React,{useEffect,useState} from 'react';
import { Steps,Button } from 'antd';
const description = 'This is a description.';
import { connect } from 'dva';
import GlobalModal from '../../../componments/GlobalModal';
import styles from './steptsModal.less'
const { Step } = Steps;
 function steptsModal({location, isShowSteptsModal,setIsShowSteptsModal,title,width,height,onCancel,steptsList}) {
    const listId = location?.query?.listId || 0;
    const bizSolId = location?.query?.bizSolId || 0;
    const formModelingName = `formModeling${bizSolId}${listId}`;

const handleCancel = () => {
    onCancel && onCancel();
    setIsShowSteptsModal(false);
    };
  return (
     <GlobalModal
      title={title}
      visible={isShowSteptsModal}
      widthType={1}
      incomingWidth={width}
      incomingHeight={height}
      onCancel={handleCancel}
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return document.getElementById(formModelingName) || false;
      }}
      footer={
          [<Button type='cancel' onClick={handleCancel}>取消</Button>]
      }
      >

        <Steps className={styles.stepts}  labelPlacement="vertical">
            {
                steptsList?.map((item=>{
                    return <Step className={item.status=='finish'?styles.finish:item.status=='process'?styles.process:item.status=='wait'?styles.wait:''} title={item.title} description={item.description?item.description:''} status={item.status} subTitle={item.subTitle?item.subTitle:''} />
                }))
            }
            <Step title="完成" status='finish' className={ steptsList.every((item=>item.status=='finish'))?styles.finally_step:styles.wait}/>
        </Steps>
      </GlobalModal>

  )
}
export default connect(({ dynamicPage }) => ({
    dynamicPage,
  }))(steptsModal);

