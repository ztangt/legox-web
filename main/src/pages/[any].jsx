

import React, { useState } from 'react';
import { history } from 'umi';

import { Result,Button } from 'antd';

class Expection extends React.Component { 

 


  render(){
    

    return (
        <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => historyPush('/')}>
            Back Home
          </Button>}
        />
    )
  }
}

Expection.path = undefined;

export default Expection