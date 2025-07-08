// 流程配置
import {dataFormat} from '../../../../util/util'
import {Select,Popover,InputNumber,Checkbox} from 'antd'
import styles from '../../index.less'

export const subProcessConfig =(props)=>{
    return {
        columns:[
            {
                title: '序号',
                dataIndex:'number',
                width: 50,
            },
            {
                title: '节点名称',
                dataIndex: 'actName'
            },
            {
                title: '办理人',
                width: 90,
                render(record){
                    return <a>
                        <span onClick={()=>props.configAction(record)}>配置</span>
                    </a>
                }
            },
            {
                title: '更新详情',
                render(record){
                    return (
                        <div>{record.updateUserName} {dataFormat(record.updateTime,'YYYY-MM-DD HH:mm:ss')}</div>
                    )
                }
            }
        ]
    }
}
// 办理人详情
export const detailProcess = (props)=>{
    return {
        columns: [
            {
                title: '分类',
                dataIndex: 'valueType',
                width:100,
                render: (text,record,index)=><Select value={text} style={{width:'84px'}} onChange={props.selectChange.bind(this,record,index)}>
                    <Select.Option value="USER">默认人</Select.Option>
                    <Select.Option value="GROUP">默认组</Select.Option>
                </Select>
            },
            {
                title: '类型',
                dataIndex: 'orgType',
                width:100,
                render: (text,record,index)=>
                    {
                      return  record.valueType == 'GROUP' ? (<Select style={{width:'84px'}} value={text} onChange={props.orgChange.bind(this,record,index)}>
                        <Select.Option value="CURRENT_ORG">本单位</Select.Option>
                        <Select.Option value="ORG">某单位</Select.Option>
                        <Select.Option value="CURRENT_DEPT">本部门</Select.Option>
                        <Select.Option value="DEPT">某部门</Select.Option>
                        <Select.Option value="USER_GROUP">用户组</Select.Option>
                        <Select.Option value="POST">岗位</Select.Option>
                        <Select.Option value="ROLE">角色</Select.Option>
                        </Select>) : (<Select style={{width:'84px'}} value='USER'>
                            <Select.Option value="USER">人员</Select.Option>
                        </Select>)
                    }
            },
            {
                title: '值域',
                dataIndex: 'orgValueName',
                width:280,
                ellipsis: {
                    showTitle: false,
                },
                render: (text,record,index)=>{
                  return (
                    <div id={`message_${index}`}>
                    <div >
                    {record.orgType == 'CURRENT_ORG' ?
                      <div>本单位</div> :
                      record.orgType == 'CURRENT_DEPT' ?
                      <div>本部门</div> :
                      <Popover
                        content="请输入值域" 
                        title=""
                        open={props.emptyVisible[index]?props.emptyVisible[index]:false}
                        placement="right"
                        getPopupContainer={()=>{return document.getElementById(`message_${index}`)}}
                        overlayClassName={styles.popover_style}
                      >
                        <div style={{height:'28px',border:'1px solid #ccc',cursor:'pointer',overflow:'hidden',borderRadius:'4px',lineHeight:'28px',paddingLeft:'8px'}} onClick={props.orgTreeClick.bind(this,record,index)}>{text}</div>
                      </Popover>
                    }
                    </div>
                    </div>
                  )
                }
            },
            {
                title: '含下级',
                width:60,
                dataIndex: 'subordinate',
                render: (text,record,index)=>record.valueType == 'GROUP' ? (<Checkbox checked={record.subordinate} onChange={props.subordinateChange.bind(this,record,index)}></Checkbox>) :''
            },
            {
              title: '排序',
              dataIndex: 'sort',
              width:100,
              render: (text,record,index)=><div>
                <InputNumber onChange={props.changeSort.bind(this,index)} step="0.000001" min="0" value={text}/>
              </div>
            },
        ],
    }
}

//applyModel弹窗

export const applyModelColumns = (props)=>{
    return {
        columns: [
            {
                title: '序号',
                dataIndex: 'number',
                width: 50,
            },
            {
                title: '名称',
                dataIndex: 'bizSolName'
            },
            {
                title: '标识',
                dataIndex: 'bizSolCode'
            },
            {
                title: '创建时间',
                render(record){
                    return (
                        <span>{dataFormat(record.createTime,'YYYY-MM-DD')}</span>
                    )
                }
            }
        ]
    }
}