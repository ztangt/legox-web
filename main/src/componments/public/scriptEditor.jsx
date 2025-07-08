import React, { useRef, useEffect, useState, useCallback,useImperativeHandle } from 'react';
import { Button } from 'antd';
import CodeMirror, { useCodeMirror } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import _ from 'lodash';
import styles from './scriptEditor.less';
function ScriptEditor({ scriptValue },parentRef) {
  const [codeText, setCodeText] = useState(scriptValue || '');
  useImperativeHandle(parentRef, () => {
    // return返回的值就可以被父组件获取到,没返回的值就获取不到
    return {
      getValue() {
        return codeText;
      }
    }
  })
  // CodeMirror的change
  const codeChange = useCallback((newValue, viewUpdate) => {
    setCodeText(newValue);
  }, []);
  // 防抖
  const onCodeChange = _.debounce(codeChange, 800, { maxWait: 1000 });
  return (
    <div className={styles.warp}>
      <CodeMirror
        value={codeText}
        extensions={[javascript({ jsx: true })]}
        onChange={onCodeChange}
        style={{width:'inherit',height:'inherit'}}
      />
    </div>
  );
}

export default React.forwardRef(ScriptEditor);
