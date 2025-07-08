import commonStyles from '@/common.less';
import MenuButton from '@/components/menuButton';
import { useModel } from '@@/exports';
import { Button, Form, Input, Select } from 'antd';
import { connect } from 'dva';
import { dateList } from './config';

const FormItem = Form.Item;
const OriginData = ({
    dispatch,
    getList,
    rowKeys,
    rows,
    dataEntryIssued,
    onImportClick,
    pageId,
    sateType,
    tabButton,
}) => {
    const { bizSolId } = useModel('@@qiankunStateFromMaster');
    const { currentPage, formInfo } = dataEntryIssued;
    console.log('pageId', pageId, sateType);

    const [form] = Form.useForm();
    const onSearch = () => {
        let values = form.getFieldsValue();
        dispatch({ type: 'dataEntryIssued/updateStates', payload: { formInfo: { ...formInfo, ...values } } });
        getList(1);
    };

    //提供给按钮调用的方法
    const getData = () => {
        let leftTreInfo = [];
        let reportYear = dataEntryIssued.formInfo.reportYear;

        let newPageId = dataEntryIssued.pageId;
        let newListType = dataEntryIssued.listType;
        dispatch({
            type: 'dataEntryIssued/getState',
            callback: ({ unitCheckInfo, listType, formInfo, pageId }) => {
                leftTreInfo = unitCheckInfo || [];
                reportYear = formInfo.reportYear;
                newPageId = pageId;
                newListType = listType;
            },
        });
        console.log(
            {
                leftTreInfo,
                listInfo: rows,
                listInfoKeys: rowKeys,
                listType: newListType,
                pageId: newPageId,
                reportYear,
            },
            '--->调用getData传参数',
        );
        return {
            leftTreInfo,
            listInfo: rows,
            listInfoKeys: rowKeys,
            listType: newListType,
            reportYear,
            pageId: newPageId,
        };
    };

    //提供给按钮调用的方法-重新获取列表
    const getListModelData = () => {
        getList(currentPage);
    };

    return (
        <div>
            <div className="flex flex_justify_between  flex_align_start ">
                <div className={'flex flex_justify_between'}>
                    <Form
                        form={form}
                        colon={false}
                        className={[commonStyles.ui_form_box, 'flex', 'flex_wrap', 'flex_1']}
                        initialValues={{ reportYear: dateList[0].value, dataType: 1 }}
                    >
                        <FormItem name={'reportYear'} style={{ width: 100 }}>
                            <Select
                                placeholder={'年度'}
                                options={dateList}
                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            />
                        </FormItem>
                        {pageId == 1 && sateType == 1 ? (
                            <FormItem name={'dataType'} style={{ width: 100 }}>
                                <Select
                                    placeholder={'数据类型'}
                                    options={[
                                        { label: '待下发', value: 1 },
                                        { label: '已下发', value: 2 },
                                    ]}
                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                />
                            </FormItem>
                        ) : (
                            ''
                        )}
                        <FormItem name={'searchWord'} style={{ width: 180 }}>
                            <Input placeholder={'请输入关键字'}></Input>
                        </FormItem>
                        <Button onClick={onSearch} className={'mb8 ml8 mr8'}>
                            查询
                        </Button>
                    </Form>
                </div>
                <div className="flex_1 flex flex_justify_end mr8">
                    <MenuButton
                        bizSolId={bizSolId}
                        getData={getData}
                        getListModelData={getListModelData}
                        onImportClick={onImportClick}
                        sateType={sateType}
                        tabButton={tabButton}
                    />
                </div>
            </div>
        </div>
    );
};

export default connect(({ dataEntryIssued }) => ({
    dataEntryIssued,
}))(OriginData);
