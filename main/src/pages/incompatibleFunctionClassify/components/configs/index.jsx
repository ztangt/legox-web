import styles from '../../index.less'
import {dataFormat} from '../../../../util/util'
const configs = (props)=>{

    const MENUTYPE = {
        'OWN': "授权能力",
        'APP': "业务应用建模",
        'OUT': "外部链接",
        'DESIGN':'设计发布器'
    }
    return {
        functionColumns: [
            {
                title: '序号',
                dataIndex:'number',
                width: 60
            },
            {
                title: '职能分类名称',
                dataIndex: 'functionTypeName',
                render(text,record){
                    return <a onClick={()=>props.onAdd&&props.onAdd(record,"watch")}>{text}</a>
                }
            },
            {
                title: '职能分类编码',
                dataIndex: 'functionTypeCode'
            },
            {
                title: '职能分类描述',
                dataIndex: 'functionTypeDesc'
            },
            {
                title: '是否启用',
                dataIndex: 'isEnable',
                render(text){
                    return <span>{text==1?'是':'否'}</span>
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
                render(record){
                    return <div className={styles.actions}>
                            <a onClick={()=>props.onAdd&&props.onAdd(record,"edit")}>修改</a>
                            <a style={{marginLeft: 8,marginRight: 8}} onClick={()=>props.onDelete&&props.onDelete(record,"del")}>删除</a>
                            <a onClick={()=>props.bindModel&&props.bindModel(record)}>绑定模块</a>
                        </div>
                }
            }
        ],
        bindColumns: [
            {
                title: '模块资源显示名称',
                dataIndex: 'menuName',
                width: 260
            },
            {
                title: '能力名称',
                dataIndex: 'sourceName'
            },
            {
                title: '模块来源',
                dataIndex: 'menuSource',
                render(text){
                    return <span>{MENUTYPE[text]}</span>
                }
            }
        ],
        // 搜索配置
        searchList :[
            {   
                fileType: 'add',
                onClick: props.onAdd,
                fileName: '新增',
            },
            {
                fileType: 'delete',
                onClick: props.onDelete,
                fileName: '删除',
            },
            {
                fileType: 'actions',
                onClick: props.onStart,
                fileName: '启用'
            },
            {
                fileType: 'stops',
                onClick: props.onStops,
                fileName: '停用'
            }
        ]
    }
}

export default configs