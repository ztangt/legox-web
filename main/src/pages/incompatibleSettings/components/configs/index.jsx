import {dataFormat} from '../../../../util/util'
import styles from '../../index.less'
const configs = (props)=>{
    return {
        columns: [
            {
                title: '序号',
                dataIndex: 'number',
                width: 60
            },
            {
                title: '规则名称',
                dataIndex: 'ruleName',
                render: (text,record)=>{
                    return <a onClick={()=>props.onAdd(record,'is_disable')}>{text}</a>
                }
            },
            {
                title: '规则编码',
                dataIndex: 'ruleCode'
            },
            {
                title: '类型',
                dataIndex: 'incompatible',
                render(text){
                    return <span>{text==1?'职能分类':'单位角色'}</span>
                }
            },
            {
                title: '创建日期',
                dataIndex: 'createTime',
                render(text){
                    return <span>{dataFormat(text)}</span>
                }
            },
            {
                title: '操作',
                render(text,record){
                    return (
                        <div className={styles.actions}>
                            <a style={{marginRight: 8}} onClick={()=>props.onAdd(record,'edit')}>修改</a>
                            <a onClick={()=>props.onDelete(record,'delete')}>删除</a>
                        </div>
                    )
                }
            }
        ],
        options:[
            {
                label: '单位角色',
                value: 0
            },
            {
                label: '职能分类',
                value: 1
            }
        ],
        settingColumns: [
            {
                title: '序号',
                dataIndex: 'listNumber',
                width: 60
            },
            {
                title: '角色名称/职能分类名称',
                render(text){
                    return <div>{props.selectedModalType==0?text.roleName:text.functionTypeName}</div>
                }
            },
            {
                title: '编码',
                render(text){
                    return <span>{props.selectedModalType==0?text.roleCode:text.functionTypeCode}</span>
                }
            }
        ],
        rulesColumns: [
            {
                title: '序号',
                dataIndex: 'number',
                width: 60
            },
            {
                title: '角色名称',
                dataIndex: 'roleName'
            },
            {
                title: '角色简称',
                dataIndex: 'roleTag'
            },
            {
                title: '角色编码',
                dataIndex: 'roleCode'
            },
            {
                title: '角色类型',
                dataIndex: 'orgRoleType',
                render:(text)=><div>{text?(text==1?'自有':'公共'):'全局'}</div>
            }
        ],
        jobsColumns: [
            {
                title: '序号',
                dataIndex:'number',
                width: 60
            },
            {
                title: '职能分类名称',
                dataIndex: 'functionTypeName'
            },
            {
                title: '职能分类编码',
                dataIndex:'functionTypeCode'
            },
            {
                title: '描述',
                dataIndex: 'functionTypeDesc'
            }
        ]
    }
}

export default configs