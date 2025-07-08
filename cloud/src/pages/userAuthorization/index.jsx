import {Form,Input,Button,Descriptions,message} from 'antd';
import styles from './index.less';
import {history} from 'umi';
import {connect} from 'dva';
import { useState, useEffect } from 'react';
import {SERVUCEPUBLICKEY} from '../../service/constant';
import {sm2} from 'sm-crypto';
import { env } from '../../../../project_config/env';
function UserAuthorization({dispatch,importAccredit}){
  // const [step,setStep] = useState(1);
  const [initdata,setInitData]=useState({})
  const [importResult,setImportResult]=useState(false)
  console.log(initdata,'initdata');
  const [fields, setFields] = useState([
    {
        name: ['userAccount'],
        value: '',
    },
    {
        name:['password'],
        value:'',
    }
  ]);
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
    const requestOptions = {
      method: 'POST',
      headers: {
          // 'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + window.localStorage.getItem('userToken_cloud'),
      },
      body: formData // 将参数转换为JSON字符串并放入requestBody
  };
  // 发送请求
  // fetch(`${env}/lock/cloud/license/add`, requestOptions)
  //     .then(function (response) {
  //         if (!response.ok) {
  //             throw new Error('Network response was not ok');
  //         }
  //         return response.json();
  //     })
  //     .then(function (data) {
  //         // 处理成功响应
  //         if (data.code == 200) {
  //           setInitData(data.data.authInfo)
  //           setImportResult(data.data.importResult)
  //         } else if (data.code != 401 && data.code != 419 && data.code != 403) {
  //             message.error(data.msg)
  //         }
  //     })
  //     .catch(function (error) {
  //         // 处理请求错误
  //         console.error(error);
      // });

    dispatch({
      type:'importAccredit/uploadFile',
      payload:{data:formData},
      callback:(data)=>{
        setInitData(data.authInfo)
        setImportResult(data.importResult)
        // setFields([
        //   {
        //     name: ['userAccount'],
        //     value: data.userAccount,
        //   },
        //   {
        //     name:['password'],
        //     value:data.userPassWord,
        //   }
        // ])
        // setStep(3)
      }
    })
  }
  //登录
  const onFinish=(values)=>{
    let oldUserAccount = values['userAccount'].trim();
    values['userAccount']='04'+sm2.doEncrypt(values['userAccount'],SERVUCEPUBLICKEY);
    values['password']='04'+sm2.doEncrypt(values['password'],SERVUCEPUBLICKEY);
    dispatch({
      type:'user/login',
      payload:{
        ...values,
        clientType:'CLOUD',
        oldUserAccount:oldUserAccount
      },
      callback:()=>{
        history.push('/');
      }
    })
  }


  return (
    <div className={styles.content}>
      {/* {
        (step==1? */}
          <div className={styles.import_warp}>
            <img src={require('../../../public/assets/import_img.png')}/>
            <div className={styles.import_div}>
              <p className={styles.import_title}>授权导入</p>
              <input type="file" onChange={onChangeFile} onClick={(event)=> { event.target.value = null }} />

              {importResult&&<div className={styles.success_content}>
                <p>授权导入成功！</p>
                <p><span>登录账号</span>：<span>{initdata&&initdata.userAccount}</span></p>
                <p><span>登录密码</span>：<span>{initdata&&initdata.password}</span></p>
                <p style={{color:'red'}}>注: 仅初始授权导入提供账号密码信息，请自行记住密码!</p>
                <p><Button onClick={()=>{ location.href="#/login"}}>跳转至登录页</Button> <span style={{color:'red',marginLeft:16}}>注:跳转至登录页或关闭页面!</span></p>
              </div>}
            </div>
          </div>
          {/* :
          <div className={styles.user_warp}>
            <p className={styles.form_title}>用户信息</p>
            <Form
              className={styles.form_cr}
              name="login"
              onFinish={onFinish}
              layout='vertical'
              fields={fields}
            >
              <Form.Item
                label="管理员"
                name="userAccount"
                rules={[
                  {
                    required: true,
                    message: '请输入账号',
                  },
                  { max: 50,message:'最多输入50个字符'}
                ]}
              >
                <Input placeholder='请输入账号' className={styles.input_warp}/>
              </Form.Item>
              <Form.Item
                label="密码"
                name="password"
                rules={[
                  {
                    required: true,
                    message: '请输入密码',
                  },
                ]}
              >
                <Input.Password placeholder='请输入密码' className={styles.input_warp}/>
              </Form.Item>
              <div>
                <Button type="primary" htmlType="submit" className={styles.submit_btn}>
                  进入系统
                </Button>
              </div>
            </Form>
          </div>
        )
      } */}
    </div>
  )
}
export default connect(({userAuthorization,layoutG})=>({
  userAuthorization,
  layoutG,
}))(UserAuthorization);