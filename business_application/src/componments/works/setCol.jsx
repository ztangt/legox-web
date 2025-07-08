/**设置列显示 */
/**
 * @defalutColumnCode为选中的字段code
 * @defalutCols为起始的所有字段
 * @ID为popover所挂在的div
 * @saveCols为函数是确认的操作
 * @colVisiblePop是否显示弹框
 * @taskType类型不同类型
 * @changeColVisiblePop控制显示隐藏
 */
import { useEffect, useState } from 'react';
import { Input, Checkbox, Row, Popover, message } from 'antd';
import {Button} from '@/componments/TLAntd';
import {
  SettingOutlined,
  EllipsisOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import styles from './list.less';
const { Search } = Input;
function SetCol({
  changeColVisiblePop,
  taskType,
  colVisiblePop,
  saveCols,
  defalutCols,
  defalutColumnCode,
  id,
}) {
  const [cols, setCols] = useState([]);
  const [colSelectKey, setColSelectKey] = useState([]); //弹框里面的选中key
  const [indeterminate, setIndeterminate] = useState(false); //全选
  const [checkAll, setCheckAll] = useState(false);
  // console.log('colVisiblePop11=', colVisiblePop);
  //回显
  useEffect(() => {
    if (colVisiblePop) {
      setCols(defalutCols);
      setCheckAll(defalutColumnCode.length == defalutCols.length);
      setColSelectKey(defalutColumnCode.length ? defalutColumnCode : []);
      setIndeterminate(
        !!defalutColumnCode.length &&
          defalutColumnCode.length < defalutCols.length,
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
      cols.map((item) => {
        if (colSelectKey.filter((key) => key == item.key).length) {
          newColSelectKey.push(item.key);
        }
      });
      saveCols(newColSelectKey);
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
        {/* <Search onChange={changeColFn} className={styles.p_search}/>
        <br/> */}
        <Checkbox
          onChange={onCheckAllChange}
          indeterminate={indeterminate}
          checked={checkAll}
        >
          全选
        </Checkbox>
        <Checkbox.Group
          style={{ width: '100%' }}
          value={colSelectKey}
          className={styles.col_check}
          onChange={onChangeCheck}
        >
          {cols.map((item, index) => {
            return (
              <div className={styles.setCol_rows} key={item.key}>
                <Row className={styles.col_row}>
                  <EllipsisOutlined rotate={90} style={{ marginTop: '3px' }} />
                  <EllipsisOutlined
                    rotate={90}
                    style={{ marginTop: '3px', marginLeft: '-8px' }}
                  />
                  <Checkbox value={item.key}>
                    <span>{item.title}</span>
                  </Checkbox>
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
                </Row>
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
  // console.log('changeColVisiblePop=', colVisiblePop);
  return (
    <Popover
      placement="topRight"
      title={''}
      content={allColFileld(cols)}
      trigger="click"
      visible={colVisiblePop}
      getPopupContainer={() => document.getElementById(`${id}`)}
      onVisibleChange={changeColVisiblePop.bind(this)}
    >
      <SettingOutlined className='col_set' />
    </Popover>
  );
}
export default SetCol;

