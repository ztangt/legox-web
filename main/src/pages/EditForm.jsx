import React from "react";
import _ from "lodash";
import styles from './editor.less'
import classnames from 'classnames'
import {Select,Input,DatePicker,Button} from 'antd'
import GridLayout from "react-grid-layout";
// const ResponsiveReactGridLayout = WidthProvider(Responsive);
let data = [
  {label: '拟稿人',type: 'input'}, 
  {label: '拟稿部门',type: 'select'},
  {label: '拟稿时间',type: 'dataPicker'},
  {label: '标题',type: 'textArea'},
  {label: '备注',type: 'textArea'},
  {label: '部门负责人',type: 'input'},
  {label: '分管领导',type: 'select'},
  {label: '人事处',type: 'select'},
  {label: '提交',type: 'button'},
]
let flag =0;
const originalPcLayout = getFromLS("pcData") || [];
const originalMobileLayout = getFromLS("mobileData") || [];
const originalPcSource = getFromLS("dataPcSource") || [];
const originalMobileSource = getFromLS("dataMobileSource") || [];

export default class DragFromOutsideLayout extends React.Component {
  

  state = {
    pcLayouts: { lg: [] },
    mobileLayouts: { lg:[] },
    pcData: [],
    mobileData: [],
    screenType: 'pc',
    width: 1200,
    dataPcSource: data,
    dataMobileSource:data,
  };

  componentDidMount() {
    this.initWidth();
    
    this.setState({
      pcData: JSON.parse(JSON.stringify(originalPcLayout)),
      mobileData: JSON.parse(JSON.stringify(originalMobileLayout)),
      dataPcSource: originalPcSource.length==0?data:JSON.parse(JSON.stringify(originalPcSource)),
      dataMobileSource: originalMobileSource.length==0?data:JSON.parse(JSON.stringify(originalMobileSource))
    });
  }
  
  
  initWidth(){
    const obj = document.getElementById("layout")
    if(obj){
      this.setState({width: obj.clientWidth})
    }
  }

  renderNode(type){
    const istyle={width:'80%',height:'80%'}
    switch(type) {
        case 'input':
            return <input style={istyle} disabled/>
        break;
        case 'button':
            return <Button style={istyle} disabled>拖拽</Button>
        break;
        case 'dataPicker':
          return <DatePicker style={istyle} disabled></DatePicker>
        break; 
        case 'select':
          return <Select style={{width:'80%'}} disabled>
                    <Select.Option value={1}>1</Select.Option>
                    <Select.Option value={2}>2</Select.Option>
          </Select>
        break;     
        default:
            return <input style={istyle} disabled/>
        break;
    }
  }
  generateDOM() {
    let that = this
    const { mobileData, pcData, screenType} = this.state
    return _.map(screenType=='pc'?pcData:mobileData, function(l, i) {
      return (
        <div key={l.i} data-grid={l} className={styles.drag_item} >
            <div className={styles.drag_item_label}>{l.label}</div>
            <div className={styles.drag_item_value}>{that.renderNode(l.type)}</div>
            <span 
              className={styles.remove} 
              onClick={that.onRemoveItem.bind(this,l)}
            >
              x
          </span>
        </div>
      );
    });
  }


  initDragNode(){
    let that = this
    const {dataPcSource,dataMobileSource, screenType} = that.state
    return _.map(screenType=='pc'?dataPcSource:dataMobileSource,function(s,i){
        return (
            <div 
                key={i}
                id={i}
                draggable={true}
                unselectable="on"
                className={styles.drag_item}
                onDragStart={e => e.dataTransfer.setData("text/plain",JSON.stringify(s))}
            >
                <div className={styles.drag_item_label}>{s.label}</div>
                <div className={styles.drag_item_value} >{that.renderNode(s.type)}</div>
            </div>
          );
    })
    
  }

  //位置和大小改变时执行该事件
  setData(layout){
    const { screenType, pcData, mobileData,dataPcSource,dataMobileSource} = this.state
    //操作前保存上一次操作后的数据至操作列表
    saveToLS('operationList',_.concat(getFromLS("operationList"),{'pcData':pcData,'mobileData':mobileData,'dataPcSource':dataPcSource,'dataMobileSource':dataMobileSource}))
    //设置改变后的布局
    let data = screenType == 'pc'?pcData:mobileData
    let list = _.map(layout,function(l,i){
      return  {
        ...data[i],
        ...l,
      }
    })
    this.setState({
      [screenType == 'pc'?'pcData':'mobileData']: list
    })
    saveToLS(screenType == 'pc'?'pcData':'mobileData',list)
  }



  onDrop = (layout, layoutItem, event) => {
    //获取当前拖拽组件
    var obj = JSON.parse(event.dataTransfer.getData("text/plain"));
    const { screenType, pcData, mobileData, dataPcSource ,dataMobileSource } = this.state
    //操作前保存上一次操作后的数据至操作列表
    saveToLS('operationList',_.concat(getFromLS("operationList"),{'pcData':pcData,'mobileData':mobileData,'dataPcSource':dataPcSource,'dataMobileSource':dataMobileSource}))
    let dataSource = screenType=='pc'?dataPcSource:dataMobileSource
    let data = screenType == 'pc'?pcData:mobileData
    //设置从外部拖拽的组件的大小、type（组件类型）、组件唯一标识
    data[layout.length-1] = {
      ...layout[layout.length-1],
      i: `${screenType}-${layout[layout.length-1].i}-${layout.length-1}`,
      type: obj.type,
      label: obj.label,
      w: screenType=='pc'?3:2,
      h: screenType=='pc'?2:1,
    }
    this.setState({
      [screenType == 'pc'?'pcData':'mobileData']: data
    })
    saveToLS(screenType == 'pc'?'pcData':'mobileData',data)
    //将当前组件从可拖拽列表删除
    let dS = _.reject(dataSource, { label: obj.label })
    saveToLS(screenType=='pc'?'dataPcSource':'dataMobileSource',dS)
    this.setState({ [screenType=='pc'?'dataPcSource':'dataMobileSource']:  dS});

  };

  onChangeScreen = (value) =>{
    this.setState({
      screenType: value
    })
  }

  //撤销
  onBack = () =>{
    //获取存在localstorage中的操作列表
    const ol = getFromLS("operationList");
    //取到上一次操作前的数据
    const obj = ol[ol.length-1]
    if(!obj){
      return
    }
    this.setState({
      pcData:obj.pcData||[],
      mobileData:obj.mobileData||[],
      dataPcSource:obj.dataPcSource||data,
      dataMobileSource:obj.dataMobileSource||data
    })
    flag +=1;
    saveToLS('dataPcSource',obj.dataPcSource)
    saveToLS('dataMobileSource',obj.dataMobileSource)
    saveToLS('pcData',obj.pcData)
    saveToLS('mobileData',obj.mobileData)
    saveToLS('operationList',_.dropRight(ol,1))


  }

  //删除表单组件
  onRemoveItem = (l) =>{
    const { screenType, pcData, mobileData,dataPcSource,dataMobileSource } = this.state
    //操作前保存上一次操作后的数据至操作列表
    saveToLS('operationList',_.concat(getFromLS("operationList"),{'pcData':pcData,'mobileData':mobileData,'dataPcSource':dataPcSource,'dataMobileSource':dataMobileSource}))
    //删除选中的组件
    let data =  _.reject(screenType=='pc'?pcData:mobileData, { i: l.i })
    this.setState({ [screenType=='pc'?'pcData':'mobileData']: data});
    saveToLS(screenType == 'pc'?'pcData':'mobileData',data)
    //将删除后的组件恢复到拖拽列表
    let dS = _.concat(screenType=='pc'?dataPcSource:dataMobileSource, { type: l.type, label: l.label})
    saveToLS(screenType=='pc'?'dataPcSource':'dataMobileSource',dS)
    this.setState({ [screenType=='pc'?'dataPcSource':'dataMobileSource']:  dS});

  }
  
  render() {
      const { screenType,width} = this.state
      const defaultProps = {
        rowHeight: 30,
        cols: 15,
        onDrop: this.onDrop,
        isDroppable: true,
        isBounded: true,
        margin:[0,0],
        onDragStop: this.setData.bind(this),
        onResizeStop: this.setData.bind(this),
        containerPadding:[30,30],
        measureBeforeMount:true,
        compactType:''
      };
    return (
        <div className={styles.container} key={flag}>
            <div className={styles.drag_contianer}>
                可拖拽组件
                {this.initDragNode()}
            </div>
            <div className={styles.right_container}>
            <div className={styles.tool}>
                <Select className={styles.tool_select} onChange={this.onChangeScreen} defaultValue={'pc'}>
                  <Select.Option value={'mobile'}>
                    手机
                  </Select.Option>
                  <Select.Option value={'pc'}>
                    PC
                  </Select.Option>
                </Select>
                <Button onClick={this.onBack}>撤回</Button>
              </div> 
              <div id={'layout'} className={classnames(styles.layout_container)}style={{width: screenType=='pc'?'100%':'540px'}}>
                <GridLayout 
                    width={screenType=='pc'?width:540}
                    {...defaultProps}
                    cols={screenType=='pc'?15:7}
                    >
                  
                    {this.generateDOM()}
                </GridLayout>
            </div>
          </div>
        </div>
    );
  }
}

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem(key)) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      key,
      JSON.stringify({
        [key]: value
      })
    );
  }
}


