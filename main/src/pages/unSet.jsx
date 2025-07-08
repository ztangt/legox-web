

import React, { useState } from 'react';
import { history } from 'umi';

import { Result,Button } from 'antd';

class Expection extends React.Component { 

 


  render(){
    

    return (
        <Result
        status="404"
        title="404"
        subTitle="未查询到租户信息"

        />
    )
  }
}
Expection.path = '/unSet';


export default Expection