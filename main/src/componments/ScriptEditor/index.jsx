import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from 'antd';
import CodeMirror, { useCodeMirror } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { fetchResource, getCleanScript } from '../../util/performScript';
import { scriptStr } from '../../util/defaultScriptStr';
import _ from 'lodash';
import styles from './index.less';

function ScriptEditor({ value, onChange ,changeCodeValue, path, isFun, isShow,isView}) {
  const editor = useRef();
  // const [codeText, setCodeText] = useState(scriptStr);
  const [codeText, setCodeText] = useState(isFun ? '' : scriptStr);

  // CodeMirror的change
  const codeChange = useCallback((newValue, viewUpdate) => {
    // const codeText = `(()=> {'use strict';${newValue}})`;
    const codeText = `((rowInfoArr)=> {'use strict';${newValue}})`;
    onChange(codeText);
    changeCodeValue(newValue)
  }, []);
  // 防抖
  const onCodeChange = _.debounce(codeChange, 800, { maxWait: 1000 });

  const onClear = () => {
    setCodeText('');
  };

  const { setContainer } = useCodeMirror({
    container: editor.current,
    height: '330px',
    width: 'inherit',
    extensions: [javascript()],
    value: codeText,
    onChange: onCodeChange,
    readOnly: isView||isShow || false,
  });

  useEffect(() => {
    if (editor.current) {
      setContainer(editor.current);
    }
  }, [editor.current]);

  // 获取事件脚本内容
  const fetchEventScriptText = async scriptURL => {
    let scriptStr = await fetchResource(scriptURL);
    let scriptClearText = getCleanScript(scriptStr);

    setCodeText(scriptClearText);
    changeCodeValue(scriptClearText)
  };

  useEffect(() => {
    if (path) {
      fetchEventScriptText(path);
    }
  }, [path]);

  return (
    <div className={styles.warp}>
      <div className={styles.button}>
        {isShow ? null : <Button type="link" onClick={onClear} style={{ marginRight: '20px' }} disabled={isView?true:false}>
          清空
        </Button>}
      </div>
      <div ref={editor} className={styles.scriptEditor}/>
    </div>
  );
}

export default ScriptEditor;
