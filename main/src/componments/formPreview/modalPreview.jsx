import {Modal,Button,message,Form} from 'antd';
import styles from './modalPreview.less';
import {connect, useLocation, MicroAppWithMemoHistory} from 'umi';
import { useMemo,useEffect,useState,useCallback } from 'react'
import GlobalModal from '../../componments/GlobalModal';
function ModalPreview({dispatch,formId,version,cancelPre,formPreview,containerId}){
  const { signConfig, formStyleJSON } = formPreview
  const [height, setHeight] = useState(
    document.getElementById(containerId).offsetHeight * 0.8 - 87
  )
  const onResize = useCallback(() => {
    setHeight(
      Number(
        document.getElementById(containerId).offsetHeight * 0.8 - 43
      )
    )
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    dispatch({
      type: 'formPreview/getTenantSign'
    })
    dispatch({
      type: 'formPreview/getFormDetail',
      payload: {
        formId,
        version
      }
    })
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])
  const onCancel = () =>{
    cancelPre();
    dispatch({
      type: 'formPreview/updateStates',
      payload: {
        formId,
        formStyleJSON: {}
      }
    })
  }
  const MicroApp = useMemo(() => {
    return (
      <MicroAppWithMemoHistory
        isPreview={true}
        name="designable"
        url="/preview"
        // formId={formId}
        // version={version}
        location={useLocation()}
        signConfig={signConfig}
        formJson={formStyleJSON}
      />
      )
  }, [signConfig,formStyleJSON]);
  return (
    <GlobalModal
      visible={true}
      widthType={1}
      incomingWidth={1000}
      incomingHeight={height}
      title="预览表单"
      onCancel={onCancel}
      maskClosable={false}
      mask={false}
      centered
      // width={'97%'}
      // bodyStyle={{height:height,overflow:'auto'}}
      getContainer={() =>{
        return document.getElementById(containerId)||false
      }}
      footer={false}
      className={styles.modal_warp}
    >
      {MicroApp}
    </GlobalModal>
  )
}
export default connect(({formPreview})=>{return {formPreview}})(ModalPreview);
