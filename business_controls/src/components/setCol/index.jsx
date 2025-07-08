/**设置列显示 */
/**
 * @selectColumnCode为选中的字段code
 * @allCols为起始的所有字段
 * @ID为popover所挂在的div
 * @saveCols为函数是确认的操作
 * @colVisiblePop是否显示弹框
 * @taskType类型不同类型
 * @changeColVisiblePop控制显示隐藏
 */
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Input, Popover, message } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';

const { Search } = Input;

function SetCol({
  changeColVisiblePop,
  taskType,
  colVisiblePop,
  saveCols,
  allCols,
  selectColumnCode,
  id,
}) {
  console.log(
    'changeColVisiblePop',
    changeColVisiblePop,
    taskType,
    colVisiblePop,
    saveCols,
    allCols,
    selectColumnCode,
    id,
  );

  const [cols, setCols] = useState([]);
  const [colSelectKey, setColSelectKey] = useState([]); //弹框里面的选中key
  const [indeterminate, setIndeterminate] = useState(false); //全选
  const [checkAll, setCheckAll] = useState(false);
  // console.log('colVisiblePop11=', colVisiblePop);
  //回显
  useEffect(() => {
    if (colVisiblePop) {
      //重新给所有的按照选中的排序
      let selectList = [];
      selectColumnCode.forEach((item) => {
        let columnsItem = allCols.find(
          (columnsItem) => columnsItem.key == item,
        );
        if (columnsItem) {
          selectList.push(columnsItem);
        }
      });
      let noSelectList = allCols.filter(
        (item) => !selectColumnCode.includes(item.key),
      );
      setCols([...selectList, ...noSelectList]);
      setCheckAll(selectColumnCode.length == allCols.length);
      setColSelectKey(selectColumnCode.length ? selectColumnCode : []);
      setIndeterminate(
        !!selectColumnCode.length && selectColumnCode.length < allCols.length,
      );
    }
  }, [colVisiblePop]);

  //去掉搜索
  // const changeColFn=(e)=>{
  //   let newCol = [];
  //   defalutCols.map((item)=>{
  //     if(item.title.includes(e.target.value)){
  //       newCol.push(item)
  //     }
  //   })
  //   setCols(newCol);
  // }
  //全选
  const onCheckAllChange = (e) => {
    let colSelectKey = [];
    cols.map((item) => {
      colSelectKey.push(item.key);
    });
    setColSelectKey(e.target.checked ? colSelectKey : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  //选中
  const onChangeCheck = (list) => {
    // console.log('list=', list);
    setColSelectKey(list);
    setIndeterminate(!!list.length && list.length < cols.length);
    setCheckAll(list.length === cols.length);
  };
  //保存
  const saveColsFn = () => {
    if (colSelectKey.length) {
      //调准顺序
      let newColSelectKey = [];
      let colSelect = [];
      cols.map((item) => {
        if (colSelectKey.filter((key) => key == item.key).length) {
          newColSelectKey.push(item.key);
          colSelect.push(item);
        }
      });
      saveCols(newColSelectKey, colSelect);
    } else {
      message.error('请选择要展示的列');
    }
  };
  // console.log('colSelectKey=', colSelectKey);
  //排序
  const moveCol = (event, index, e) => {
    e.stopPropagation();
    let newCols = _.cloneDeep(cols);
    if (event == 'up' && index != 0) {
      let preOne = newCols[index - 1];
      let currentOne = newCols[index];
      newCols[index - 1] = currentOne;
      newCols[index] = preOne;
    } else if (event == 'down' && index != cols.length - 1) {
      let nextOne = newCols[index + 1];
      let currentOne = newCols[index];
      newCols[index + 1] = currentOne;
      newCols[index] = nextOne;
    }
    setCols(newCols);
  };
  // console.log('cols=', cols);
  //显示搜索列的全部
  const allColFileld = (cols) => {
    return (
      <div className={styles.search_col_pop}>
        <div>
          <Checkbox
            onChange={onCheckAllChange}
            indeterminate={indeterminate}
            checked={checkAll}
          >
            全选
          </Checkbox>
        </div>

        <Checkbox.Group
          value={colSelectKey}
          className={styles.col_check}
          onChange={onChangeCheck}
        >
          {cols.map((item, index) => {
            return (
              <div className={styles.setCol_rows} key={item.key}>
                <div className={styles.col_row}>
                  <EllipsisOutlined rotate={90} />
                  <EllipsisOutlined
                    rotate={90}
                    style={{ marginLeft: '-8px' }}
                  />
                  <Checkbox value={item.key}>{item.title}</Checkbox>
                  <div
                    className={styles.move_col_box}
                    style={{ width: '30px' }}
                  >
                    <div className={styles.move_col}>
                      <ArrowUpOutlined
                        onClick={(e) => {
                          moveCol('up', index, e);
                        }}
                      />
                      <ArrowDownOutlined
                        onClick={(e) => {
                          moveCol('down', index, e);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Checkbox.Group>
        <div className={styles.p_opration}>
          <Button onClick={changeColVisiblePop.bind(this)}>取消</Button>
          <Button onClick={saveColsFn.bind(this)} type="primary">
            保存
          </Button>
        </div>
      </div>
    );
  };
  // console.log(document.getElementById(`${id}`), 22);
  // console.log('changeColVisiblePop=', colVisiblePop);
  return (
    <Popover
      placement="topRight"
      title={''}
      content={allColFileld(cols)}
      trigger="click"
      open={colVisiblePop}
      overlayInnerStyle={{ padding: 0 }}
      getPopupContainer={() => document.getElementById(`${id}`)}
      onOpenChange={changeColVisiblePop.bind(this)}
    >
      <SettingOutlined className={styles.col_set} />
    </Popover>
  );
}

export default SetCol;
