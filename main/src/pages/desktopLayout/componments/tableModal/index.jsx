/**
 * @author zhangww
 * @description table modal
 */
import { connect } from 'dva';
import React,{useEffect,useState} from 'react';
import _ from "lodash";
import { Button, Input, message, Modal, Table } from 'antd';
import GlobalModal from '../../../../componments/GlobalModal';

function Index({ dispatch, desktopLayout }) {

  const { selectedRowKeys, paramsData } = desktopLayout;

  const [color, setColor] = useState("#aabbcc");


  function onHideModal() {
    dispatch({
      type: 'desktopLayout/updateStates',
      payload: {
        columnName: '',
        columnUrl: '',
        isTableModalVisible: false
      }
    })
  }

  const onFinish = (values) => {
    const { columnName, columnUrl } = values;
    // dispatch({
    //   type: 'desktopLayout/addColumn',
    //   payload:{
    //     deskSectionName: columnName,
    //     deskSectionUrl: columnUrl
    //   },
    //   callback: ()=>{
    //     onHideModal()
    //     window.location.reload();
    //   }
    // })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const tableProps = {
    columns: 
    [
      {
        title: '序号',
        width: 60,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '名称',
        dataIndex: 'name',
        render: (text, record) => (
          <Input
            value={text}
            style={{ width: 150 }}
            onChange={changeParamsValue.bind(this, 'name', record.key)}
          />
        ),
      },
      {
        title: '英文标识',
        dataIndex: 'code',
        render: (text, record) => (
          <Input
            value={text}
            style={{ width: 150 }}
            onChange={changeParamsValue.bind(this, 'code', record.key)}
          />
        ),
      },
      {
        title: '数据源',
        dataIndex: 'api',
        render: (text, record) => (
          <Input
            value={text}
            style={{ width: 150 }}
            onChange={changeParamsValue.bind(this, 'api', record.key)}
          />
        ),
      },
      {
        title: '更多跳转',
        dataIndex: 'link',
        render: (text, record) => (
          <Input
            value={text}
            style={{ width: 150 }}
            onChange={changeParamsValue.bind(this, 'link', record.key)}
          />
        ),
      },
    ],
    pagination: false,
    dataSource: paramsData,
    rowSelection: {
      selectedRowKeys: selectedRowKeys ,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'desktopLayout/updateStates',
          payload: {
            selectedRowKeys,
          },
        });
      },
    },
  };

  const addParams = () => {
    const key =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);

      paramsData.push({
        key: key,
        name: '',
        code: '',
        api: '',
        link: '',
      });
      dispatch({
        type: 'desktopLayout/updateStates',
        payload: {
          paramsData: [...paramsData],
        },
      });
  };
  //删除
  const deleteParams = keys => {
    if (keys.length > 0) {
      const newData = paramsData.filter(item => !keys.includes(item.key));
        dispatch({
          type: 'desktopLayout/updateStates',
          payload: {
            paramsData: [...newData],
          },
        });
    } else {
      message.error('请选择一条数据');
    }
  };

  const changeParamsValue = (name, key, value) => {
      paramsData.forEach(item => {
        if (item.key == key) {
          item[name] = value.target.value;
        }
      });
      dispatch({
        type: 'desktopLayout/updateStates',
        payload: {
          paramsData: [...paramsData],
        },
      });
  };

  return (
    <GlobalModal
      title="子栏目设置"
      widthType={1}
      incomingWidth={900}
      incomingHeight={500}
      open={true}
      onCancel={onHideModal}
      mask={false}
      maskClosable={false}
      getContainer={() => {
        return document.getElementById('desktop_wrapper') || false;
      }}
      footer={[
        <Button onClick={() => {
          onHideModal()
        }}>取消</Button>,
        <Button
          type="primary"
          // htmlType="submit"
          // style={{ width: 100, height: 28 }}
          onClick={() => {
            console.log(paramsData);
            onHideModal()
          }}
        >
          确认
        </Button>,
      ]}
    >
      <p style={{marginBottom: 10}}>
          <Button
          style={{marginRight: 10}}
            onClick={() => {
              addParams();
            }}
          >
            新增
          </Button>
          <Button
            onClick={() => {
              deleteParams(selectedRowKeys);
            }}
          >
            删除
          </Button>
        </p>
      <Table
              {...tableProps}
              scroll={paramsData?.length > 0 ? { y: 350 } : {}}
            />
    </GlobalModal>
  );
}

export default connect(({
  desktopLayout,
}) => ({
  desktopLayout,
}))(Index);