/**
 * @author zhangww
 * @description 通讯录列表
 */
import { connect } from 'dva';
import styles from './addressList.less';
import { useState, useEffect } from 'react';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import { StarOutlined, StarFilled, StarTwoTone, UserOutlined, DownOutlined } from '@ant-design/icons';
import { Tree, Table, Space, Button, Input, message, Modal, Descriptions, Avatar ,Tooltip,Spin} from 'antd';
import TRE from "../../../componments/WTree";
import IPagination from '../../../componments/public/iPagination';
import GlobalModal from '../../../componments/GlobalModal'
import ExportUnitModal from './exportModal';
import ColumnDragTable from '../../../componments/columnDragTable';
import classnames from 'classnames'

const nodeType = 'ALL';
const initialStart = 1;
// const onlySubDept = 1;
const { TreeNode } = Tree;

function AddressList({ dispatch, addressBook, loading,location }) {

  const { treeData, tableData, returnCount, collectList, expandedKeys, currentNode,isShowExportUnitModel, checkedKeys, userIds,limit,currentPage} = addressBook;

  const addressOrgId = localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).orgId;
  console.log(checkedKeys,expandedKeys, '26----')
  const collectTreeData = [
    {
      title: '收藏',
      key: '0-0',
      icon: <StarTwoTone />,
      children: collectList.map(item=>{
        item['icon']=[<UserOutlined key={item.title}/>]
        return item
      })
    },
  ];

  const [start, setStart] = useState(1);
  // const [userIds, setUserIds] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [searchWord, setSearchWord] = useState('');
  const [selectedTreeId, setSelectedTreeId] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState(addressOrgId);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showLine, setShowLine] = useState(true);
  const [showIcon, setShowIcon] = useState(false);
  useEffect(() => {
    // getAddressList(initialStart, 10,treeData[0].id, addressOrgId);
    getCollectList();
  }, []);
  useEffect(() => {
    if(selectedTreeId){
      getAddressList( currentPage, limit,selectedTreeId,'')
    }
  }, [limit])
  function getAddressList(start, limit, orgId, searchWord) {
    dispatch({
      type: 'addressBook/getAddress',
      payload: {
        orgId,
        start,
        limit,
        searchWord,
        userSelectLevel: '2' // 1 本级  2 本级含下级
      },
    });
  }

  function getCollectList() {
    dispatch({
      type: 'addressBook/getCollectList',
      payload: {
        start: 1,
        limit: 1000,
      },
    });
  }

  const tableProps = {
    rowKey: 'id', 
    columns: [
      // {
      //   title: '在线',
      //   dataIndex: 'online',
      //   render: () => (
      //     <UserOutlined />
      //   ),
      // },
      {
        title: '序号',
        dataIndex: 'key',
        render: (text,record,index)=><div >{index+1}</div>,
        width:80
      },
      {
        title: '姓名',
        dataIndex:  'userName',
        render: (text, record) => (
          <a onClick={()=>{onShowIntroClick(record)}} className={styles.text} title={text}>{text}</a>
        ),
        width:100
      },
      {
        title: '单位',
        dataIndex: 'orgName',
        render: (text, record) => (
          <span className={styles.text} title={text}>{text}</span>
        ),
      },
      {
        title: '部门',
        dataIndex: 'deptName',
        render: (text, record) => (
          <span className={styles.text} title={text}>{text}</span>
        ),
      },
      {
        title: '岗位',
        dataIndex: 'postName',
        render: (text, record) => (
          <span className={styles.text} title={text}>{text}</span>
        ),
      },
      {
        title: '座机电话',
        dataIndex: 'telephone',
        render: (text, record) => (
          <span className={styles.text} title={text}>{text}</span>
        ),
      },
      {
        title: '手机',
        dataIndex: 'phone',
        render: (text, record) => (
          <span className={styles.text} title={text}>{text}</span>
        ),
      },
      {
        title: '电子邮箱',
        dataIndex: 'email',
        render: (text, record) => (
          <span className={styles.text} title={text}>{text}</span>
        ),
      },
      {
        title: '收藏',
        dataIndex: 'isCollect',
        render: (text, record) => (
          <div>
            { 
              text == "2"
              ? 
              <StarOutlined onClick={()=>{onCollectClick(record, 1)}}/> 
              : 
              <StarFilled onClick={()=>{onCollectClick(record, 2)}}/> 
            }
          </div>
        ),
        width:60
      }
    ],
    dataSource: tableData,
    pagination: false,
    rowSelection: {
      selectedRowKeys: userIds,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'addressBook/updateStates',
          payload: {
            userIds: selectedRowKeys,
          },
        });
        // setUserIds(selectedRowKeys)
      },
    },
  }

  const renderTreeNodes = data =>
    data.map((item, index) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.title} key={item.key} />;
    });

  const onImportModalCancel = () => {
    dispatch({
      type: 'addressBook/updateStates',
      payload: {
        isShowExportUnitModel: false,
      },
    });
  }

  const onExportClick = () => {
    if(!currentNode.key) {
      message.error('请选择单位!');
      return;
    }
    let timeStamp = Date.parse(new Date());
    currentNode.newFileName = `通讯录${timeStamp}`;
    dispatch({
      type: 'addressBook/updateStates',
      payload: {
        isShowExportUnitModel: true,
      },
    });
  }

  const onChangeValue = (e) => {
    setSearchWord(e.target.value)
  };

  const onSearchTable = () => {
    setStart(initialStart)
    getAddressList(initialStart, limit, selectedTreeId, searchWord);
  };

  const onShowIntroClick = (val) => {
    setModalData(val);
    setIsModalVisible(true);
  };

  const pageChange = (page, pageSize) => {
    setStart(page)
    dispatch({
      type:'addressBook/updateStates',
      payload:{
        limit:pageSize
      }
    })
    getAddressList(page, pageSize, selectedTreeId, searchWord);
    // dispatch({
    //   type: 'information/updateStates',
    //   payload: {
    //     start: page,
    //     limit: pageSize,
    //   },
    // });
  }

  const onCollectClick = (record, isCollect, extra) => {
    let identityId = record.id;
    if (extra) {
      const tmp = modalData;
      tmp.isCollect = tmp.isCollect == '2' ? '1' : '2';
      setModalData(tmp);
    } 
    dispatch({
      type: 'addressBook/userCollect',
      payload: {
        identityId,
        isCollect,
      },
      callback: function() {
        getAddressList(start, limit, selectedTreeId, searchWord);
        getCollectList();
      },
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onCollectSelect = (selectedKeys, info) => {
    // setModalData(info.selectedNodes[0]);
    if (info.node.title !== '收藏') {
      setModalData(info.node);
      setIsModalVisible(true);
    }
  };

  return (
    <div className={styles.container} id="addressList_id">
      <div id="list_head">
      <ReSizeLeftRight
        vLeftNumLimit={220}
        leftChildren={
          <div className={styles.departmentTree}>
            <TRE
              getData={node => {
                setSelectedDeptId(node.key);
                setSelectedTreeId(node.key);
                dispatch({
                  type: 'postMg/updateStates',
                  payload: {
                    currentPage: 1,
                    searchWord: ''
                  },
                });
                setStart(1);
                getAddressList(initialStart, limit, node.key,searchWord);
              }}
              isShowSearch={false}
              // plst={'请输入单位/部门名称'}
              // nodeIds={nodeId}
              // onlySubDept={onlySubDept}
              // isShowIcon={false}
              isAddress={true}
              nodeType={nodeType}
              treeData={treeData}
              currentNode={currentNode}
              expandedKeys={expandedKeys}
              // moudleName={'addressBook'}
              location={location}
            />
            <Spin spinning={loading.global}>
              <Tree
                style={{marginLeft: '-28px'}}
                showIcon
                defaultExpandAll
                // switcherIcon={<StarTwoTone />}
                onSelect={onCollectSelect}
                treeData={collectTreeData}
              />
            </Spin>

          </div>
        }
        rightChildren={
          <div className={styles.table}>
            <div className={styles.other}>
              <Tooltip trigger={['focus']} title={searchWord?'':'请输入姓名/部门名称/座机电话/手机/电子邮件'} placement="bottomLeft">
                <Input
                  style={{width: '226px',marginLeft:8}}
                  value={searchWord}
                  placeholder={'请输入姓名/部门名称/座机电话/手机/电子邮件'}
                  // allowClear
                  onChange={onChangeValue}
                  // onSearch={value => {
                  //   onSearchTable(value);
                  // }}
                />
                <Button
                  type="primary"
                  style={{ margin: '0 8px' }}
                  onClick={onSearchTable}
                >
                  查询
                </Button>
              </Tooltip>
              <Space>
                <div className={styles.bt_gp}>
                  <Button onClick={onExportClick}>
                    导出
                  </Button>
                </div>
              </Space>
            </div>
            <div style={{height:'calc(100% - 100px)'}}>
              <ColumnDragTable taskType="MONITOR" modulesName="addressBook"  {...tableProps}  scroll={{ y: 'calc(100% - 45px)' }}/>
            </div>
            <IPagination
            current={start}
            total={String(returnCount)}
            onChange={pageChange}
            pageSize={limit}
            isRefresh={true}
            refreshDataFn={()=>{
              setStart(1)
               getAddressList(1, limit, selectedTreeId, searchWord);}}
          />
          </div>
        }
      >
      </ReSizeLeftRight>
      </div>
     

      <GlobalModal 
        title="联系人详情" 
        visible={isModalVisible} 
        onCancel={handleCancel}
        mask={false}
        widthType={1}
        incomingWidth={500}
        incomingHeight={240}
        maskClosable={false}
        getContainer={() =>{
          return document.getElementById('addressList_id')||false;
        }}
        footer={[
          <Button key="back" onClick={handleCancel} id='footer_button'>
            关闭
          </Button>
        ]}
      >
        <div className={styles.collect_modal}>
          <div style={{width:'40%',margin:'auto'}}>
            <Avatar size={100} icon={<UserOutlined />} className={styles.avatar}/>
            { 
              modalData.isCollect == 2
              ? 
              <StarOutlined onClick={()=>{onCollectClick(modalData, 1, 'mm')}}/> 
              : 
              <StarFilled onClick={()=>{onCollectClick(modalData, 2, 'mm')}}/> 
            }
          </div>
          <div style={{width:'60%',margin:'auto'}}>
            <Descriptions title="" column={1} labelStyle={{justifyContent: 'flex-end',minWidth:80}}>
              <Descriptions.Item label="姓名">{modalData.userName || modalData.title || ''}</Descriptions.Item>
              <Descriptions.Item label="部门">{modalData.deptName}</Descriptions.Item>
              <Descriptions.Item label="座机电话">{modalData.telephone}</Descriptions.Item>
              <Descriptions.Item label="手机">{modalData.phone}</Descriptions.Item>
              <Descriptions.Item label="电子邮箱">{modalData.email}</Descriptions.Item>
            </Descriptions>
          </div>
        </div>

      </GlobalModal>
      {isShowExportUnitModel && (
        <ExportUnitModal
          onCancel={onImportModalCancel.bind(this)}
          currentNode={currentNode}
          userIds={userIds}
        />
      )}
    </div>
  );
}
export default connect(({
  addressBook,
  loading
}) => ({
  addressBook,
  loading,
}))(AddressList);