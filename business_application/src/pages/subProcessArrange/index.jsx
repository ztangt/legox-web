// 子流程编排
import React from 'react';
import { history } from 'umi';
import SubProcessArrange from './components/subProcessArrange';

export default ({location}) => {
    
  return (
      <SubProcessArrange  location={location}></SubProcessArrange>
  );
};