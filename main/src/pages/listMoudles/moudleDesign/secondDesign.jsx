import { connect } from 'dva';
import React, { useState } from 'react';
import { Input,Button,message,Radio,Select, Form,Tree,Table,Tabs,Switch,Row,Col,DatePicker,Popover,Dropdown,Menu} from 'antd';
import styles from './index.less';
import { dataFormat } from '../../../util/util.js';
import ReSizeLeftRightCss from '../../../componments/public/reSizeLeftRightCss'
import ButtonMoudle from './buttonMoudle'
import { isEmptyObject } from 'jquery';
import ListSet from './listSet'
import ColSet from './colSet'
import SeniorSearch from './seniorSearch'
import { SettingOutlined, DownOutlined } from '@ant-design/icons'
import Sort from './sortAble'
import {history,useLocation} from 'umi'
import 'braft-editor/dist/output.css'
import './font.css';
import './size.css';
import { parse } from 'query-string';
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
// import { useAliveController } from 'react-activation'


function firstDesign({dispatch,dsTree,listMoudleInfo,fieldTree,tableColumns,buttonModal,
    editorState,selectedKeys,seniorModal,selectedIndex,checkedKeys,isPreview,sortSetVisible,
    sortList,outputHTML,newTable,seniorSearchList,formKey,buttons,seniorCheckedKeys,activeKey,
    yearData
}){
const query = parse(history.location.search);

    // const { getCachingNodes, dropScope, clear} = useAliveController()

    // console.log('getCachingNodes',getCachingNodes());
    const [form] = Form.useForm();
    const namespace = `moudleDesign_${query.moudleId}`;
    const pathname = history.location.pathname
    const searchValue = history.location.search.includes('?')||!history.location.search?history.location.search:`?${history.location.search}`
    // function getList() {
    //     if(isPreview){
    //         return newTable
    //     }else {
    //         return listMoudleInfo.columnList
    //     }
    // }
    function onSelect(selectedKeys, {selected: bool, selectedNodes, node, event}) {
        if(!selectedKeys[0]){
            return
        }
        if(listMoudleInfo.columnList&&listMoudleInfo.columnList.length!=0){
            let index = listMoudleInfo.columnList.findIndex((item)=>{return item.columnCode==selectedNodes[0].colCode})
            if(index!=-1){
                console.log('listMoudleInfo.columnList[index]',listMoudleInfo.columnList[index],selectedNodes[0]);

                // listMoudleInfo.columnList[index].dsName = listMoudleInfo.dsName
                listMoudleInfo.columnList[index].tableCode = listMoudleInfo.tableCode
                listMoudleInfo.columnList[index].fieldName = selectedNodes[0].title
                console.log('listMoudleInfo',listMoudleInfo);
                dispatch({
                    type: `${namespace}/updateStates`,
                    payload: {
                        listMoudleInfo,
                        selectedIndex: index,
                        selectedKeys,
                    }
                })
            }else{//当前选中的列字段未找到
                message.error('当前字段未选中,请选中后再进行配置')
            }
        }


    }

    function onSetSenior() {
        dispatch({
            type: `${namespace}/updateStates`,
            payload: {
                seniorModal: true,
            }
        })
    }
    function onCheck(checkedKeys, {checked: bool, checkedNodes, node, event, halfCheckedKeys}) {
        let list = checkedNodes.filter((item)=>{return listMoudleInfo['tableId']!=item.key})
        let sks = selectedKeys
        let sidx = selectedIndex
        if(list.length!=0){
            if(listMoudleInfo.columnList&&listMoudleInfo.columnList.length!=0){
                for (let index = 0; index < list.length; index++) {
                    const element = list[index];
                    element.columnCode = element.colCode
                    element.columnName = element.colName
                    element.fieldName = element.colName
                    element.checked = true
                    let flag = listMoudleInfo.columnList.findIndex((item)=>{return item.columnCode == element.colCode})
                    if(flag==-1){
                        listMoudleInfo.columnList.push(element)
                    }
                }
                for (let f = 0; f < listMoudleInfo.columnList.length; f++) {
                    const obj = listMoudleInfo.columnList[f];
                    let flag = list.findIndex((item)=>{return item.colCode == obj.columnCode})

                    if(flag==-1){
                        if(sks.length!=0&&sks[0]==obj.columnCode){
                            sks = []
                            sidx =-1;
                        }
                        listMoudleInfo.normalSearch = listMoudleInfo.normalSearch.filter((item)=>{return item!=listMoudleInfo.columnList[f].columnCode})
                        seniorSearchList = seniorSearchList&&seniorSearchList.filter((item)=>{return item.colCode!=listMoudleInfo.columnList[f].columnCode})
                        seniorCheckedKeys = seniorCheckedKeys&&seniorCheckedKeys.filter((item)=>{return item.columnCode!=listMoudleInfo.columnList[f].columnCode})

                        listMoudleInfo.columnList[f]['flag'] = -1
                    }else{
                        listMoudleInfo.columnList[f]['flag'] = f
                    }
                }


                 listMoudleInfo['columnList'] = listMoudleInfo.columnList.filter((item)=>{return item.flag!=-1})

                 form.setFieldsValue({'normalSearch': listMoudleInfo.normalSearch})

            }else{

                listMoudleInfo.columnList = list.map((item)=>{
                    return{
                        ...item,
                        checked: true
                    }
                })
            }
        }else{
            listMoudleInfo.columnList = []
            listMoudleInfo.normalSearch = []
            seniorSearchList = []
            seniorCheckedKeys = []
            form.setFieldsValue({'normalSearch': []})

        }

        dispatch({
            type: `${namespace}/updateStates`,
            payload: {
                listMoudleInfo,
                checkedKeys,
                selectedKeys: sks,
                selectedIndex: sidx,
                sortList: listMoudleInfo.columnList,
                seniorTree: [{
                    key: listMoudleInfo['tableId'],
                    title: listMoudleInfo['tableCode'],
                    dsDynamic: listMoudleInfo['dsDynamic'],
                    children: list,
                  }],
                  seniorSearchList,
                  seniorCheckedKeys,
            }
        })

    }
    function onChoseMoudle() {
        dispatch({
            type: `${namespace}/updateStates`,
            payload: {
                buttonModal: true,
            }
        })
        getButtonGroups('')

    }
    function getButtonGroups(searchValue) {
        dispatch({
            type: `${namespace}/getButtonGroups`,
            payload: {
                searchValue: searchValue,
                start: 1,
                limit: 1000,
                groupType: 'TABLE',
            }
        })
    }


    function oncancel() {
        dispatch({
            type: `${namespace}/updateStates`,
            payload: {
                sortSetVisible: false,
            }
        })
    }
    function handleVisibleChange(visible) {
        dispatch({
            type: `${namespace}/updateStates`,
            payload: {
                sortSetVisible: visible,
            }
        })
    }

    function onSaveSort() {
        var newIndex = selectedKeys[0]&&_.findIndex(sortList,{colCode:selectedKeys[0]})
        listMoudleInfo.columnList = sortList
        dispatch({
            type: `${namespace}/updateStates`,
            payload: {
                listMoudleInfo,
                formKey: formKey+1,
                selectedIndex: newIndex&&newIndex!=-1?newIndex:selectedIndex

            }
        })
        oncancel();
    }

    function onPreview(isPreview) {
        dispatch({
            type: `${namespace}/updateStates`,
            payload: {
                isPreview,
            }
        })

    }

    function onSave(){
        if(listMoudleInfo['normalSearch'].length==0){
            form.setFields([
                {
                    name: 'normalSearch',
                    errors: ['请选择常规查询项']
                }
            ])
            message.error('请选择常规查询项');
            return
        }
        if(!listMoudleInfo['buttonGroupName']){
            message.error('请选择按钮模板');

            return
        }
        listMoudleInfo['showTitleFlag'] = listMoudleInfo.showTitleFlag?1:0
        listMoudleInfo['seniorSearchFlag'] = listMoudleInfo.seniorSearchFlag?1:0
        listMoudleInfo['newlineFlag'] = listMoudleInfo.newlineFlag?1:0
        listMoudleInfo['pageFlag'] = listMoudleInfo.pageFlag?1:0
        listMoudleInfo['fixedMeterFlag'] = listMoudleInfo.fixedMeterFlag?1:0
        listMoudleInfo['cacheFlag'] = listMoudleInfo.cacheFlag?1:0
        listMoudleInfo['designFlag'] = listMoudleInfo.designFlag?1:0
        listMoudleInfo['yearCutFlag'] = listMoudleInfo.yearCutFlag?1:0
        listMoudleInfo['normalSearch'] = listMoudleInfo.normalSearch?listMoudleInfo.normalSearch.toString():''
        listMoudleInfo['columnJson'] = JSON.stringify(listMoudleInfo.columnList)
        let flagLength = false;
        let flagrequired = false;
        let columnJson = listMoudleInfo.columnList.map((item)=>{
            item['sortFlag'] = item.sortFlag?1:0
            item['sumFlag'] = item.sumFlag?1:0
            item['fixedFlag'] = item.fixedFlag?1:0
            if(!item.columnName){
                flagrequired = true
            }
            item['columnName'] = item.columnName.trim()
            if(item.columnName.length>30){
                flagLength = true
            }
            return item
        })
        if(flagrequired){
            message.error('列表名称为必填项!')
            return
        }
        if(flagLength){
            message.error('列表名称最多输入30个字符!')
            return
        }
        let search = seniorSearchList&&seniorSearchList.map((item)=>{
            return {
                value: item.value,
                columnCode: item.columnCode,
                colName: item.colName
            }
        })

        listMoudleInfo['columnJson'] = JSON.stringify(columnJson)
        delete listMoudleInfo['columnList']
        dispatch({
            type: `${namespace}/designFormListModel`,
            payload: {
                ...listMoudleInfo,
                title: outputHTML!='[object Object]'?getText(outputHTML):'',
                titleStyle: outputHTML!='[object Object]'?outputHTML:'',
                modelId: query.moudleId,
                seniorSearchInfo: JSON.stringify(search)

            },
            callback:()=>{
                console.log('`${pathname}${search}`',`${pathname}${searchValue}`);
                // dropScope(`${pathname}${searchValue}`);
                var pname = ''
                if(pathname.includes('/support')){
                  pname = pathname.split('/support')?.[1]
                }
                dropCurrentTab(GETTABS(),`${pname}/${query.moudleId}`)
            }
        })
    }
    const dropScope = () =>{
        //TODOdropScope 后面再看看怎么整
      }
    function  getText(str) {
        if(str){
            return str
            .replace(/<[^<>]+>/g, "")
            .replace(/&nbsp;/gi, "");
        }

      }

    function getList(list){
        let fixedList = _.filter(list,(item)=>{return item.fixedFlag==1})
        let unFixedList = _.filter(list,(item)=>{console.log(item.fixedFlag); return !item.fixedFlag})
        list = _.concat(fixedList,unFixedList)
        console.log('list',list,fixedList,unFixedList);
        if(isPreview){
            return list.filter((item)=>{return item.checked})
        }else {
            return list
        }
    }

    function onPreStep(params) {
        dispatch({
            type: `${namespace}/updateStates`,
            payload: {
                step: 1,
            }
        })
    }
    function onChangeTab(key) {
        if(key=='2'&&selectedIndex==-1){
            message.error('请选择要配置的字段')
            return
        }
        dispatch({
            type: `${namespace}/updateStates`,
            payload: {
                activeKey: key,
            }
        })
    }

    const buttonMenu=(group)=>{
        return (
          <Menu>
            {group.map((item)=>{
                return (
                  <Menu.Item>
                    <span>
                      {item.buttonName}
                    </span>
                  </Menu.Item>
                )

            })}
          </Menu>
        )
      }

    const tableProps = listMoudleInfo&&{
        scroll: listMoudleInfo.fixedMeterFlag&&{ y: 240 },
        bordered: listMoudleInfo.tableStyle&&listMoudleInfo.bordered=='table'?true:false,
        columns: listMoudleInfo.columnList&&getList(listMoudleInfo.columnList).map((item,index)=>{
            return {
                title: <div className={styles.list_title}>
                        {item.columnName}
                        </div>,
                dataIndex: item.colCode,
                algin: item.algin?item.algin: 'center',
                ellipsis: item.newlineFlag&&item.newlineFlag==1?false:true,
                sorter: item.sortFlag&&item.sortFlag==1?true: false,
                width: item.widthN?`${item.widthN}${item.widthP}`:'auto',
                render: text=><div className={styles.text} title={text}>{text}{listMoudleInfo.columnList.length-1==index?<SettingOutlined />:''}</div>
            }


        }).concat([{title:'操作列'},{title: <div style={{textAlign:'right'}}><SettingOutlined />{/**<Popover
            className={styles.sort_pover}
            visible={sortSetVisible}
            placement="bottom"
            onVisibleChange={handleVisibleChange.bind(this)}
            content={

                <div>
                    <Sort isCheck={true} location={useLocation()}/>
                    {<div className={styles.sort_bt_group}>
                        <Button onClick={oncancel.bind(this)}>取消</Button>
                        <Button onClick={onSaveSort.bind(this)}>保存</Button>
                    </div>}
                </div>

            }
            trigger="click">

        </Popover> */}</div>}]),
        dataSource: [],
        pagination: listMoudleInfo.pageFlag?{
          total: 1,

          showQuickJumper: true,
          showSizeChanger:true,
          showTotal: (total)=>{return `共 ${total} 条` },
          onChange: (page,size)=>{
          }
        }:false,
      }
      console.log('editorState',editorState);
    function renderContainer() {
        return(<div>
            {outputHTML!='[object Object]'&&<div  dangerouslySetInnerHTML={{__html:outputHTML}} style={{whiteSpace: 'pre-wrap'}}></div>}
            <div className={styles.set}>
                <Input.Search
                    className={styles.search}
                    placeholder={'请输入搜索词'}
                    allowClear
                />
                {!isPreview&&listMoudleInfo.columnList&&listMoudleInfo.columnList.length!=0&&listMoudleInfo.seniorSearchFlag?<span className={styles.heiger_set} onClick={onSetSenior.bind(this)}>高级</span>:''}
                {(listMoudleInfo.yearCutFlag==1)&&<Select className={styles.year} placeholder='年度数据分割'>
                    {
                        yearData.length!=0&&yearData.map((year)=><Select.Option value={year.dictTypeInfoCode} key={year.dictTypeInfoCode}>{year.dictInfoName}</Select.Option>)
                    }

                </Select>}
                {
                    <div className={styles.button_list}>
                    {buttons&&Object.keys(buttons).map((key)=>{
                      if(!key||key=='null'){
                        return (buttons[key].map((item)=><Button type="primary"  key={item.buttonId}>{item.buttonName}</Button>
                        ))
                      }else{
                        return (
                          <Dropdown overlay={buttonMenu(buttons[key])} placement="bottomCenter">
                            <Button>{key}<DownOutlined/></Button>
                          </Dropdown>
                        )
                      }
                    })}
                  </div>
                }

                {listMoudleInfo.columnList&&listMoudleInfo.columnList.length!=0&&listMoudleInfo.seniorSearchFlag&&
                    <ul className={styles.input_list}>
                            {
                                seniorSearchList&&seniorSearchList.length!=0?
                                seniorSearchList.map((item,index)=>{
                                    return <li key={index+6}>
                                            <b style={{width: 100,textAlign:'right',display:'inline-block'}}>{item.colName}</b>
                                            {item.value=='input'?
                                            <Input style={{width: 240,height: 32,marginLeft: 10}}/>:
                                            <RangePicker style={{width: 240,height: 32,marginLeft: 10}}/>}
                                            </li>
                                }):''
                            }
                    </ul>
                }
            </div>
            <Table {...tableProps}/>

        </div>)

    }

    function renderRightContainer(){
        return   <Tabs activeKey={activeKey} onChange={onChangeTab.bind(this)} className={styles.rightContainer}>
                    <TabPane tab="列表配置" key="1">
                        <ListSet form={form}/>
                    </TabPane>
                    <TabPane tab="字段配置" key="2">
                        <ColSet  location={useLocation()}/>
                    </TabPane>
                    <TabPane tab="按钮配置" key="3">
                        <Select
                            onClick={onChoseMoudle.bind(this)}
                            autoComplete="off"
                            open={false}
                            showArrow={false}
                            placeholder='请选择按钮模板'
                            defaultValue={listMoudleInfo.buttonGroupName}
                            value={listMoudleInfo.buttonGroupName}
                            >
                            <Select.Option value="0"></Select.Option>
                        </Select>

                    </TabPane>
                </Tabs>
    }
    console.log('fieldTree',fieldTree);
    return(
        <div className={styles.container}>
            <div className={styles.title}>
                <h1 className={styles.title_text} onClick={onPreview.bind(this,false)}>{isPreview?'返回':'列表设计'}</h1>
            </div>
            {
            isPreview?renderContainer():
            <div className={styles.form_container}>

            <ReSizeLeftRightCss
                maxWidth={400}
                minWidth={200}
                leftChildren={
                    <Tree
                    checkedKeys={checkedKeys}
                    selectedKeys={selectedKeys}
                    checkable
                    autoExpandParent={true}
                    onSelect={onSelect}
                    onCheck={onCheck}
                    treeData={fieldTree}
                    expandedKeys={fieldTree.length!=0&&[fieldTree[0].key]}
                  />
                }
                rightChildren={
                <ReSizeLeftRightCss
                maxWidth={800}
                minWidth={650}
                leftChildren={renderContainer()}
                rightChildren={renderRightContainer()}
                />
                }
            />
        </div>

            }
           {!isPreview&&<div className={styles.form_footer} style={{position:'relative'}}>
                <div className={styles.bt_group}>
                    <Button onClick={onPreStep.bind(this)}>上一步</Button>
                    <Button onClick={onSave.bind(this)}>保存并发布</Button>
                    {!isPreview&&<Button className={styles.bt_preview} onClick={onPreview.bind(this,true)}>预览</Button>}

                </div>
        </div>}
            {buttonModal&&<ButtonMoudle onSearch={getButtonGroups}/>}
            {seniorModal&&<SeniorSearch/>}
        </div>
    );
}
// export default connect(({moudleDesign})=>({
//     ...moudleDesign
// }))(firstDesign);
export default connect((state)=>({
  ...state[`moudleDesign_${parse(history.location.search).moudleId}`],
}))(firstDesign);

