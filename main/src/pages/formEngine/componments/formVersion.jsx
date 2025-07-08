import { connect } from 'dva';
import { Modal, Table, Space, Switch, Menu, Dropdown } from 'antd';
import _ from 'lodash';
import { history } from 'umi';
import FormTable from './formTable';
import BusinessAtt from './businessAtt';
import IPagination from '../../../componments/public/iPagination';
import ColumnDragTable from '../../../componments/columnDragTable';
import { DownOutlined } from '@ant-design/icons';
import React from 'react'
import './formVersion.less'
class FormVersion extends React.Component {
  componentDidMount() {
    this.getFormVersions(0);
  }

  getFormVersions(start) {
    const { dispatch, formId } = this.props;
    dispatch({
      type: 'formEngine/getFormVersions',
      payload: {
        start,
        limit: 10,
        formId,
      },
    });
  }
  onChangeMain(deployFormId, version, checked) {
    const { dispatch } = this.props;
    if (checked) {
      dispatch({
        type: 'formEngine/setMainVersion',
        payload: {
          deployFormId,
          version: version,
        },
      });
    }
  }

  onEdit(formId, version, router) {
    let path = `/support/designer/${router}?formId=${formId}&version=${version}`;
    window.open(`#${path}`, '_blank');
  }

  onTable(deployFormId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'formEngine/updateStates',
      payload: {
        ftVisible: true,
        currentDeployFormId: deployFormId,
      },
    });
  }
  onBusiness(deployFormId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'formEngine/updateStates',
      payload: {
        fbVisible: true,
        currentDeployFormId: deployFormId,
      },
    });
  }

  onPrintView(record) {
    let path = `/support/formEngine/templateEditor?formId=${record.formId}&version=${record.edition}`;
    window.open(`#${path}`, '_blank');
  }
  onOperatingMoreClick = ({ key }, record) => {
    const {
      formId,
    } = this.props;
    switch (key) {
      case 'table': //数据源关联情况
        this.onTable(record.deployFormId);
        break;
      case 'business': //业务应用关联情况
        this.onBusiness(record.deployFormId);
        break;
      case 'print': //打印设置
        this.onPrintView(record);
        break;
      case 'appDesign': //APP设计
        this.onEdit(formId, record.edition,'appDesigner');
      break;
      default:
        break;
    }
  };
  OperatingMoreMenu = record => {
    return (
      <Menu
        onClick={e => {
          this.onOperatingMoreClick(e, record);
        }}
      >
        <Menu.Item key="table">数据源关联情况</Menu.Item>
        <Menu.Item key="business">业务应用关联情况</Menu.Item>
        <Menu.Item key="print">打印设置</Menu.Item>
        <Menu.Item key="appDesign">APP设计</Menu.Item>
      </Menu>
    );
  };

  render() {
    const {
      fvIds,
      fvReturnCount,
      formVersions,
      fvCurrentPage,
      loading,
      onCancel,
      onDelete,
      formId,
      currentDeployFormId,
      ftVisible,
      mainVersion,
      fbVisible,
      ftLimit,
      fvLimit,
    } = this.props;
    console.log('ftVisible', ftVisible);
    const tableProps = {
      rowKey: 'deployFormId',
      columns: [
        {
          title: '名称',
          dataIndex: 'formName',
          fixed: 'left'
        },
        {
          title: '标志键',
          dataIndex: 'formCode',
        },
        {
          title: '状态',
          dataIndex: 'isDeploy',
          render: (text, record) => {
            return (
              <div style={{ display: 'flex',width:'60px' }}>
                <div style={{ 'margin-left': '10px' }}>
                  {text == '0' ? '未发布' : '已发布'}
                </div>
              </div>
            );
          },
          width: '60px'
        },
        {
          title: '版本号',
          dataIndex: 'edition',
        },
        {
          title: '设为主版本',
          dataIndex: 'isMain',
          render: (text, record) => {
            return (
              <Switch
                checked={record.edition == mainVersion}
                onChange={this.onChangeMain.bind(
                  this,
                  record.deployFormId,
                  record.edition,
                )}
              />
            );
          }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          render: (text, record) => {
            return (
              <div className='operation_group'>
                <Space>
                  {record.version != mainVersion ||
                  (fvReturnCount == 1 && record.edition == mainVersion) ? (
                    <a onClick={onDelete.bind(this, formId, record.edition)}>
                      删除
                    </a>
                  ) : (
                    ''
                  )}
                  <a onClick={this.onEdit.bind(this, formId, record.edition,'formDesigner')}>
                    设计
                  </a>

                  <Dropdown
                    overlay={this.OperatingMoreMenu(record)}
                    trigger={['click']}
                  >
                    <a
                      className="ant-dropdown-link"
                      onClick={e => e.preventDefault()}
                    >
                      更多 <DownOutlined />
                    </a>
                  </Dropdown>
                </Space>
              </div>
            );
          },
        },
      ],
      dataSource: formVersions,
      pagination: false,
      rowSelection: {
        selectedRowKeys: fvIds,
        onChange: (selectedRowKeys, selectedRows) => {
          const { dispatch } = this.props;
          dispatch({
            type: 'formEngine/updateStates',
            payload: {
              fvIds: selectedRowKeys,
            },
          });
        },
      },
      scroll: formVersions.length ? { y: `calc(100% - 52px)`,x:'auto' } : {},
    };
    const pageProps = {
      total: fvReturnCount,
      pageSize: fvLimit,
      current: fvCurrentPage,
      onChange: (page, size) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'formEngine/updateStates',
          payload: {
            fvLimit: size,
            fvCurrentPage: page,
          },
        });
        this.getFormVersions(page, size);
      },
      isRefresh: true,
      refreshDataFn: () => {
        this.getFormVersions(fvCurrentPage, fvLimit);
      },
      style: {
        position: 'unset',
      },
    };
    return (
      <Modal
        visible={true}
        footer={false}
        width={800}
        title={'版本详情'}
        onCancel={onCancel}
        maskClosable={false}
        mask={false}
        centered
        getContainer={() => {
          return document.getElementById('formEngine_container')||false;
        }}
        className='modal_table'
      >
        <ColumnDragTable {...tableProps} />
        <IPagination {...pageProps} />
        {ftVisible && (
          <FormTable deployFormId={currentDeployFormId} ftLimit={ftLimit} />
        )}
        {fbVisible && <BusinessAtt deployFormId={currentDeployFormId} />}
      </Modal>
    );
  }
}

export default connect(({ loading, formEngine }) => ({
  ...formEngine,
  loading,
}))(FormVersion);
