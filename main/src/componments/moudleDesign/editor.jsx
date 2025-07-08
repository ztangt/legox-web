import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/color-picker.css'
import { connect } from 'dva';
import React from 'react'
import BraftEditor from 'braft-editor'
import ColorPicker from 'braft-extensions/dist/color-picker'
import styles from './index.less'
import {useLocation} from 'umi'
BraftEditor.use(ColorPicker({
  includeEditors: ['editor-with-color-picker'],
  theme: 'light' // 支持dark和light两种主题，默认为dark
}))


 class Editor extends React.Component {
  
  handleEditorChange = (editorState) =>{
    const {dispatch,namespace} = this.props
    
    dispatch({
        type: `${namespace}/updateStates`,
        payload: {
            editorState: editorState,
            outputHTML: editorState.toHTML()
          
        }
    })
  }
  render () {
    const {editorState} = this.props.stateInfo
    const extendControls = [
      {
        key: "font-family",
      },
    ];
  const fontFamily = [
      {
          name: "宋体",
          family: '"宋体",sans-serif',
      },
      {
          name: "方正小标宋",
          family: "FZXiaoBiaoSong-B05S",
      },
      {
          name: "仿宋",
          family: "FangSong",
      },
      {
          name: "微软雅黑",
          family: "Microsoft Yahei",
      },
      
      {
          name: "黑体",
          family: '"黑体",serif',
      },
      {
          name: "楷体",
          family: "楷体",
      },
      
  ];

    console.log('editorState',editorState);
    return (
      <div className={styles.editor_container}>
        <BraftEditor 
            id="editor-with-color-picker" 
            controls={['font-size','font-family','text-color','bold','italic','strike-through','underline']} 
            value={BraftEditor.createEditorState(editorState)}
            onChange={this.handleEditorChange}
            fontFamilies={fontFamily} 
            extendControls={extendControls}
        />
      </div>
    )

  }

}
// export default connect(({moudleDesign})=>({
//     ...moudleDesign
// }))(Editor);
export default Editor