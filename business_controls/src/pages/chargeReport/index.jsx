import React, { useEffect, useState, useCallback } from 'react';
import { connect, history, useModel } from 'umi';
import {
  Input,
  Button,
  message,
  Select,
  Form,
  Row,
  Col,
  Modal,
  DatePicker,
} from 'antd';
import moment from 'moment';
import BasicsTable from '../../components/basicsTable';
import IPagination from '../../components/public/iPagination';
import { formattingMoney } from '../../util/util';
import {
  BASE_WIDTH,
  ORDER_WIDTH,
  NORM_STATE,
  YES_NO,
  BUDGET_TYPE,
} from '../../util/constant';
import styles from './index.less';
import RelevanceRangModal from './components/relevanceRangModal';

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 16,
  },
};
function ChargeReport({ dispatch, chargeReport, targetWarning }) {
  const { location } = useModel('@@qiankunStateFromMaster');
  const { url } = location.query;
  const columns = [
    {
      key: 'index',
      dataIndex: 'index',
      title: '序号',
      width: ORDER_WIDTH,
      fixed: 'left',
      render: (text, record, index) => <a>{index + 1}</a>,
    },
    {
      key: 'LABOR_NAME',
      dataIndex: 'LABOR_NAME',
      title: '姓名',
      fixed: 'left',
      width: BASE_WIDTH,
    },
    {
      key: 'DOCUMENT_TYPE_TLDT_',
      dataIndex: 'DOCUMENT_TYPE_TLDT_',
      title: '证件类型',
      width: BASE_WIDTH * 1.5,
      render: (text, record) => <span>{dictInfo?.[text] || text}</span>,
    },
    {
      key: 'DOCUMENT_NUM',
      dataIndex: 'DOCUMENT_NUM',
      title: '证件号码',
      width: BASE_WIDTH * 1.5,
      // render: (text, record) => (
      //   <span className={!record.isSatisfyWarning ? styles.redColor : ''}>
      //     {text}
      //   </span>
      // ),
    },
    {
      key: 'PAYABLE_AMOUNT',
      dataIndex: 'PAYABLE_AMOUNT',
      title: '本月累计应发金额',
      width: BASE_WIDTH * 1.5,
      align: 'right',
      // render: (text, record) => (
      //   <span className={!record.isSatisfyWarning ? styles.redColor : ''}>
      //     {text}
      //   </span>
      // ),
    },
    {
      key: 'TAX_PAYABLE_AMOUNT',
      dataIndex: 'TAX_PAYABLE_AMOUNT',
      title: '本月累计扣税额',
      width: BASE_WIDTH,
      align: 'right',
      // render: (text, record) => (
      //   <span className={!record.isSatisfyWarning ? styles.redColor : ''}>
      //     {formattingMoney(text)}
      //   </span>
      // ),
    },
    {
      key: 'PAID_OUT_AMOUNT',
      dataIndex: 'PAID_OUT_AMOUNT',
      title: '本月实发金额',
      width: BASE_WIDTH,
      align: 'right',
      // render: (text, record) => (
      //   <a
      //     onClick={(e) => {
      //       e.stopPropagation();
      //       onOpenNewPage('FREEZE_BUDGET', record.NORM_CODE, record.ID);
      //     }}
      //   >
      //     {formattingMoney(text)}
      //   </a>
      // ),
    },
    {
      key: 'CHARGE_FOR_REMITTANCES',
      dataIndex: 'CHARGE_FOR_REMITTANCES',
      title: '汇款手续费',
      width: BASE_WIDTH,
      align: 'right',
      // render: (text, record) => (
      //   <a
      //     onClick={(e) => {
      //       e.stopPropagation();
      //       onOpenNewPage('EXECUTE_BUDGET', record.NORM_CODE, record.ID);
      //     }}
      //   >
      //     {formattingMoney(text)}
      //   </a>
      // ),
    },
    {
      key: 'TOTAL_AMOUNT',
      dataIndex: 'TOTAL_AMOUNT',
      title: '金额合计',
      width: BASE_WIDTH,
      align: 'right',
      // render: (text, record) => (
      //   <span className={!record.isSatisfyWarning ? styles.redColor : ''}>
      //     {formattingMoney(text)}
      //   </span>
      // ),
    },
    {
      key: 'MOBILE_PHONE_NUM',
      dataIndex: 'MOBILE_PHONE_NUM',
      title: '手机号',
      width: BASE_WIDTH,
      // render: (text, record) => (
      //   <span className={!record.isSatisfyWarning ? styles.redColor : ''}>
      //     {formattingMoney(text)}
      //   </span>
      // ),
    },
    {
      key: 'WORK_ORG',
      dataIndex: 'WORK_ORG',
      title: '工作单位',
      width: BASE_WIDTH,
      // render: (text, record) => (
      //   <a
      //     onClick={(e) => {
      //       e.stopPropagation();
      //       onOpenNewPage('WAY_FREEZE_BUDGET', record.NORM_CODE, record.ID);
      //     }}
      //   >
      //     {formattingMoney(text)}
      //   </a>
      // ),
    },
    {
      key: 'PROFESSIONAL_TITLE',
      dataIndex: 'PROFESSIONAL_TITLE',
      title: '职称学历',
      width: BASE_WIDTH,
      // render: (text, record) => (
      //   <a
      //     onClick={(e) => {
      //       e.stopPropagation();
      //       onOpenNewPage('WAY_EXEC_BUDGET', record.NORM_CODE, record.ID);
      //     }}
      //   >
      //     {formattingMoney(text)}
      //   </a>
      // ),
    },
  ];

  const [form] = Form.useForm();
  const {
    currentYear,
    start,
    limit,
    currentHeight,
    sizeFlag,
    dictInfo,
    dictInfoList,
    currentPage,
    returnCount,
    reportList,
    isShowReleveModal,
    orgUserType,
  } = chargeReport;

  console.log('Object.keys(dictInfo).length', Object.keys(dictInfo).length);

  const [time, setTime] = useState(
    Math.round(new Date().getTime() / 1000).toString(),
  );
  const [searchWord, setSearchWord] = useState('');

  const [showMore, setShowMore] = useState(false);
  useEffect(() => {
    dispatch({
      type: 'chargeReport/getDictType',
      payload: {
        dictTypeId: 'LWRYKZJLX',
        showType: 'ALL',
        isTree: '0',
        searchWord: '',
      },
    });
  }, []);
  useEffect(() => {
    limit &&
      Object.keys(dictInfo).length &&
      url === 'chargeReport' &&
      getReportList(time, start, limit, searchWord);
  }, [time, start, limit, dictInfo]);

  const getReportList = (
    time,
    start,
    limit,
    searchWord,
    documentType = '',
    documentNum = '',
    mobilePhoneNum = '',
    workOrg = '',
    professionalTitle = '',
  ) => {
    dispatch({
      type: 'chargeReport/getReportList',
      payload: {
        time,
        start,
        limit,
        searchWord,
        documentType,
        documentNum,
        mobilePhoneNum,
        workOrg,
        professionalTitle,
      },
    });
  };

  const onSearchClick = (value) => {
    setSearchWord(value);
    getReportList(time, start, limit, value);
  };

  const onFinish = (values) => {
    console.log('Success:', values);
    const {
      documentNum,
      documentType,
      mobilePhoneNum,
      professionalTitle,
    } = values;
    getReportList(
      time,
      start,
      limit,
      searchWord,
      documentType,
      documentNum,
      mobilePhoneNum,
      form.getFieldValue(`workOrgid`),
      professionalTitle,
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const setShowModal = (orgUserType, formType) => {
    console.log(orgUserType, formType, form.getFieldValue(`${formType}id`));
    dispatch({
      type: 'chargeReport/updateStates',
      payload: {
        formType,
        isShowReleveModal: true,
        selectedDataIds: form.getFieldValue(`${formType}id`)
          ? form.getFieldValue(`${formType}id`).split(',')
          : [],
        orgUserType,
      },
    });
  };

  const changePage = (nextPage, size) => {
    dispatch({
      type: 'chargeReport/updateStates',
      payload: {
        start: nextPage,
        limit: size,
      },
    });

    getReportList(time, start, limit, searchWord);
  };

  const onMonthChange = (date, dateString) => {
    console.log();
    if (dateString === '') {
      setTime('');
    } else {
      setTime(
        Math.round(new Date(dateString + '-01').getTime() / 1000).toString(),
      );
    }
  };

  return (
    <div className={styles.container} id="chargeReport_id">
      <div className={styles.list_head} id="list_head">
        <div className={styles.header}>
          <div className={styles.search}>
            <DatePicker onChange={onMonthChange} picker="month" />
            <Search
              placeholder="请输入姓名查询"
              onSearch={onSearchClick}
              allowClear
              style={{ width: 220, margin: '0 10px' }}
            />
            <Button onClick={() => setShowMore(true)}>高级查询</Button>
          </div>
        </div>
        {showMore && (
          <div className={styles.more} id="more">
            <Form
              form={form}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              style={{ width: '100%' }}
            >
              <Row
                gutter={{
                  xs: 8,
                  sm: 16,
                  md: 24,
                  lg: 32,
                }}
              >
                <Col span={8}>
                  <Form.Item label="证件类型" name="documentType">
                    <Select
                      placeholder="请选择"
                      style={{
                        width: '100%',
                      }}
                    >
                      {dictInfoList.map((item, index) => {
                        return (
                          <Option value={item.dictInfoCode} key={index}>
                            {item.dictInfoName}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="证件号码" name="documentNum">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="手机号" name="mobilePhoneNum">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row
                gutter={{
                  xs: 8,
                  sm: 16,
                  md: 24,
                  lg: 32,
                }}
              >
                <Col span={8}>
                  <Form.Item label="工作单位" name="workOrg">
                    <Input onClick={() => setShowModal('ORG', 'workOrg')} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="职称学历" name="professionalTitle">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item {...tailLayout}>
                <Button htmlType="submit">查询</Button>
                <Button
                  onClick={() => form.resetFields()}
                  style={{ margin: '0 30px' }}
                >
                  重置
                </Button>
                <Button onClick={() => setShowMore(false)}>取消</Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </div>
      <div>
        <BasicsTable
          listHead="list_head"
          container="dom_container"
          modulesName="chargeReport"
          key={showMore}
          dispatch={dispatch}
          bordered
          columns={columns}
          dataSource={reportList}
          pagination={false}
          scroll={
            reportList.length
              ? {
                  y: currentHeight,
                }
              : {}
          }
        />
      </div>
      <IPagination
        current={Number(currentPage)}
        total={returnCount}
        onChange={changePage}
        pageSize={limit}
        isRefresh={true}
        refreshDataFn={() => {
          getReportList(time, start, limit, searchWord);
        }}
      />
      {isShowReleveModal && (
        <RelevanceRangModal orgUserType={orgUserType} form={form} />
      )}
    </div>
  );
}
export default connect(({ chargeReport, targetWarning }) => ({
  chargeReport,
  targetWarning,
}))(ChargeReport);
