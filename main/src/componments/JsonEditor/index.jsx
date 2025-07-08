import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from 'antd';
// import CodeMirror, { useCodeMirror } from '@uiw/react-codemirror';
// import { StreamLanguage } from '@codemirror/language';
// import { json } from '@codemirror/lang-json';
// import { StreamLanguage } from "@codemirror/language"
// import { json } from "@codemirror/legacy-modes/mode/javascript"
// import { fetchResource, getCleanScript } from '../../util/performScript';
import _ from 'lodash';
import styles from './index.less';
// import JSONInput from 'react-json-editor-ajrm';
// import locale from 'react-json-editor-ajrm/locale/zh-cn';

function ScriptEditor({ value, changeCodeValue }) {

  // const editor = useRef();

  // // CodeMirror的change
  const codeChange = useCallback((newValue, viewUpdate) => {
    changeCodeValue(newValue)
  }, []);
  // // 防抖
  const onCodeChange = _.debounce(codeChange, 800, { maxWait: 1000 });

  // const onClear = () => {
  //   changeCodeValue('')
  // };

  // const { setContainer } = useCodeMirror({
  //   container: editor.current,
  //   height: '430px',
  //   width: 'inherit',
  //   extensions: [[StreamLanguage.define(json)]],
  //   value,
  //   onChange: onCodeChange,
  //   readOnly: false,
  //   basicSetup: {
  //     foldGutter: true,
  //   }
  // });

  // useEffect(() => {
  //   if (editor.current) {
  //     setContainer(editor.current);
  //   }
  // }, [editor.current]);

  return (
    <div className={styles.warp}>
      <div className={styles.button}>
        {/* <Button type="link" onClick={onClear} style={{ marginRight: '20px' }}>
          清空
        </Button> */}
      </div>
      {/* <div ref={editor} className={styles.scriptEditor}/> */}
      {/* <JSONInput
        id='a_unique_id'
        placeholder={value}
        // colors      = { darktheme }
        locale={locale}
        height='550px'
        onChange={onCodeChange}
      /> */}
    </div>
  );
}

export default ScriptEditor;
