import { Button, InputNumber } from 'antd';

// 单条最大长度
export const MAX_LENGTH = 10;

// 左侧编码方案的表格内容
export const codeTableProps = ({ dataSource, onRowClick, handleCarry }) => {
  return {
    rowKey: 'bizSolId',
    onRow: (record) => {
      return {
        onClick: () => {
          onRowClick(record);
        },
      };
    },
    columns: [
      {
        title: '基础数据类型',
        dataIndex: 'bizSolName',
        key: 'bizSolName',
        align: 'center',
      },
      {
        title: '编码方案',
        dataIndex: 'encodingPlan',
        key: 'encodingPlan',
        align: 'center',
      },
      {
        title: '基础数据结转',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, record) => {
          //isEnableFinishTurn : 能否结转 1:是，0:否  如果是0 显示无结转 如果不是 0 则走下面逻辑
          // baseDataFinishTurn: 基础数据是否结转 , 1:是，0:否
          //添加无结转
          return (
            <div>
              <Button
                type="primary"
                disabled={
                  record.isEnableFinishTurn === 0 ||
                  record.baseDataFinishTurn === 1
                }
                onClick={(e) => handleCarry(e, record)}
                style={{ width: '62px' }}
              >
                {record.isEnableFinishTurn === 0
                  ? '无结转'
                  : (record.baseDataFinishTurn === 1
                    ? '已结转'
                    : '结转')}
              </Button>
            </div>
          );
        },
      },
    ],
    dataSource: dataSource,
    pagination: false,
  };
};
// 每级长度的列表
const lengthTableArr = [
  {
    name: '第一级',
    key: 'firstGradeLength',
  },
  {
    name: '第二级',
    key: 'secondGradeLength',
  },
  {
    name: '第三级',
    key: 'thirdGradeLength',
  },
  {
    name: '第四级',
    key: 'fourthGradeLength',
  },
  {
    name: '第五级',
    key: 'fifthGradeLength',
  },
  {
    name: '第六级',
    key: 'sixthGradeLength',
  },
  {
    name: '第七级',
    key: 'seventhGradeLength',
  },
  {
    name: '第八级',
    key: 'eighthGradeLength',
  },
  {
    name: '第九级',
    key: 'ninthGradeLength',
  },
];

const lengthTableKeys = lengthTableArr.map((i) => i.key);

// 计算当前长度
export const computeLength = (list) => {
  return list.reduce((pre, cur) => {
    for (let k in cur) {
      if (lengthTableKeys.includes(k)) {
        pre += cur[k];
      }
    }
    return pre;
  }, 0);
};

// 处理编码方案
export const transformEncodingPlan = (config) => {
  return lengthTableKeys.reduce((pre, cur) => {
    if (config[cur] && config[cur] != 0) {
      pre += `${config[cur]}-`;
    }

    return pre;
  }, '');
};

// 获取每一级的数组
function getLengthColumns(dataSource) {
  if (dataSource.length > 0) {
    const ds = dataSource[0];
    return lengthTableArr.reduce((pre, cur) => {
      pre.push({
        lengthCode: cur.name,
        key: cur.key,
        isDisable: ds['baseDataFinishTurn'] === 1 ? true : false,
        gradeLength: Number(ds[cur.key]),
      });
      return pre;
    }, []);
  }
}
// 右侧各级长度的表格内容
export const lengthTableProps = ({
  dataSource,
  isHaveBaseDataList,
  onChange,
}) => {
  let lenTabDataSource = getLengthColumns(dataSource);
  return {
    columns: [
      {
        title: '级次',
        dataIndex: 'lengthCode',
        key: 'lengthCode',
        align: 'center',
      },
      {
        title: '长度',
        dataIndex: 'gradeLength',
        key: 'gradeLength',
        align: 'center',
        render: (text, record, index) => {
          // 是否已结转
          let canEdit = record.isDisable === 1 ? true : false;
          // 上一级是否有值
          let preInputHasVal = () => {
            let preItem = lenTabDataSource[index - 1];

            if (record.key === 'firstGradeLength') {
              return false;
            }

            if (preItem && preItem.gradeLength > 0) {
              return false;
            }

            return true;
          };
          // 判断当前层级是否含有基础数据
          let isHaveBaseData = () => {
            if (isHaveBaseDataList.length === 0) {
              return false;
            }

            return isHaveBaseDataList[index] ? true : false;
          };

          return (
            <div>
              <InputNumber
                min={0}
                max={MAX_LENGTH}
                precision={0}
                disabled={canEdit || preInputHasVal() || isHaveBaseData()}
                value={record.gradeLength}
                onChange={(val) => onChange(val, record)}
              />
            </div>
          );
        },
      },
    ],
    dataSource: lenTabDataSource,
    pagination: false,
  };
};
