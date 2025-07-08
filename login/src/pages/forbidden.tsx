

import React, { useState } from 'react';
import { history } from 'umi';

import { Result,Button } from 'antd';

class Expection extends React.Component { 

 


  render(){
    return (
        <Result
        status="403"
        title="403"
        subTitle="身份信息已变更，请重新登录。"
        />
    )
  }
}

Expection.path = undefined;

export default Expection