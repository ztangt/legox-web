import { Button, DatePicker, Modal, Table, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { useEffect } from 'react';
import style from './codingScheme.less';
import {
  MAX_LENGTH,
  codeTableProps,
  computeLength,
  lengthTableProps,
  transformEncodingPlan,
} from './config';

function CodingScheme({ dispatch, codingScheme }) {
  const {
    codingPlanList,
    usedYear,
    codingPlanItem,
    isHaveBaseDataList,
  } = codingScheme;

  useEffect(() => {
    dispatch({
      type: 'codingScheme/getCodingPlanList',
      payload: {
        usedYear: String(new Date().getFullYear()),
      },
      callback: (bizSolId) => {
        dispatch({
          type: 'codingScheme/getIsHaveBaseData',
          payload: {
            bizSolId,
            usedYear: String(new Date().getFullYear()),
          },
        });
      },
    });
  }, []);
  // 点击保存
  const handleSave = () => {
    const encodingPlan = transformEncodingPlan(codingPlanItem[0]).slice(0, -1);
    // 映射对应key 查找为null
    const mapKey = [
      'firstGradeLength',
      'secondGradeLength',
      'thirdGradeLength',
      'fourthGradeLength',
      'fifthGradeLength',
      'sixthGradeLength',
      'seventhGradeLength',
      'eighthGradeLength',
      'ninthGradeLength',
    ];
    if (codingPlanItem && codingPlanItem.length > 0) {
      for (let key in codingPlanItem[0]) {
        if (mapKey.includes(key)) {
          if (codingPlanItem[0][key] == null) {
            codingPlanItem[0][key] = 0;
          }
        }
      }
    }

    dispatch({
      type: 'codingScheme/saveCodingPlan',
      payload: {
        ...codingPlanItem[0],
        totalLength: computeLength(codingPlanItem),
        encodingPlan,
        usedYear,
      },
    });
  };
  // 更改数字事件
  const onNumChange = (value, record) => {
    const newCodingPlanItem = codingPlanItem.reduce((pre, cur) => {
      pre.push({
        ...cur,
        [record.key]: value,
      });
      return pre;
    }, []);

    let curLen = computeLength(newCodingPlanItem);
    // 判断当前的总长度是否超过30
    if (curLen <= 30) {
      dispatch({
        type: 'codingScheme/updateStates',
        payload: {
          codingPlanItem: newCodingPlanItem,
        },
      });
    } else {
      message.error('总长度不超过30!');
    }
  };
  // 点击单条内容切换
  const onRowClick = (record) => {
    // 更新当前选中的项目
    dispatch({
      type: 'codingScheme/updateStates',
      payload: {
        codingPlanItem: [record],
      },
    });
    // 获取每级是否含有基础数据
    dispatch({
      type: 'codingScheme/getIsHaveBaseData',
      payload: {
        usedYear,
        bizSolId: record.bizSolId,
      },
    });
  };

  // 选择日期
  const onDatePackerChange = (date, dateString) => {
    dispatch({
      type: 'codingScheme/updateStates',
      payload: {
        usedYear: dateString,
      },
    });
    dispatch({
      type: 'codingScheme/getCodingPlanList',
      payload: {
        usedYear: dateString,
      },
      callback: (bizSolId) => {
        dispatch({
          type: 'codingScheme/getIsHaveBaseData',
          payload: {
            bizSolId,
            usedYear: dateString,
          },
        });
      },
    });
  };

  // 结转按钮
  const handleCarry = (e, record) => {
    e.stopPropagation();

    Modal.confirm({
      title: '提示',
      content: '是否继续结转? (将覆盖原有数据)',
      okText: '确定',
      cancelText: '取消',
      mask: false,
      getContainer: () => {
        return document.getElementById('codingScheme');
      },
      onOk: () => {
        dispatch({
          type: 'codingScheme/saveBaseEncodingPlan',
          payload: {
            bizSolId: record.bizSolId,
            usedYear,
          },
        });
      },
    });
  };

  // 编码方案结转
  const handleCodingPlanCarry = () => {
    Modal.confirm({
      title: '提示',
      content: '是否继续结转? (将覆盖原有数据)',
      okText: '确定',
      cancelText: '取消',
      mask: false,
      getContainer: () => {
        return document.getElementById('codingScheme');
      },
      onOk: () => {
        dispatch({
          type: 'codingScheme/finishTurn',
          payload: { usedYear },
        });
      },
    });
  };

  return (
    <div className={style.warp} id="codingScheme">
      <div className={style.handleWarp}>
        <div>
          <DatePicker
            onChange={(date, dateString) => {
              onDatePackerChange(date, dateString);
            }}
            picker="year"
            value={moment(new Date(usedYear))}
            allowClear={false}
            style={{ marginLeft: 8 }}
          />
        </div>
        <div>
          <Button
            type="primary"
            onClick={handleSave}
            style={{ marginRight: 8 }}
          >
            保存
          </Button>
          <Button
            type="primary"
            onClick={handleCodingPlanCarry}
            style={{ marginRight: 8 }}
          >
            编码方案结转
          </Button>
        </div>
      </div>
      <div className={style.tableWarp}>
        <Table
          {...codeTableProps({
            dataSource: codingPlanList,
            onRowClick,
            handleCarry,
          })}
          style={{ width: '50%' }}
          scroll={{ y: 'calc(100vh - 320px)' }}
        />
        <Table
          {...lengthTableProps({
            dataSource: codingPlanItem,
            isHaveBaseDataList,
            onChange: onNumChange,
          })}
          style={{ width: '50%', marginLeft: 20 }}
          scroll={{ y: 'calc(100vh - 320px)' }}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                  <div style={{ textAlign: 'center' }}>
                    单级最大长度：{MAX_LENGTH}
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <div style={{ textAlign: 'center' }}>
                    总长度：{computeLength(codingPlanItem)}
                  </div>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>
    </div>
  );
}

export default connect(({ codingScheme }) => ({
  codingScheme,
}))(CodingScheme);
