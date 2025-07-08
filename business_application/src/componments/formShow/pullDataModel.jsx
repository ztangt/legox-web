import React,{useState} from 'react';
import ReSizeLeftRightCss from '../public/reSizeLeftRightCss';
import styles from './index.less';
import {connect, useLocation} from 'umi';
import ITree from '../Tree';
import {Input,Radio,Table,Button,Tag,Select,Typography} from 'antd';
import { BarsOutlined,AppstoreOutlined,SettingOutlined} from '@ant-design/icons';
import {dataFormat} from '../../util/util';
import {renderHtml,widthShowCol} from '../../util/listFormatUtil';
const { Text } = Typography;

const {Search} = Input;

import { Modal,message} from 'antd';

function Index({dispatch,formShow,onOKValue}){
  const {stateObj} = formShow;
  const bizSolId = useLocation().query.bizSolId;
  const bizInfoId = useLocation().query.bizInfoId;
  const currentTab = useLocation().query.currentTab;

  const { bizSolList, pullDataList, tableStyleInfo, pullDatacurrentPage, pullDataCurrentSize,dataDriveInfoId,pullDataTotalCount,mainIds,isBase,disabledIds,isMultipleTree,pullDataTableCode,pullDataSelectedId,dataDriveYear,searchWord,dictInfos} = stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab]
    console.log('stateObj[bizSolId+',stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab],bizSolList);   
    console.log('pullDataSelectedId[pullDataTableCode]',pullDataSelectedId[pullDataTableCode]);
  function onOk() {
    
    let selectIds = [];
    // if(pullDataTableCode&&pullDataSelectedId[pullDataTableCode]){
    //   selectIds = pullDataSelectedId[pullDataTableCode].concat(mainIds)
    // }else{
      selectIds = selectIds.concat(mainIds)

      if(isMultipleTree=='NO'){
        selectIds = [selectIds.pop()]
      }

    // }
    if(selectIds.length==0){
      message.error('至少选择一条单据信息')
      return 
    }
    pullDataSelectedId[pullDataTableCode] = selectIds
    
    dispatch({//获取拉取数据
      type: 'formShow/getPullData',
      payload:{
        dataDriveInfoId,
        mainIds: selectIds.filter((item)=>{return item}).toString(),
      },
      callback:(data)=>{
        
        dispatch({
          type: 'formShow/updateStates',
          payload: {
            pullDataModel: false,
            pullDataSelectedId
          }
        })
      }

    })
  }

  function onCancel(){
    dispatch({
      type: 'formShow/updateStates',
      payload: {
        pullDataModel: false,
        mainIds: pullDataSelectedId[pullDataTableCode]

      }
    })
  }
  function onSelectBiz(value,option){
    console.log('option.key.split('|')[1]',option.key.split('|')[1]);
    dispatch({
      type: 'formShow/updateStates',
      payload: {
        dataDriveInfoId: value,
        isBase: option.key.split('|')[1]=='true'?1:0,
        
      }
    })
    dispatch({//获取拉取数据列表样式
      type: 'formShow/getPullStyle',
      payload:{
        dataDriveInfoId: value,
      }

    })
    getPullDataList(value,1,pullDataCurrentSize,option.key.split('|')[1],dataDriveYear,searchWord)
   
  }
  function onSelectYear(value,option){
    dispatch({
      type: 'formShow/updateStates',
      payload: {
        dataDriveYear: value,        
      }
    })
    getPullDataList(dataDriveInfoId,1,isBase,value,searchWord)
   
  }
  //获取拉取数据
  function getPullDataList (dataDriveInfoId,start,limit,isBase,dataDriveYear,searchWord){
    dispatch({
      type: 'formShow/getPullDataList',
      payload:{
        dataDriveInfoId,
        start,
        limit,
        isBase:isBase=='true'?1:0,
        dataDriveYear,
        searchWord,
      }

    })
  }
  function onChange(e){
    dispatch({
      type:"formShow/updateStates",
      payload:{
        searchWord:e.target.value
      }
    })
  }

  function onSearch(value){
    getPullDataList(dataDriveInfoId,1,isBase,dataDriveYear,value)

  }
  function getList(list){
    let fixedList = _.filter(list,(item)=>{return item.fixedFlag==1})
    let unFixedList = _.filter(list,(item)=>{console.log(item.fixedFlag); return !item.fixedFlag})
    list = _.concat(fixedList,unFixedList)

      return list
  }

  function getTotal(pageData,code){
    let total = 0;
    pageData.forEach((item) => {
  　　var re = /^[0-9]+.?[0-9]*/;//判断字符串是否为数字
  　　if (re.test( item[code])) { 
       total += Number(item[code])
  　　}
    });
    return total
  }

  const tableProps =tableStyleInfo&&{
    summary:pageData => {
      return (
        <>
          {tableStyleInfo.columnList&&tableStyleInfo.columnList.length!=0&&_.filter(tableStyleInfo.columnList,(item)=>{return item.sumFlag==1}).length!=0&&<>
          <Table.Summary.Row>
            <Table.Summary.Cell><p style={{textAlign:'center'}}>合计</p></Table.Summary.Cell>
            {getList(tableStyleInfo.columnList).map((item,index)=>{
              return <Table.Summary.Cell key={index}>
              {item.sumFlag==1?item.showStyle=='MONEY'?renderHtml(item,getTotal(pageData,item.columnCode.toUpperCase()),tableStyleInfo.newLineFlag,'alignStyle'):getTotal(pageData,item.columnCode.toUpperCase()):''}
            </Table.Summary.Cell>
            })}
          </Table.Summary.Row>
          </>
        }
        </>
      );
    },
    scroll: {y:'calc(100% - 100px)',x:'auto'},
    bordered: tableStyleInfo.tableStyle&&tableStyleInfo.tableStyle=='TABLE'?true:false,
    pagination: tableStyleInfo.pageFlag?{
        total: pullDataTotalCount,
        // showQuickJumper: true,
        showSizeChanger:true,
        showTotal: (total)=>{return `共 ${total} 条` },
        onChange: (page,size)=>{
          getPullDataList(dataDriveInfoId,page,size,isBase);

          dispatch({
            type: 'formShow/updateStates',
            payload: {
              pullDatacurrentPage: page,
              pullDataCurrentSize: size, 
            }
          })
        }
      }:false,
    dataSource:pullDataList,
    columns: tableStyleInfo.columnList&&tableStyleInfo.columnList.length!=0&&getList(tableStyleInfo.columnList).map((item,index)=>{
      return {
        title: item.columnName,
        dataIndex: item.columnCode.toUpperCase(),
        sorter: item.sortFlag&&item.sortFlag==1?(a, b) => a[item.columnCode.toUpperCase()] - b[item.columnCode.toUpperCase()]: false,
        align:item.alignStyle=='MIDDLE'?'center':(item.alignStyle=='RIGHT'?'right':'left'),
        width:item.width?`calc(${item.width}${item.sortFlag==1?'+32px':''})`:'auto',
        className:item.width?'':styles.is_overflow,
        render:(text)=><>{renderHtml(item,text,tableStyleInfo.newlineFlag,'alignStyle')}</>
      }
    }),
    rowKey: 'ID',
    locale: '暂无数据,请先选择拉取方案',
    rowSelection:{
      selectedRowKeys:isMultipleTree=='YES'?mainIds:(mainIds?[mainIds[mainIds.length-1]]:[]),
      type:isMultipleTree=='YES'?'checkbox':'radio',
      onChange: (selectedRowKeys, selectedRows)=>{
        console.log('mainIds',mainIds,selectedRowKeys);
        //是当前页数据 且被取消选择
        // dispatch({
        //   type: 'formShow/updateStates',
        //   payload: {
        //     mainIds: _.union(mainIds.concat(selectedRowKeys)),
        //   }
        // })
      },
      onSelect: (record, selected, selectedRows, nativeEvent)=>{
        var selectedIds = []
        var IDS = mainIds||[]
        console.log('mainIds',mainIds)

        // if(!selected&&pullDataTableCode&&pullDataSelectedId[pullDataTableCode]){//取消选择
          
          if(!selected){//取消选择
            // selectedIds = pullDataSelectedId[pullDataTableCode].filter((item)=>{return item!=record.ID})
            IDS = IDS.filter((item)=>{return item!=record.ID})
          }else{
            IDS = IDS.concat(record.ID)
          }
          dispatch({
            type: 'formShow/updateStates',
            payload: {
              // pullDataSelectedId: selectedIds,
              mainIds: IDS
            }
          })
      }
      // getCheckboxProps: (record) => ({
      //   disabled: disabledIds&&disabledIds.includes(record.ID)
      // }),
    }
  }
  return (
    <Modal
      width={'95%'}
      visible={true}
      title={'单据信息选择'}
      onCancel={onCancel.bind(this)}
      maskClosable={false}
      mask={false}
      onOk={onOk.bind(this)}
      getContainer={() =>{
          return document.getElementById('formShow_container')
      }}
    >
      <div className={styles.search}> 
        <Input.Search
          className={styles.pullSearch}
          value={searchWord}
          onChange={onChange.bind(this)}
          onSearch={onSearch.bind(this)}
          placeholder='请输入搜索词'/>

        <Select 
          className={styles.pullSearch} 
          onChange={onSelectYear.bind(this)}  
          value={dataDriveYear} 
          placeholder='请选择年度数据'>
          {dictInfos.map((item)=><Select.Option value={item.dictInfoCode}>{item.dictInfoName}</Select.Option>)}
        </Select>
        <Select 
          className={styles.pullSearch} 
          onChange={onSelectBiz.bind(this)}  
          value={dataDriveInfoId} 
          placeholder='请选择拉取方案'>
          {bizSolList.map((item)=><Select.Option value={item.dataDriveInfoId} key={`${item.dataDriveInfoId}|${item.isBase}`}>{item.sourceBizSol}</Select.Option>)}
        </Select>
      </div>

      <Table {...tableProps}/>  
                             
    </Modal>
  )
}


export default connect(({formShow})=>{return {formShow}})(Index);
