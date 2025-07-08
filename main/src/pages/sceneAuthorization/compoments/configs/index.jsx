import {dataFormat} from '../../../../util/util'
const tableList =  (props)=>{
    return {
        columnsTable: [
            {
                title: '序号',
                dataIndex: 'number',
                width: 60
            },
            {
                title: '场景名称',
                dataIndex: 'sceneName',
                render(text, record, index){
                    return (
                        <a>
                            <span onClick={()=>props.addScene(record.id)}>{text}</span>
                        </a>
                    )
                }
            },
            {
                title: '场景编号',
                dataIndex: 'sceneCode'
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                render(text){
                    return <span>{dataFormat(text)}</span>
                }
            },
            {
                title: '是否启用',
                dataIndex: 'isEnable',
                render(text){
                    return <span>{text==1?'是':'否'}</span>
                }
            },
            {
                title: '操作',
                render(record){
                    return (
                        <a>
                            <span onClick={()=>props.connectJob(record)}>关联岗位</span>
                        </a>
                    )
                }
            }
        ]
    }
}

export {
    tableList
}