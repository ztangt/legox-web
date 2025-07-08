import React,{useEffect,useState,useCallback,Fragment} from 'react'
import {connect} from 'dva'
import {Table, Button, Input, message, Modal, Form, DatePicker, Select, Row, Col} from 'antd'
import IPagination from '../../../componments/public/iPagination'
import styles from '../index.less'
import AddNormAux from './addNormAux';
import {BASE_WIDTH} from "@/util/constant";

const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 16,
  },
};

function NormAux({dispatch,normAux, layoutG}) {
  const {list, returnCount, limit, selectedRowKeys, search, isShowAddModal, isEditModal, editRowData, allTableData, modelTitle} = normAux
  const [height, setHeight] = useState(document.documentElement.clientHeight - 305)
  const [searchWord, setSearchWord] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { Search } = Input;
  const [form] = Form.useForm();
  useEffect(() => {
    dispatch({
      type:'normAux/getNormAuxList',
      payload:{
        start: currentPage,
        limit: limit,
        searchWord: searchWord,
      }
    })
  }, [currentPage, limit, searchWord, dispatch])

  const getNormAuxList=(start,limit,searchWord)=>{
    dispatch({
      type:'normAux/getNormAuxList',
      payload:{
        start,
        limit,
        searchWord,
      }
    })
  }

  const deleteNormAux=(record)=>{
    if(record.businessTableCode){
      dispatch({
        type:'normAux/deleteNormAuxByTableCode',
        payload:{
          tableCode:record.businessTableCode
        },
        callback:(data)=>{
          if(data.code == 200){
            getNormAuxList(1, limit, '');
            message.success('删除成功');
          }else {
            message.error("删除失败");
          }
        }
      })
    }else {
      message.error("删除失败,表名为空");
    }
  }
  const updateNormAux=(record)=>{
    dispatch({
      type:'normAux/getByTableCode',
      payload:{
        tableCode:record.businessTableCode
      },
      callback:(data)=>{
        // 格式化数据
        const formattedData = data.map((item, index) => ({
          key: index + 1, // 确保 key 是唯一的
          columnCode: item.businessColCode, // 字段代码
          auxCode: item.auxLableCode, // 辅助核算项代码
        }));
        dispatch({
          type: 'normAux/updateStates',
          payload: {
            modelTitle:"修改辅助核算项",
            isEditModal: true,
            editRowData: {
              tableCode: record.businessTableCode,
              tableName: record.businessTableName,
              rows: formattedData
            },
            initData: formattedData,
            lastKey: formattedData.length,
          },
        });
        // 加载 colData 和 dictData
        dispatch({
          type: 'normAux/getNormAuxTableColumn',
          payload: {
            tableCode: record.businessTableCode,
          },
        });
        dispatch({
          type: 'normAux/getNormAuxDict',
        });
      }
    })
  }

  const tableProps = {
    rowKey: 'id',
    columns: [
      {
        title: '序号',
        dataIndex: 'number',
        render: (text) => <a>{text}</a>,
      },
      {
        title: '表名',
        dataIndex: 'businessTableCode',
        render: (text, record) => (
          <a onClick={()=>{updateNormAux(record)}}>
            {text}
          </a>
        ),
      },
      {
        title: '描述',
        dataIndex: 'businessTableName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (text,record,index)=><span>{dataFormat(text,'YYYY-MM-DD HH:mm:ss')}</span>
      },
      {
        title: '创建人',
        dataIndex: 'createUserName'
      },
      {
        title: '操作',
        dataIndex: 'businessTableCode',
        render: (text, record) => {
          return (
            <div className='table_operation'>
              <a onClick={()=>{updateNormAux(record)}}>修改</a>
              <a onClick={()=>{deleteNormAux(record)}}>删除</a>
            </div>
          )
        }
      },
    ],
    dataSource: list.map((item,index)=>{
      item.number=index+1
      return item
    }),//列表数据
    pagination: false,//分页
    rowSelection: {//多选
      selectedRowKeys:selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type:'normAux/updateStates',
          payload:{
            selectedRowKeys,
          }
        })
      }
    }
  }

  const addNormAux = async() => {
    dispatch({
      type: 'normAux/getNormAuxDict',
    });
    await dispatch({
      type:'normAux/getNormAuxTable',
      callback:(data)=>{
        dispatch({
          type:'normAux/updateStates',
          payload:{
            modelTitle:"新增辅助核算项",
            isShowAddModal:true,
            initData: [{
              key: 1,
              columnCode: "",
              auxCode: "",
            }], // 初始化为只有一行
            lastKey: 1, // 重置 lastKey
          }
        })
      }
    })
  };

  const onSearch = (value) => {
    setSearchWord(value);
    getNormAuxList(1, limit, value)
  }


  // 函数总的返回
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Search
          onChange={e => setSearchWord(e.target.value)}
          onSearch={(value) => onSearch(value)}
          style={{ width: 400 }}
          value={searchWord}
          allowClear
          placeholder="支持表名、字段名、辅助核算项多维度查询"
        />
        <div className={styles.header_button}>
          <Button onClick={addNormAux}>新增</Button>
        </div>
      </div>
      <div className={styles.table}>
        <Table {...tableProps} scroll={{ y: 'calc(100vh - 290px)' }} />
      </div>
      <IPagination
        current={Number(currentPage)}
        total={returnCount}
        pageSize={limit}
        isRefresh={true}
        refreshDataFn={() => {
          getNormAuxList(currentPage, limit, searchWord);
        }}
        onChange={(newPage) => {
          setCurrentPage(newPage);
          getNormAuxList(newPage, limit, searchWord);
        }}
      />
      {isShowAddModal && <AddNormAux isEdit={false} documentId="sceneConfig_container" />}
      {isEditModal && <AddNormAux isEdit={true} documentId="sceneConfig_container" />}
    </div>
  );
}
export default connect(({normAux, layoutG})=>({normAux, layoutG}))(NormAux)
