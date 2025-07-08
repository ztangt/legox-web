/**
 *
 * @description 租户管理
 */
 import {useState,useCallback,useEffect} from 'react';
import {connect,history} from 'umi';
import {Table,Input,Button,message,Spin} from 'antd';
import styles from './index.less';
import IPagination from '../../componments/public/iPagination';
import ModalUpdateInfo from './componments/modalUpdateInfo';
import ShareOrgModal from './componments/shareOrgModal';
import {dataFormat} from '../../util/util';
import LoginConfigModal from './componments/loginConfigModal';
import { env } from '../../../../project_config/env';
import AccreditImport from './componments/accreditImport';
const {Search}= Input;
function Index({location,dispatch,layoutG}){
  const pathname='/tenement';
  const {returnCount,limit,currentPage,list,searchWord,isShowUpdateModal,isShowShareOrgModal,
    isShowLoginConfig,isShowAccredit} = layoutG.searchObj[pathname];
  const [isCat, setIsCat] = useState(false);
  const [loading, setLoading] = useState(false);
  // table自适应滚动
  const [scrollY, setScrollY] = useState(document.documentElement.clientHeight-305);
  const onResize = useCallback(()=>{
    setScrollY(document.documentElement.clientHeight-305);
  },[])

  useEffect(()=>{
    //获取列表
    dispatch({
      type: 'tenement/getTenants',
      payload: {
        searchWord:'',
        start:1,
        limit:10
      }
  })
      window.addEventListener('resize',onResize);
      return (()=>{
          window.removeEventListener('resize',onResize)
      })
  },[])
  const columns = [
    {
      title:'序号',
      dataIndex:'index',
      key:'index',
      width: 70,
      render:(text,obj,index)=><div>{index+1}</div>
    },
    {
      title: '租户名称',
      dataIndex: 'tenantName',
      key: 'tenantName',
    },
    {
      title: '租户账号',
      dataIndex: 'tenantCode',
      key: 'tenantCode',
    },
    {
      title: '开始时间',
      dataIndex: 'authStartTime',
      key: 'authStartTime',
      render:(text)=><div>{dataFormat(text/1000,'YYYY-MM-DD HH:mm')}</div>
    },
    {
      title: '到期时间',
      dataIndex: 'authEndTime',
      key: 'authEndTime',
      render:(text)=><div>{dataFormat(text/1000,'YYYY-MM-DD HH:mm')}</div>
    },
    {
      title: '组织模式',
      dataIndex: 'tenantOrgShare',
      key: 'tenantOrgShare',
      render:(text)=><div>{text=='YES'?'共享':'私有'}</div>
    },
    {
      title: '平台url',
      dataIndex: 'tenantUrl',
      key: 'tenantUrl',
      render:(text,record)=>{
       return <a onClick={()=>{gotoPath(record)}}>{text}</a>
      }
      // <a href={text + '/#/login'} target="_blank">{text}</a>
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      render:(text,obj)=>(
        <div className="table_operation">
          {/* {obj.tenantOrgShare=='YES'?<span onClick={shareOrgModalFn.bind(this,obj)}>共享组织</span>:''} */}
          <span onClick={showUpdateTenant.bind(this,obj)}>修改</span>
          <span onClick={catUpdateTenant.bind(this,obj)}>查看</span>
          {/* <span onClick={showLoginScheme.bind(this,text)}>登录方案</span> */}
        </div>
      )
    },
  ];
  const gotoPath=(record)=>{
    window.open(record.url)
  }
  //显示登录方案弹框
  const showLoginScheme=(tenantId)=>{
    //获取登录设置
    dispatch({
      type:"tenement/getLoginConfig",
      payload:{
        tenantId:tenantId
      },
      callback:()=>{
        dispatch({
          type:'tenement/updateStates',
          payload:{
            isShowLoginConfig:true,
            tenantId:tenantId
          }
        })
      }
    })
  }
  //显示共享组织弹框
  const shareOrgModalFn=(obj)=>{
    dispatch({
      type:'tenement/updateStates',
      payload:{
        isShowShareOrgModal:true,
        checkTenantId:obj.id
      }
    })
    //获取选中的共享组织
    dispatch({
      type:"tenement/getShareOrgInfo",
      payload:{
        tenantId:obj.id
      }
    })
    //获取组织中心
    dispatch({
      type:'tenement/getOrgCenters',
      payload:{
        searchWord:'',
        start:1,
        limit:10000,
        noShare:1,
        onlyShareOrgTenant:1,
        excludeTenantId:obj.id
      }
    })
    //获取共享组织勾选单位TODO
  }
  //修改弹框
  const showUpdateTenant=(obj)=>{
    setIsCat(false);
    dispatch({
      type:'tenement/updateStates',
      payload:{
        tenantInfo:obj,
        isShowUpdateModal:true
      }
    })
  }
  //修改弹框
  const catUpdateTenant=(obj)=>{
    setIsCat(true);
    dispatch({
      type:'tenement/updateStates',
      payload:{
        tenantInfo:obj,
        isShowUpdateModal:true
      }
    })
  }
  //获取列表
  const getTenants=(start,limit,searchWord)=>{
    dispatch({
      type:'tenement/getTenants',
      payload:{
        start,
        limit,
        searchWord
      }
    })
    setTimeout(()=>{
      setLoading(false)
    },200)
  }
  //分页
  const changePage=(nextPage,size)=>{
    dispatch({
      type:'tenement/updateStates',
      payload:{
        limit:size
      }
    })
    getTenants(nextPage,size,searchWord)
  }
  //搜索词
  const changeSearch=(e)=>{
    dispatch({
      type:'tenement/updateStates',
      payload:{
        searchWord:e.target.value
      }
    })
  }
  //搜索
  const searchWordFn=(value)=>{
    getTenants(1,limit,value);
  }
  //上传文件
  const onChangeFile=(e)=>{
    const file = e.target.files[0];
    // if(!this.props.fileType.includes(file.name.split('.')[1])){
    //   message.error('请上传正确的文件格式');
    //   return;
    // }
    const isLt = file.size / 1024 / 1024 < 2;
    if (!isLt) {
      message.error(`文件大小不符，必须小于2MB`, 5);
      return false;
    }
    const formData = new FormData();
            formData.append("file", file);
    // 构建请求配置对象
    const requestOptions = {
      method: 'POST',
      headers: {
        // 'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + window.localStorage.getItem('userToken_cloud'),
      },
      body: formData // 将参数转换为JSON字符串并放入requestBody
    };
        // 发送请求
        fetch(`${env}/lock/tenant/license`, requestOptions)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function(data) {
            // 处理成功响应
            if(data.code==200){
              dispatch({
                type:"tenement/getTenants",
                payload:{
                  start:1,
                  limit:limit,
                  searchWord:'',
                }
              })
              dispatch({
                type:"tenement/updateStates",
                payload:{
                  searchWord:''
                }
              })
            }else{
              message.error(data.mag)
            }
        })
        .catch(function(error) {
            // 处理请求错误
            console.error(error);
        });
    
    // dispatch({
    //   type:'tenement/uploadFile',
    //   payload:{
    //     file:file
    //   }
    // })
  }
  const accreditImport=()=>{
    dispatch({
      type:"tenement/updateStates",
      payload:{
        isShowAccredit:true
      }
    })
  }
  return (
    <div className={styles.table_warp} id='tenement_container'>
      <div className={styles.table_header}>
        <div className={styles.left}>
          <Search
            value={searchWord}
            allowClear
            onChange={changeSearch}
            // onSearch={searchWordFn}
            onSearch={(value)=>{searchWordFn(value)}}
            style={{width:'200px'}}
            placeholder="请输入租户名称/租户账号"
          />
        </div>
        <div className={styles.right}>
          <Button type="primary" className={styles.upload_button} onClick={accreditImport.bind(this)}>
            新增授权
            {/* <input type="file" onChange={onChangeFile} onClick={(event)=> { event.target.value = null }} /> */}
          </Button>
        </div>
      </div>
      <Spin spinning={loading}>
        <Table
        columns={columns}
        dataSource={list}
        pagination={false}
        rowKey="id"
        scroll={{y: scrollY}}
        />
      </Spin>
      <IPagination
        total={returnCount}
        current={currentPage}
        onChange={changePage}
        pageSize={limit}
        isRefresh={true}
        refreshDataFn={() => {setLoading(true); getTenants(1,limit,searchWord)}}
      />
      {isShowUpdateModal&&<ModalUpdateInfo location={location} isCat={isCat}/>}
      {isShowShareOrgModal&&<ShareOrgModal location={location} conteiner={'tenement_container'}/>}
      {isShowLoginConfig&&<LoginConfigModal location={location}/>}
      {isShowAccredit&&<AccreditImport location={location}/>}
    </div>
  )
}
export default connect(({tenement,layoutG})=>{return {tenement,layoutG}})(Index);
