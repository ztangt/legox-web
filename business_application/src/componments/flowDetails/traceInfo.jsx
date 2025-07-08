import GlobalModal from '../GlobalModal';
import {Descriptions,Button,Popover} from 'antd';
import Table from '../columnDragTable/index'
import { useEffect, useState,useRef } from 'react';
import {connect} from 'umi';
import styles from './traceInfo.less';
function TraceInfo({location,dispatch,id,onCancel}){
  const targetKey = location?.query?.bizInfoId||'';
  const deployFormId = location?.query?.deployFormId||'';
  const deployFormName = location?.query?.deployFormName||'';
  const [mainFormInfo,setMainFormInfo] = useState({});
  const [tabelInfos,setTabelInfos] = useState([]);
  const [descContentWidth,setDescContentWidth] = useState(0);
  const traceInfoRef=useRef(null);
  useEffect(()=>{
    //获取表单留痕数据,整理成table数据
    dispatch({
      type:'flowDetails/getFormTrace',
      payload:{
        id,
        deployFormId:deployFormId
      },
      callback:(data)=>{
        //根据deployFormId先获取主表的
        const mainFormInfo = data.data[deployFormId];
        //获取body宽度用于计算Descriptions组件的宽度，内容超过则省略号
        const bodyWidth = traceInfoRef?.current?.offsetWidth||1000;
        let tmpWidth = 0;
        if(mainFormInfo){
          if(Object.keys(mainFormInfo?.[0]).length>2){
            //超过两个时候会展示三行(label是固定100，所以减300,padding是8所以减48)
            tmpWidth = Math.floor((bodyWidth-300-48)/3);
          }else if(Object.keys(mainFormInfo?.[0]).length==2){
            tmpWidth = Math.floor((bodyWidth-200-32)/2);
          }
        }
        //获取全部子表的
        const tmpTabelInfos = [];
        data.listStyle.map((item)=>{
          let columns = [{
            title:'序号',
            dataIndex:'index',
            width:60,
            render:(text,obj,index)=><p 
              className={styles.cell_col} 
              style={{color:getColor(obj,'')}}>
                <span>{index+1}</span>
              </p>
          }];
          let dataSource = data.data[item.formId]||[];
          item.columns.map((colItem)=>{
            columns.push({
              title:colItem.formColumnName ,
              dataIndex: colItem.formColumnCode,
              render:(text,obj)=><p 
                style={{
                  color:getColor(obj,colItem.formColumnCode)
                }} 
                className={styles.cell_col}>
                  <span>{text}</span>
                </p>
            })
          })
          tmpTabelInfos.push({
            columns:columns,
            data:dataSource,
            tabelName:item.formName
          })
        })
        setDescContentWidth(tmpWidth);
        setMainFormInfo(mainFormInfo?.[0]||{});
        setTabelInfos(tmpTabelInfos);
      }
    })
  },[])
  //获取背景颜色
  // const getBackGround=(obj,formColumnCode)=>{
  //   if(obj.LIST_LINE_COLOR){
  //     switch(obj.LIST_LINE_COLOR){
  //       case 'GREEN':
  //         return '#E4FBE4';
  //       case 'RED':
  //         return '#FEE9E8';
  //       default :
  //         return 'inherit'
  //     }
  //   }
  //   if(formColumnCode&&obj.YELLOW_COLUMNS){
  //     if(obj.YELLOW_COLUMNS.includes(formColumnCode)){
  //       return '#FBECDD'
  //     }
  //   }
  //   return 'inherit'
  // }
  //获取字体颜色
  const getColor=(obj,formColumnCode)=>{
    if(obj.LIST_LINE_COLOR){
      switch(obj.LIST_LINE_COLOR){
        case 'GREEN':
          return '#50AC50';
        case 'RED':
          return '#FA2C19';
        default :
          return 'inherit'
      }
    }
    if(formColumnCode&&obj.YELLOW_COLUMNS){
      if(obj.YELLOW_COLUMNS.includes(formColumnCode)){
        return '#EA9743'
      }
    }
    return 'inherit'
  }
  return (
    <GlobalModal
      open={true}
      title="表单留痕"
      widthType={3}
      onOk={onCancel}
      onCancel={onCancel}
      bodyStyle={{padding:0,overflowY:'auto',overflowX:'hidden'}}
      mask={false}
      maskClosable={false}
      getContainer={() =>{
        return document.getElementById(`flowDetails_container_${targetKey}`)
      }}
      className={styles.info_warp}
      footer={<>
      <p className={styles.warn_info}>
        <span><i style={{background:'#50AC50'}}></i>新增</span>
        <span><i style={{background:'#EA9743'}}></i>修改</span>
        <span><i style={{background:'#FA2C19'}}></i>删除</span>
      </p>
      <Button onClick={onCancel}>取消</Button>
      <Button onClick={onCancel}>确定</Button>
      </>}
    >
      <div ref={traceInfoRef} style={{width:'100%'}}>
        {Object.keys(mainFormInfo).length?<Descriptions 
          title={<p style={{fontSize:'14px'}}>{deployFormName}</p>} 
          bordered
          labelStyle={{maxWidth:'100px',minWidth:'100px',textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden'}}
          contentStyle={{color:"#EA9743"}}
        >
          {Object.keys(mainFormInfo).map((key)=>{
            return (
              <Descriptions.Item label={<span title={key}>{key}</span>}>
                <Popover 
                  overlayClassName='desc_popover'
                  content={<p style={{maxHeight:'200px',overflowY:'auto',color:"#EA9743"}}>{mainFormInfo[key]}</p>} 
                  title={`${key}`}
                  autoAdjustOverflow={true}
                >
                  <p
                   style={{width:descContentWidth?descContentWidth:'auto',textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden'}}
                  >{mainFormInfo[key]}</p>
                </Popover>
              </Descriptions.Item>
            )
          })}
        </Descriptions>:null}
        {tabelInfos.map((item)=>{
          return (
            <>
            {item.data&&item.data.length?
              <>
                <p style={{margin:'8px',fontWeight:'700'}}>{item.tabelName}</p>
                <Table
                  columns={item.columns} 
                  dataSource={item.data}
                  scroll={{x:'auto'}}
                  rowKey='index'
                  pagination={false}
                  bordered={true}
                />
              </>:null
            }
            </>
          )
        })}
      </div>
    </GlobalModal>
  )
}
export default connect(({flowDetails,loading})=>{return {flowDetails,loading}})(TraceInfo);