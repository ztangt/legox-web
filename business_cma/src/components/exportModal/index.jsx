import { Button, DatePicker, Form, Input, message, Select } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import { useState } from 'react';
import { history } from 'umi';
import GlobalModal from '../GlobalModal';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

function exportModal({
    dispatch,
    bizSolId,
    columns,
    listColumnCodes,
    fileType,
    exportSearchWord,
    selectedRowKeys,
    setExportVisible,
    fileName, //文件名
    id,
}) {
    // console.log(bizSolId, '---->bizSolid', 11111);
    // console.log(columns, '---->columns', 222222);
    // console.log(listColumnCodes, '---->listColumnCodes', 333333);
    // console.log(fileType, '---->fileType', 444444);
    // console.log(exportSearchWord, '---->exportSearchWord', 5555555, 1000000);
    // console.log(selectedRowKeys, '---->selectedRowKeys', 66666666);
    // console.log(setExportVisible, '---->setExportVisible', 77777777);

    const [form] = Form.useForm();
    let timeStamp = dayjs().format('YYYYMMDDHHmm');
    const [initialValues, setInitialValues] = useState({
        fileName: `${fileName || '文件名称'}${timeStamp}`,
        exportFileType: '1',
        exportDataType: '1',
    });

    const [excelVal, setExcelVal] = useState('1');
    const [dates, setDates] = useState(null);
    const [value, setValue] = useState(null);

    const disabledDate = (current) => {
        if (!dates) {
            return false;
        }
        const tooLate = dates[0] && current.diff(dates[0], 'days') > 365;
        const tooEarly = dates[1] && dates[1].diff(current, 'days') > 365;
        return !!tooEarly || !!tooLate;
    };

    const onOpenChange = (open) => {
        if (open) {
            setDates([null, null]);
        } else {
            setDates(null);
        }
    };

    function generateColJson() {
        const colJson = {};
        let tmp = columns;
        if (tmp && listColumnCodes.length) {
            tmp = tmp.filter((obj) => listColumnCodes.includes(obj.columnCode));
        }
        for (let i = 0; i < tmp.length; i++) {
            colJson[tmp[i].columnCode] = tmp[i].columnName;
        }
        return JSON.stringify(colJson);
    }

    function onCancel() {
        setExportVisible(false);
    }

    const onFinish = (values) => {
        const { fileName, exportFileType, exportDataType, startAndEndTime } = values;
        if (selectedRowKeys.length === 0 && exportDataType == 2) {
            message.warning('请至少选中一条数据');
            return;
        }
        let startTime = '';
        let endTime = '';
        if (startAndEndTime && startAndEndTime.length) {
            startTime = dayjs(startAndEndTime[0]).unix();
            endTime = dayjs(startAndEndTime[1]).unix();
        }
        dispatch({
            type: 'cmaExport/exportFile',
            payload: {
                fileName,
                exportFileType,
                exportDataType,
                startTime,
                endTime,
                bizSolId,
                primaryKeyIds: selectedRowKeys.toString(),
                colJson: generateColJson(),
                searchWord: exportSearchWord,
                fileType,
                serviceName: 'REPORT',
            },
            callback: () => {
                message.success('导出成功');
                setExportVisible(false);
                history.push({
                    pathname: '/exportList',
                });
            },
        });
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onValuesChange = (changedValues, allValues) => {
        console.log('onValuesChange:', changedValues, allValues);
        setInitialValues(allValues);
    };

    return (
        <GlobalModal
            title={'导出'}
            visible={true}
            widthType={1}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            getContainer={() => {
                return id
                    ? document.getElementById(id)
                    : document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`);
            }}
            footer={null}
        >
            <Form
                initialValues={initialValues}
                form={form}
                onValuesChange={onValuesChange}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <FormItem
                    label="文件名"
                    name="fileName"
                    rules={[
                        {
                            required: true,
                            message: '请输入文件名，长度不大于50个字符',
                            max: 50,
                        },
                    ]}
                >
                    <Input />
                </FormItem>

                <FormItem
                    label="文件类型"
                    name="exportFileType"
                    rules={[
                        {
                            required: true,
                            message: '请选择文件类型!',
                        },
                    ]}
                >
                    <Select>
                        <Select.Option value="1">excel</Select.Option>
                    </Select>
                </FormItem>

                <FormItem
                    label="导出数据"
                    name="exportDataType"
                    rules={[
                        {
                            required: true,
                            message: '请选择要导出的数据!',
                        },
                    ]}
                >
                    <Select>
                        <Select.Option value="1">列表全部记录</Select.Option>
                        <Select.Option value="2">列表选中记录</Select.Option>
                    </Select>
                </FormItem>

                {initialValues.exportDataType === '1' && (
                    <FormItem
                        label="起止时间"
                        name="startAndEndTime"
                        rules={[
                            {
                                required: true,
                                message: '请输入起止时间!',
                            },
                        ]}
                    >
                        <RangePicker
                            // picker="month"
                            value={dates || value}
                            disabledDate={disabledDate}
                            onCalendarChange={(val) => setDates(val)}
                            onChange={(val) => {
                                val[0].startOf('day');
                                val[1].endOf('day');
                                setValue(val);
                            }}
                            onOpenChange={onOpenChange}
                        />
                    </FormItem>
                )}

                <FormItem
                    wrapperCol={{
                        offset: 10,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        导出
                    </Button>
                </FormItem>
            </Form>
        </GlobalModal>
    );
}

export default connect(({ cmaExport }) => ({
    cmaExport,
}))(exportModal);
