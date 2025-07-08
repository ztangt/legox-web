// 合并过滤列表
const filterList = (warningList,record,name,index)=>{
    const arr =warningList.filter(item=>{
        return item[name] == record[name]   
    })
    if(index == 0 || warningList[index - 1][name] !=record[name]){
        return {
            rowSpan: arr.length
        }
    }
    return {
        rowSpan: 0
    }
}
const configs = ({tableList})=>{
    return {
        warningColumns: [
            {
                title: '序号',
                width: 60,
                dataIndex: 'number'
            },
            {
                title : '账号',
                dataIndex: 'accountNum'
            },
            {
                title: '姓名',
                dataIndex: 'userName',
                onCell(record,index){
                       return tableList&&filterList(tableList,record,'userId',index)
                }
            },
            {
                title: '岗位',
                dataIndex: 'postName'
            },
            {
                title: '部门',
                dataIndex: 'deptName'
            },
            {
                title: '单位',
                dataIndex: 'orgName'
            },
            {
                title: '角色情况',
                dataIndex : 'roleSituation'
            },
            {
                title: '规则名称',
                dataIndex: 'ruleName'
            }
        ]
    }
}

export default configs