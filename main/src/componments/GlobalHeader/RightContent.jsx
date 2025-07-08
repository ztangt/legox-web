import { Tooltip, Tag } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { connect, SelectLang, useDispatch,useSelector} from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';
const ct = window.localStorage.getItem("clientType");
const rt = window.localStorage.getItem("refreshToken");

const GlobalHeaderRight = (props) => {
  const dispatch = useDispatch();
  const { clientType,refreshToken } = useSelector(({user})=>({...user}));
  const ctype = clientType?clientType:ct
  const toFront = () =>{
    dispatch({
      type:'user/login',
      payload:{
        clientType: 'PC',
        fromState: 'PC',
        toState: 'FRONT',
        grantType: 'refresh_token',
        refreshToken: refreshToken?refreshToken:rt,
        identityId: localStorage.getItem('identityId')?localStorage.getItem('identityId'):'',
        registerCode: localStorage.getItem('registerCode')?localStorage.getItem('registerCode'):''
      }
    })
  }
  return (
    <div className={ styles.right}>
      { ctype && ctype.includes('FRONT') ? 
      <span 
        className={`${styles.to_front} anticon`}
        onClick={toFront.bind(this)}
      >
        业务前台
      </span> : '' }
      <Avatar />
    </div>
  );
};

export default GlobalHeaderRight;
