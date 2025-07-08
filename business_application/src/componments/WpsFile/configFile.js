
const configFile = (type,callback)=>{
    // 操作下 配置按钮 可根据类型增加多个类型按钮
    const obj = {
        action: [
            {
                name: '引用历史公文',
                callbackIt:()=>{
                    callback('history')
                }
            },
            {
                name: '正文转附件',
                callbackIt: ()=>{
                    callback('textToAttach')
                }
            },
            {
                name: '打开本地文档',
                callbackIt: ()=>{
                    callback('openLocalText')
                }
            },
            {
                name: '另存文档',
                callbackIt: ()=>{
                    callback('saveAs')
                }
            },
            {
                name: 'pdf 转版',
                callbackIt: ()=>{
                    callback('transferPDF')
                }
            }
        ],
        redAction: [
            {
                name: '打开本地文档',
                callbackIt: ()=>{
                    callback('openLocalText')
                }
            },
            {
                name: '另存文档',
                callbackIt: ()=>{
                    callback('saveAs')
                }
            }
        ]
    }
    return obj[type]
}

 const bizStatus = {
    0: '待办',
    1: '在办',
    2: '办结',
    4: '作废'
 }   

const historyListColumns = ()=>{
    return {
        history: [
            {
                title: '序号',
                dataIndex: 'key',
                render: (text,record,index)=><div >{index+1}</div>,
                width: 60
            },
            {
                title: '标题',
                dataIndex: 'bizTitle'
            },
            {
                title: '流水号',
                // dataIndex: ''
            },
            {
                title: '拟稿人',
                dataIndex: 'draftUserName'
            },
            {
                title: '拟稿部门',
                dataIndex: 'draftDeptName'
            },
            {
                title: '拟稿时间',
                dataIndex: 'draftTime'
            },
            {
                title: '缓急程度',
            },
            {
                title: '密级',
            },
            {
                title: '办理状态',
                dataIndex: 'bizStatus',
                render: (text)=>{
                    return bizStatus[text]
                }
            }
        ]
    }
}


export {
    configFile,
    historyListColumns,
}