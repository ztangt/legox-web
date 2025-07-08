import { connect } from 'dva';
import { useContext, useRef, useState, useEffect } from 'react';
import { Select, Modal, Input, Table, Tabs, Button, Form } from 'antd';
import pinyinUtil from '../../../../service/pinyinUtil';
import styles from './buttonList.less';
import {
  optionsColumns,
  detailColumns,
  EditableRow,
  EditableCell,
} from './modalConfig';

const TabPane = Tabs.TabPane;

function APIDataModal({
  isAPIModalVisible,
  setIsAPIModalVisible,
  dispatch,
  templateEditor,
}) {
  const {} = templateEditor;

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const [activeKey, setActiveKey] = useState('detail');
  // 编码返填
  const [codeValue, setCodeValue] = useState('');
  // 字段信息数据
  const [dataSource, setDataSource] = useState([
    {
      key: 0,
      name: 'Edward King 0',
      age: '32',
      dec: 'London, Park Lane no. 0',
    },
    {
      key: 1,
      name: 'Edward King 1',
      age: '32',
      dec: 'London, Park Lane no. 1',
    },
  ]);

  const [detailSource, setDetailSource] = useState([
    { key: 1, code: 1, name: 'zc' },
    { key: 2, code: 2, name: 'zc' },
  ]);

  // 添加的下标
  const [count, setCount] = useState(2);

  const handleOk = () => {
    setIsAPIModalVisible(false);
  };
  const handleCancel = () => {
    setIsAPIModalVisible(false);
  };

  const onTabChange = value => {
    setActiveKey(value);
  };
  // 请求方式
  const handleMethodChange = value => {
    console.log('val', value);
  };
  // 删除
  const handleDelete = key => {
    const newData = dataSource.filter(item => item.key !== key);
    setDataSource(newData);
  };
  // 添加
  const handleAdd = () => {
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: '32',
      dec: `London, Park Lane no. ${count}`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };
  // 编辑表格保存
  const handleSave = row => {
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };
  //
  const handleDetailSave = row => {
    const newData = [...detailSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDetailSource(newData);
  };

  const transFormNameChange = e => {
    let name = `${pinyinUtil.getFirstLetter(e.target.value)}`;

    setCodeValue(name);
  };

  console.log('dataSource', dataSource);

  return (
    <Modal
      title="API数据集"
      visible={isAPIModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={900}
      style={{ padding: '10px' }}
    >
      <div className={styles.APIDataWarp}>
        <div className={styles.filterSel}>
          <div className={styles.item}>
            <div className={styles.label}>名称：</div>
            <Input onChange={e => transFormNameChange(e)} />
          </div>

          <div className={styles.item}>
            <div className={styles.label}>编码：</div>
            <Input value={codeValue} />
          </div>

          <div className={styles.item}>
            <div className={styles.longLabel}>请求方式：</div>
            <Select
              defaultValue=""
              onChange={handleMethodChange}
              style={{ width: '150px' }}
            >
              <Select.Option value="">请选择</Select.Option>
              <Select.Option value="PUT">PUT</Select.Option>
              <Select.Option value="GET">GET</Select.Option>
              <Select.Option value="DELETE">DELETE</Select.Option>
              <Select.Option value="POST">POST</Select.Option>
            </Select>
          </div>
          <div className={styles.item}>
            <div className={styles.largeLabel}>API地址: </div>
            <Input />
            <Button className={styles.btn}>API解析</Button>
          </div>
        </div>

        <Tabs
          defaultActiveKey={'detail'}
          activeKey={activeKey}
          onChange={onTabChange}
        >
          <TabPane tab="字段明细" key="detail">
            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              dataSource={detailSource}
              bordered
              columns={detailColumns({ handleDetailSave })}
              scroll={{ y: 'calc(100vh - 600px)' }}
            />
            ;
          </TabPane>
          <TabPane tab="参数信息" key="options">
            <Button style={{ marginBottom: '20px' }} onClick={handleAdd}>
              新增
            </Button>

            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={dataSource}
              columns={optionsColumns({ dataSource, handleDelete, handleSave })}
              scroll={{ y: 'calc(100vh - 600px)' }}
            />
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  );
}

export default connect(({ templateEditor }) => ({
  templateEditor,
}))(APIDataModal);
