import {Modal,Input} from 'antd';
import {connect} from 'dva';
import styles from './ruleConfig.less';
import SparkMD5 from 'spark-md5';
import ScriptEditor from '../../../componments/public/scriptEditor'
import { JSSCRIPT } from '../../../service/constant';
import { v4 as uuidv4 } from 'uuid';
import {useState,useEffect,useCallback} from 'react';
const { TextArea } = Input;
function ScriptModal({dispatch,applyModelConfig,bizSolId,parentState,setParentState}){
  const {customInex,selectActId,customCheckData,currentRule}= parentState;
  const {scriptContent}=applyModelConfig
  const [height, setHeight] = useState(
    document.getElementById(`code_modal_${bizSolId}`)?document.getElementById(`code_modal_${bizSolId}`).offsetHeight-62-87:0
  )
  const onResize = useCallback(() => {
    setHeight(
      Number(
        document.getElementById(`code_modal_${bizSolId}`).offsetHeight-62-87
      )
    )
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])
  const handelCancle=()=>{
    setParentState({
      isShowCustomRule:false,
      customInex:0,
    })
    dispatch({
      type: 'applyModelConfig/updateStatesGlobal',
      payload: {
        scriptContent: JSSCRIPT,
      }
    })
  }
  const changeScriptContent= (value)=>{
    dispatch({
      type:"applyModelConfig/updateStatesGlobal",
      payload:{
        scriptContent:value
      }
    })
  }
  console.log('scriptContent123=',scriptContent);
  //保存
  const saveCustomRule=async ()=>{
    console.log(scriptContent,'scriptContent----');
        const blob = new Blob([scriptContent], { type: 'text/javascript' });
        const file = new File([blob], uuidv4(), {
          type: 'text/javascript',
        });
        console.log(file,'file');
        const fileMD5 = SparkMD5.hashBinary(scriptContent);
        console.log(fileMD5,'fileMD5');
        await dispatch({
          type: 'applyModelConfig/updateStatesGlobal',
          payload: {
            fileChunkedList: [file],
            md5: fileMD5,
            fileName: `${file.name}.js`,
            fileSize: file.size,
          },
        });
        await dispatch({
          type:'applyModelConfig/getScriptFileToMinio',
          callback:(filePath,fileFullPath)=>{
                  console.log(filePath,'filePath');
                  console.log(fileFullPath,'fileFullPath');
                  console.log('currentRule===',currentRule);
                  currentRule.custom[customInex].ruleJsUrl=filePath;
                  currentRule.custom[customInex].ruleJsFullUrl=fileFullPath;
                  setParentState({
                    currentRule
                  })
                  handelCancle()
          }
        })
    // dispatch({
    //   type:"applyModelConfig/saveRuleConfig",
    //   payload:{
    //     jsurl:`bizSolRuleConfig/${bizSolId}`,
    //     miniojs:JSON.stringify({data:scriptContent}),
    //     minioname:`custom_rule_${selectActId}_${customInex}.js`,
    //     fileEncryption:SparkMD5.hash(JSON.stringify({data:scriptContent}))
    //   },
    //   callback:(url)=>{
    //     // customCheckData[customInex].ruleJsUrl=url;
    //     currentRule.custom[customInex].ruleJsUrl=url;
    //     dispatch({
    //       type:"applyModelConfig/updateStates",
    //       payload:{
    //         currentRule
    //       }
    //     })
    //     handelCancle()
    //   }
    // })
  }
  return (
    <Modal
      title="JS脚本"
      visible={true}
      onCancel={handelCancle.bind(this)}
      width={'95%'}
      bodyStyle={{height:height}}
      centered
      onOk={saveCustomRule}
      className={styles.rule_modal_warp}
      maskClosable={false}
      mask={false}
      getContainer={() =>{
        return document.getElementById(`code_modal_${bizSolId}`)||false
      }}
    >
      {/* <TextArea style={{height:'100%'}} onChange={changeScriptContent.bind(this)} value={scriptContent}/> */}
      <ScriptEditor
            scriptValue={scriptContent}
            onChange={changeScriptContent}
          />
    </Modal>
  )
}
export default connect(({applyModelConfig})=>{return {applyModelConfig}})(ScriptModal);
