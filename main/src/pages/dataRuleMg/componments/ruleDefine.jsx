import { connect } from 'dva';
import { useEffect } from 'react';
import { Modal, Input,Button,message,Form,Row,Col,Spin,Select,Table,Tabs} from 'antd';
import _ from "lodash";
import styles from '../../unitInfoManagement/index.less';
import style from './ruleDefine.less';
// import SM from './conditionModal'
import SM from './orgTree'
import RT from './ruleDefineTable'
import MD5 from 'md5-js'
import GlobalModal from '../../../componments/GlobalModal';

function ruleDefine ({dispatch,onCancel,loading,setValues,dataRuleMg}){
    const { groups, groupNum, dataRuleInfo, registers,registerId,
        selectVisible, groupSql, selectedGroup, lastKey, execResult,dataRuleName,menuName,dataRuleTypeInfo,metaData} = dataRuleMg
    const layout = {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
    };
    const [form] = Form.useForm();
    useEffect(()=>{
        if(registers.length!=0&&!dataRuleInfo.registerId){//默认选择第一个注册系统
            dataRuleInfo['registerId'] = registers[0].id
            form.setFieldsValue({ registerId: registers[0].id });
        }
    },[registers,dataRuleInfo])

    function setSql(groups,isSubmit) {
        console.log('groups',groups);
        if(groups.length==0){
            dataRuleInfo.execSql = `${form.getFieldValue('sqlData')}`
            dispatch({
                type: 'dataRuleMg/updateStates',
                payload: {
                    groupSql: '',
                    dataRuleInfo
                }
            })
            form.setFieldsValue({ execSql: `${form.getFieldValue('sqlData')}` });

            return
        }
        let tables = []
        let columns = []
        let weheres = ''
        for (let index = 1; index <= groupNum; index++) {
            let array = groups.filter(item => item.groupName==index )
            let whereStr = ''
            let groupCondition = ''
            for (let f = 0; f < array.length; f++) {
                const obj = array[f];
                if(isSubmit){
                    if(obj.propType=='design'&&!obj.propTypeValue){
                        message.error('请填写属性值')
                        return false
                    }else{
                        return true
                    }
                }

                if(!obj.groupCondition){
                    let condition = '' //关联关系
                    if((groupNum==index&&f==array.length-1)||(groupNum!=index&&f==array.length-1)||(index==1&&f==array.length-1)){//如果是最后一行 不添加条件关系
                        condition = ''
                    }else{
                        condition = obj.condition
                    }
                    condition = condition + " "

                    let value  = '';//属性值
                    if(obj.propTypeValue&&obj.propTypeValueId){//属性值id
                        // value  = `"${obj.propTypeValueId }"`
                        value  = `${obj.propTypeValueId }`
                    }else if(obj.propTypeValue){//自定义值
                        if(obj.propType=='design'||obj.propType=='orgName'||obj.propType=='deptName'||obj.propType=='userName'){
                            value  = obj.propTypeValue
                        }else{
                            value  = obj.propType //占位符
                        }
                    }else if(!obj.propTypeValue){
                        if(obj.propType=='design'||obj.propType=='orgName'||obj.propType=='deptName'||obj.propType=='userName'){
                            value = ''
                        }else{
                            value  = obj.propType //占位符
                        }
                    }

                    if(obj.relationType=='LIKE'||'PRELIKE'||'BACKLIKE'){
                        value = value.replace(/'/g, '')
                    }else{
                        if(obj.dbColumnName){//已经选择了列信息
                            if(dataRuleInfo.dataRuleType=='PUBLIC') {
                                // 数据规则类型为公共规则
                                value = value==''?`'${value}'`:`${value}`;
                            } else {
                                if(((obj.dbColumnName.split('-')[1].toLowerCase()=='varchar'
                                ||obj.dbColumnName.split('-')[1].toLowerCase()=='varchar2'))
                                &&!obj.propType.includes(':')){//String类型值
                                    value = `'${value}'`
                                }
                                console.log('dfaslkfkaslfkasbfk');
                            }
                            // if(dataRuleInfo.dataRuleType=='MODULE'){//模块资源模块且为自定义输入属性值需要加‘’
                            //     if((obj.dbColumnName.split('-')[1].toLowerCase()=='varchar'
                            //     ||obj.dbColumnName.split('-')[1].toLowerCase()=='varchar2')
                            //     &&obj.propType=='design'){//String类型值
                            //         value = `'${value}'`
                            //     }

                            // }else{//公共模块且自定义输入
                            //     // if(value==':currentUserId'||value==':currentDeptId'||value==':currentOrgId'){
                            //     //     value = value
                            //     // }else{
                            //     //     value = `"${value}"`
                            //     // }
                            //     if(obj.propType=='design'){
                            //         value = `'${value}'`
                            //     }
                            // }

                        }
                    }

                    if(obj.relationType&&obj.dbColumnName&&value){
                        let tableName = obj.dbTableName;//表名
                        let columnName = obj.dbColumnName;//列名
                        let aliasName = dataRuleInfo.dataRuleType=='PUBLIC'?tableName.split('AS')[0]:tableName.split('AS')[1]
                        // if(dataRuleInfo.dataRuleType=='MODULE'){//如果是模块资源 需要截取相关字段
                        columnName = obj.dbColumnName.split('-')[0]
                        // }
                        tables.push(dataRuleInfo.dataRuleType=='PUBLIC'?form.getFieldsValue().dbTableName:obj.dbTableName);
                        console.log('tableName',tableName);
                        if(aliasName){
                            columns.push(`${aliasName}.${columnName}`)
                        }else{
                            columns.push(`${columnName}`)
                        }
                      
                        if(obj.relationType==='NOT IN'||obj.relationType==='IN'){//包含 不包含
                            whereStr += aliasName?`${aliasName}.${columnName} ${obj.relationType} (${value}) ${condition}`:`${columnName} ${obj.relationType} (${value}) ${condition}`
                        }else if(obj.relationType=='LIKE'){//相似
                            whereStr +=aliasName? ` ${aliasName}.${columnName} ${obj.relationType} '%${value}%' ${condition}`:`${columnName} ${obj.relationType} '%${value}%' ${condition}`
                        }else if(obj.relationType=='PRELIKE'){//前相似
                            whereStr +=aliasName? ` ${aliasName}.${columnName} ${'LIKE'} '${value}%' ${condition}`:`${columnName} ${'LIKE'} '${value}%' ${condition}`
                        }else if(obj.relationType=='BACKLIKE'){//后相似
                            whereStr +=aliasName? ` ${aliasName}.${columnName} ${'LIKE'} '%${value}' ${condition}`:`${columnName} ${'LIKE'} '%${value}' ${condition}`
                        }
                        else{
                            whereStr += aliasName?` ${aliasName}.${columnName} ${obj.relationType} ${value} ${condition}`:`${columnName} ${obj.relationType} ${value} ${condition}`
                        }

                    }

                }else{
                    groupCondition = obj.groupCondition?obj.groupCondition:''
                }

            }

                // const ws = whereStr.split(' ')
                // for (let index = 0; index < array.length; index++) {
                //     const element = array[index];

                // }
                // if(ws[ws.length-1].includes('AND')||ws[ws.length-1].includes('OR')){
                //     whereStr
                // }


            if(whereStr){
                weheres += ` ${groupCondition} (${whereStr.trim()})`
            }

        }
        tables = Array.from(new Set(tables))
        columns = Array.from(new Set(columns))
        let strSql = ''
        if(columns.length!=0&&tables.length!=0){
            strSql = `SELECT ${columns.toString()} FROM ${tables.toString()} WHERE${weheres}`
            if(form.getFieldValue('sqlData')){
                form.setFieldsValue({ execSql: `${strSql} ${form.getFieldValue('sqlData')}` });
                dataRuleInfo.execSql = `${strSql} ${form.getFieldValue('sqlData')}`
            }else{
                form.setFieldsValue({ execSql: `${strSql}` });
                dataRuleInfo.execSql = `${strSql}`
            }
        }
        dispatch({
            type: 'dataRuleMg/updateStates',
            payload: {
                groupSql: strSql,
                dataRuleInfo

            }
        })
    }









    //模块资源选择
    function onMenu() {
        if(registerId){
            dispatch({
                type: 'dataRuleMg/updateStates',
                payload: {
                    mnVisible: true
                }
            })
            dispatch({
                type: 'dataRuleMg/getMenu',
                payload: {
                    registerId
                }
            })
        }else{
            message.error('请选择注册系统')
        }

    }

    //提交表单
    function onFinish(values){
        console.log(values,'values');
      let isCheck=''
       groups.map(item=>{
            if((item.propType=='userName'||item.propType=='deptName'||item.propType=='orgName')&&!item.propTypeValue){
                return isCheck=true
            }
        })
        if(isCheck){
            message.error('请填写属性值')
        }else{
            dispatch({
                type: 'dataRuleMg/testSql',
                payload: {
                    sql: form.getFieldValue('execSql')
                },
                callback:(data)=>{
                    if(data){
                        // if(setSql(groups,true)){
                            dispatch({
                                type: 'dataRuleMg/uploadFileio',
                                payload: {
                                    miniojs:JSON.stringify(groups),
                                    jsurl: `DataRule/${new Date().getTime()}/${dataRuleName}`,
                                    minioname: `${dataRuleName}.json`,
                                    fileEncryption:MD5(Math.random().toString(36).slice(2))
                                },
                                callback: (data)=>{
                                    dispatch({
                                        type: 'dataRuleMg/setDataRule',
                                        payload: {
                                            dataRuleId: dataRuleInfo.dataRuleId,
                                            menuId: dataRuleInfo.menuId,
                                            microService: dataRuleInfo.microService,
                                            registerId: registerId,
                                            ...values,
                                            searchJson: data.data,
                                            menuName: menuName,
                                            dataRuleTypeInfo:dataRuleTypeInfo
                                        },
                                        callback:()=>{
                                            dispatch({
                                                type:'dataRuleMg/updateStates',
                                                payload:{
                                                   rdVisible: false,
                                                   dataRuleTypeInfo:'1'
                                                }
                                            })
                                        }
                                    })
                                }
                            })
    
                        // }
                    }
                }
            })
        }
        // onSubmit(values)




    }

    //表单数据修改
    function onValuesChange(changedValues, allValues){
        if(allValues['sqlData']){
            if(groups.length>0){
                form.setFieldsValue({execSql: `${groupSql} ${allValues['sqlData']}`})
                dataRuleInfo.execSql = `${groupSql} ${allValues['sqlData']}`
                setSql(groups);
            }else{
                form.setFieldsValue({execSql: `${allValues['sqlData']}`})
                dataRuleInfo.execSql = `${allValues['sqlData']}`
            }
            
        }else{
            if(groups.length<=0||!allValues['dbTableName']){
                form.setFieldsValue({execSql: ''})
                dataRuleInfo.execSql = ''
            }else{
                form.setFieldsValue({execSql: `${groupSql}`})
                dataRuleInfo.execSql = `${groupSql}`
            }
            if(groups.length>0&&!allValues['sqlData']){
                form.setFieldsValue({execSql: `${groupSql}`})
                dataRuleInfo.execSql = `${groupSql}`
            }
        }

        dataRuleInfo.registerId = registerId;
        dispatch({
            type: 'dataRuleMg/updateStates',
            payload: {
                registerId: allValues['registerId'],
                dataRuleInfo,
            }
        })

        setValues(allValues)
    }



    //添加分组
    function onAddGroup(groupName,groupNum,conditionNum,index,isRowCol) {

        // if(groups.length==0&&dataRuleInfo.dataRuleType=='PUBLIC'&&!dataRuleInfo.dbTableName){
        //     message.error('请填写数据库表!');
        //     return
        // }

        // if(groups.length==0&&dataRuleInfo.dataRuleType=='PUBLIC'){
        //     dispatch({
        //         type: 'dataRuleMg/getTableColumns',
        //         payload: {
        //             tableCode: dataRuleInfo.dbTableName.split('AS')[0].trim()
        //         }
        //     })
        // }
        if(dataRuleInfo.dbTableName&&dataRuleInfo.dataRuleType=='PUBLIC'){
            dispatch({
                type: 'dataRuleMg/updateStates',
                payload: {
                    metaData: dataRuleInfo.dbTableName.split(',')
                }
            })
        }


        let key = lastKey
        if(isRowCol&&index!=0){//如果是添加分组  添加一行分组条件
            // key = key+1
            key=Math.random().toString(36).substr(2, 9);
            groups.splice(index,0,{
                key: key,
                groupCondition: 'AND',
                isRowCol: false,
                groupName: groupName

            });
        }
        // key = key+1
        key=Math.random().toString(36).substr(2, 9);
        groups.splice(isRowCol?index+1:index,0,{
            key: key,
            groupName: groupName,
            dbTableName:metaData.length&&dataRuleInfo.dataRuleType=='MODULE'?metaData[0]:'',
            dbColumnName:'',
            relationType:'',
            propType:'',
            propTypeValue:'',
            condition:'AND',
            groupCondition:'',
            conditionNum: conditionNum,
            isRowCol: isRowCol
        });

        for (let index = 0; index < groups.length; index++) {//修改当前组的个数
            const g = groups[index];
            if(g.groupName==groupName){
                g.conditionNum = conditionNum
            }

        }

        setSql(groups);
        dispatch({
            type: 'dataRuleMg/updateStates',
            payload: {
                groups,
                lastKey: key,
            }
        })
        if(isRowCol){//如果添加组  更新组数
            dispatch({
                type: 'dataRuleMg/updateStates',
                payload: {
                    groupNum,
                }
            })
        }


    }




    //删除分组
    function onDeleteGroup(groupName) {
        let array = groups
        let totalGNum = groupNum
        if(groupName){
            array = array.filter(item => (item.groupName!=groupName))//删除掉当前组
            totalGNum = totalGNum-1;
        }else{
            if(selectedGroup.length==0){
                message.error('请选择要删除的组!')
                return
            }
            for (let index = 0; index < selectedGroup.length; index++) {
                const name = selectedGroup[index];
                totalGNum = totalGNum-1;
                array = array.filter(item => item.groupName!=name)//删除掉当前组
            }
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
                groupNum: totalGNum,
                selectedGroup: []
            }
        })

    }

    function  onTestSql() {
        dispatch({
            type: 'dataRuleMg/testSql',
            payload: {
                sql: form.getFieldValue('execSql')
            }
        })
    }

    function onChangeDbName(value) {//数据库表改变时删除组
        if(value!=dataRuleInfo['dbTableName']){
            dispatch({
                type: 'dataRuleMg/updateStates',
                payload: {
                    groups: [],
                    groupNum: 1
                }
            })
            const values=form.getFieldsValue()
            console.log(values,'values');
                if(values.sqlData){
                    dataRuleInfo.execSql = `${form.getFieldValue('sqlData')}`
                    dispatch({
                        type: 'dataRuleMg/updateStates',
                        payload: {
                            groupSql: '',
                            dataRuleInfo
                        }
                    })
                    form.setFieldsValue({ execSql: `${form.getFieldValue('sqlData')}` });
                }else{
                    dataRuleInfo.execSql = ''
                    dispatch({
                        type: 'dataRuleMg/updateStates',
                        payload: {
                            groupSql: '',
                            dataRuleInfo
                        }
                    })
                    form.setFieldsValue({ execSql:'' });
                }
        }

    }

    function onChangeSys(value) {
        dataRuleInfo.menuId = ''
        dataRuleInfo.menuName  = ''
        form.setFieldsValue({ execSql: '',correlation:'' });
        dispatch({
            type: 'dataRuleMg/updateStates',
            payload: {
                dataRuleInfo,
                groups: [],
                groupNum: 1,
                metaData: [],
                columns: [],
                groupSql:'',
                menuId: '',
                menuName:''
            }
        })
    }

    function renderButton() {
        return <Col span={dataRuleInfo.dataRuleType == 'MODULE'?10:24}>
                    {
                        groups.length==0?
                        <Button   className={style.bt_add_group} onClick={onAddGroup.bind(this,1,1,1,0,true)}>
                            增加分组
                        </Button>:
                        <Button   className={style.bt_add_group} onClick={onDeleteGroup.bind(this,'')}>
                            批量删除
                        </Button>
                    }
                </Col>
    }
    function onChangeTable(value){
        const values=form.getFieldsValue()
            let isCheck=''
            groups.map(item=>{
                 if((item.propType=='userName'||item.propType=='deptName'||item.propType=='orgName')&&!item.propTypeValue){
                     return isCheck=true
                 }
             })
             if(isCheck){
                 message.error('请填写属性值')
             }else{
                 dispatch({
                     type: 'dataRuleMg/testSql',
                     payload: {
                         sql: form.getFieldValue('execSql')
                     },
                     callback:(data)=>{
                         if(data){
                                 dispatch({
                                     type: 'dataRuleMg/uploadFileio',
                                     payload: {
                                         miniojs:JSON.stringify(groups),
                                         jsurl: `DataRule/${new Date().getTime()}/${dataRuleName}`,
                                         minioname: `${dataRuleName}.json`,
                                         fileEncryption:MD5(Math.random().toString(36).slice(2))
                                     },
                                     callback: (data)=>{
                                         dispatch({
                                             type: 'dataRuleMg/setDataRule',
                                             payload: {
                                                 dataRuleId: dataRuleInfo.dataRuleId,
                                                 menuId: dataRuleInfo.menuId,
                                                 microService: dataRuleInfo.microService,
                                                 registerId: registerId,
                                                 ...values,
                                                 searchJson: data.data,
                                                 menuName: menuName,
                                                 dataRuleTypeInfo:value=='2'?'1':'2'
                                             },
                                             callback:()=>{
                                                form.setFieldsValue({ execSql: '',correlation:'',dbTableName:'' ,sqlData:''});
                                                dispatch({
                                                    type: 'dataRuleMg/updateStates',
                                                    payload: {
                                                        dataRuleTypeInfo:value,
                                                        dataRuleInfo,
                                                        groups: [],
                                                        groupNum: 1,
                                                        metaData: [],
                                                        columns: [],
                                                        groupSql:'',
                                                        menuId: '',
                                                        menuName:''
                                                    }
                                                })
                                                dispatch({
                                                    type: 'dataRuleMg/getDataRuleInfo',
                                                    payload:{
                                                        dataRuleId:dataRuleInfo.dataRuleId,
                                                        dataRuleTypeInfo:value,
                                                    },
                                                    callback:(data)=>{
                                                        form.setFieldsValue({ execSql: data.execSql,correlation:data.correlation,dbTableName:data.dbTableName,sqlData:data.sqlData });
                                                    }
                                                    })
                                             }
                                         })
                                     }
                                 })
         
                         }

                     }
                 })
             }
           
    }
    return (
        <GlobalModal
            visible={true}
            // width={`calc(100% - 40px)`}
            widthType={1}
            incomingWidth={1000}
            incomingHeight={490}
            bodyStyle={{overflow:'scroll'}}
            title={'规则定义'}
            onCancel={onCancel}
            className={styles.add_form}
            maskClosable={false}
            mask={false}
            centered
            footer={[
                <Button onClick={onCancel} >
                     取消
                </Button>,
                <Button  type="primary" htmlType="submit" loading={loading.effects['dataRuleMg/setRuleInfo']} onClick={()=>{form.submit()}}>
                    保存
                 </Button>
              ]}
            getContainer={() =>{
                return document.getElementById('dataRuleMg_container')||false
            }}
        >
        {selectVisible&&<SM setSql={setSql.bind(this)}/>}
        {/**<Spin spinning={loading.effects['dataRuleMg/getDataRuleInfo']}>*/}
            <Form  onFinish={onFinish.bind(this)} initialValues={dataRuleInfo} onValuesChange={onValuesChange.bind(this)} form={form}>
                <Row >
                    <Col span={7}>
                    <Form.Item
                        label="数据规则类型"
                        name="dataRuleType"
                        rules={[
                            // { required: true,message:'请选择数据规则类型' },
                        ]}
                        labelCol={{span:10}}
                        wrapperCol={{span:14}}
                    >
                        <Select  disabled >
                            <Select.Option value={'SYSTEM'}>预置规则</Select.Option>
                            <Select.Option value={'MODULE'}>模块资源规则</Select.Option>
                            <Select.Option value={'PUBLIC'}>公共规则</Select.Option>

                        </Select>
                    </Form.Item>
                    </Col>
                </Row>
                {
                    dataRuleInfo.dataRuleType =='PUBLIC'?
                    <Row>
                    <Col span={24}>
                        <Tabs activeKey={dataRuleTypeInfo} onChange={onChangeTable} style={{width:'100%'}} >
                                <Tabs.TabPane tab={'列表规则'} key={'1'}>
                                </Tabs.TabPane>
                                <Tabs.TabPane tab={'树规则'} key={'2'}>
                                </Tabs.TabPane>
                        </Tabs>
                    </Col>
                </Row>
                    :''
                }
                {
                    dataRuleInfo.dataRuleType == 'MODULE'?
                    <Row >
                    <Col span={7}>
                    <Form.Item
                        label="注册系统"
                        name="registerId"
                        labelCol={{span:10}}
                        wrapperCol={{span:14}}
                        rules={[

                        ]}
                    >
                        <Select  placeholder='请选择注册系统' onChange={onChangeSys.bind(this)}>
                            {
                                registers.map((rg,index)=>{
                                    return <Select.Option value={rg.id} key={index}>{rg.registerName}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    </Col>
                    <Col span={7}>
                        <a className={style.menu} onClick={onMenu.bind(this)}>模块资源选择</a>
                        <span style={{marginLeft: 10}}>{menuName}</span>

                    </Col>
                    {renderButton()}
                </Row>:
                < >
                <Row style={{marginBottom: 8}}>
                {renderButton()}
                </Row>
            </>
            }
            {dataRuleInfo.dataRuleType=='PUBLIC'?
                <Form.Item
                label="数据库表(*示例: 表名 AS 别名,表名 AS 别名)"
                name="dbTableName"
                {...layout}
                rules={[
                    {max:200}
                ]}
            >
                <Input  placeholder='请输入数据库表' onChange={onChangeDbName.bind(this)}/>

            </Form.Item>:''}

                <Form.Item
                    label="关联关系(*示例: 表名 AS 别名 LEFT JOIN 表名 AS 别名 ON 别名.字段名 = 别名.字段名)"
                    name="correlation"
                    {...layout}
                    rules={[

                    ]}
                >
                    <Input  placeholder='请输入关联关系' />

                </Form.Item>
                <RT
                    setSql={setSql.bind(this)}
                    onAddGroup={onAddGroup.bind(this)}
                    onDeleteGroup={onDeleteGroup.bind(this)}
                />
                <Form.Item
                    label="sql编辑器(*标识：数据库表和字段需要大写输入)"
                    name="sqlData"
                    {...layout}
                    rules={[

                    ]}
                >
                    <Input.TextArea />
                </Form.Item>
            <Form.Item>
                <Button className={style.test} onClick={onTestSql.bind(this)}>测试</Button>
            </Form.Item>
            <Row style={{marginTop: -46}}>
                <Form.Item
                    style={{width:'100%'}}
                    label="sql可视化"
                    name="execSql"
                    {...layout}
                    rules={[

                    ]}
                >
                    <Input.TextArea disabled/>
                </Form.Item>

            </Row>

            </Form>
        {/**</Spin>*/}
    </GlobalModal>
    )
  }



export default (connect(({dataRuleMg,loading})=>({
    dataRuleMg,
    loading
  }))(ruleDefine));
