

import React, { useState } from 'react';
import { history } from 'umi';

import { Result,Button } from 'antd';

class Expection extends React.Component { 

 


  render(){
    if(
      window.location.pathname?.split('/')?.length<=2||
      // (window.location.pathname?.split('/').length>2&&!window.location.pathname?.split('/')?.[2])||
      !window.location.hash||
      !localStorage.getItem('teantMark')
      // ||window.location.hash?.split('/').length<=2
      ){
      return null
    } 
    return (
        <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => history.push('/')}>
            Back Home
          </Button>}
        />
    )
  }
}

Expection.path = undefined;

export default Expection