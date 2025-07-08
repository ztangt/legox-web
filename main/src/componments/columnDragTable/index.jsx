import React, { useState } from 'react';
import classnames from 'classnames';
import './index.less';
import styles from './index.less';
import _ from 'lodash';
import { Table } from 'antd';
import { connect } from 'dva';
import { history } from 'umi';
import { toLine, checkAndReplace } from '../../util/util';
import {
  PADDING_HEIGHT,
  TABLE_HEAD_HEIGHT,
  PAGE_NATION_HEIGHT,
} from '../../util/constant';
import { ReactComponent as Fixation } from './line.svg';
import { Resizable } from 'react-resizable';
import ReactDragListView from 'react-drag-listview';
import { BASE_WIDTH, closeReSize } from '../../util/constant';

// 宽度可伸缩render
const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  // 添加偏移量
  const [offset, setOffset] = useState(0);

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      // 宽度重新计算结果，表头应当加上偏移量，这样拖拽结束的时候能够计算结果；
      width={width + offset}
      height={0}
      minConstraints={[50, 50]}
      handle={
        <span
          // 有偏移量显示竖线
          className={classnames(['react-resizable-handle', offset && 'active'])}
          // 拖拽层偏移
          style={{ transform: `translateX(${offset}px)` }}
          onClick={(e) => {
            // 取消冒泡，不取消貌似容易触发排序事件
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      }
      // 拖拽事件实时更新
      onResize={(e, { size }) => {
        // 这里只更新偏移量，数据列表其实并没有伸缩
        setOffset(size.width - width);
      }}
      // 拖拽结束更新
      onResizeStop={(...argu) => {
        // 拖拽结束以后偏移量归零
        setOffset(0);
        // 这里是props传进来的事件，在外部是列数据中的onHeaderCell方法提供的事件，请自行研究官方提供的案例
        onResize(...argu);
      }}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

class DragTable extends React.Component {
  constructor(props) {
    super(props);
    this.onResizeDebounced = _.debounce(this.onResize, 100);
    this.reverseStorageDebounced = _.debounce(this.reverseStorage, 100);
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
      sumFlags,
      showTabs,
      setParentState,
    } = this.props;
    this.setState(
      {
        height:
          document.getElementById(`${container}`)?.clientHeight -
          document.getElementById(`${listHead}`)?.clientHeight -
          PADDING_HEIGHT -
          (showTabs ? 60 : 0),
      },
      () => {
        if (!closeReSize) {
          if (modulesName == 'setState') {
            setParentState({
              limit: Math.floor(this.state.height / 40) || 10,
            });
          } else {
            dispatch({
              type: `${modulesName}/updateStates`,
              payload: {
                limit: Math.floor(this.state.height / 40) || 10,
              },
            });
          }
        }
        if (modulesName == 'setState') {
          setParentState({
            currentHeight:
              this.state.height -
              8 -
              2 * TABLE_HEAD_HEIGHT -
              PAGE_NATION_HEIGHT -
              (sumFlags ? 35 : 0),
          });
        } else {
          dispatch({
            type: `${modulesName}/updateStates`,
            payload: {
              currentHeight:
                this.state.height -
                8 -
                2 * TABLE_HEAD_HEIGHT -
                PAGE_NATION_HEIGHT -
                (sumFlags ? 35 : 0),
            },
          });
        }
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
      sumFlags,
      showTabs,
      reqFlag,
      setParentState,
    } = this.props;
    const baseHeight =
      document.getElementById(`${container}`)?.clientHeight -
      document.getElementById(`${listHead}`)?.clientHeight -
      PADDING_HEIGHT -
      (showTabs ? 60 : 0);

    if (!reqFlag) {
      if (modulesName == 'setState') {
        setParentState({
          limit: Math.floor((baseHeight-160) / 40),
          currentHeight:
            baseHeight -
            8 -
            2 * TABLE_HEAD_HEIGHT -
            PAGE_NATION_HEIGHT -
            (sumFlags ? 35 : 0),
        });
      } else {
        dispatch({
          type: `${modulesName}/updateStates`,
          payload: {
            limit: Math.floor((baseHeight-160) / 40),
            currentHeight:
              baseHeight -
              8 -
              2 * TABLE_HEAD_HEIGHT -
              PAGE_NATION_HEIGHT -
              (sumFlags ? 35 : 0),
          },
        });
      }
    } else {
      if (modulesName == 'setState') {
        setParentState({
          currentHeight:
            baseHeight -
            8 -
            2 * TABLE_HEAD_HEIGHT -
            PAGE_NATION_HEIGHT -
            (sumFlags ? 35 : 0),
        });
      } else {
        dispatch({
          type: `${modulesName}/updateStates`,
          payload: {
            // limit: Math.floor(baseHeight / 40),
            currentHeight:
              baseHeight -
              8 -
              2 * TABLE_HEAD_HEIGHT -
              PAGE_NATION_HEIGHT -
              (sumFlags ? 35 : 0),
          },
        });
      }
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setBaseHeight();
    }, 0);
    window.addEventListener('resize', this.onResizeDebounced.bind(this));
    return () => {
      window.removeEventListener('resize', this.onResizeDebounced.bind(this));
    };
  }

  // columns的title需包裹一层标签 为了可以拖动和缩放互不影响
  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log(nextProps,'nextProps');
    // console.log('🔥：', nextProps, 'nextProps', prevState);
    if (nextProps.columns !== prevState.columns&&(typeof nextProps.isDrag=='undefined' || nextProps.isDrag)) {
      const columns = nextProps.columns;
      if (columns.length && typeof columns[0].title == 'string') {
        columns.forEach((element, index) => {
          // element.title = <p className="dragHandler">{element.title}</p>;
          if (element.title !== '序号' || element.title !== '操作') {
            element.title = (
              <div className="drag_title">
                <p className="dragHandler">{element.title}</p>
                <Fixation
                  width={22}
                  height={22}
                  title="固定列"
                  className="custom_btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const { bizSolId, listId } = nextProps.location.query;
                    let obj = {
                      row: element.key,
                      fixedVal: !element.fixed,
                    };
                    let fixedRows = localStorage.getItem(
                      `fixedRows-${bizSolId}-${listId}`,
                    )
                      ? JSON.parse(
                          localStorage.getItem(
                            `fixedRows-${bizSolId}-${listId}`,
                          ),
                        )
                      : [];
                    checkAndReplace(fixedRows, obj);
                    localStorage.setItem(
                      `fixedRows-${bizSolId}-${listId}`,
                      JSON.stringify(fixedRows),
                    );
                    nextProps.setRowKeyVal &&
                      nextProps.setRowKeyVal(JSON.stringify(fixedRows));
                  }}
                />
              </div>
            );
          }
          element.width = parseInt(element.width) || BASE_WIDTH;
        });
        return {
          columns: columns || [],
        };
      }
    }
    return null;
  }

  // 设置后数据 与后端交互保存一哈
  reverseStorage(columns) {
    let colSelectKey = [];
    columns.forEach((item, index) => {
      // 表头首&尾 不做处理
      if (index === 0 || index + 1 === columns.length) {
        return;
      }
      // dynamic动态页面直接存
      if (this.props.taskType === 'dynamic') {
        colSelectKey.push(item.key);
      } else {
        // other _ & toUpperCase
        colSelectKey.push(toLine(item.key).toUpperCase());
      }
    });
    // 抛出设置后数据 req
    this.props.saveCols(colSelectKey);
  }

  components = {
    header: {
      cell: ResizableTitle,
    },
  };

  // 调整列宽方法
  handleResize =
    (index) =>
    (e, { size }) => {
      // console.log('🔥：', size);
      e.stopImmediatePropagation();
      const { taskType } = this.props;
      // 监控 分类 暂不支持     动态页面|| taskType === 'dynamic'
      if (taskType === 'MONITOR' || taskType === 'CATEGORY') {
        return;
      }
      const _this = this;
      this.setState(({ columns }) => {
        const nextColumns = [...columns];
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width ? size.width : 100,
        };
        // _this.reverseStorageDebounced(nextColumns);
        return { columns: nextColumns };
      });
    };

  render() {
    const { isDrag,components, columns, disableDrap,needClassName=true, taskType, ...others } =
      this.props;
    // console.log('columns', columns, 'others', others);

    const that = this;

    // 扩充通用功能：1.区分表格奇偶行
    const getRowClassName = (record, index) => {
      let className = '';
      className = index % 2 === 0 ? 'oddRow' : 'evenRow';
      return className;
    };

    const dragProps = {
      // 列拖拽排序
      onDragEnd(from, to) {
        // 监控 分类 不支持
        if (taskType === 'MONITOR' || taskType === 'CATEGORY') {
          return;
        }
        const columns = [...that.state.columns];
        let fromIndex = from;
        let toIndex = to;
        // 单独处理分类事项 所有事项 动态页面 的起始标记（有rowSelection index都需-1）
        if (
          taskType === 'CIRCULATE' ||
          taskType === 'ALL' ||
          taskType === 'dynamic'
        ) {
          fromIndex--;
          toIndex--;
        }
        // 首尾不让拖动 也不可其他位置拖至首尾  首尾必须固定位置！
        if (
          fromIndex === 0 ||
          toIndex === 0 ||
          fromIndex + 1 === columns.length ||
          toIndex + 1 === columns.length
        ) {
          return;
        }
        const item = columns.splice(fromIndex, 1)[0];
        columns.splice(toIndex, 0, item);
        that.reverseStorageDebounced(columns);
      },
      nodeSelector: 'th',
      handleSelector: '.dragHandler',
      ignoreSelector: 'react-resizable-handle',
    };

    const newColumns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: (column) => ({
        width:
          column.width && column.width !== 'auto'
            ? parseInt(column.width) || 100
            : 100,
        onResize: this.handleResize(index),
      }),
    }));
    return (
      <div className={styles.drag_tabel} id="drag_table">
        {taskType === 'MONITOR' || taskType === 'CATEGORY'||!isDrag ? (
          components?
          <Table rowClassName={needClassName?getRowClassName:''} columns={columns} {...others} components={components} />:
          <Table rowClassName={needClassName?getRowClassName:''} columns={columns} {...others}/>
        ) : (
          <ReactDragListView.DragColumn {...dragProps}>
            <Table
              rowClassName={needClassName?getRowClassName:''}
              components={this.components}
              columns={newColumns}
              {...others}
            />
          </ReactDragListView.DragColumn>
        )}
      </div>
    );
  }
}

export default connect(({ columnDragTable, layoutG }) => ({
  columnDragTable,
  layoutG,
}))(DragTable);
