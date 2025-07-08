import { Fragment, useState, useRef,useEffect} from 'react';
import { Table,Form,Button,Popover } from 'antd';
import { useDispatch, useSelector, useLocation} from 'umi';
import _ from 'lodash'
import {components} from './formConfig';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { constants } from 'crypto';
import BasicData from "./basicData";
const SubForm = ({feId,getColConfigInfo,onSubValuesChange,disabled,datainitValues,onBlurMoneyInput,
                    onClickTree,changeComponent,getDisabledFn,newComponentStyle,visibleInfo,onBiz})=>{
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { stateObj } = useSelector(({formShow})=>({...formShow}));
    const bizSolId = useLocation().query.bizSolId;
    const bizInfoId = useLocation().query.bizInfoId;
    const currentTab = useLocation().query.currentTab;
    const { subFormJSON, subFormColumnJSON,formdata,bizInfo,isSubSelfUpdate } = stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab];
    const tableColsIndex =  _.findIndex(subFormJSON,{feId: feId});
    const tableCols =  tableColsIndex==-1?[]:subFormJSON[tableColsIndex].formJSON//当前布局
    const deployFormId = tableColsIndex==-1?[]:subFormJSON[tableColsIndex].deployFormId//已发布表单id
    const configsIndex =  _.findIndex(subFormColumnJSON,{feId: feId});
    const configs =  configsIndex==-1?[]:subFormColumnJSON[configsIndex].formColumnJSON//当前配置
    const tableIndex = _.findIndex(formdata,{deployFormId: deployFormId	})
    console.log('formdata',formdata)
    // const onValuesChange = (changedValues, allValues) =>{
    //     let obj = {deployFormId,data: allValues[deployFormId]}
    //     let newFormdata = _.cloneDeep(formdata)
    //     if(newFormdata.length==0){//没有表单数据时初始化主表数据
    //         newFormdata = [{deployFormId:bizInfo.deployFormId,data:[]}]
    //     }
    //     if(tableIndex==-1){
    //         newFormdata.push(obj)
    //     }else{
    //         newFormdata[tableIndex] = obj
    //     }
    //     dispatch({
    //         type: 'formShow/updateStates',
    //         payload: {
    //             formdata: newFormdata
    //         }
    //     })
    // }
    
    // console.log('dateValues',dateValues,subFormJSON,subFormColumnJSON);
    useEffect(()=>{
        const table = tableIndex==-1?[]:formdata[tableIndex].data;//当前子表数据
        if(!table||table.length==0){
                form.setFieldsValue({[deployFormId]: [{}]})

            
        }else{
            if(subFormJSON.length!=0&&subFormColumnJSON.length!=0){
                let dateValues = []
                let mvalues = []
                let selectValues = []
                subFormJSON.map((subForm)=>{
                    subForm.formJSON&&subForm.formJSON.map((item)=>{
                        var type = item.componentType.split('_')[0];
                        var configInfo = getColConfigInfo(_.find(subFormColumnJSON,{feId: subForm.feId}).formColumnJSON,item.feId,item.tableColCode,type);
                        if(type=='MoneyInput'){
                        mvalues.push({'name': item.tableColCode,'moneyFormat': configInfo.configProps.moneyFormat})
                        }
                        if(type=='Date'){
                        dateValues.push({'name': item.tableColCode,'format': configInfo.configProps.format})//TODO 日期格式化
                        }
                        if(type=='Select'){
                            selectValues.push({'name': item.tableColCode,'choiceStyle': configInfo.configProps.choiceStyle})
                        }
                    })
                })

                let tableData = table
                if(table.length!=0&&!isSubSelfUpdate){
                    tableData = table.map((data)=>{
                        let subValue = {}
                        data&&Object.keys(data).length!=0&&Object.keys(data).map((item)=>{
                            subValue = datainitValues(data,data,item,mvalues,dateValues,selectValues)
                        })
                        return subValue
                    })
                }
                form.setFieldsValue({[deployFormId]: tableData})

            }
            
            
        }
    },[_.clone(subFormColumnJSON),tableIndex,deployFormId,formdata,subFormJSON])
    const removeFormItem =(index)=>{
        const table = tableIndex==-1?[]:formdata[tableIndex].data;//当前子表数据
        table.splice(index,1);
        form.setFieldsValue({[deployFormId]: table})

    }

    return(
        <div  style={{width:'100%',height:'100%',pointerEvents:disabled?'none':'',background:disabled?'#f5f5f5':''}}>
            <Form   form={form} onValuesChange={onSubValuesChange.bind(this,deployFormId,tableIndex,true)}>
                <Form.List name={deployFormId}>
                {(fields, {add, remove}) => {
                    console.log('fields',fields);
                    return (
                    <div>
                        <Table 
                            dataSource={fields} 
                            pagination={false}
                            bordered={true}
                            columns={
                                subFormJSON.length!=0&&tableCols.length!=0&&subFormColumnJSON.length!=0&&tableCols.map((item)=>{
                                const type = item.feId.split('_')[0]
                                const MyComponent = type=='Select'?BasicData:components[type]||Fragment;
                                const configInfo = subFormColumnJSON.length!=0&&configs.length!=0&&getColConfigInfo(configs,item.feId,item['tableColCode']);
                                    return {
                                        title: item['tableColName'],
                                        dataIndex: item['tableColCode'].toUpperCase(),
                                        width: `${item.width}${item.widthUnit}`,
                                        render:(text,record,index)=><Popover
                                        content={visibleInfo&&visibleInfo.name==item['tableColCode'].toUpperCase()?visibleInfo.content:''}
                                        title=""
                                        trigger="focus"
                                        visible={visibleInfo&&visibleInfo.name==item['tableColCode'].toUpperCase()?visibleInfo.visible:false}
                                        placement="topRight"
                                      > 
                                      {type=='DataPull'?
                                        <div style={{...newComponentStyle,...borderStyle}}>
                                             <Button onClick={onBiz.bind(this,item['tableColCode'].toUpperCase(),configInfo.configProps)} disabled={getDisabledFn(item['tableColCode'].toUpperCase()),deployFormId}>单据引用</Button>
                                        </div>:
                                              <Form.Item

                                              rules={configInfo.rules}
                                              name={[record.name, item['tableColCode'].toUpperCase()]}
                                              fieldKey={[record.fieldKey, item['tableColCode'].toUpperCase()]}
                                              >
                                              <MyComponent 
                                              onBlur={type=='MoneyInput'?onBlurMoneyInput.bind(this,configInfo.configProps.moneyFormat,item['tableColCode'].toUpperCase(),index,deployFormId):()=>{}}
                                              allowClear={(type=='PersonTree'||type=='DeptTree'||type=='OrgTree')?true:false}
                                              onClick={(type=='PersonTree'||type=='DeptTree'||type=='OrgTree')?onClickTree.bind(this,type,item['tableColCode'].toUpperCase(),configInfo.configProps,index,deployFormId):()=>{}}
                                              onChange={(e)=>{changeComponent(e,item['tableColCode'].toUpperCase(),type,configInfo.configProps,deployFormId,index)}}
                                              style={{...newComponentStyle,height:'100%',width:'100%',background:getDisabledFn(item['tableColCode'].toUpperCase(),deployFormId)?'#f5f5f5':'',pointerEvents:getDisabledFn(item['tableColCode'].toUpperCase(),deployFormId)?'none':''}}
                                              {...configInfo.configProps} 
                                              form={form}/>
                                              </Form.Item>
                                      }
                                      
                                            </Popover>,
                                        }
                                }).concat({
                                    title:'操作',
                                    dataIndex:'action',
                                    key:'action',
                                    width: '5%',
                                    render:(text,record,index)=>{
                                      return <>
                                      <PlusOutlined onClick={()=>add()} style={{marginRight:'5'}}/>
                                      {index==0?'':<MinusCircleOutlined onClick={()=>removeFormItem(index)}/>}
                                      </>
                                    }
                                })
                            }

                        />
                    </div>
                    );
                }}
                </Form.List>

            </Form>
        </div>

    )
}
export default SubForm