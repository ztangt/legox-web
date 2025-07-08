import { connect } from 'dva';
import { Input,Select,Table} from 'antd';
import _ from "lodash";
import ColumnDragTable from '../../../componments/columnDragTable'
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
function ruleDefine ({dispatch,dataRuleMg,setSql,onAddGroup,onDeleteGroup}){
    const { groups, groupNum, dataRuleInfo, metaData, columns} = dataRuleMg
    const tableProps = {
        scroll:{x:'auto',y:'auto'},
        key: groups,
        rowKey: 'key',
        bordered: true,
        columns: [
            {
              title: '别名',
              dataIndex: 'dbTableName',
              fixed: 'left',
              render: (value,row,index)=>{
                const obj = {
                    children: <Select  placeholder='别名' value={value} style={{width: 130}} onSelect={onSelectTable.bind(this,row.key)} key={index}>
                    {
                        metaData&&metaData.map((m,index)=><Select.Option value={m} key={index}>{m.split('AS')[1]}</Select.Option>)
                    }
                    </Select>,
                    props: {},
                  };
                  if(dataRuleInfo.dataRuleType=='PUBLIC'){
                    obj.children = <Input  placeholder='别名' defaultValue={value} style={{width: 130}} onChange={(e)=>{updateGroup(row.key,'dbTableName',e.target.value)}}/>
                  }
      
                  if(row.groupCondition){
                      obj.props.colSpan = 0
                  }
                  return obj;
              }
            },
            {
              title: '字段',
              dataIndex: 'dbColumnName',
              render: (value,row,index)=>{
                const obj = {
                    children: <Select  placeholder='字段' value={getValue(value)} style={{width: 130}} onSelect={updateGroup.bind(this,row.key,'dbColumnName')} key={index} onFocus={onFocusColNmae.bind(this,row)}>
                    {
                        columns.map((c,index)=><Select.Option value={`${c.tableColumn}-${c.tableColumnType}-${c.tableColumnName}`} key={index}>{c.tableColumnName||c.tableColumn}</Select.Option>)
                    }
                </Select>,
                    props: {},
                  };
                  if(dataRuleInfo.dataRuleType=='PUBLIC'){
                    obj.children = <Input  placeholder='字段' defaultValue={value} style={{width: 130}} onChange={(e)=>{updateGroup(row.key,'dbColumnName',e.target.value)}}/>
                  }
      
                  if(row.groupCondition){
                      obj.props.colSpan = 0
                  }
                  return obj;
              }
            },
            {
                title: '关系',
                dataIndex: 'relationType',
                render: (value,row)=>{
                    const obj = {
                        children: <Select  placeholder='' value={value} style={{width: 130}} onSelect={updateGroup.bind(this,row.key,'relationType')}>
                            <Select.Option value={'='}>等于</Select.Option>
                            <Select.Option value={'!='}>不等于</Select.Option>
                            <Select.Option value={'>'}>大于</Select.Option>
                            <Select.Option value={'<'}>小于</Select.Option>
                            <Select.Option value={'>='}>大于等于</Select.Option>
                            <Select.Option value={'<='}>小于等于</Select.Option>
                            <Select.Option value={'IN'}>包含于</Select.Option>
                            <Select.Option value={'NOT IN'}>不包含于</Select.Option>
                            <Select.Option value={'LIKE'}>相似</Select.Option>
                            <Select.Option value={'PRELIKE'}>前相似</Select.Option>
                            <Select.Option value={'BACKLIKE'}>后相似</Select.Option>
                        </Select>,
                        props: {},
                      };
                    if(row.groupCondition){
                        obj.props.colSpan = 0
                    }
                    return obj;
                }
            },
            {
                title: '属性',
                dataIndex: 'propType',
                render: (value,row)=>{
                    const obj = {
                        children: <Select  placeholder='' value={value} style={{width: 130}} onSelect={updateGroup.bind(this,row.key,'propType')}>
                            <Select.Option value={`':currentUserId'`}>本人</Select.Option>
                            <Select.Option value={`':currentDeptId'`}>本部门</Select.Option>
                            <Select.Option value={`':currentOrgId'`}>本单位</Select.Option>
                            <Select.Option value={`':currentDeptAll'`}>本部门含下级</Select.Option>
                            <Select.Option value={`':currentOrgAll'`}>本单位含下级</Select.Option>
                            <Select.Option value={'userName'}>人员</Select.Option>
                            <Select.Option value={'deptName'}>部门</Select.Option>
                            <Select.Option value={'orgName'}>单位</Select.Option>
                            <Select.Option value={'design'}>自定义</Select.Option>
                        </Select>,
                        props: {},
                      };
                      
                    if(row.groupCondition){
                        obj.props.colSpan = 0
                    }
                    return obj;
                     
                }
                
            },
            {
                title: '属性值',
                dataIndex: 'propTypeValue',
                render: (value,row)=>{
                    const obj = {
                        children: <div style={{width: 130}}/>,
                        props: {},
                    };
                    if(row.propType=='userName'||row.propType=='deptName'||row.propType=='orgName'){
                        obj.children = <Input value={value} style={{width: 130}} onClick={onSelctValue.bind(this,row.propType,row.key,row.propTypeValueId)} />
                    }else if(row.propType=='design'){
                        obj.children = <Input defaultValue={value} style={{width: 130}} onChange={onChangePValue.bind(this,row)}/>
                    }
                    if(row.groupCondition){
                        obj.props.colSpan = 0
                    }
                    return obj;
                }
            },
            {
                title: '条件',
                dataIndex: 'condition',
                render: (value,row)=>{
                    const obj = {
                        children: <Select  placeholder='' value={row.groupCondition?row.groupCondition:value} style={{width: 130,float:'right'}} onSelect={updateGroup.bind(this,row.key,row.groupCondition?'groupCondition':'condition')}>
                            <Select.Option value={'AND'}>并且</Select.Option>
                            <Select.Option value={'OR'}>或者</Select.Option>
                        </Select>,
                        props: {},
                    };
                    if (row.groupCondition) {
                        obj.props.colSpan = 8;
                    }
                    return obj;
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                fixed: 'right',
                render:(value,row,index)=>{const obj = {
                    children: <div style={{width: 42}}>
                    <a  onClick={onAddGroup.bind(this,row.groupName,row.groupName,row.conditionNum+1,index+1,false)}>增加行</a><br/>
                    <a onClick={onDeleteLine.bind(this,row.key,row.conditionNum,row.groupName,row.isRowCol)}>删除行</a>
                </div>,
                    props: {},
                  };
                  if (row.groupCondition) {
                    obj.props.colSpan = 0;
                  }
                  return obj;

                     
                }
            },

        ],
        dataSource: groups,
        pagination: false,
        rowSelection: {
        columnWidth: 90,
        renderCell:(value, row, index,originNode) => {
            const obj = {
              children: <div style={{width:90}}>
                            {originNode}
                            <span style={{marginLeft:5}}>{row.groupName}</span><br/>
                            <a onClick={onAddGroup.bind(this,Number(groups[groups.length-1].groupName)+1,groupNum+1,1,groups.length,true)}>增加组</a><br/>
                            <a onClick={onDeleteGroup.bind(this,row.groupName)}>删除组</a>
                  </div>,
              props: {},
            };
            if (row.isRowCol) {
              obj.props.rowSpan = row.conditionNum;
            }else{
              obj.props.rowSpan = 0;
            }

            if(row.groupCondition){
                obj.props.colSpan = 0
            }
            return obj;
        },
        
          onChange: (selectedRowKeys, selectedRows) => {
            let array = selectedRows.map((item)=>{return item.groupName})
            dispatch({
              type: 'dataRuleMg/updateStates',
              payload: {
                selectedGroup: Array.from(new Set(array))
              }
            })
          },
          getCheckboxProps: record => ({
            disabled: record.isSelected==1,
          }),
        },
      }
      function getValue(value){
        //   if(columns.length==0&&value){
            if(!value?.split('-')[2]||value?.split('-')[2]=='null'){
                return value?.split('-')[0]
            }else{
                return value?.split('-')[2] 
            }
        //   }else{
        //       return value
        //   }
      }
    /**
     * 更新当前操作数据
     * @param {*当前数据key值} key 
     * @param {*属性名} name  
     * @param {*当前修改值} values  
     */
    function updateGroupChange(key,name,values) {
        let index = groups.findIndex((item)=>{return item.key==key})
        groups[index][name] = values //改变每个输入框值
        if(name=='propType'){
            groups[index]['propTypeValue'] = '' //自定义时清空属性值
            groups[index]['propTypeValueId'] = ''
        }
        if(name=='dbColumnName'){

        }
        setSql(groups);
        dispatch({
            type: 'dataRuleMg/updateStates',
            payload: {
                groups,

            }
        })
    }  
    const updateGroup = _.debounce(updateGroupChange, 100, { maxWait: 1000 })




    
    function onSelctValue(requestType,currentKey,selectedDataIds) {
        console.log('selectedDataIds',selectedDataIds);
        dispatch({
            type: 'dataRuleMg/updateStates',
            payload: {
                selectVisible: true,
                requestType,
                currentKey,
                orgUserType: requestType.replace('Name','').toUpperCase(),
                selectedDataIds:selectedDataIds
            }
        }) 
    }

    function onFocusColNmae(row){
        dispatch({
            type: 'dataRuleMg/getTableColumns',
            payload: {
                tableCode: row.dbTableName.split('AS')[0].trim(),
            },
            serviceName: dataRuleInfo.microService
        })
    }

    function onChangePValue(row,e) {
        let value = e.target.value
        if(row.dbColumnName&&value){
            let dbColumnType = row.dbColumnName.split('-')[1]
            if(dbColumnType=='bigint'||
                dbColumnType=='tinyint'||
                dbColumnType=='smallint'||
                dbColumnType=='int'||
                dbColumnType=='float'||
                dbColumnType=='tinyint'||
                dbColumnType=='double'||
                dbColumnType=='decimal'||
                dbColumnType=='number'||
                dbColumnType=='integer'||
                dbColumnType=='long'){
                value = value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')
            }
        }
        updateGroup(row.key,'propTypeValue',value)

    }



    //选择别名
    function onSelectTable(key,values) {
        updateGroup(key,'dbTableName',values)
        dispatch({
            type: 'dataRuleMg/getTableColumns',
            payload: {
                tableCode: values.split('AS')[0].trim()
            },
            serviceName: dataRuleInfo.microService
        })
    }

    
    
    /**
     * 删除行
     * @param {*当前删除行的key值} key 
     * @param {*当前删除行所在组的个数} conditionNum 
     * @param {*当前删除行的组名} groupName 
     * @param {*当前删除行是否为被合并列} isRowCol 
     */
    function onDeleteLine(key,conditionNum,groupName,isRowCol) {

        let array = groups.filter(item => item.key!=key )//删除当前行
        if(conditionNum-1!=0){//非当前组的最后一行  需要更改当前删除组的个数以及需要合并的行
            let indexs = [];//存储当前删除内容所存在的组的index
            for (let index = 0; index < array.length; index++) {
                const g = groups[index];
                if(g.groupName==groupName&&!g.groupCondition){
                    indexs.push(index) 
                    g.conditionNum = conditionNum-1
                } 
            }
            if(isRowCol){//如果删除的是被合并的列  重置被合并的列
                array[indexs[0]].isRowCol = true
            }
        }else{//删除的是当前组的最后一行
            dispatch({
                type: 'dataRuleMg/updateStates',
                payload: {
                    groupNum: groupNum-1,
                }
            })
            array = groups.filter(item => item.groupName!=groupName ) //只剩最后一行时，删除添加的组条件所在行数据
        }
        for (let index = 0; index < array.length; index++) {
            const element = array[index];                
            if(index==0&&element.groupCondition){//删除掉第一行就为分组条件所在行的数据
                array.splice(index,1)
            } 
        }
        setSql(array);
        dispatch({
            type: 'dataRuleMg/updateStates',
            payload: {
                groups: array,
            }
        })

    }
    


    return (
        <ColumnDragTable {...tableProps} />          
    )
  }


  
export default (connect(({dataRuleMg,loading})=>({
    dataRuleMg,
    loading
  }))(ruleDefine));
