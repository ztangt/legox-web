import React from 'react';
import './index.css';
import _ from 'lodash';
import { toLine } from '../../util/util';
import { Table } from 'antd';
import { Resizable } from 'react-resizable';
import ReactDragListView from 'react-drag-listview';

// 宽度可伸缩render
const ResizableTitle = (props) => {
    const { onResize, width, ...restProps } = props;
    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable
            width={width ? width : null}
            height={0}
            minConstraints={[50, 50]}
            onResize={onResize}
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
        };
    }

    componentDidMount() {}

    // columns的title需包裹一层标签 为了可以拖动和缩放互不影响
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.columns !== prevState.columns) {
            const columns = nextProps.columns;
            if (columns.length && typeof columns[0].title == 'string') {
                columns.forEach((element) => {
                    element.title = <p className="dragHandler">{element.title}</p>;
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
            // 动态页面直接存
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
                    width: size.width ? size.width : '100%',
                };
                // _this.reverseStorageDebounced(nextColumns);
                return { columns: nextColumns };
            });
        };

    render() {
        const { components, columns, disableDrap, taskType, ...others } = this.props;
        const that = this;

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
                width: column.width && column.width !== 'auto' ? column.width : 90,
                onResize: this.handleResize(index),
            }),
        }));

        return (
            <ReactDragListView.DragColumn {...dragProps}>
                <Table components={this.components} columns={newColumns} {...others} />
            </ReactDragListView.DragColumn>
        );
    }
}

export default DragTable;
