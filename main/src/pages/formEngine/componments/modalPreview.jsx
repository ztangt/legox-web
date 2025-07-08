import {Modal} from 'antd';
import {components,itemprops} from '../../../componments/public/formConfig';
import RGL, { WidthProvider } from "react-grid-layout";
import styles from './modalPreview.less';
import {connect} from 'umi';
const ReactGridLayout = WidthProvider(RGL);
//配置
const defaultProps = {
  className: "layout",
  isDraggable: false,
  isResizable: false,
  margin:[0,0],
  containerPadding: [0, 0],
  //isBounded: false,
  cols: 12,
  rowHeight: 16,
  onLayoutChange: function() {}
};
function ModalPreview({dispatch,formEngine}){
  const {formJSON} = formEngine;
  const cancelPre = ()=>{
    dispatch({
      type:"formEngine/updateStates",
      payload:{
        isModalPreview:false,
      }
    })
  }
  const generateDOM=(grids,componentValues)=>{
    console.log('components=',components);
    return grids.map((item, i)=>{
      const type = item.i.split('_')[0];
      let MyComponent = components[type]||Fragment;
      let componentValueInfo = componentValues.filter((value)=>value.i==item.i);
      let componentValue = componentValueInfo.length?componentValueInfo[0].value:'';
      switch (type) {
        case 'Upload':
          return (
            <div key={item.i} className={styles.wrap}>
              <MyComponent {...itemprops[type][0]} className={styles.boxInput} readOnly="readOnly"><Button>上传附件</Button></MyComponent>
            </div>
          )
          break;
        case 'Title':
        case 'Text':
          return (
            <div key={item.i} className={styles.wrap}>
              <MyComponent {...itemprops[type][0]} value={componentValue} readOnly="readOnly"/>
            </div>
          )
          break;
        default:
          //组件属性
          return (
            <div key={item.i} className={styles.wrap}>
              <MyComponent {...itemprops[type][0]} className={styles.boxInput}/>
          </div>
          )
      }
    })
  }
  return (
    <Modal
      visible={true}
      title="预览表单"
      onCancel={cancelPre}
      maskClosable={false}
      mask={false}
      width={'95%'}
      centered
      getContainer={() =>{
        return document.getElementById('formEngine_container')||false
      }}
      footer={null}
      className={styles.modal_warp}
    >
      <div className={styles.content}>
        {formJSON.length?
          <ReactGridLayout
            layout={formJSON[0].grids}
            {...defaultProps}
            isDraggable={false}
          >
            {generateDOM(formJSON[0].grids,formJSON[0].componentValues)}
          </ReactGridLayout>:
          null
        }
      </div>
    </Modal>
  )
}
export default connect(({formEngine})=>{return {formEngine}})(ModalPreview);
