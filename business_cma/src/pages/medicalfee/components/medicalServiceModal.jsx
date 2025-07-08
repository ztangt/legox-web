import { Modal, Form, Input, Button, Select, Switch, Table, InputNumber } from 'antd';
import { connect } from 'umi';
import { useEffect } from 'react';
import styles from '../index.less';
import GlobalModal from '../../../components/GlobalModal';
import ColumnDragTable from '../../../components/columnDragTable';
import BigNumber from 'bignumber.js';
function Index({ dispatch, medicalfee, form }) {
    const { medicalRegistration, currentReimburseNo, serviceChargeChangeData, serviceChargeData } = medicalfee;
    console.log('serviceChargeChangeData', serviceChargeChangeData, serviceChargeData);
    useEffect(() => {}, []);

    const handelCanel = () => {
        dispatch({
            type: 'medicalfee/updateStates',
            payload: {
                medicalServiceModal: false,
                serviceChargeChangeData: serviceChargeData, //取消填写的数据
            },
        });
    };
    const onOk = () => {
        medicalRegistration['medicalServiceList'] = serviceChargeChangeData;
        form.setFieldsValue({
            medicalServiceFee: serviceChargeChangeData[serviceChargeChangeData?.length - 1]['reimbursableAmount'],
        });
        dispatch({
            type: 'medicalfee/updateStates',
            payload: {
                medicalServiceModal: false,
                serviceChargeData: serviceChargeChangeData, //填写的数据
                medicalRegistration,
            },
        });
    };
    //票据及金额的改变
    const onValueChange = (key, index, value) => {
        if (value) {
            serviceChargeChangeData[index][key] = value;
            dispatch({
                type: 'medicalfee/updateStates',
                payload: {
                    serviceChargeChangeData,
                },
            });
        }
    };
    const onBlur = (key, index, e) => {
        if (e.target.value) {
            if (medicalRegistration?.medicalServiceCalculateManually != 1) {
                //非手算
                if (key == 'billCount') {
                    var cmaMedicalServiceAmount = serviceChargeChangeData[index]['cmaMedicalServiceAmount'];
                    serviceChargeChangeData[index]['reimbursableAmount'] = cmaMedicalServiceAmount
                        ? BigNumber(e.target.value).times(cmaMedicalServiceAmount)
                        : ''; //可报销金额
                } else {
                    serviceChargeChangeData[index][key] = e.target.value; //其他金额
                }
            } else {
                serviceChargeChangeData[index][key] = e.target.value; //其他金额
            }
            var totalNum = 0; //合计张数
            var totalAmount = 0; //合计金额
            for (let i = 0; i < serviceChargeChangeData.length - 1; i++) {
                const element = serviceChargeChangeData[i];
                totalNum = BigNumber(totalNum).plus(element?.billCount || 0);
                // if(key == 'reimbursableAmount'&&index==i){
                //   totalAmount = BigNumber(totalAmount).plus(e.target.value || 0);
                // }else{
                totalAmount = BigNumber(totalAmount).plus(element?.reimbursableAmount || 0);
                // }
            }
            serviceChargeChangeData[serviceChargeChangeData?.length - 1]['reimbursableAmount'] = totalAmount;
            serviceChargeChangeData[serviceChargeChangeData?.length - 1]['billCount'] = totalNum;
            dispatch({
                type: 'medicalfee/updateStates',
                payload: {
                    serviceChargeChangeData,
                },
            });
        }
    };
    //改变是否手算按钮
    const onChangeSwitch = (checked) => {
        medicalRegistration['medicalServiceCalculateManually'] = checked ? 1 : 0;
        dispatch({
            type: 'medicalfee/updateStates',
            payload: {
                medicalRegistration,
                serviceChargeChangeData: serviceChargeData, //取消填写的数据
            },
        });
    };

    const tableProps = {
        columns: [
            {
                title: '医院性质',
                dataIndex: 'cmaHospitalNatureRankName',
                render: (value, row, index) => {
                    const obj = {
                        children: value,
                        props: {},
                    };
                    if (row.isRowCol) {
                        obj.props.rowSpan = row.rowSpanNum;
                    } else {
                        obj.props.rowSpan = 0;
                    }
                    if (row.cmaHospitalNatureRankName == '其他') {
                        obj.props.colSpan = 3;
                        obj.props.rowSpan = 1;
                    }
                    if (row.cmaHospitalNatureRankName == '合计') {
                        obj.props.colSpan = 1;
                        obj.props.rowSpan = 1;
                    }
                    return obj;
                },
            },
            {
                title: '医事服务费类别',
                dataIndex: 'cmaMedicalServiceAmount',
                render: (value, row, index) => {
                    const obj = {
                        children: value,
                        props: {},
                    };
                    if (row.cmaHospitalNatureRankName == '其他') {
                        obj.props.colSpan = 0;
                        obj.props.rowSpan = 0;
                    }
                    if (row.cmaHospitalNatureRankName == '合计') {
                        obj.props.colSpan = 1;
                        obj.props.rowSpan = 1;
                    }
                    return obj;
                },
            },
            {
                title: '票据张数',
                dataIndex: 'billCount',
                render: (value, row, index) => {
                    const obj = {
                        children: (
                            <InputNumber
                                key={index}
                                value={value}
                                onChange={onValueChange.bind(this, 'billCount', index)}
                                onBlur={onBlur.bind(this, 'billCount', index)}
                            />
                        ),
                        props: {},
                    };
                    if (row.cmaHospitalNatureRankName == '其他') {
                        obj.props.colSpan = 0;
                        obj.props.rowSpan = 0;
                    }
                    if (row.cmaHospitalNatureRankName == '合计') {
                        obj.props.colSpan = 1;
                        obj.props.rowSpan = 1;
                    }
                    return obj;
                },
            },
            {
                title: '可报销金额',
                dataIndex: 'reimbursableAmount',
                render: (value, row, index) => {
                    const obj = {
                        children: (
                            <InputNumber
                                key={index}
                                value={value}
                                onChange={onValueChange.bind(this, 'reimbursableAmount', index)}
                                onBlur={
                                    onBlur.bind(this, 'reimbursableAmount', index)
                                    // index == serviceChargeChangeData?.length - 2
                                    //     ? onBlur.bind(this, 'reimbursableAmount', index)
                                    //     : () => {}
                                }
                            />
                        ),
                        props: {},
                    };
                    return obj;
                },
            },
        ],
        dataSource: serviceChargeChangeData || [],
        pagination: false,
        bordered: true,
    };

    return (
        <GlobalModal
            open={true}
            title={'药费报销单'}
            onCancel={handelCanel}
            maskClosable={false}
            mask={false}
            centered
            modalSize="middle"
            getContainer={() => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            }}
            footer={[
                <Button key="cancel" onClick={handelCanel.bind(this)}>
                    取消
                </Button>,
                <Button key="submit" type="primary" onClick={onOk.bind(this)}>
                    保存
                </Button>,
            ]}
        >
            <div className={styles.first_text}>
                <span>医疗编号: {medicalRegistration?.medicalNo}</span>
                <span>姓名: {medicalRegistration?.personName}</span>
                <span>人员状态: {medicalRegistration?.cmaPersonnelStatusObjName}</span>
                <span>人员类型: {medicalRegistration?.cmaPersonnelMoldObjName}</span>
            </div>
            <div className={styles.first_text}>
                <a>是否手算:</a>
                <Switch
                    onChange={onChangeSwitch}
                    checked={medicalRegistration?.['medicalServiceCalculateManually'] == 1 ? true : false}
                />
            </div>
            <div className={styles.tableservicelist}>
                <ColumnDragTable
                    taskType="MONITOR"
                    tableLayout="fixed"
                    {...tableProps}
                    className={styles.table_container}
                    scroll={
                        { x: 'auto' }
                        // serviceChargeChangeData?.length
                        //     ? {
                        //           y: 'auto',
                        //           x: 'auto',
                        //       }
                        //     : {x: 'auto'}
                    }
                />
            </div>
            <div className={styles.service_footer_text}>可报销金额=医事服务费报销金额*票据张数</div>
        </GlobalModal>
    );
}
export default connect(({ medicalfee }) => {
    return { medicalfee };
})(Index);
