
import { connect } from 'dva';
import React, { useState } from 'react';
import { Input,Select, Form,Switch,Row,Col,Button,Popover} from 'antd';
import Editor from './editor'
import Sort from './sortAble'
import styles from './index.less'
function listSet({dispatch,dataDrive,tableColumns,seniorModal,sortVisible,sortList}){
    const [form] = Form.useForm();
    const [showTitleFlag, setShowTitleFlag] = useState(false);
    const [seniorSearchFlag, setSeniorSearchFlag] = useState(false);
    const [dataSort, setDataSort] = useState('');
    dataDrive['showTitleFlag'] = dataDrive.showTitleFlag&&dataDrive.showTitleFlag==1?true:false
    dataDrive['seniorSearchFlag'] = dataDrive.seniorSearchFlag&&dataDrive.seniorSearchFlag==1?true:false
    dataDrive['newlineFlag'] = dataDrive.newlineFlag?(dataDrive.newlineFlag==1?true:false):true
    dataDrive['pageFlag'] = dataDrive.pageFlag?(dataDrive.pageFlag==1?true:false):true
    dataDrive['fixedMeterFlag'] = dataDrive.fixedMeterFlag&&dataDrive.fixedMeterFlag	==1?true:false
    dataDrive['cacheFlag'] = dataDrive.cacheFlag&&dataDrive.cacheFlag==1?true:false
    dataDrive['designFlag'] = dataDrive.designFlag&&dataDrive.designFlag==1?true:false
    const layouts =  {labelCol: { span: 10 },wrapperCol: { span: 14}};

    function onValuesChange(changedValues, allValues){
        // setValues(allValues)
        setShowTitleFlag(allValues['showTitleFlag'])   
        setSeniorSearchFlag(allValues['seniorSearchFlag'])   
        setDataSort(allValues['dataSort'])   

        dispatch({
            type: 'dataDriven/updateStates',
            payload: {
                dataDrive: {
                    ...dataDrive,
                    ...allValues,
                },
            }
        })
    }

    function onSetSenior(params) {
        dispatch({
            type: 'dataDriven/updateStates',
            payload: {
                seniorModal: true,
            }
        })
    }
    function oncancel() {
        dispatch({
            type: 'dataDriven/updateStates',
            payload: {
                sortVisible: false,
            }
        })
    }
    function handleVisibleChange(visible) {
        dispatch({
            type: 'dataDriven/updateStates',
            payload: {
                sortVisible: visible,
            }
        })
    }
    
    function onSaveSort() {
        dataDrive.tableColumnList = sortList
        dispatch({
            type: 'dataDriven/updateStates',
            payload: {
                dataDrive
            }
        })
        oncancel();
    }
    
    
    return (
        <Form initialValues={dataDrive}   labelAlign={'right'} form={form} onValuesChange={onValuesChange.bind(globalThis)} {...layouts}>
        <Form.Item 
            label="跨应用数据选中"
            name="ctlgType" 
            className={styles.form}
            valuePropName="checked"
        >
            <Switch  />
        </Form.Item>
        {/** 
         * <Row>
            <Col>
                <Form.Item 
                    label="标题"
                    name="showTitleFlag" 
                    className={styles.form}
                    valuePropName="checked"
                >
                    <Switch  />
                </Form.Item>
            </Col>
            <Col>
                {
                    
                    dataDrive.showTitleFlag||showTitleFlag?
                    <Popover 
                        placement="bottom"  
                        content={
                            <Editor/>
                        } 
                        trigger="click">
                        <a className={styles.setting}>设置</a>
                    </Popover>:''
                }
                
            </Col>
        </Row>
        */}

        <Form.Item 
            label="常规查询"
            name="normalSearch" 
            className={styles.form}
            rules={[
                { required: true,message:'请选择常规查询项' },
            ]}
        >
            <Select style={{width: 163}} placeholder='请选择常规查询项' mode="tags">
                {
                    dataDrive.tableColumnList&&dataDrive.tableColumnList.length!=0?
                    dataDrive.tableColumnList.map((item,index)=><Select.Option value={item.columnCode} key={index}>{item.columnName}</Select.Option>):''
                }
                
            </Select>
        </Form.Item>
        {/**
         * <Row>
            <Col>
                <Form.Item 
                    label="高级查询"
                    name="seniorSearchFlag" 
                    className={styles.form}
                    valuePropName="checked"
                >
                    <Switch  />
                </Form.Item>
            </Col>
            <Col>
                {dataDrive.tableColumnList&&dataDrive.tableColumnList.length!=0&&(seniorSearchFlag||dataDrive.seniorSearchFlag)?<a className={styles.setting} onClick={onSetSenior.bind(this)}>设置</a>:''}
                
            </Col>
        </Row>
         */}
        
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
            <Select style={{width: 163}} placeholder='请选择列表样式'>
                <Select.Option value='TABLE'>显示表格</Select.Option>
                <Select.Option value='NONE'>无</Select.Option>
            </Select>
        </Form.Item>
        {
            /** 
            <Form.Item 
                label="固定表头"
                name="fixedMeterFlag" 
                className={styles.form}
                valuePropName="checked"
            >
                <Switch  />
            </Form.Item>
             */
        }
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
                label=""
                name="dataSortSql" 
                className={styles.form}
            >
                <Input.TextArea style={{width: 227}}/>
            </Form.Item>:''
        }
        
        {/**
         *<Form.Item 
            label="年度数据"
            name="yearCutFlag" 
            className={styles.form}
            valuePropName="checked"
        >
            <Switch  />
        </Form.Item>
         */}

        {/*<Form.Item 
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
                        <Sort isCheck={false}/>
                        <div className={styles.sort_bt_group}>
                            <Button onClick={oncancel.bind(this)}>取消</Button>
                            <Button onClick={onSaveSort.bind(this)}>保存</Button>
                        </div>
                    </div>
                        
                } 
                trigger="click">
                <a className={styles.setting}>设置</a>
            </Popover>
            </Form.Item>*/}
        <Form.Item 
            label="自定义列"
            name="designFlag" 
            className={styles.form}
            valuePropName="checked"
        >
            <Switch  />
        </Form.Item>
        </Form>
    )

  

}
export default connect(({dataDriven})=>({
    ...dataDriven
}))(listSet);