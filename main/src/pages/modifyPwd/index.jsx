import { Form, Input, Button, Carousel, message } from 'antd';
import {connect} from 'dva';
import styles from './index.less'
// export async function delay(timeout) {
//   return new Promise(function(resolve, reject) {
//       setTimeout(resolve, timeout);
//   });
// }
function Login({dispatch,user}){
  const {
    logos,
    copyRight,
  } = user;
  const ls = JSON.parse(window.localStorage.getItem('logos'))||logos

  const onFinish=(values)=>{
    if(values.againPwd!= values.newPwd){
      message.error('两次输入密码不一致!')
      return
    }
    dispatch({
      type:'user/updatePassword',
      payload: {
        ...values
      }
    })

  }
  const validatorPwd = (rule, value, callback) => {
    if(value){
      let matchPwd = /(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]/;
      if(!matchPwd.test(value)){
        callback('请输入数字和字母');
      }else{
        callback();
      }
    }else{
      callback();
    }
  }

  return (
    <div className={styles.login}>
        <Carousel autoplay className={styles.carousel_list}>
          <div>
            <h3 className={styles.carousel}>
              <img
                src={ls&&ls.PAGETAB_LOGINPIC?ls.PAGETAB_LOGINPIC:require('../../../public/assets/login_banner1.jpg')}
                style={{ width: '100%' }}
              />
            </h3>
          </div>
          <div>
            <h3 className={styles.carousel}>
              <img
                src={ls&&ls.PAGETAB_LOGINPIC?ls.PAGETAB_LOGINPIC:require('../../../public/assets/login_banner1.jpg')}
                style={{ width: '100%' }}
              />
            </h3>
          </div>
      </Carousel>
        <div className={styles.form_div}>

          <div className={styles.form_form}>
          <Form
          className={styles.form}
          onFinish={onFinish}
          >
        <p>修改密码</p>
        <Form.Item
          label=""
          name="oldPassword"
          rules={[
            {
              required: true,
              message: '请输入新密码',
            },
            { max: 50,message:'最多输入50个字符'},
            {
              validator: validatorPwd
            }
            
          ]}
        >
          <Input.Password style={{width:'340px',height: '45px'}} placeholder='数字+字母'/>
        </Form.Item>
        <Form.Item
          label=""
          name="newPassword"
          rules={[
            {
              required: true,
              message: '再次输入新密码',
            },
          ]}
        >
          <Input.Password style={{width:'340px',height: '45px'}} placeholder='再次输入新密码'/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.item}>
            确认修改
          </Button>
        </Form.Item>
      </Form>
          </div>
          
          <div className={styles.footer}>
            {copyRight && copyRight.LOGIN_COPYRIGHT
              ? copyRight.LOGIN_COPYRIGHT
              : ''}
          </div>
        </div>
          
    </div>

  )
}
export default connect(({user})=>{return {user}})(Login);
