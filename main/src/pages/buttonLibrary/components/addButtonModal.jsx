import { connect } from 'dva';
import { history, useDispatch } from 'umi';
import React, { useState, useEffect } from 'react';
import IPagination from '../../../componments/public/iPagination';
import GlobalModal from '../../../componments/GlobalModal/index.jsx';
import {
  Modal,
  Input,
  Select,
  Table,
  Button,
} from 'antd';
const { Option } = Select;
const GROUPTYPE = {
  1: '按钮类',
  2: '列表类',
  3: '控件类',
  4: '规则类',
  5: '其他类',
};
const listColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    render: (text, obj, index) => <div>{index + 1}</div>,
  },
  {
    title: '函数名称',
    dataIndex: 'funcName',
  },
  {
    title: '函数编码',
    dataIndex: 'funcCode',
  },
  {
    title: '函数引用类型',
    dataIndex: 'funcRefType',
    render: text => <span>{GROUPTYPE[text]}</span>,
  },
  {
    title: '语言类型',
    dataIndex: 'funcLangType',
  },
];

function Index({
  form,
  addObj,
  buttonLibrary,
  dispatch,
}) {
  const { selectedIndex, funList,funCurrentPage,funReturnCount,funLimit } = buttonLibrary;
  
  const [selectKey, setSelectKey] = useState(addObj?.funcLibId);
  const [selectRow, setSelectRow] = useState([]);

  useEffect(() => {
    if (addObj?.funcLibId) {
      dispatch({
        type: `buttonLibrary/getFuncLibById`,
        payload: {
          funcLibId: addObj.funcLibId,
        },
        callback: (funcName, data) => {
          setSelectRow([data])
        },
      });
    }
  }, [addObj?.funcLibId]);

  const rowSelection = {
    selectedRowKeys: [selectKey],
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectKey(selectedRowKeys.toString());
      setSelectRow(selectedRows);
    },
  };
 const getFunList=(limit,start,searchValue)=>{
  dispatch({
    type: `buttonLibrary/getFuncLibList`,
    payload: {
      limit,
      start,
      funcRefType: '1,5',
      searchValue,
    },
  });
 }
  const onSearchTable = value => {
    getFunList(funLimit,funCurrentPage,value)
    // dispatch({
    //   type: `buttonLibrary/getFuncLibList`,
    //   payload: {
    //     limit: 10000,
    //     start: 1,
    //     funcRefType: '1,5',
    //     searchValue: value,
    //   },
    // });
  };

  const onCancel = () => {
    dispatch({
      type: `buttonLibrary/updateStates`,
      payload: {
        isShowButtonModal: false,
      },
    });
  };

  //保存
  const saveList = () => {
    if (!selectKey.length) {
      return;
    }
    addObj.funcLibId = selectRow[0].id
    addObj.funcName = selectRow[0].funcName
    addObj.thenEvent = selectRow[0].funcLibUrl
    form.setFieldsValue({ [`funcName`]: selectRow[0].funcName });
    dispatch({
      type: 'buttonLibrary/updateStates',
      payload: {
        addObj: { ...addObj },
        isShowButtonModal: false
      },
    });
  };

  //重置到form到chu
  return (
    <GlobalModal
      visible={true}
      widthType={1}
      incomingWidth={900}
      incomingHeight={550}
      title="函数详情"
      onCancel={onCancel}
      mask={false}
      maskClosable={false}
      centered
      bodyStyle={{paddingBottom:0}}
      getContainer={() => {
        return document.getElementById('buttonLibrary_container') || false;
      }}
      footer={[
        <Button key="cancle" onClick={onCancel}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={saveList}>
          保存
        </Button>,
      ]}
    >
      <div style={{height:'100%',position:'relative'}}>
        <Input.Search
          style={{ width: 200,paddingBottom:8 }}
          placeholder={'请输入函数名称、描述'}
          allowClear
          onSearch={value => {
            onSearchTable(value);
          }}
        />
        <div style={{height:'calc(100% - 40px)'}}>
        <Table
          scroll={{ y: 'calc(100% - 120px)' }}
          bordered
          dataSource={funList}
          columns={listColumns}
          rowClassName="editable-row"
          pagination={false}
          rowKey="id"
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
        />
        </div>
        <IPagination
          current={funCurrentPage}
          total={funReturnCount}
          onChange={(page, size) => {
            dispatch({
              type: 'buttonLibrary/updateStates',
              payload: {
                funCurrentPage: page,
                funLimit: size,
              },
            });
            getFunList(size,page,'')

          }}
          pageSize={funLimit}
          isRefresh={true}
          refreshDataFn={() => {
            dispatch({
              type:'buttonLibrary/updateStates',
              payload:{
                funCurrentPage:1
              }
            })
            getFunList(funLimit,1,'')
          }}
        />
      </div>
    </GlobalModal>
  );
}

export default Index;
