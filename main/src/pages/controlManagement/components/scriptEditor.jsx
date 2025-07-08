import React, { useState, useCallback,useImperativeHandle } from 'react';
import {connect} from 'dva'
import { Button } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { v4 as uuidv4 } from 'uuid';
import { dataFormat } from '../../../util/util';
import SparkMD5 from 'spark-md5';
import {CONTROLCODE,DRIVETYPE} from '../../../service/constant'
import styles from './scriptEditor.less'
function ScriptEditor({dispatch,controlManagement,onRef,height,readOnly}) {
    const [codeText, setCodeText] = useState(CONTROLCODE);
    useImperativeHandle(onRef, () => {
      return {
        changeValue: changeValue
      }
    })
    function changeValue(data) {
      setCodeText(data)
    }
    const onChange = useCallback((value, viewUpdate) => {
        setCodeText(value);
        console.log(value,'value');
        console.log('value:', value, viewUpdate);
        dispatch({
          type:'controlManagement/updateStates',
          payload:{
            ruleData:value
          }
        })
      }, []);
       // js代码转js文件
  const codeTextToFile = () => {
    if (codeText && codeText.trim()) {
      const text = `function run() {${codeText}} run()`;
      const blob = new Blob([text], { type: 'text/javascript' });
      const file = new File([blob], uuidv4(), { type: 'text/javascript' });

      const aTag = document.createElement('a');

      aTag.download = `${file.name}.js`; //创建文件名
      aTag.href = URL.createObjectURL(blob);
      aTag.click();
      URL.revokeObjectURL(blob);

      console.log(file);
    }
  };

  return (
    <div style={{height:'100%'}}>
         <CodeMirror
        value={codeText}
        style={{height:height}}
        extensions={[javascript()]}
        onChange={onChange}
        className={styles.editor}
        readOnly={readOnly}
      />
      {/* <Button onClick={codeTextToFile}>下载</Button> */}
    </div>
  );
}

export default connect (({controlManagement})=>({controlManagement}))(ScriptEditor);
