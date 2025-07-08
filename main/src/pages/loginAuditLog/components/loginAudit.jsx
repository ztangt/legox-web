import React,{useEffect,useState,useCallback,Fragment} from 'react'
import {connect} from 'dva'
import {Table, Button, Input, message, Modal, Form, DatePicker, Select, Row, Col} from 'antd'
import IPagination from '../../../componments/public/iPagination'
import styles from '../index.less'
import DelAudit from "./delAudit";
import moment from "moment/moment";

const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 16,
  },
};

function loginAuditLog({dispatch,loginAuditLog, layoutG}) {
  const {list, returnCount, limit, selectedRowKeys, search, isShowDeleteModal} = loginAuditLog
  const [height, setHeight] = useState(document.documentElement.clientHeight - 305)
  const [isShowHighSearch, setIsShowHighSearch] = useState(false);//是否显示高级搜索
  const [searchWord, setSearchWord] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const onResize = useCallback(() => {
    setHeight(document.documentElement.clientHeight - 305)
  }, [])
  const [form] = Form.useForm();
  useEffect(() => {
    dispatch({
      type:'loginAuditLog/getLoginAuditLog',
      payload:{
        start: currentPage,
        limit: limit,
        searchWord: searchWord,
      }
    })
  }, [])

  const getLoginAuditLog=(start,limit,searchWord)=>{
    dispatch({
      type:'loginAuditLog/getLoginAuditLog',
      payload:{
        start,
        limit,
        searchWord,
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
        title: '登录账号',
        dataIndex: 'userAccount',
      },
      {
        title: '用户姓名',
        dataIndex: 'userName'
      },
      {
        title: '单位',
        dataIndex: 'userOrgName',
      },
      {
        title: '部门',
        dataIndex: 'userDeptName'
      },
      {
        title: '登录IP',
        dataIndex: 'loginIp',
      },
      {
        title: '登录时间',
        dataIndex: 'loginTime',
        render:text=>{return dataFormat(text,'YYYY-MM-DD HH:mm:ss')}
      },
      {
        title: '离线时间',
        dataIndex: 'leaveTime',
        render:text=>{return text == '0'?'':dataFormat(text,'YYYY-MM-DD HH:mm:ss')}
      },
      {
        title: '终端',
        dataIndex: 'clientType',
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
          type:'loginAuditLog/updateStates',
          payload:{
            selectedRowKeys,
          }
        })
      }
    }
  }

  //搜索
  const onFinishSearch = (values) => {
    const formValues = form.getFieldsValue();
    if(formValues.startLoginTime == undefined){
      formValues.startLoginTime = 0;
    }else{
      formValues.startLoginTime = Math.floor(formValues.startLoginTime['_d'].getTime()/1000);
    }
    if(formValues.endLoginTime == undefined){
      formValues.endLoginTime = 0;
    }else {
      formValues.endLoginTime = Math.floor(formValues.endLoginTime['_d'].getTime()/1000);
    }

    dispatch({
      type:'loginAuditLog/getLoginAuditLog',
      payload:{
        start:currentPage,
        limit:limit,
        searchWord: '',
        userAccount: formValues.userAccount,
        userName: formValues.userName,
        userOrgName: formValues.userOrgName,
        userDeptName: formValues.userDeptName,
        loginIp: formValues.loginIp,
        startLoginTime: formValues.startLoginTime,
        endLoginTime: formValues.endLoginTime,
        clientType: formValues.clientType,
      }
    })
  }

  /**
   * 搜索框内容校验是否包含特殊字符
   * @param {*校验值} value
   */
  const checkWOrd = value => {
    let specialKey =
      "[`·~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
    for (let i = 0; i < value.length; i++) {
      if (specialKey.indexOf(value.substr(i, 1)) != -1) {
        return true;
      }
    }
    return false;
  };

  //重置
  const onReset = async () => {
    form.resetFields();
    onFinishSearch('');
  };

  const changeShowAdvSearch = (isShow) => {
    form.resetFields();
    setIsShowHighSearch(isShow);
    dispatch({
      type: 'loginAuditLog/updateStates',
      payload: {
        showAdvSearch: isShow,
      },
    });
  };

  const onSearch=(value)=>{
    setSearchWord(value);
    if (checkWOrd(value)) {
      message.error('搜索词中包含特殊字符！');
      return;
    }
    dispatch({
      type:'loginAuditLog/updateStates',
      payload:{
        searchWord:value
      }
    })
    getLoginAuditLog(1, limit, value)
  }

  const onChangeValue = (val) => {
    setSearchWord(val)
  };

  // 点击删除弹框
  const batchDelete = () => {
      dispatch({
        type: 'loginAuditLog/updateStates',
        payload: {
          isShowDeleteModal: true,
        }
      })
  }

  // 函数总的返回
  return (
    <div className={styles.warp} id="contractLedger_head">
      <div className={styles.searchWarp}>
        <div>
          <Input.Search
            className={styles.searchInput}
            placeholder="输入登录账号/用户姓名"
            allowClear
            size="middle"
            onSearch={(value) => onSearch(value)}
            onChange={(value) => onChangeValue(value)}
          />
          <Button
            style={{ marginLeft: '10px' }}
            onClick={() => {
              changeShowAdvSearch(true);
            }}
          >
            高级查询
          </Button>
          <Button style={{ marginLeft: '10px'}} onClick={batchDelete}>
            批量删除
          </Button>
        </div>
      </div>
        {isShowHighSearch && (
            <div>
              <Form
                colon={false}
                form={form}
                name="basic"
                onFinish={onFinishSearch}
                style={{ width: '100%' }}
                className={styles.advSearch}
              >
                <Row gutter={24}>
                  <Col span={6}>
                    <Form.Item label="登录账号" name="userAccount">
                      <Input placeholder="请选择登录账号" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="用户姓名" name="userName">
                      <Input placeholder="请输入用户姓名" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="单位" name="userOrgName">
                      <Input placeholder="请输入单位名称" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="部门" name="userDeptName">
                      <Input placeholder="请输入部门" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={6}>
                    <Form.Item label="登录IP" name="loginIp">
                      <Input placeholder="请输入ip地址" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="登录日期" name="startLoginTime">
                      <DatePicker style={{width:'100%'}} showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} format="YYYY-MM-DD HH:mm:ss" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="至" name="endLoginTime">
                      <DatePicker style={{width:'100%'}} showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} format="YYYY-MM-DD HH:mm:ss" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="终端" name="clientType">
                      <Select placeholder="请选择终端类型" allowClear>
                        <Option value="ALL">全部</Option>
                        <Option value="PC">PC端</Option>
                        <Option value="MOBILE">移动端</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item {...tailLayout}>
                  <Button htmlType="submit">查询</Button>
                  <Button onClick={onReset} style={{ margin: '0 30px' }}>
                    重置
                  </Button>
                  <Button onClick={() => changeShowAdvSearch(false)}>取消</Button>
                </Form.Item>
              </Form>
            </div>
        )}
      <div className={styles.table}>
        <Table {...tableProps} scroll={{ y: 'calc(100vh - 270px) '}} />
      </div>
      <div
        style={{
          marginTop: '40px',
          paddingBottom: '10px',
        }}
      >
        <IPagination
          current={currentPage}
          total={returnCount}
          pageSize={limit}
          isRefresh={true}
          refreshDataFn={() => {
            if(isShowHighSearch){
              onFinishSearch('');
            }else {
              getLoginAuditLog(currentPage, limit, searchWord);
            }
          }}
          onChange={(newPage) => {
            setCurrentPage(newPage);
            if(isShowHighSearch){
              onFinishSearch('');
            }else {
              getLoginAuditLog(newPage, limit, searchWord);
            }
          }}
        />
      </div>
      {isShowDeleteModal &&
        <DelAudit />}
    </div>
  );
}
export default connect(({loginAuditLog, layoutG})=>({loginAuditLog, layoutG}))(loginAuditLog)
