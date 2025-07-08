import React,{useEffect,useState,useCallback,Fragment} from 'react'
import { connect } from 'dva';
import {Table,Button,Input,message,Modal,Form,DatePicker,Select,Row,Col} from 'antd'
import moment from 'moment';
import IPagination from '../../../componments/public/iPagination';
import { BASE_WIDTH, ORDER_WIDTH } from '../../../util/constant';
import copy from 'copy-to-clipboard';
import styles from '../index.less';
import ColumnDragTable from '../../../componments/columnDragTable'
import searchIcon from '../../../../public/assets/search_black.svg'
import { DoubleRightOutlined, SettingOutlined, RollbackOutlined, SearchOutlined, EllipsisOutlined, DownOutlined } from '@ant-design/icons';
function businessOperationLog({ dispatch, businessOperationLog }) {
  const {
    tableData,
    returnCount,
    limit,
    search,
    selectedRowIds,
  } = businessOperationLog;
  const { confirm } = Modal;
  const { Search } = Input;
  const [isShowHighSearch, setIsShowHighSearch] = useState(false);//是否显示高级搜索
  const [currentPage, setCurrentPage] = useState(1);
  const searchColumnCodes= [
    "userAccount",
    "userName",
    "clientType",
    "menuName",
    "operation",
    "buttonName",
    "loginIp",
    "httpType",
    "startOperaTime",
    "endOperaTime",
  ]
  useEffect(() => {
    /* if(limit>0){
       getPubSysBusinessOpera(1, limit, '');
     }
   }, [limit]);*/
    getPubSysBusinessOpera(1, limit, '');
   },[]);
  //接口列表
  const getPubSysBusinessOpera = (start, limit, searchWord) => {
    dispatch({
      type: 'businessOperationLog/getPubSysBusinessOpera',
      payload: {
        start,
        limit,
        searchWord,
      },
    });
  };

  const tableProps = {
    rowKey: 'id',
    columns: [
      {
        title: '序号',
        render: (text, record, index) => <span>{index + 1}</span>,
        width: ORDER_WIDTH,
      },
      {
        title: '操作描述',
        dataIndex: 'operation',
        width: BASE_WIDTH,
      },
      {
        title: '操作模块',
        dataIndex: 'menuName',
        width: BASE_WIDTH,
      },
      {
        title: '操作按钮',
        dataIndex: 'buttonName',
        width: BASE_WIDTH,
      },
      {
        title: '操作账号',
        dataIndex: 'userAccount',
        width: BASE_WIDTH,
        ellipsis:true,
        render:(text)=><span style={{cursor:'pointer'}}>{text}</span>
      },
      {
        title: '用户姓名',
        dataIndex: 'userName',
        width: BASE_WIDTH,
      },
      {
        title: '终端',
        dataIndex: 'clientType',
        width: BASE_WIDTH,
        ellipsis: true,
      },
      {
        title: '请求类型',
        dataIndex: 'httpType',
        width: BASE_WIDTH,
      },
      {
        title: '操作时间',
        dataIndex: 'operaTime',
        width: BASE_WIDTH,
        render:text=>{return dataFormat(text,'YYYY-MM-DD HH:mm:ss')}
      },
      {
        title: '耗时(毫秒)',
        dataIndex: 'timeConsuming',
        width: BASE_WIDTH,
      },
      {
        title: 'IP地址',
        dataIndex: 'loginIp',
        width: BASE_WIDTH,
      },
    ],
    dataSource: tableData,
    pagination: false,
  };
  //搜索
  const onSearch = value => {
    getPubSysBusinessOpera(currentPage, limit, value);
  };
  //搜索
  const onFinishSearch = (values) => {
    const formValues = form.getFieldsValue();
    if(formValues.startOperaTime === ""){
      formValues.startOperaTime = 0;
    }else{
      formValues.startOperaTime = Math.floor(formValues.startOperaTime['_d'].getTime()/1000);
    }
    if(formValues.endOperaTime === ""){
      formValues.endOperaTime = 0;
    }else{
      formValues.endOperaTime = Math.floor(formValues.endOperaTime['_d'].getTime()/1000);
    }
    dispatch({
      type:'businessOperationLog/getPubSysBusinessOpera',
      payload:{
        start: typeof(values)  == 'object' ? currentPage : values,
        limit:limit,
        searchWord: '',
        userAccount: formValues.userAccount,
        userName: formValues.userName,
        menuName: formValues.menuName,
        operation: formValues.operation,
        buttonName: formValues.buttonName,
        httpType: formValues.httpType,
        loginIp: formValues.loginIp,
        startOperaTime: formValues.startOperaTime,
        endOperaTime: formValues.endOperaTime,
        clientType: formValues.clientType,
      }
    })
  }
  const defaultSearchCol=[
    {
      "key": "userAccount",
      "title": "操作账号",
      "type": "TODO,DONE,SEND,CIRCULATE,ALL,TRACE,TRUSTED,TRUST,CATEGORY,MONITOR"
    },
    {
      "key": "userName",
      "title": "用户姓名",
      "type": "TODO,DONE,SEND,ALL,CATEGORY,MONITOR"
    },
    {
      "key": "clientType",
      "title": "终端",
      "type": "TODO,DONE,SEND,ALL,CATEGORY,MONITOR"
    },
    {
      "key": "menuName",
      "title": "操作模块",
      "type": "TODO,DONE,SEND,ALL"
    },
    {
      "key": "operation",
      "title": "操作描述",
      "type": "TODO,TRUST"
    },
    {
      "key": "buttonName",
      "title": "操作按钮",
      "type": "TODO"
    },
    {
      "key": "loginIp",
      "title": "IP地址",
      "type": "TODO"
    },
    {
      "key": "httpType",
      "title": "请求类型",
      "type": "TODO"
    },
    {
      "key": "startOperaTime",
      "title": "操作时间",
      "type": "TODO"
    },
    {
      "key": "endOperaTime",
      "title": "到",
      "type": "TODO"
    }
  ]
  const [form] = Form.useForm();
  //显示高级搜索的组件
  const componentRender = (code, key) => {
    let label = defaultSearchCol.filter(col => col.key == code && col.type.includes('TODO'))
    switch (code) {
      case 'userAccount':
      case 'userName':
      case 'clientType':
      case 'menuName':
      case 'operation':
      case 'buttonName':
      case 'loginIp':
        return (
          <Form.Item
            name={code}
            label={label && label.length ? label[0].title : ''}
            // style={{ marginBottom: '8px' }}
            initialValue={''}
            key={key}
          >
            <Input style={{width:250,height:32}}/>
          </Form.Item>
        );
      case 'startOperaTime':
        return (
            <Form.Item
              name={code}
              label={label&&label.length?label[0].title:''}
              initialValue={''}
              key={key}
            >
              <DatePicker style={{width:250,height:32}} showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
        )
      case 'endOperaTime':
        return (
              <Form.Item
                name={code}
                label='到'
                initialValue={''}
                key={key}
              >
                <DatePicker style={{width:250,height:32}} showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} format="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>
        )
      case 'httpType':
        return (
          <Form.Item
            name={code}
            label={label && label.length ? label[0].title : ''}
            initialValue={''}
            key={key}
            // style={{ marginBottom: '20px' }}
          >
            <Select allowClear style={{width:250,height:32}}>
              <Option value="delete">delete</Option>
              <Option value="post">post</Option>
              <Option value="put">put</Option>
              <Option value="get">get</Option>
            </Select>
          </Form.Item>
        )
      default:
        break;
    }
  }

  //获取高级搜索的html
  const getSearchFields = () => {
    const children = [];
    searchColumnCodes.map((item, key) => {
      children.push(
        <Col span={6} key={key}>
          {componentRender(item, key)}
        </Col>
      );
    })
    console.log('children=', children);
    return children;
  };
  const changeInput = e => {
    dispatch({
      type: 'businessOperationLog/updateStates',
      payload: {
        search: e.target.value,
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header} id='list_head'>
        <div className={styles.search_div} style={{background:isShowHighSearch?'#f7f7f7':'#ffffff'}}>
          {isShowHighSearch ?
            <>
              <Form
                form={form}
                onFinish={onFinishSearch}//搜索 查询
                className={styles.form}
                // layout="inline"
              >
               <Row gutter={24}> {getSearchFields()}</Row>
              </Form>
              <div className={styles.f_opration} id="set_opration">
                <Button className={styles.o_search} onClick={() => { form.submit() }}>查询</Button>
                <Button className={styles.o_roll} onClick={() => { form.resetFields() }}>重置</Button>
                <Button className={styles.o_pack} onClick={() => { setIsShowHighSearch(false) }}>收起</Button>
              </div>
            </>
            :
            <>
              <Search
                onChange={changeInput}
                onSearch={onSearch}
                style={{ width: 230,marginRight:8 }}
                value={search}
                allowClear
                placeholder="请输入用户姓名/操作账号"
                enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
              />
              <Button className={styles.high_level} onClick={() => { setIsShowHighSearch(true)}}>高级查询</Button>
              {/* <DoubleRightOutlined onClick={() => { setIsShowHighSearch(true) }} rotate={90} style={{ fontSize: '12px' }} /> */}
            </>
          }
        </div>
      </div>
      <div className={styles.table}>
        <ColumnDragTable taskType="MONITOR" modulesName="interfaceManagement" {...tableProps} scroll={{ y: 'calc(100% - 45px)' }} />
      </div>
      <IPagination
        current={Number(currentPage)}
        total={returnCount}
        isRefresh={true}
        pageSize={limit}
        refreshDataFn={() => {
          if (isShowHighSearch){
            onFinishSearch();
          }else {
            dispatch({
              type: 'businessOperationLog/getPubSysBusinessOpera',
              payload: {
                start: currentPage,
                limit: limit,
                searchWord: ''
              },
            });
          }
        }}
        onChange={(page, size) => {
          if (isShowHighSearch){
            setCurrentPage(page);
            onFinishSearch(page);
          }else{
            dispatch({
              type: 'businessOperationLog/getPubSysBusinessOpera',
              payload: {
                start: page,
                limit: size,
              },
            });
          }
        }}
      />
    </div>
  );
}
export default connect(({ businessOperationLog }) => ({ businessOperationLog }))(
  businessOperationLog,
);
