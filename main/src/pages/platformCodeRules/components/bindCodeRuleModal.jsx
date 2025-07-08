import React, { useState, useEffect } from 'react'
import { Modal, Table, Select, Button, Input, InputNumber, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment'
import _ from 'lodash'
import styles from './bindCodeRuleModal.less'
import GlobalModal from '../../../componments/GlobalModal';

const {Option} = Select;

function BindCodeRuleModal({ dispatch, platformCodeRules, layoutG, listSelectedRowKey }) {

    const {
        codeRuleId,
        echoBindRules,
        selectTreeNodeKeys,
        isEdit,
        searchWord
    } = platformCodeRules;
    console.log('isEdit',isEdit);
    // 回显规则处理;
    const echoBindRulesHandle = echoBindRules =>
        echoBindRules.map((item, ind) => {
            item.key = ind;
            return item;
        })

    // 选中行
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    // 规则绑定列表
    const defaultTable = [{
        key: 1,
        codeRuleId: '',
        codeRuleType: 'CONSTANT',
        defaultValue: '',
        defaultType: 'YEAR',
        codeLength: '1',
        codeStart: '1',
        codeReset: 'DAY',
        codeView: '',
    }];
    const [tableData, setTableData] = useState([]);
    let tmpTable = [];

    useEffect(() => {
        // 更新时回显有值时更新TabeData;
        let isUnmount = false;
        const updateTable = () => {
          if ( !isUnmount && echoBindRules.length) {
            setTableData([...echoBindRulesHandle(echoBindRules)]);
          } else {
            setTableData([]);
          }
        };

        updateTable();

        // 销毁时重置值;
        return () => {
          isUnmount = true;
          setTableData([]);
        }
    }, [echoBindRules])

    function usePrevious(data){
        const ref = React.useRef();
        React.useEffect(()=>{
          ref.current = data
        }, [data])
        return ref.current
      }
    const columns = [
        {
            title: '类型',
            dataIndex: 'codeRuleType',
            key: 'codeRuleType',
            render: (text, record, index) => {
                return (
                    <Select
                        style={{ minWidth: 100 }}
                        value={text}
                        disabled={isEdit=='N'}
                        onChange={(value) =>
                          {
                          tmpTable = [...tableData];
                          switch (value) {
                            case "CONSTANT":
                              tmpTable[index]['codeView'] = '';
                              break;
                            case "FIXEDTYPE":
                              tmpTable[index]['codeView'] = fixedTypeCodeViewHandle("YEAR");
                              break;
                            case "SERIALCODE":
                              tmpTable[index]['codeView'] = '1';
                              tmpTable[index]['codeReset'] = 'NULL';
                              tmpTable[index]['countType'] = 'NULL';
                              tmpTable[index]['ackFlag'] = 'NO';

                              break;
                            case "BILLVAL":
                              tmpTable[index]['codeView'] = 'CODE';
                              break;
                            default:
                              tmpTable[index]['codeView'] = '';
                              break;
                          }
                          if(tmpTable.length!=0){
                            let flag = tmpTable.findIndex((item)=>{return item.codeRuleType=='SERIALCODE'})
                            if(flag>-1&&flag!=index&&value=='SERIALCODE'){
                                tmpTable[index]['codeView'] = '';
                                tmpTable[index]['codeReset'] = '';
                                message.error('最多绑定一种流水号类型')
                            }else{
                                setTableData([...tmpTable]);
                                changeHandle(value, index);
                            }
                          }
                          }}
                    >
                        <Option value="CONSTANT">常量</Option>
                        <Option value="FIXEDTYPE">固定类型</Option>
                        <Option value="SERIALCODE">流水号</Option>
                        <Option value="BILLVAL">单据属性值</Option>
                    </Select>
                )
            }
        },
        {
            title: '固定值',
            dataIndex: 'defaultValue',
            key: 'defaultValue',
            render: (text, record, index) => {
                switch (record.codeRuleType) {
                    case "CONSTANT":
                        return (
                            <Input style={{ width: 100 }}
                                disabled={isEdit=='N'}
                                value={text}
                                onBlur={(e) => {
                                    // e.persist();
                                    var regx = /[^\w\u4E00-\u9FA5-]/g
                                    if(e.target.value&&regx.test(e.target.value)){
                                        message.error('请勿输入特殊字符!')
                                    }
                                }}
                                onChange={(e) => {
                                    if(e.target.value&&e.target.value.length>50){
                                        message.error('最多输入50个字符!')
                                        return
                                    }
                                    tmpTable = [...tableData];
                                    tmpTable[index]['defaultValue'] = e.target.value;
                                    tmpTable[index]['codeView'] = e.target.value;
                                    setTableData([...tmpTable]);
                                }} />
                        )
                    case "FIXEDTYPE":
                        return;
                    case "SERIALCODE":
                        return;
                    case "BILLVAL":
                        return;
                }
            }
        },
        {
            title: '选择值',
            dataIndex: 'defaultType',
            key: 'defaultType',
            render: (text, record, index) => {
                switch (record.codeRuleType) {
                    case "CONSTANT":
                        return;
                    case "FIXEDTYPE":
                        return (
                            <Select
                                disabled={isEdit=='N'}
                                style={{ minWidth: 100 }}
                                value={text}
                                onChange={(value) => {
                                    tmpTable = [...tableData];
                                    tmpTable[index]['defaultType'] = value;
                                    tmpTable[index]['codeView'] = fixedTypeCodeViewHandle(value);
                                    setTableData([...tmpTable]);
                                }}
                            >
                                <Option value="YEAR">年度</Option>
                                <Option value="MONTH">月度</Option>
                                <Option value="YEARMONTH">年月</Option>
                                <Option value="YEARMONTHDAY">年月日</Option>
                                {/* <Option value="TIME">时间</Option> */}
                                <Option value="DEPT">部门简称</Option>
                                <Option value="ORG">单位简称</Option>
                            </Select>
                        )
                    case "SERIALCODE":
                        return;
                    case "BILLVAL":
                        return;
                }
            }
        },
        {
            title: '长度',
            dataIndex: 'codeLength',
            key: 'codeLength',
            render: (text, record, index) => {
                switch (record.codeRuleType) {
                    case "CONSTANT":
                        return;
                    case "FIXEDTYPE":
                        return;
                    case "SERIALCODE":
                        return (
                            <InputNumber
                                min={1} max={99999}
                                step={1}
                                value={text}
                                disabled={isEdit=='N'}
                                onChange={(value) => {
                                    var regCode = /^[1-9]+[0-9]*$/;
                                    //只能输入正整数
                                    if(value&&(!regCode.test(value)||value>9)){
                                        message.error('只能输入0-9之间的数字')
                                        return
                                    }else{
                                        tmpTable = [...tableData];
                                        tmpTable[index]['codeLength'] = value;
                                        tmpTable[index]['codeView'] = getPipelineCode(value, record.codeStart);
                                        // tmpTable[index]['codeView'] = value * record.codeStart;
                                        setTableData([...tmpTable]);
                                    }

                                }} />
                        )
                    case "BILLVAL":
                        return;
                }
            }
        },
        {
            title: '起始值',
            dataIndex: 'codeStart',
            key: 'codeStart',
            render: (text, record, index) => {
                switch (record.codeRuleType) {
                    case "CONSTANT":
                        return;
                    case "FIXEDTYPE":
                        return;
                    case "SERIALCODE":
                        return (
                            <InputNumber
                                min={1} max={99999}
                                step={1}
                                value={text}
                                disabled={isEdit=='N'}
                                onChange={(value) => {
                                    var regCode = /^[1-9]+[0-9]*$/;
                                    //只能输入正整数
                                    if(value&&!regCode.test(value)){
                                        message.error('只能输入正整数')
                                        return
                                    }else{
                                        tmpTable = [...tableData];
                                        tmpTable[index]['codeStart'] = value;
                                        tmpTable[index]['codeView'] = getPipelineCode(record.codeLength, value);
                                        // tmpTable[index]['codeView'] = value * record.codeLength;
                                        setTableData([...tmpTable]);
                                    }

                                }} />
                        )
                    case "BILLVAL":
                        return;
                }
            }
        },
        {
            title: '流水重置规则',
            dataIndex: 'codeReset',
            key: 'codeReset',
            render: (text, record, index) => {
                switch (record.codeRuleType) {
                    case "CONSTANT":
                        return;
                    case "FIXEDTYPE":
                        return;
                    case "SERIALCODE":
                        return (
                            <Select
                                style={{ minWidth: 100 }}
                                value={text}
                                disabled={isEdit=='N'}
                                onChange={(value)=>{
                                    tmpTable = [...tableData];
                                    tmpTable[index]['codeReset'] = value;
                                    setTableData([...tmpTable]);
                                }}
                            >
                                <Option value="DAY">每日</Option>
                                <Option value="MONTH">每月</Option>
                                <Option value="YEAR">每年</Option>
                                <Option value="NULL">无</Option>
                            </Select>
                        )
                    case "BILLVAL":
                        return;
                }
            }
        },
        {
          title: '计数规则',
          dataIndex: 'countType',
          key: 'countType',
          render: (text, record, index) => {
            switch (record.codeRuleType) {
              case "CONSTANT":
                return;
              case "FIXEDTYPE":
                return;
              case "SERIALCODE":
                return (
                  <Select
                    style={{ minWidth: 100 }}
                    value={text}
                    disabled={isEdit=='N'}
                    onChange={(value)=>{
                      tmpTable = [...tableData];
                      tmpTable[index]['countType'] = value;
                      setTableData([...tmpTable]);
                    }}
                    defaultValue={'NULL'}
                  >
                    <Option value="NULL">默认</Option>
                    <Option value="ORG">单位计数</Option>
                    <Option value="DEPT">部门计数</Option>
                  </Select>
                )
              case "BILLVAL":
                return;
            }
          }
        },
        {
          title: '手动确认',
          dataIndex: 'ackFlag',
          key: 'ackFlag',
          render: (text, record, index) => {
            switch (record.codeRuleType) {
              case "CONSTANT":
                return;
              case "FIXEDTYPE":
                return;
              case "SERIALCODE":
                return (
                  <Select
                    style={{ minWidth: 100 }}
                    value={text}
                    disabled={isEdit=='N'}
                    onChange={(value)=>{
                      tmpTable = [...tableData];
                      tmpTable[index]['ackFlag'] = value;
                      setTableData([...tmpTable]);
                    }}
                    defaultValue={'NO'}
                  >
                    <Option value="NO">否</Option>
                    <Option value="YES">是</Option>
                  </Select>
                )
              case "BILLVAL":
                return;
            }
          }
        },
        {
            title: '展示',
            dataIndex: 'codeView',
            key: 'codeView',
            render: (text, record, index) => {
                return record.codeView;
                // switch (record.codeRuleType) {
                //     case "CONSTANT":
                //         return record.defaultValue;
                //     case "FIXEDTYPE":
                //         return fixedTypeCodeViewHandle(record.defaultType);
                //     case "SERIALCODE":
                //         return record.codeLength * record.codeStart;
                //     case "BILLVAL":
                //         return;
                // }
            }
        },
        {
            title: '操作',
            render: (text, record, index) => {
                return (
                    <div style={{'pointer-events':isEdit=='N'?'none':''}}>
                        <a onClick={() => { upmoveHandle(record, index) }}>上移</a>
                        &ensp;
                        <a onClick={() => { downmoveHandle(record, index) }}>下移</a>
                    </div>
                )
            }
        },
    ];
    const fixedTypeCodeViewHandle = (type) => {
        // YYYY-MM-DD HH:mm:ss
        switch (type) {
            case 'YEAR':
                return moment().year();
            case 'MONTH':
                return moment().month() + 1;
            case 'YEARMONTH':
                return moment(new Date().getTime()).format('YYYYMM');
            case 'YEARMONTHDAY':
                return moment(new Date().getTime()).format('YYYYMMDD');
            // case 'TIME':
            //     return moment(new Date().getTime()).format('HH:mm:ss');
            case 'DEPT':
                return '部门';
            case 'ORG':
                return '单位';
        }
    }

    const getPipelineCode = (length, start) => {
      if ( !(length && start)) {
        return '';
      }
      let startS = start.toString();
      if ( startS.length >= length ) {
        return startS;
      } else {
        let needLength = length - startS.length;
        let tmp = '';
        for (let i = 0; i < needLength; i++) {
          tmp = tmp + '0';
        }
        return (tmp + startS);
      }
    }

    // 设置类型&增删处理;
    const changeHandle = (value, index) => {
        tmpTable = [...tableData];
        tmpTable[index]['codeRuleType'] = value;
        setTableData([...tmpTable])
    }
    // Modal保存
    const handleOk = () => {
        let flag = false;
        for (let index = 0; index < tableData.length; index++) {
            const element = tableData[index];
            var regx = /[^\w\u4E00-\u9FA5-]/g
            if(element.codeView&&regx.test(element.codeView)){
                message.error('请勿输入特殊字符!')
                return
            }
            if(element.codeRuleType=='SERIALCODE'&&(!element.codeStart||!element.codeLength)){
                message.error('请检查长度/起始值是否已填写!')
                return
            }
        }
        // if(flag){
        //     message.error('请勿输入特殊字符!')
        //     return
        // }
        // 保存规则
        dispatch({
            type: 'platformCodeRules/addCodeRuleInfos',
            payload: {
                codeRulesJson: JSON.stringify(tableData),
                codeRuleId: codeRuleId,
            }
        })
        // 列表刷新
        dispatch({
            type: 'platformCodeRules/getCodeRuleInfo',
            payload: {
                codeRuleId: selectTreeNodeKeys[0],
                start: 1,
                limit: 10,
                codeName: searchWord,
            }
        })
        dispatch({
            type: 'platformCodeRules/updateStates',
            payload: {
                isShowBindModal: false,
                echoBindRules: [],
            }
        })
    }
    // Modal关闭
    const handleCancel = () => {
        dispatch({
            type: 'platformCodeRules/updateStates',
            payload: {
                isShowBindModal: false,
                echoBindRules: [],
            }
        })
        setTableData([]);
        setSelectedRowKeys([]);
    }

    // 编号预览
    const handleCodePreview = () => {

    }

    /**
     * @describe [数组位置交换]
     * @param  {[Array]}   arr   原数组
     * @param  {[Number]} start  开始位
     * @param  {[Number]}  end   结束位
     * @return {[resultArray]}
     */
    const upDownHandle = (arr, start, end) => {
        let newArr = [].concat(arr);
        let startItem = newArr[start];
        newArr.splice(start, 1);
        newArr.splice(end, 0, startItem);
        return newArr;
    };

    // 上移
    const upmoveHandle = (record, index) => {
        if (index == 0) {
            message.error('已移至第一条');
        } else {
            setTableData(upDownHandle(tableData, index, index - 1))
        }
    }
    // 下移
    const downmoveHandle = (record, index) => {
        if (index == tableData.length - 1) {
            message.error('已移至最后一条');
        } else {
            setTableData(upDownHandle(tableData, index, index + 1))
        }
    }

    // 增行
    const addTableRow = () => {
        let newTData = _.cloneDeep(defaultTable[0])
        for (let index = 0; index < tableData.length; index++) {
            const element = tableData[index];
            element.key=index+1

        }
        newTData['key'] = tableData.length + 1;
        setTableData([...tableData, newTData]);
    }
    // 删除
    const delTableRow = async () => {
        if (!selectedRowKeys.length) {
            message.error('请勾选一条进行删除');
        }

        let tempTableData = [...tableData]
        selectedRowKeys.forEach((selectedItem, ind) => {
            tempTableData = tempTableData.filter(item => item.key != selectedItem)
        })
        // tempTableData = tempTableData.map((item, ind) => { item.key = ind; return item });
        setTableData(tempTableData);
        setSelectedRowKeys([]);
    }

    return (
        <GlobalModal
            visible={true}
            onCancel={handleCancel}
            title={'编码规则'}
            widthType={1}
            incomingWidth={1200}
            incomingHeight={400}
            centered
            footer={[
                <Button key="back" onClick={handleCancel}>
                    取消
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    保存
                </Button>

            ]}
            maskClosable={false}
            mask={false}
            getContainer={() => {
                return document.getElementById('platformCodeRules_container')||false
            }}
            bodyStyle={{paddingTop:8}}
            className={styles.platformCodeRules_modal}
        >
            <div style={{height:'100%'}}>
                <div style={{'pointer-events':isEdit=='N'?'none':''}}>
                    <Button type="primary" className={styles.ad_button} onClick={addTableRow}>增行</Button>
                    <Button type="primary" className={styles.ad_button} onClick={delTableRow}>删除</Button>
                </div>
            <div style={{height:'100%'}}>
                {tableData && <Table
                    rowKey="key"
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectedRowKeys(selectedRowKeys);
                        },
                    }}
                    scroll={{y:tableData.length?'calc(100% - 55px)':null}}
                />}
            </div>
            </div>
        </GlobalModal>
    )
}

export default connect(({ platformCodeRules, layoutG }) => ({
    platformCodeRules,
    layoutG,
}))(BindCodeRuleModal);
