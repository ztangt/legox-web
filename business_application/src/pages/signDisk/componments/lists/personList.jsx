/*
 * @Author: gaohy gaohy@suirui.com
 * @Date: 2022-04-28 17:41:06
 * @LastEditors: gaohy gaohy@suirui.com
 * @LastEditTime: 2022-07-05 13:49:01
 * @FilePath: \WPX\business_application\src\pages\signDisk\componments\lists\personList.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {useState} from 'react'
import { connect } from 'dva';
import { Table } from 'antd';
import IPagination from '../../../../componments/public/iPagination';
import styles from  '../signDisk.less'

function PersonList({ dispatch, signDisk}) {
  const [current,setCurrent] = useState(1)
  const [pageSize,setPageSize] = useState(10)
  const columns = [
    {
      title: '文件名',
      dataIndex: 'title',
      key: 'title'
    }
  ];

  const data = [{
    title: '我的文件',
    key: 0,
    url:[
      {key: 2,title: '个人文件'},
      {key: 0,title: '我的文件'}
    ]
  }, {
    title: '他人分享',
    key: 3,
    url:[
      {key: 2,title: '个人文件'},
      {key: 3,title: '他人分享'}
    ]
  }, {
    title: '我的分享',
    key: 4,
    url:[
      {key: 2,title: '个人文件'},
      {key: 4,title: '我的分享'}
    ]
  }, {
    title: '回收站',
    key: 5,
    url:[
      {key: 2,title: '个人文件'},
      {key: 5,title: '回收站'}
    ]
  }];
  // 个人文件
  const myFilePageChange = (page, pageSize)=>{
    setCurrent(page)
    setPageSize(pageSize)
  }

  return (
    <div className={styles.signDiskPersonList}>
      <Table
        rowKey='id'
        columns={columns}
        dataSource={data}
        pagination={false}
        onRow={record => {
          return {
            onClick: event => {
              dispatch({
                type: 'signDisk/updateStates',
                payload: {
                  selectedKeysValue: record.key,
                  treeId: record.key,
                  selectTreeUrl: record.url
                }
              });
            }
          };
        }}
        style={{ cursor: 'pointer' }}
      />
      <IPagination
         current={current}
         total={Number(data.length)}
         onChange={myFilePageChange}
         pageSize={pageSize}
         isRefresh={true}
         refreshDataFn={() => {
          setCurrent(1)
          setPageSize(pageSize)
         }}
      />
    </div>
  )
};

export default connect(({
  signDisk
}) => ({
  signDisk
}))(PersonList);
