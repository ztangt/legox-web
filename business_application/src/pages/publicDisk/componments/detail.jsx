/*
 * @Author: gaohy gaohy@suirui.com
 * @Date: 2022-04-28 17:41:06
 * @LastEditors: gaohy gaohy@suirui.com
 * @LastEditTime: 2022-05-20 16:14:55
 * @FilePath: \WPX\business_application\src\pages\publicDisk\componments\detail.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { connect } from 'dva';
import { Modal, Button, Table } from 'antd';
import {
  EyeOutlined,
  DownloadOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { dataFormat } from '../../../util/util';
import styles from './list.less';
import IPagination from '../../../componments/public/iPagination';
import GlobalModal from '../../../componments/GlobalModal';
import ColumnDragTable from '../../../componments/columnDragTable';
function Detail({ dispatch, publicDisk }) {
  const {
    detailVisible,
    detailPublic,
    detailList,
    detailreturnCount,
    detailStart,
    detailLimit,
    id,
    detailCurrentPage,
  } = publicDisk;

  const closed = () => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        detailVisible: false,
      },
    });
  };

  const detailPageChange = (page, pageSize) => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        detailStart: page,
        detailLimit: pageSize,
      },
    });
  };

  const columnss = [
    {
      title: '操作详情',
      dataIndex: 'operationDescribe',
      key: 'operationDescribe',
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => <div>{dataFormat(text, 'YYYY-MM-DD HH:mm:ss')}</div>,
    },
    {
      title: '操作用户',
      dataIndex: 'createUserName',
      key: 'createUserName',
    },
  ];

  return (
    <GlobalModal
      onCancel={closed}
      title="详情"
      widthType={2}
      className={styles.detailModal}
      visible={detailVisible}
      mask={false}
        getContainer={() => {
          return document.getElementById('container_public')||false;
        }}
      footer={[
        <Button onClick={closed} className={styles.button_width} type="primary">
          关闭
        </Button>,
      ]}
    >
      <table className={styles.file}>
        <tr>
          <td title={detailPublic.cloudDiskName}>
            文件名称：{detailPublic.cloudDiskName}
          </td>
          {/* <td title={detailPublic.cloudDiskSize}>文件大小：{`${detailPublic.cloudDiskSize / 1024 / 1024 >= 1024 ? `${(detailPublic.cloudDiskSize / 1024 / 1024 / 1024).toFixed(2)}GB` : `${(detailPublic.cloudDiskSize / 1024 / 1024).toFixed(2)}MB`}`}</td> */}
          <td title={(`${( detailPublic.cloudDiskSize == null?0:detailPublic.cloudDiskSize/1024).toFixed(2)}KB`)}>
            文件大小：
            {`${
              detailPublic.cloudDiskSize == null
                ? '0'
                : (detailPublic.cloudDiskSize / 1024).toFixed(2)
            }KB`}
          </td>
        </tr>
        <tr>
          <td title={detailPublic.creatUserName}>
            创建用户：{detailPublic.createUserName}
          </td>
          <td title={detailPublic.creatTime}>
            创建时间：
            {dataFormat(detailPublic.createTime, 'YYYY-MM-DD HH:mm:ss')}
          </td>
        </tr>
        <tr>
          <td title={detailPublic.downNum}>下载次数：{detailPublic.downNum}</td>
          <td>
            拥有权限：&emsp;{detailPublic.visual == 1 ? <EyeOutlined /> : ''}
            &emsp;{detailPublic.download == 1 ? <DownloadOutlined /> : ''}&emsp;
            {detailPublic.see == 1 ? <MenuUnfoldOutlined /> : ''}
          </td>
        </tr>
      </table>
      <ColumnDragTable
        rowKey="id"
        columns={columnss}
        dataSource={detailList}
        pagination={false}
        scroll={{ y: 'calc(100% - 185px)' }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '0',
          width: '90%',
        }}
      >
        <IPagination
          current={detailStart}
          total={detailreturnCount}
          onChange={detailPageChange}
          pageSize={detailLimit}
          isRefresh={true}
          showSizeChanger
          showQuickJumper
          refreshDataFn={()=>{
            dispatch({
              type: 'publicDisk/getDetailPagingMessage_CommonDisk',
              payload: {
                id: id,
                start: 1,
                limit: detailLimit,
              },
            });

            dispatch({
              type: 'publicDisk/updateStates',
              payload: {
                detailStart: 1,
              },
            });
          }}
        />
      </div>
    </GlobalModal>
  );
}

export default connect(({ publicDisk }) => ({
  publicDisk,
}))(Detail);
