import { Form, Input, Button, Checkbox ,Carousel} from 'antd';
import {useState,useEffect} from 'react';
import {connect} from 'dva';
import styles from './index.less';
import {setCookie,getCookie} from '../../util/util';
import {sm2} from 'sm-crypto';
import {SERVUCEPUBLICKEY} from '../../service/constant';
import {history} from 'umi';
function Login({dispatch,user}){
  console.log('window.localStorage.getItem("selfLogin")=',window.localStorage.getItem("selfLogin_cloud"));
  //获取用户，密码，是否记住密码，是否自动登录
  const defaultRemePwd = window.localStorage.getItem("remePwd_cloud")?window.localStorage.getItem("remePwd_cloud"):'0';
  const defaultSelfLogin = window.localStorage.getItem("selfLogin_cloud")?window.localStorage.getItem("selfLogin_cloud"):'0';
  const [remePwd,setRemePwd] = useState(defaultRemePwd );
  const [selfLogin,setSelfLogin] = useState(defaultSelfLogin);
  const userAccount = getCookie('userAccount_cloud');
  const password = getCookie('pkeys_cloud');
  console.log('remePwd=',remePwd);
  const [form] = Form.useForm();
  if(defaultSelfLogin=='1'){
    useEffect(() => {
      form.submit();
    });
  }
  useEffect(()=>{
    dispatch({
      type:"importAccredit/isExistLicense",
      callback:(isAuth)=>{
        if(!isAuth) {
          return history.push('/userAuthorization')
        } 
      }
    })
  },[])
  const onFinish=(values)=>{
    if(remePwd=='1' || selfLogin=='1'){
      console.log('remePwd11=',remePwd);
      //记住密码
      setCookie('userAccount_cloud',values['userAccount'],336)//存14天
      setCookie('pkeys_cloud',values['password'],336)//存14天
    }else{
      setCookie('userAccount_cloud','')//存14天
      setCookie('pkeys_cloud','')//存14天
    }
    window.localStorage.setItem("remePwd_cloud",remePwd);
    window.localStorage.setItem("selfLogin_cloud",selfLogin);
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
        // 登录的时候判断有没有进行授权，未进行授权进入授权页面
        // dispatch({
        //   type:"importAccredit/isExistLicense",
        //   callback:(isAuth)=>{
        //     if(!isAuth) {
        //       location.href="#/userAuthorization";
        //       return;
        //     } else {
        //       history.push('/');
        //     }
        //   }
        // sessionStorage.setItem('key',1)
      }
    })
  }
  //改变复选框
  const changeCheck=(type,e)=>{
    switch(type){
      case 'remeber':
        setRemePwd(e.target.checked?"1":"0");
        break;
      case 'self':
        setSelfLogin(e.target.checked?"1":"0");
        setRemePwd(e.target.checked?"1":"0");
        break;
    }
  }
  return (
    <div className={styles.login}>
      <Carousel
        autoplay
        className={styles.carousel_list}
      >
        <div>
          <h3 className={styles.carousel}>
            <img src={require('../../assets/login.png')} style={{width:'100%'}}/>
          </h3>
        </div>
        <div>
          <h3 className={styles.carousel}>
            <img src={require('../../assets/login.png')} style={{width:'100%'}}/>
          </h3>
        </div>
      </Carousel>
      <div className={styles.form_div}>
        <p>云管理平台</p>
        <div className={styles.form_form}>
        <Form
          name="login"
          form={form}
          onFinish={onFinish}
          className={styles.form}
          initialValues={{
            userAccount:userAccount,
            password:password
          }}
        >
          <p>用户登录</p>
          <Form.Item
            label=""
            name="userAccount"
            rules={[
              {
                required: true,
                message: '请输入账号!',
              },
            ]}
          >
            <Input className={styles.item}/>
          </Form.Item>
          <Form.Item
            label=""
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
            ]}
          >
            <Input.Password className={styles.item}/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.item}>
              登录
            </Button>
          </Form.Item>
          <div className={styles.check_div}>
            <Checkbox onChange={changeCheck.bind(this,'remeber')} checked={remePwd=="1"?true:false}>记住密码</Checkbox>
            <Checkbox onChange={changeCheck.bind(this,'self')} checked={selfLogin=="1"?true:false}>自动登录</Checkbox>
          </div>
        </Form>
        </div>
      </div>
    </div>
  )
}
export default connect(({user})=>{return {user}})(Login);
