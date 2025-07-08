// import React , {  useCallback }from 'react';
// import CodeMirror from '@uiw/react-codemirror';
// import {StreamLanguage} from "@codemirror/language"
// import { json } from "@codemirror/legacy-modes/mode/javascript"
// import _ from 'lodash';

// function App({value, changeCodeValue }) {
//  // CodeMirror的change
//  const codeChange = useCallback((newValue, viewUpdate) => {
//   changeCodeValue(newValue)
// }, []);
// // 防抖
// const onCodeChange = _.debounce(codeChange, 800, { maxWait: 1000 });

//   return <CodeMirror value={value} height="400px" extensions={[StreamLanguage.define(json)]} onChange={onCodeChange} />;
// }
// export default App;

import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

function App() {
  const [value, setValue] = React.useState("console.log('hello world!');");
  const onChange = React.useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
  }, []);
  return <CodeMirror value={value} height="200px" extensions={[javascript({ jsx: true })]} onChange={onChange} />;
}
export default App;
