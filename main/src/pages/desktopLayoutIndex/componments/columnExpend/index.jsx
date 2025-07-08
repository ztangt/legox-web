/**
 * @author zhangww
 * @description 栏目-支出信息汇总（TODO）
 */

import React from 'react';
import styles from './index.less';

function Index() {

  return (
      <div className={styles.pay_info}>
        <h1>个人支出信息汇总</h1>
        <ul className={styles.pay_list}>
          <li>
            <i>个人报销</i>
            <span>报销在途</span>
            <b>151,462.35</b>
          </li>
          <li>
            <i>已完成报销</i>
              <span>报销完结</span>
              <b>31,458.82</b>
            </li>
          <li>
          <i>费用申请</i>
            <span>未核销申请</span>
            <b>8,462.58</b>
          </li>
          <li>
              <i>我的借款</i>
            <span>借款余额</span>
            <b>31,458.82</b>
          </li>
        </ul>
      </div>

  );
}

export default Index;
