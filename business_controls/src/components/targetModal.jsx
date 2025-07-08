import React, { useContext, useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import { toChinese } from '../util/util';
import { Modal, InputNumber, Descriptions, message } from 'antd';

function Index({
  dispatch,
  targetWarning,
  containerId = 'targetWarning_id',
  WHETHER_WARNING_TLDT_,
  bizSolId,
  resetKeys,
}) {
  // const bizSolId = location.query.bizSolId;
  const { normCode, selectedRowKey, selectedRow, editCount } = targetWarning;
  const [ratioArr, setRatioArr] = useState([]);
  useEffect(() => {
    generateObj(selectedRow);
  }, [selectedRow]);

  function generateObj(selectedRow) {
    let arr = [];
    if (selectedRow.length === 1) {
      const row = selectedRow[0];
      arr = [
        row.JAN_RATIO || 0,
        row.FEB_RATIO || 0,
        row.MAR_RATIO || 0,
        row.APR_RATIO || 0,
        row.MAY_RATIO || 0,
        row.JUN_RATIO || 0,
        row.JUL_RATIO || 0,
        row.AUG_RATIO || 0,
        row.SEP_RATIO || 0,
        row.OCT_RATIO || 0,
        row.NOV_RATIO || 0,
        row.DEC_RATIO || 0,
      ];
    } else {
      arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    setRatioArr(arr);
  }

  const handelCanel = () => {
    dispatch({
      type: 'targetWarning/updateStates',
      payload: {
        isShowEditModal: false,
      },
    });
  };

  function combinationIds() {
    const ids = [];
    for (let i = 0; i < selectedRow.length; i++) {
      ids.push({
        ID: selectedRow[i].ID,
        UPDATE_TIME: selectedRow[i].UPDATE_TIME || '',
      });
    }
    return ids;
  }

  function combinationParams() {
    const params = {
      JAN_RATIO: ratioArr[0],
      FEB_RATIO: ratioArr[1],
      MAR_RATIO: ratioArr[2],
      APR_RATIO: ratioArr[3],
      MAY_RATIO: ratioArr[4],
      JUN_RATIO: ratioArr[5],
      JUL_RATIO: ratioArr[6],
      AUG_RATIO: ratioArr[7],
      SEP_RATIO: ratioArr[8],
      OCT_RATIO: ratioArr[9],
      NOV_RATIO: ratioArr[10],
      DEC_RATIO: ratioArr[11],
      WHETHER_WARNING_TLDT_,
    };
    // 修改：1-12月份传入设置的值，WHETHER_WARNING_TLDT_不传
    if (WHETHER_WARNING_TLDT_ === undefined) {
      delete params['WHETHER_WARNING_TLDT_'];
    }
    return params;
  }

  const handelOk = () => {
    let count = 0;
    for (let i = 0; i < ratioArr.length; i++) {
      if (ratioArr[i] == 0) {
        count++;
      }
    }
    if (count == 12) {
      message.warning('请设置预算指标使用百分比！');
      return;
    }
    let ids = JSON.stringify(combinationIds());
    let budgetNormRatioVos = JSON.stringify(combinationParams());
    dispatch({
      type: 'targetWarning/saveWarning',
      payload: {
        ids,
        bizSolId,
        budgetNormRatioVos,
        // WHETHER_WARNING_TLDT_,
      },
      callback: function () {
        resetKeys();
        dispatch({
          type: 'targetWarning/updateStates',
          payload: {
            isShowEditModal: false,
            editCount: editCount + 1,
          },
        });
      },
    });
  };

  const onChange = (index, val) => {
    const tmp = ratioArr;
    tmp[index] = val;
    setRatioArr(tmp);
  };

  const limitDecimalPoint = (value) => {
    let reg = /^(-)*(\d+)\.(\d\d).*$/;
    return (
      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '').replace(reg, '$1$2.$3') +
      '%'
    );
  };

  return (
    <Modal
      title="修改预算指标管控"
      open={true}
      onCancel={handelCanel}
      maskClosable={false}
      mask={false}
      width={1000}
      getContainer={() => {
        return document.getElementById(containerId);
      }}
      onOk={handelOk}
    >
      <Descriptions
        bordered
        title="预算指标使用百分比管控"
        size="small"
        column={2}
      >
        {ratioArr.map((item, index) => {
          return (
            <Descriptions.Item label={`${toChinese(index + 1)}月`} key={index}>
              <InputNumber
                defaultValue={item}
                min={0}
                max={100}
                step={0.01}
                // formatter={(value) => `${value}%`}
                formatter={limitDecimalPoint}
                parser={(value) => value.replace('%', '')}
                onChange={(val) => onChange(index, val)}
              />
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    </Modal>
  );
}
export default connect(({ targetWarning }) => ({ targetWarning }))(Index);
