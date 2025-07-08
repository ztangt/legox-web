import { Table } from 'antd';
import classnames from 'classnames';
import { connect } from 'dva';
import _ from 'lodash';
import React, { useState } from 'react';
import ReactDragListView from 'react-drag-listview';
import { Resizable } from 'react-resizable';
import { BASE_WIDTH, PADDING_HEIGHT, PAGE_NATION_HEIGHT, TABLE_HEAD_HEIGHT } from '../../util/constant';
import { toLine } from '../../util/util';
import './index.less';
import styles from './index.less';

/**
 * 建议弹窗中有列表的时候也用这个，外部传入modal_id和modal_head_id的名称
 * 例如： container="modal_id"
 * listHead="modal_head_id"
 * 不过currentHeight要从父级获取redux值,然后传入子组件去使用，防止重复渲染
 * **/
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
        this.reverseStorageDebounced = _.debounce(this.reverseStorage, 100);
        this.state = {
            columns: [],
            height: 0,
            columnsWidth: [], //存储每列的宽度
        };
    }

    onResize() {
        const {
            listRef,
            dispatch,
            modulesName,
            container = 'dom_container_cma',
            listHead = 'list_head_cma',
            setParentState,
        } = this.props;
        // dom_container

        let listHeadHeight = document.getElementById(`${listHead}`)?.clientHeight || 0;
        this.setState(
            {
                height: document.querySelector('.ant-tabs-content').clientHeight - listHeadHeight - PADDING_HEIGHT,
            },
            () => {
                console.log(
                    document.querySelector('.ant-tabs-content').clientHeight,
                    "document.querySelector('.ant-tabs-content').clientHeight",
                );
                console.log(this.state.height, 'this.state.height');
                console.log(TABLE_HEAD_HEIGHT, 'TABLE_HEAD_HEIGHT');
                console.log(PAGE_NATION_HEIGHT, 'PAGE_NATION_HEIGHT');
                console.log(listHeadHeight, 'listHeadHeight2', 4444);
                console.log(this.state.height - TABLE_HEAD_HEIGHT - PAGE_NATION_HEIGHT, '最后的高度2', 111);
                let currentHeight = this.state.height - TABLE_HEAD_HEIGHT - PAGE_NATION_HEIGHT + 8;
                if (modulesName === 'setState') {
                    setParentState({
                        limit: Math.floor(currentHeight / 40) || 10,
                        currentHeight: currentHeight, //+8是为了解决容器多8px的问题，等公司改了去掉这个
                    });
                } else {
                    dispatch({
                        type: `${modulesName}/updateStates`,
                        payload: {
                            limit: Math.floor(currentHeight / 40) || 10,
                            currentHeight: currentHeight, //+8是为了解决容器多8px的问题，等公司改了去掉这个
                        },
                    });
                }
            },
        );
    }

    // 设置默认高度和默认条数
    setBaseHeight() {
        // container 和 list_head 要重新起名做隔离，因为document获取的是全局的dom
        const {
            listRef,
            dispatch,
            modulesName,
            container = 'dom_container_cma',
            listHead = 'list_head_cma',
            setParentState,
        } = this.props;
        let listHeadHeight = document.getElementById(`${listHead}`)?.clientHeight || 0;
        const baseHeight = document.querySelector('.ant-tabs-content').clientHeight - listHeadHeight - PADDING_HEIGHT;

        console.log(
            document.querySelector('.ant-tabs-content').clientHeight,
            "document.querySelector('.ant-tabs-content').clientHeight",
        );
        console.log(PAGE_NATION_HEIGHT, 'PAGE_NATION_HEIGHT');

        console.log(TABLE_HEAD_HEIGHT, 'TABLE_HEAD_HEIGHT');
        console.log(listHeadHeight, 'listHeadHeight2', 4444);

        console.log(document.getElementById(`${listHead}`), 'listHead-获取不到了吗', 10000);
        console.log(listHeadHeight, 'listHeadHeight', 555);
        console.log(baseHeight - TABLE_HEAD_HEIGHT - PAGE_NATION_HEIGHT, '最后的高度', 2222);
        let currentHeight = baseHeight - TABLE_HEAD_HEIGHT - PAGE_NATION_HEIGHT + 8;
        if (modulesName === 'setState') {
            setParentState({
                limit: Math.floor(currentHeight / 40),
                currentHeight: baseHeight - 8 - 2 * TABLE_HEAD_HEIGHT - PAGE_NATION_HEIGHT,
                // currentHeight: currentHeight, //+8是为了解决容器多8px的问题，等公司改了去掉这个
            });
        } else {
            dispatch({
                type: `${modulesName}/updateStates`,
                payload: {
                    limit: Math.floor(currentHeight / 40),
                    currentHeight: currentHeight, //+8是为了解决容器多8px的问题，等公司改了去掉这个
                },
            });
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setBaseHeight();
        }, 0);
        // const table =  document.getElementById('drag_table')
        // const showFixed = document.getElementsByClassName('ant-table-cell-fix-right')
        // table.onmouseover=()=>{
        //   for(let i = 0 ; i<showFixed.length;i++){
        //     showFixed[i].style.opacity = 1
        //   }
        // }
        // table.onmouseout =()=>{
        //   for(let i = 0 ; i<showFixed.length;i++){
        //     showFixed[i].style.opacity = 0
        //   }
        // }
        window.addEventListener('resize', this.onResize.bind(this));
        return () => {
            window.removeEventListener('resize', this.onResize.bind(this));
        };
    }

    // columns的title需包裹一层标签 为了可以拖动和缩放互不影响
    static getDerivedStateFromProps(nextProps, prevState) {
        // console.log(nextProps.columns[2]?.width, 'nextProps', 1111);
        // console.log(prevState.columns[2]?.width, 'prevState', 222)
        // console.log(nextProps.columnsWidth,3333)
        // console.log(prevState.columnsWidth,4444)

        let columnsWidthList = prevState.columnsWidth || [];

        if (nextProps.columns !== prevState.columns) {
            const columns = nextProps.columns;
            if (columns.length && typeof columns[0].title == 'string') {
                columns.forEach((element, index) => {
                    let dragWidth = columnsWidthList[index];
                    // console.log(dragWidth,10000000)
                    element.title = <p className="dragHandler">{element.title}</p>;
                    element.width = dragWidth || parseInt(element.width) || BASE_WIDTH;
                    // if(element.dataIndex=='action'){
                    //   element.fixed = 'right'
                    // }
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

    // getWidth(i) {
    //   const handlers = document.getElementsByClassName(
    //     "ant-table-thead"
    //   );
    //   const th = handlers[0].getElementsByTagName('th');
    //   return th[i].clientWidth;
    // }

    // 调整列宽方法
    handleResize =
        (index) =>
        (e, { size }) => {
            console.log('🔥：', size);
            e.stopImmediatePropagation();
            const { taskType } = this.props;
            // 监控 分类 暂不支持     动态页面|| taskType === 'dynamic'
            if (taskType === 'MONITOR' || taskType === 'CATEGORY') {
                return;
            }
            const _this = this;
            this.setState(({ columns, columnsWidth }) => {
                const nextColumns = [...columns];
                nextColumns[index] = {
                    ...nextColumns[index],
                    width: size.width ? size.width : 100,
                };

                let newColumnsWidth = [...columnsWidth];
                newColumnsWidth[index] = size.width ? size.width : 100;

                console.log(size.width ? size.width : 100, '---->');
                // _this.reverseStorageDebounced(nextColumns);
                return { columns: nextColumns, columnsWidth: newColumnsWidth };
            });
        };

    render() {
        const { components, columns, disableDrap, taskType, ...others } = this.props;

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
                if (taskType === 'CIRCULATE' || taskType === 'ALL' || taskType === 'dynamic') {
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
                width: column.width && column.width !== 'auto' ? parseInt(column.width) || 100 : 100,
                onResize: this.handleResize(index),
            }),
        }));
        return (
            <div className={styles.drag_tabel} id="drag_table">
                {taskType === 'MONITOR' || taskType === 'CATEGORY' ? (
                    <Table rowClassName={getRowClassName} columns={columns} {...others} />
                ) : (
                    <ReactDragListView.DragColumn {...dragProps}>
                        <Table
                            rowClassName={getRowClassName}
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
