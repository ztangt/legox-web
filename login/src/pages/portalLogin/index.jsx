import { Form, Input, Button, Checkbox, Carousel } from 'antd';
import { useState, useEffect } from 'react';
import { setCookie, getCookie } from '../../util/util';
import {Base64} from 'js-base64'
import { connect } from 'dva';
import styles from './index.less';
import { sm2 } from 'sm-crypto';
import Verify from '../../componments/verify/VerifyComponent';
import DownloadPlugin from '../../componments/downloadPlugin';
import ContactPerson from '../../componments/contactPerson';
import { CopyrightOutlined } from '@ant-design/icons';
import { history } from 'umi'
import { parse } from 'query-string';
import { getTeantMark } from '../../util/loginUtil'
import img_logo from '../../../public/assets/qx_logo_portal.png'
import img_user from '../../../public/assets/user.png'
import img_password from '../../../public/assets/password.png'
// import bg_img from '../../../public/assets/qx_login_bg.png'
import bg_img from '../../../public/assets/login_bg_new.png'
import classnames from 'classnames';
const servicePublicKey =
  '0416e39a2a5023e90a4f8d0c663b7f9e21bcd430c122e767150b201dd5935d8953a08227be68de4a04c46d46c6b2644d3042889404a7dcda92c7f211ee29f20c8e';
function Login({ dispatch, user }) {
  const {
    tenantId,
    verifyVisible,
    curUserInfo,
    logos,
    dictTypes,
    copyRight,
    isShowDownloadPlugin,
    contactVisiable,
    contact,
    loginConfigInfo,
  } = user;
  console.log('logos', copyRight);
  const query = parse(history.location.search);
  const defaultRemePwd = window.localStorage.getItem('remePwd')
    ? window.localStorage.getItem('remePwd')
    : '0';
  const defaultSelfLogin = window.localStorage.getItem('selfLogin')
    ? window.localStorage.getItem('selfLogin')
    : '0';
  const [remePwd, setRemePwd] = useState(defaultRemePwd);
  const [selfLogin, setSelfLogin] = useState(defaultSelfLogin);
  const userAccount = getCookie('userAccount');
  const password = Base64.decode(getCookie('pkeys')?.slice(11));
  console.log('remePwd=', remePwd, dictTypes);
  const [form] = Form.useForm();
  useEffect(()=>{
    if (
      //当前访问租户与存在租户相同 且存在usertoken 根据当前登录平台跳转到相应页面
      window.location.pathname.split('/')[1] ==
        (window.localStorage.getItem('tenantMark') || mark) &&
      window.localStorage.getItem('userToken') &&
      window.localStorage.getItem('clientType')
    ) {
      if (
        window.location.href.includes('/business_application') ||
        window.location.href.includes('/support')
      ) {
      } else {
        window.location.href = `#/${
          window.localStorage.getItem('clientType') == 'PC'
            ? 'support'
            : 'business_application/portal'
        }`;
      }
    } else {
      //无token状态
      // window.localStorage.setItem('userToken', '');
      window.localStorage.setItem('selfLogin', '0');
      window.localStorage.setItem('userAccount', '');
      window.localStorage.setItem('tenantMark', '');
      window.localStorage.setItem('tenantId', '');
      window.localStorage.setItem('clientType', '');
      window.localStorage.setItem('visible', false);
      window.localStorage.setItem('firstLogo', ''); //首页logo
      // 遍历localstorage中的所有键值对
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        // 检查键是否包含'desktopType'
        if (key.includes('desktopType')) {
          // 删除包含'desktopType'的键值对
          window.localStorage.removeItem(key);
        }
      }
      mark = '';
      getTeantMark(dispatch);
    }
  },[])
  useEffect(()=>{ 
    document.title = loginConfigInfo.pageName
  },[loginConfigInfo])
  if (defaultSelfLogin == '1') {
    useEffect(() => {
      form.submit();
    });
  }
  const onFinish = (values) => {
    dispatch({
      type: 'user/updateStates',
      payload: {
        verifyVisible: true,
        curUserInfo: values,
      },
    });
  };

  const onCancel = () => {
    dispatch({
      type: 'user/updateStates',
      payload: {
        verifyVisible: false,
      },
    });
  };
  const randomWord = (num)=>{
    var str = "",
      arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let pos;
    for(var i=0; i<num; i++){   
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
  }

  const onSuccess = () => {
    dispatch({
      type: 'user/updateStates',
      payload: {
        verifyVisible: false,
      },
    });

    if (remePwd == '1' || selfLogin == '1') {
      let random=randomWord(11)
      let encryption=random+Base64.encode(curUserInfo['password'])
      //记住密码
      setCookie('userAccount', curUserInfo['userAccount'], 336); //存14天
      setCookie('pkeys', encryption, 336); //存14天
    } else {
      setCookie('userAccount', ''); //存14天
      setCookie('pkeys', ''); //存14天
    }
    window.localStorage.setItem('remePwd', remePwd);
    window.localStorage.setItem('selfLogin', selfLogin);
    window.localStorage.setItem('userAccount', curUserInfo['userAccount']);
    window.localStorage.setItem('tenantId', tenantId);
    const { registerCode} = query

    dispatch({
      type: 'user/login',
      payload: {
        userAccount:
          '04' + sm2.doEncrypt(curUserInfo['userAccount'], servicePublicKey),
        password:
          '04' + sm2.doEncrypt(curUserInfo['password'], servicePublicKey),
        grantType: 'password',
        clientType: 'PC',
        tenantId,
        identityId: localStorage.getItem('identityId')
          ? localStorage.getItem('identityId')
          : '',
        // registerCode: registerCode
        // ? registerCode
        // : localStorage.getItem('registerCode')
      },
    });
  };

  const changeCheck = (type, e) => {
    switch (type) {
      case 'remeber':
        setRemePwd(e.target.checked ? '1' : '0');
        break;
      // case 'self':
      //   setSelfLogin(e.target.checked ? '1' : '0');
      //   setRemePwd(e.target.checked ? '1' : '0');
      //   break;
    }
  };

  const showDownloadPlugin = () => {
    dispatch({
      type: 'user/updateStates',
      payload: {
        isShowDownloadPlugin: true,
      },
    });
  };

  const onContact = () => {
    dispatch({
      type: 'user/updateStates',
      payload: {
        contactVisiable: true,
      },
    });
  };
  return(
    <div className={styles.portal_login} id="login" style={{backgroundImage:`url(${logos && logos.PAGETAB_SCENELOGINPIC
      ? logos.PAGETAB_SCENELOGINPIC
      : bg_img})`}}>
        {isShowDownloadPlugin ? <DownloadPlugin /> : ''}
        <div className={styles.img_logo_container}>
        {/* <img src={img_logo} className={styles.img_logo}/> */}
        {/* <img src={logos && logos.PAGETAB_SCENELOGO
        ? logos.PAGETAB_SCENELOGO
        : img_logo} className={styles.img_logo}/> */}
        </div>
        <div className={styles.form_container}>
            <Form
              name="login"
              form={form}
              onFinish={onFinish}
              className={styles.form}
              initialValues={{
                userAccount: userAccount,
                password: password,
              }}
            >
              <p className={styles.form_title}>用户登录</p>
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
                <Input className={styles.item} placeholder="请输入账号" prefix={<img src={img_user}/>}/>
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
                <Input.Password
                  className={styles.item}
                  placeholder="请输入密码"
                  prefix={<img src={img_password}/>}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className={classnames(styles.item,styles.item_button)}>
                  登录
                </Button>
              </Form.Item>
              <div className={styles.check_div}>
                {dictTypes && dictTypes.PERSONENUM__REMPASS == 1 && (
                  <Checkbox
                    onChange={changeCheck.bind(this, 'remeber')}
                    checked={remePwd == '1' ? true : false}
                  >
                    记住密码
                  </Checkbox>
                )}
                {/* <Checkbox
                  onChange={changeCheck.bind(this, 'self')}
                  checked={selfLogin == '1' ? true : false}
                  style={{ float: 'right' }}
                >
                  自动登录
                </Checkbox> */}
                {dictTypes && dictTypes.PERSONENUM__DOWNLOAD == 1 && (
                  <a onClick={showDownloadPlugin} className={styles.base}>
                    下载
                  </a>
                )}
                {dictTypes && dictTypes.PERSONENUM__CONNADMIN == 1 && (
                  <a onClick={onContact} className={styles.base}>
                    联系管理员
                  </a>
                )}
              </div>
              {verifyVisible && (
                <Verify
                  onCancel={onCancel.bind(this)}
                  onSuccess={onSuccess.bind(this)}
                  style={{top: '40%'}}
                />
              )}
              {contactVisiable && <ContactPerson />}  
            </Form>
        </div>
    </div>
  )
}
export default connect(({ user }) => {
  return { user };
})(Login);
