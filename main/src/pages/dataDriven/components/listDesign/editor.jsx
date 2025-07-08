import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/color-picker.css'
import { connect } from 'dva';
import React from 'react'
import BraftEditor from 'braft-editor'
import ColorPicker from 'braft-extensions/dist/color-picker'
import styles from './index.less'
BraftEditor.use(ColorPicker({
  includeEditors: ['editor-with-color-picker'],
  theme: 'light' // 支持dark和light两种主题，默认为dark
}))

 class Editor extends React.Component {

  handleEditorChange = (editorState) =>{
    const {dispatch} = this.props
    console.log('editorState',editorState.toHTML());
    dispatch({
        type: 'dataDriven/updateStates',
        payload: {
            editorState: editorState.toHTML(),
        }
    })
  }
  render () {
    const {editorState} = this.props
    return (
      <div className={styles.editor_container}>
        <BraftEditor 
            id="editor-with-color-picker" 
            controls={['font-size','font-family','text-color','bold','italic']} 
            value={editorState}
            onChange={this.handleEditorChange}
        />
      </div>
    )

  }

}
export default connect(({dataDriven})=>({
    ...dataDriven
}))(Editor);