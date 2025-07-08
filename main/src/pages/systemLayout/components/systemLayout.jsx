import { connect } from 'dva';
import { Table, Button, Input, Modal } from 'antd';
import { dataFormat, getButton } from '../../../util/util.js';
import ColumnDragTable from '../../../componments/columnDragTable'
import IPagination from '../../../componments/public/iPagination.jsx'
import BUSINESS from './businessModal';
import MOBILE from './mobileModal';
import SUPPORT from './supportModal';
import AddSystem from './addSystem';
import SystemSort from './systemSort';
import styles from '../index.less';
import {useEffect} from 'react'
const { Search } = Input;
function FormEngine({
  dispatch,
  loading,
  getData,
  businessModal,
  mobileModal,
  supportModal,
  searchWord,
  user,
  isAddSystem,
  isSort,
  returnCount,
  currentPage,
  limit,
}) {
  const { menus } = user;
useEffect(()=>{
  dispatch({
    type: 'systemLayout/getRegister',
    payload: {
      searchWord: '',
      limit: 100,
      start: 1,
    },
  });
},[])
  const getRegisterList = searchWord => {
    dispatch({
      type: 'systemLayout/getRegister',
      payload: {
        searchWord,
        limit,
        start: 1,
      },
    });
  };
  //三个主要平台禁止删除
  const business_arr = ['1001','1002','1003']
  const tableProps = {
    rowkey: 'id',
    columns: [
      {
        title: '序号',
        width: 50,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '系统名称',
        dataIndex: 'registerName',
      },
      {
        title: '系统简称',
        dataIndex: 'registerTag',
      },
      {
        title: '系统编码',
        dataIndex: 'registerCode',
      },
      {
        title: '属性',
        dataIndex: 'registerAtt',
      },
      {
        title: '系统描述',
        dataIndex: 'registerDesc',
      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        render: text => {
          return dataFormat(text, 'YYYY-MM-DD');
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        // align: 'left',
        render: (text, record, index) => {
          return (
            <div className={styles.operation}>
              {getButton(menus, 'config') && (
                <a onClick={onBasics.bind(this, record)}>基础配置</a>
              )}
              <a
                onClick={() => {
                  addSystem(record.id);
                }}
                style={{marginLeft:8}}
              >
                修改
              </a>
              {record.registerCode !== 'PLATFORM_SYS' &&
                record.registerCode !== 'PLATFORM_BUSS' &&
                record.registerCode !== 'PLATFORM_MIC' && (
                  <a
                    onClick={() => {
                      business_arr.includes(record.registerCode)?null:deleteSystem(record.id);
                    }}
                    style={{marginLeft:8}}
                    disabled={business_arr.includes(record.registerCode)}
                  >
                    删除
                  </a>
                )}
            </div>
          );
        },
      },
    ],
    dataSource: getData,
    loading: loading.global,
    pagination: false,
    rowSelection: false,
  };
  //删除
  const deleteSystem = id => {
    Modal.confirm({
      title: '确认删除吗？',
      mask: false,
      getContainer: () => {
        return document.getElementById('systemLayout_container');
      },
      onOk() {
        dispatch({
          type: 'systemLayout/deleteRegister',
          payload: {
            registerIds: id,
          },
        });
      },
      onCancel() {},
    });
  };
  //点击基础配置 ==支撑平台 support   ==业务平台 business   ==微协同 mobile
  function onBasics(obj) {
    let tabTypeCode = '';
    console.log('obj', obj);
    dispatch({
      type: 'systemLayout/getPartability',
      payload: {
        registerId: obj.id,
      },
    });
    console.log(obj);
    dispatch({
      type: 'systemLayout/getBaseset',
      payload: {
        registerId: obj.id,
        registerName: obj.registerName
      },
      callback: function() {
        if (obj.registerName == '支撑平台') {
          tabTypeCode = 'PAGETAB_FIRSTLOGO';
          dispatch({
            type: 'systemLayout/updateStates',
            payload: {
              supportModal: true,
              basesetId: obj.id,
              loginImgList: [],
              typeName: '支撑平台',
              // basesetObj:obj
            },
          });
        } else if (
          obj.registerName == '业务平台' ||
          obj.registerAtt == '业务平台' ||
          obj.registerAtt == '前端展示'
        ) {
          tabTypeCode = 'PAGETAB_FIRSTLOGO';
          dispatch({
            type: 'systemLayout/getMenu',
            payload:{
              searchWord:'',
              registerId:obj.registerId
            }})
          dispatch({
            type: 'systemLayout/updateStates',
            payload: {
              businessModal: true,
              basesetId: obj.id,
              loginImgList: [],
              imgList: [],
              homeImgList: [],
              typeName: '业务平台',
            },
          });
        } else if (obj.registerName == '微协同') {
          dispatch({
            type: 'systemLayout/updateStates',
            payload: {
              mobileModal: true,
              basesetId: obj.id,
              typeName: '微协同',
            },
          });
        }
        if (obj.registerName != '微协同') {
          const mapRegisterCode = {
            1002: 'PLATFORM_BUSS',
            1001: 'PLATFORM_SYS'
          }
          dispatch({
            type: 'systemLayout/getLogo',
            payload: {
              tabTypeCode: tabTypeCode,
              registerId: obj.id,
              start: 1,
              limit: 1000,
              registerCode: mapRegisterCode[obj.registerCode],
            },
          });
        }
      },
    });
  }
  function onCancel() {
    dispatch({
      type: 'systemLayout/updateStates',
      payload: {
        supportModal: false,
        businessModal: false,
        mobileModal: false,
      },
    });
  }
  //新增修改
  const addSystem = id => {
    if (id) {
      dispatch({
        type: 'systemLayout/getRegisterId',
        payload: {
          registerId: id
        },
        callback: () => {
          dispatch({
            type: 'systemLayout/updateStates',
            payload: {
              isAddSystem: true,
            },
          });
        },
      });
    } else {
      dispatch({
        type: 'systemLayout/updateStates',
        payload: {
          isAddSystem: true,
        },
      });
    }
  };
  const onChange = e => {
    dispatch({
      type: 'systemLayout/updateStates',
      payload: {
        searchWord: e.target.value,
      },
    });
  };
  const onSearch = value => {
    getRegisterList(value);
  };
  //排序
  const onSort = () => {
    dispatch({
      type: 'systemLayout/getSystemSortList',
      payload: {
        searchWord: '',
        limit: 200,
        start: 1,
      },
      callback: () => {
        dispatch({
          type: 'systemLayout/updateStates',
          payload: {
            isSort: true,
          },
        });
      },
    });
  };
  // change页面
  const changePage = (next,pageSize)=>{
    dispatch({
      type: 'systemLayout/updateStates',
      payload: {
        currentPage: next,
        limit: pageSize
      }
    })
  }

  return (
    <div className={styles.system_box} style={{ height: '100%', background: '#fff', padding: '8px',position:'relative' }}>
      <div className={styles.header}>
        <div className={styles.search}>
          <Search
            placeholder="请输入名称"
            onChange={onChange}
            onSearch={onSearch}
            allowClear
          />
        </div>
        <div className={styles.button}>
          <Button
            onClick={() => {
              addSystem('');
            }}
          >
            新增
          </Button>
          <Button
            onClick={() => {
              onSort();
            }}
          >
            排序
          </Button>
        </div>
      </div>
      <ColumnDragTable {...tableProps} taskType = 'MONITOR' key={loading} />
      <IPagination 
        current={Number(currentPage)}
        total={Number(returnCount)}
        pageSize={limit}
        isRefresh={true}
        onChange={changePage}
        refreshDataFn={() => {
          getRegisterList(searchWord)
        }}
      />     
      {supportModal && (
        <SUPPORT //支撑平台
          // org={org}
          loading={loading.global}
          onCancel={onCancel.bind(this)}
          // onSubmit={onSubmit.bind(this)}
        />
      )}

      {businessModal && (
        <BUSINESS //业务平台
          // org={org}
          loading={loading.global}
          onCancel={onCancel.bind(this)}
          // onSubmit={onSubmit.bind(this)}
        />
      )}

      {mobileModal && (
        <MOBILE //微协同
          // org={org}
          loading={loading.global}
          onCancel={onCancel.bind(this)}
          // onSubmit={onSubmit.bind(this)}
        />
      )}
      {isAddSystem && <AddSystem />}
      {isSort && <SystemSort />}
    </div>
  );
}
export default connect(({ systemLayout, user }) => ({
  ...systemLayout,
  user,
}))(FormEngine);
