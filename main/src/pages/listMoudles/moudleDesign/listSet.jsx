
import { connect } from 'dva';
import React, { useState,useEffect } from 'react';
import { Input,Select, Form,Switch,Row,Col,Button,Popover,message} from 'antd';
import Editor from './editor'
import Sort from './sortAble'
import styles from './index.less'
import { useLocation, history } from 'umi'
import { parse } from 'query-string';
function listSet({dispatch,form,listMoudleInfo,tableColumns,seniorModal,sortVisible,sortList,editorState,selectedKeys,selectedIndex}){
const query = parse(history.location.search);

    const [showTitleFlag, setShowTitleFlag] = useState(false);
    const [seniorSearchFlag, setSeniorSearchFlag] = useState(false);
    const [dataSort, setDataSort] = useState('');
    const namespace = `moudleDesign_${query.moudleId}`;
    const layouts =  {labelCol: { span: 6 },wrapperCol: { span: 18}};
    listMoudleInfo['showTitleFlag'] = listMoudleInfo.showTitleFlag&&listMoudleInfo.showTitleFlag==1?true:false
    listMoudleInfo['seniorSearchFlag'] = listMoudleInfo.seniorSearchFlag&&listMoudleInfo.seniorSearchFlag==1?true:false
    listMoudleInfo['newlineFlag'] = listMoudleInfo.newlineFlag==null?true:(listMoudleInfo.newlineFlag==1?true:false)
    listMoudleInfo['pageFlag'] = listMoudleInfo.pageFlag==null?true:(listMoudleInfo.pageFlag==1?true:false)
    listMoudleInfo['fixedMeterFlag'] = listMoudleInfo.fixedMeterFlag&&listMoudleInfo.fixedMeterFlag	==1?true:false
    listMoudleInfo['cacheFlag'] = listMoudleInfo.cacheFlag&&listMoudleInfo.cacheFlag==1?true:false
    listMoudleInfo['designFlag'] = listMoudleInfo.designFlag&&listMoudleInfo.designFlag==1?true:false
    listMoudleInfo['normalSearch'] = listMoudleInfo.normalSearch==""?[]:listMoudleInfo.normalSearch
    listMoudleInfo['tableStyle'] = listMoudleInfo.tableStyle?listMoudleInfo.tableStyle:'TABLE',
    listMoudleInfo['dataSort'] = listMoudleInfo.dataSort?listMoudleInfo.dataSort:'DATE_DESC'

    useEffect(() => {
        form.setFieldsValue(listMoudleInfo);
      }, [query.moudleId]);
    function onValuesChange(changedValues, allValues){
        // setValues(allValues)
        setShowTitleFlag(allValues['showTitleFlag'])   
        setSeniorSearchFlag(allValues['seniorSearchFlag'])   
        setDataSort(allValues['dataSort'])   
        console.log('allValues',allValues);
        console.log('editorState',editorState);
        dispatch({
            type: `${namespace}/updateStates`,
            payload: {
                listMoudleInfo: {
                    ...listMoudleInfo,
                    ...allValues,
                },
                editorState: !allValues['showTitleFlag']?'[object Object]':editorState
            }
        })
    }

    function onSetSenior(params) {
        dispatch({
            type: `${namespace}/updateStates`,
            payload: {
                seniorModal: true,
            }
        })
    }
    function oncancel() {
        dispatch({
            type: `${namespace}/updateStates`,
            payload: {
                sortVisible: false,
            }
        })
    }
    function handleVisibleChange(visible) {
        dispatch({
            type: `${namespace}/updateStates`,
            payload: {
                sortVisible: visible,
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
                selectedIndex: newIndex&&newIndex!=-1?newIndex:selectedIndex

            }
        })
        oncancel();
    }

    function changeValues(value){
        　　let newArr ;
        　　if (value.length > 3){
                message.error('最多选择三个字段');
            // 　　　　newArr = [].concat(value.slice(0,2), value.slice(-1) ) ;
            　　　　newArr = [].concat(value.slice(0,3)) ;
            　　　　
            //   return Promise.reject(new Error('最多选择三个字段'))

        　　} else {
        　　　　newArr = value ;
            //  return Promise.resolve();
    　　    }
            form.setFieldsValue({
        　　　　"normalSearch" : newArr ,
        　　})
            dispatch({
                type: `${namespace}/updateStates`,
                payload: {
                    listMoudleInfo: {
                        ...listMoudleInfo,
                        normalSearch: newArr,
                    },
                }
            })
    }
    
    return (
        <Form initialValues={listMoudleInfo}   labelAlign={'right'} form={form} onValuesChange={onValuesChange.bind(globalThis)} {...layouts}>
                <Row style={{position:'relative'}}>
                    <Col span={24}>
                        <Form.Item 
                            label="标题"
                            name="showTitleFlag" 
                            className={styles.form}
                            valuePropName="checked"
                        >
                            <Switch  />
                            
                        </Form.Item>
                    </Col>
                    <Col style={{position:'absolute',left:'45%'}}>
                    {
                        
                        listMoudleInfo.showTitleFlag||showTitleFlag?
                        <Popover 
                            placement="bottom"  
                            content={
                                <Editor location={useLocation()}/>
                            } 
                            trigger="click">
                            <a className={styles.setting}>设置</a>
                        </Popover>:''
                    }
                    </Col>
                </Row>
        <Form.Item 
            label="常规查询"
            name="normalSearch" 
            className={styles.form}
            rules={[
                { required: true,message:'请选择常规查询项' },
            ]}
        >
            <Select style={{width: 163}} placeholder='请选择常规查询项' mode="tags" onChange={changeValues}>
                {
                    listMoudleInfo.columnList&&listMoudleInfo.columnList.length!=0?
                    listMoudleInfo.columnList.map((item,index)=><Select.Option value={item.colCode} key={index}>{item.colName}</Select.Option>):''
                }
                
            </Select>
        </Form.Item>
        <Row style={{position:'relative'}}>
            <Col span={24}>
                <Form.Item 
                    label="高级查询"
                    name="seniorSearchFlag" 
                    className={styles.form}
                    valuePropName="checked"
                >
                    <Switch  />
                </Form.Item>
            </Col>
            <Col style={{position:'absolute',left:'45%'}}>
                {listMoudleInfo.columnList&&listMoudleInfo.columnList.length!=0&&(seniorSearchFlag||listMoudleInfo.seniorSearchFlag)?<a className={styles.setting} onClick={onSetSenior.bind(this)}>设置</a>:''}
                
            </Col>
        </Row>
        <Form.Item 
            label="自动换行"
            name="newlineFlag" 
            className={styles.form}
            valuePropName="checked"
        >
            <Switch  />
        </Form.Item>
        <Form.Item 
            label="分页"
            name="pageFlag" 
            className={styles.form}
            valuePropName="checked"
        >
            <Switch  />
        </Form.Item>
        {
            /**
             * 
             * <Form.Item 
            label="每页数量"
            name="pageLimit" 
            className={styles.form}
        >
            <Select style={{width: 163}} placeholder='请选择分页条数'>
                <Select.Option value='10'>10条/页</Select.Option>
                <Select.Option value='20'>20条/页</Select.Option>
                <Select.Option value='40'>40条/页</Select.Option>
                <Select.Option value='60'>60条/页</Select.Option>
                <Select.Option value='100'>100条/页</Select.Option>
            </Select>
        </Form.Item>
             */
        }
        
        <Form.Item 
            label="列表样式"
            name="tableStyle" 
            className={styles.form}
        >
            <Select style={{width: 163}} placeholder='请选择列表样式' >
                <Select.Option value='TABLE'>显示表格</Select.Option>
                <Select.Option value='NONE'>无</Select.Option>
            </Select>
        </Form.Item>
        {/**<Form.Item 
            label="固定表头"
            name="fixedMeterFlag" 
            className={styles.form}
            valuePropName="checked"
        >
            <Switch  />
        </Form.Item>*/}
        <Form.Item 
            label="缓存"
            name="cacheFlag" 
            className={styles.form}
            valuePropName="checked"
        >
            <Switch  />
        </Form.Item>
        <Form.Item 
            label="数据排序"
            name="dataSort" 
            className={styles.form}
        >
            <Select style={{width: 163}} placeholder='请选择常规查询项'>
                <Select.Option value='DATE_ASC'>拟稿时间正序</Select.Option>
                <Select.Option value='DATE_DESC'>拟稿时间倒序</Select.Option>
                <Select.Option value='CUSTOMIZE'>自定义</Select.Option>
            </Select>
        </Form.Item>
        {
            dataSort=='CUSTOMIZE'?
            <Form.Item 
                label="sql"
                name="dataSortSql" 
                className={styles.form}
            >
                <Input.TextArea style={{width: 163}}/>
            </Form.Item>:''
        }
        
        
        <Form.Item 
            label="年度数据"
            name="yearCutFlag" 
            className={styles.form}
            valuePropName="checked"
        >
            <Switch  />
        </Form.Item>
        <Form.Item 
            label="列排序"
            name="columnSort" 
            className={styles.form}
        >
            <Popover 
                className={styles.sort_pover}
                visible={sortVisible}
                placement="bottom" 
                onVisibleChange={handleVisibleChange.bind(this)} 
                content={
                    <div>
                        <Sort isCheck={false} location={useLocation()}/>
                        <div className={styles.sort_bt_group}>
                            <Button onClick={oncancel.bind(this)}>取消</Button>
                            <Button onClick={onSaveSort.bind(this)}>保存</Button>
                        </div>
                    </div>
                        
                } 
                trigger="click">
                <a className={styles.setting}>设置</a>
            </Popover>
        </Form.Item>
        </Form>
    )

  

}
// export default connect(({moudleDesign})=>({
//     ...moudleDesign
// }))(listSet);
export default connect((state)=>({
        ...state[`moudleDesign_${parse(history.location.search).moudleId}`],

  }))(listSet);