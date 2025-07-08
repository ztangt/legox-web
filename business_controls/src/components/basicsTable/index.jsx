import React, { useState } from 'react';
import styles from './index.less';
import { Table } from 'antd';
import _ from 'lodash';
import {
  closeReSize,
  PADDING_HEIGHT,
  TABLE_HEAD_HEIGHT,
  PAGE_NATION_HEIGHT,
} from '../../util/constant';
const baseHeight = 300;

class BasicsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      height: 0,
    };
  }

  onResize() {
    const {
      dispatch,
      modulesName,
      container = 'dom_container',
      listHead = 'list_head',
    } = this.props;
    if (!dispatch || closeReSize) {
      return;
    }
    debugger;
    this.setState(
      {
        height:
          document.getElementById(`${container}`)?.clientHeight -
          document.getElementById(`${listHead}`)?.clientHeight -
          PADDING_HEIGHT,
      },
      () => {
        dispatch({
          type: `${modulesName}/updateStates`,
          payload: {
            limit: Math.floor(this.state.height / 40) || 10,
            currentHeight:
              this.state.height - 2 * TABLE_HEAD_HEIGHT - PAGE_NATION_HEIGHT,
          },
        });
      },
    );
  }
  // 设置默认高度和默认条数
  setBaseHeight() {
    const {
      dispatch,
      modulesName,
      container = 'dom_container',
      listHead = 'list_head',
    } = this.props;
    if (!dispatch) {
      return;
    }
    const baseHeight =
      document.getElementById(`${container}`)?.clientHeight -
      document.getElementById(`${listHead}`)?.clientHeight -
      PADDING_HEIGHT;
    dispatch({
      type: `${modulesName}/updateStates`,
      payload: {
        limit: Math.floor(baseHeight / 40),
        currentHeight: baseHeight - 2 * TABLE_HEAD_HEIGHT - PAGE_NATION_HEIGHT,
      },
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.setBaseHeight();
    }, 0);
    window.addEventListener('resize', this.onResize.bind(this));
    return () => {
      window.removeEventListener('resize', this.onResize.bind(this));
    };
  }

  render() {
    // 扩充通用功能：1.区分表格奇偶行
    const getRowClassName = (record, index) => {
      let className = '';
      className = index % 2 === 0 ? 'oddRow' : 'evenRow';
      return className;
    };

    const { ...others } = this.props;

    return (
      <div className={styles.wrapper}>
        <Table rowClassName={getRowClassName} {...others} />
      </div>
    );
  }
}

export default BasicsTable;
