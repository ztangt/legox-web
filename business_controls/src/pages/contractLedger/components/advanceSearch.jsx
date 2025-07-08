import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { useEffect, useState } from 'react';
import searchIcon from '../../../../public/assets/high_search.svg';
import styles from './advanceSearch.less';
import ExportModal from './exportModal.jsx';

const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 16,
  },
};

const TotalMoneyComponents = ({ value, onChange }) => {
  const [moneyStart, setMoneyStart] = useState(0);
  const [moneyEnd, setmoneyEnd] = useState(0);
  const onChangePre = (value) => {
    if (value || value === 0) {
      setMoneyStart(value);
      onChange && onChange(`${value}-${moneyEnd}`);
    }
  };
  const onChangeCur = (value) => {
    if (value || value === 0) {
      setmoneyEnd(value);
      onChange && onChange(`${moneyStart}-${value}`);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <InputNumber
        min={0}
        max={999999999}
        value={moneyStart}
        style={{ width: '46%' }}
        onChange={onChangePre}
      />{' '}
      至{' '}
      <InputNumber
        min={0}
        max={999999999}
        value={moneyEnd}
        style={{ width: '46%' }}
        onChange={onChangeCur}
      />
    </div>
  );
};

function AdvanceSearch({
  dispatch,
  contractLedger,
  tabVal,
  onAdvanceChange,
  onSearchValChange,
}) {
  const [form] = Form.useForm();
  const [showAdvSearch, setShowAdvSearch] = useState(false);

  const [exportVisible, setExportVisible] = useState(false); //导出弹框

  const {
    start,
    limit,
    purchaseMethodOptions,
    contractStateOptions,
    contractTypeOptions,
    selectedRowKeys,
  } = contractLedger;

  const onSearch = (val) => {
    dispatch({
      type: 'contractLedger/updateStates',
      payload: {
        contractNumber: val,
      },
    });
    dispatch({
      type: 'contractLedger/getContractLedgerList',
      payload: {
        contractNumber: val,
        contractKindTldt_: tabVal,
        start,
        limit,
        logicCode: 'HT100001',
      },
    });
  };

  const onFinish = (val) => {
    console.log('dddddddddddd', val);
    const newVal = Object.keys(val).reduce((pre, cur) => {
      if (val[cur]) {
        pre[cur] =
          cur === 'contractSignDate'
            ? moment(val[cur]).startOf('day').unix()
            : val[cur];
      }
      return pre;
    }, {});
    onSearchValChange(newVal);
    dispatch({
      type: 'contractLedger/getContractLedgerList',
      payload: {
        ...newVal,
        start,
        limit,
        contractKindTldt_: tabVal,
        logicCode: 'HT100001',
      },
    });
  };

  const onFinishFailed = () => {
    console.log('ddddddddddd');
  };

  useEffect(() => {
    onAdvanceChange(showAdvSearch);
  }, [showAdvSearch]);

  return (
    <div className={styles.warp}>
      <div className={styles.searchWarp}>
        <div>
          <Input.Search
            className={styles.searchInput}
            placeholder="请输入合同编号"
            allowClear
            size="middle"
            onSearch={onSearch}
            enterButton={
              <img src={searchIcon} style={{ margin: '0 8px 2px 2px' }} />
            }
          />
          <Button
            style={{ marginLeft: '10px' }}
            onClick={() => {
              setShowAdvSearch(true);
            }}
          >
            高级查询
          </Button>
        </div>

        <div>
          <Button
            onClick={() => {
              // if (selectedRowKeys.length > 0) {
              setExportVisible(true);
              // } else {
              //   message.warning('请至少选中一条数据');
              //   return;
              // }
            }}
          >
            导出
          </Button>
        </div>
      </div>

      {exportVisible && (
        <ExportModal
          usedYear={String(new Date().getFullYear())}
          fileType={'CONTRACT'}
          selectedRowKeys={selectedRowKeys}
          exportVisible={exportVisible}
          setExportVisible={setExportVisible}
        />
      )}

      {showAdvSearch && (
        <div className={styles.advSearch}>
          <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            style={{ width: '100%', paddingRight: 8 }}
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
                <Form.Item label="合同编号" name="contractNumber">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="合同名称" name="contractName">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="合同乙方" name="partyB">
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
                <Form.Item label="拟稿部门" name="registerDeptId_">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="合同签订日期" name="contractSignDate">
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="合同类型" name="contractTypeTldt_">
                  <Select options={contractTypeOptions} />
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
                <Form.Item label="采购方式" name="purchaseMethodTldt_">
                  <Select options={purchaseMethodOptions} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="合同金额" name="totalMoney">
                  <TotalMoneyComponents />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="合同状态" name="contractStateTldt_">
                  <Select options={contractStateOptions} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item {...tailLayout}>
              <Button htmlType="submit">查询</Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  onFinish({});
                }}
                style={{ margin: '0 30px' }}
              >
                重置
              </Button>
              <Button onClick={() => setShowAdvSearch(false)}>收起</Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
}

export default connect(({ contractLedger }) => ({
  contractLedger,
}))(AdvanceSearch);
