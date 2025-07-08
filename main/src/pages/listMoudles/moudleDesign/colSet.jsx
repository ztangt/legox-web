
import { connect } from 'dva';
import React, { useState,Component,useEffect } from 'react';
import { Input,Select, Form,Switch,Row,Col,Button,Radio,InputNumber} from 'antd';
import Editor from './editor'
import Sort from './sortAble'
import styles from './index.less'
import {history} from 'umi'
import { parse } from 'query-string';
function listSet({dispatch,listMoudleInfo,selectedIndex,formKey,location}){
    const [showStyle, setShowStyle] = useState(listMoudleInfo.showStyle);
    const layouts =  {labelCol: { span: 6 },wrapperCol: { span: 18}};
    const [form] = Form.useForm();
    const query = parse(history.location.search);
    useEffect(()=>{
        if(listMoudleInfo.columnList[selectedIndex]&&!showStyle){
            setShowStyle(listMoudleInfo.columnList[selectedIndex].showStyle);
        }
        let obj = {};
        if(selectedIndex!=-1&&listMoudleInfo.columnList){
            obj = listMoudleInfo.columnList[selectedIndex]||{};
            console.log('obj',obj)
            if(!_.isEmpty(obj)){
                obj['sortFlag'] = obj.sortFlag==null?true:(obj.sortFlag==1?true:false)
                obj['sumFlag'] = obj.sumFlag&&obj.sumFlag==1?true:false
                obj['fixedFlag'] = obj.fixedFlag&&obj.fixedFlag==1?true:false
                if(!obj.colAlignStyle){
                    obj.colAlignStyle = 'MIDDLE'
                }
                if(!obj.showStyle){
                    obj.showStyle = 'NONE'
                }

                
            }

        }
        form.setFieldsValue(obj)
    },[listMoudleInfo.columnList])
     function onValuesChange(changedValues, allValues){
        //  const {dispatch,listMoudleInfo,selectedIndex,formKey,location} = this.props
         const namespace = `moudleDesign_${query.moudleId}`;
         if(allValues['widthN']&&allValues['widthP']){
            allValues['width'] = `${allValues['widthN']},${allValues['widthP']}`
         }
         console.log('listMoudleInfo',listMoudleInfo);
         if(allValues['showStyle']=='DATE'&&!allValues['showStyleInfo']){
            allValues['showStyleInfo'] = 'YYYY-MM-DD'
            form.setFieldsValue({'showStyleInfo':'YYYY-MM-DD'})
         }
         if(allValues['showStyle']=='MONEY'&&!allValues['showStyleInfo']){
            allValues['showStyleInfo'] = 'SECOND'
            form.setFieldsValue({'showStyleInfo':'SECOND'})
         }
        
        listMoudleInfo.columnList[selectedIndex] = {
            ...listMoudleInfo.columnList[selectedIndex],
            ...allValues,
        }
        console.log('listMoudleInfo',listMoudleInfo);
        dispatch({
            type: `${namespace}/updateStates`,
            payload: {
                listMoudleInfo,
                formKey: formKey+1,
            }
        })
    }

    function onChange(value){
        setShowStyle(value)
        if(value=='MONEY'){
            form.setFieldsValue({'showStyleInfo':'SECOND'})
        }else if(value=='DATE'){
            form.setFieldsValue({'showStyleInfo':'YYYY-MM-DD'})
        }else{
            form.setFieldsValue({'showStyleInfo':''})

        }
    }


    
        // const {selectedIndex,listMoudleInfo,showStyle} = this.state
    

        
        return (
            <Form   requiredMark={false}  onValuesChange={onValuesChange.bind(this)} key={selectedIndex} form={form}>
            <Form.Item 
                    label="字段名称"
                    name="fieldName" 
                    className={styles.form}

                >
                    <Input  style={{width: 163}} disabled/>
            </Form.Item>
            <Form.Item 
                    label="列表名称" 
                    name="columnName" 
                    className={styles.form}
                    rules={[
                        { required: true,message:'请填写列表名称' },
                        { max: 30,message:'最多输入30个字符'},
                        { whitespace: true,message:'请填写列表名称' }
                    ]}
                >
                    <Input  style={{width: 163}}/>
            </Form.Item>
            <Form.Item 
                label="格式方式"
                name="showStyle" 
                className={styles.form}
            >
                <Select style={{width: 163}} placeholder='请选择常规查询项' onChange={onChange.bind(this)}>
                    <Select.Option value='NONE'>无</Select.Option>
                    <Select.Option value='MONEY'>金额格式化</Select.Option>
                    <Select.Option value='DATE'>日期格式化</Select.Option>
                </Select>
            </Form.Item>
            {showStyle=='MONEY'&&
            <Form.Item 
                label="格式标准"
                name="showStyleInfo" 
                className={styles.form}
            >
                <Select style={{width: 163}} placeholder='请选择格式标准'>
                    <Select.Option value='SECOND'>两位小数</Select.Option>
                    <Select.Option value='THUS_SEC'>千分位两位小数</Select.Option>
                    <Select.Option value='FOURTH'>四位小数</Select.Option>
                    <Select.Option value='THUS_FOU'>千分位四位小数</Select.Option>
                    <Select.Option value='SIXTH'>六位小数</Select.Option>
                    <Select.Option value='THUS_SIX'>千分位六位小数</Select.Option>
                </Select>
            </Form.Item>}
            {showStyle=='DATE'&&
            <Form.Item 
                label="格式标准"
                name="showStyleInfo" 
                className={styles.form}
            >
                <Select style={{width: 163}} placeholder='请选择格式标准'>
                    <Select.Option value='YYYY'>YYYY</Select.Option>
                    <Select.Option value='YYYY-MM-DD'>YYYY-MM-DD</Select.Option>
                    <Select.Option value='YYYY-MM"'>YYYY-MM</Select.Option>
                    <Select.Option value='YYYY-MM-DD hh:ss:mm'>YYYY-MM-DD hh:ss:mm</Select.Option>
                    <Select.Option value='MM-DD'>MM-DD</Select.Option>
                    <Select.Option value='MM'>MM</Select.Option>
                </Select>
            </Form.Item>}
            <Form.Item 
                label="结果合计"
                name="sumFlag" 
                className={styles.form}
                valuePropName="checked"

            >
                <Switch  />
            </Form.Item>
            <Form.Item 
                label="对齐方式"
                name="colAlignStyle" 
                className={styles.form}
            >
                <Radio.Group >
                    <Radio value={'LEFT'}>左</Radio>
                    <Radio value={'MIDDLE'}>中</Radio>
                    <Radio value={'RIGHT'}>右</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item 
                label="&nbsp;&nbsp;&nbsp;&nbsp;固定列"
                name="fixedFlag" 
                className={styles.form}
                valuePropName="checked"
            >
                <Switch  />
            </Form.Item>
            <Form.Item 
                label="点击排序"
                name="sortFlag" 
                valuePropName="checked"
                className={styles.form}
            >
                <Switch  />
            </Form.Item>
            <Row>
                <Col>
                    <Form.Item 
                        label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;列宽"
                        name="widthN" 
                    >
                        <InputNumber  style={{width: 120}}/>
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item 
                        label=""
                        name="widthP" 
                    >
                        <Select>
                        <Select.Option value='px'>px</Select.Option>
                        <Select.Option value='%'>%</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        )
    


  

}
// export default connect(({moudleDesign})=>({
//     ...moudleDesign
// }))(listSet);
export default connect((state)=>({
        ...state[`moudleDesign_${query.moudleId}`],

}))(listSet);