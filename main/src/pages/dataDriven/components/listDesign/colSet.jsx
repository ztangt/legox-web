
import { connect } from 'dva';
import React, { useState,Component } from 'react';
import { Input,Select, Form,Switch,Row,Col,Button,Radio,InputNumber} from 'antd';
import Editor from './editor'
import Sort from './sortAble'
import styles from './index.less'
class listSet extends Component{
    state = {
        selectedIndex: -1,
        dataDrive: {},
        props:{
            selectedIndex: -1,
            dataDrive: {},
        }
      }
    
      static getDerivedStateFromProps (nextProps, prevState) {
        const { dataDrive,selectedIndex } = nextProps
        
            const {props} = prevState
            if (dataDrive !== props.dataDrive||
                selectedIndex !== props.selectedIndex
            ) {

                return {
                    selectedIndex, 
                    dataDrive, 
                    props : {
                        selectedIndex, 
                        dataDrive, 

                    }
                }
            }
            return null
    
        
      }

     onValuesChange(changedValues, allValues){
         const {dispatch,dataDrive,selectedIndex,formKey} = this.props
         allValues['width'] = `${allValues['widthN']},${allValues['widthP']}`


        dataDrive.tableColumnList[selectedIndex] = {
            ...dataDrive.tableColumnList[selectedIndex],
            ...allValues,
        }
        dispatch({
            type: 'dataDriven/updateStates',
            payload: {
                dataDrive,
                formKey: formKey+1,
            }
        })
    }


    
    render(){
        const {selectedIndex,dataDrive,sourceColumnList} = this.state
        const layouts =  {labelCol: { span: 6 },wrapperCol: { span: 18}};
        let obj = {};
        if(selectedIndex!=-1&&dataDrive.tableColumnList){
            obj = dataDrive.tableColumnList[selectedIndex]||{};
            obj['sortFlag'] = obj.sortFlag&&obj.sortFlag==1?true:false
            obj['sumFlag'] = obj.sumFlag&&obj.sumFlag==1?true:false
            obj['fixedFlag'] = obj.fixedFlag&&obj.fixedFlag==1?true:false
        }
        return (
            <Form initialValues={obj}  requiredMark={false}  onValuesChange={this.onValuesChange.bind(this)} key={selectedIndex} {...layouts}>

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
                >
                    <Input  style={{width: 163}}/>
            </Form.Item>
            <Form.Item 
                label="格式方式"
                name="showStyle" 
                className={styles.form}
            >
                <Select style={{width: 163}} placeholder='请选择常规查询项'>
                    <Select.Option value='NONE'>无</Select.Option>
                    <Select.Option value='MONEY'>金额格式化</Select.Option>
                </Select>
            </Form.Item>
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
            </Form.Item>
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
                    <Radio value={0}>左</Radio>
                    <Radio value={1}>中</Radio>
                    <Radio value={2}>右</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item 
                label="固定列"
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

            <Form.Item 
                label="列宽"
                name="widthN" 
            >
                <InputNumber  style={{width: 165}}/>
            </Form.Item>
            <Row>
                <Col span={6}>

                </Col>
                <Col span={18} style={{marginTop: -20}}>
                    <Form.Item 
                        label=""
                        name="widthP" 
                    >
                        <Select style={{width: 165,}}>
                            <Select.Option value='px'>px</Select.Option>
                            <Select.Option value='%'>%</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        )
    }


  

}
export default connect(({dataDriven})=>({
    ...dataDriven
}))(listSet);