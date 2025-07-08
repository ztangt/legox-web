import { Button, Pagination } from 'antd';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import styles from './index.less';
const IPagination = (props) => {
    const ref = useRef();
    const onChange = (nextPage, size) => {
        setTimeout(() => {
            if (ref.current?.offsetParent?.getElementsByClassName('ant-table-body')?.[0]) {
                ref.current.offsetParent.getElementsByClassName('ant-table-body')[0].scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth', // 平滑滚动效果
                });
            } else {
                //有的分页又嵌套了一层div，所以需要在多向上走一层
                ref.current?.offsetParent?.offsetParent?.getElementsByClassName('ant-table-body')?.[0]?.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth', // 平滑滚动效果
                });
            }
        }, 1);
        if (props.pageSize != size) {
            props.onChange(1, size); //变到第一页
        } else {
            props.onChange(nextPage, size);
        }
    };
    return (
        <div className={styles.warp} style={{ bottom: props.bottom, ...props.style }} ref={ref}>
            <Pagination
                current={Number(props.current)}
                total={props.total}
                onChange={onChange}
                showTotal={(total) => `共${props.total}条`}
                pageSize={props.pageSize}
                showSizeChanger={props.showSizeChanger}
                showQuickJumper={props.showQuickJumper}
            />

            {props.isRefresh && (
                <Button type="primary" className={styles.iPagination_button} onClick={props.refreshDataFn}>
                    刷新
                </Button>
            )}

            {props.isAll && (
                <Button type="primary ml10" className={styles.iPagination_button} onClick={props.onGetAll}>
                    全部
                </Button>
            )}
        </div>
    );
};
IPagination.propTypes = {
    current: PropTypes.number,
    total: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    pageSize: PropTypes.number,
    bottom: PropTypes.number,
    isRefresh: PropTypes.bool, //是否显示刷新
    showSizeChanger: PropTypes.bool,
    showQuickJumper: PropTypes.bool,
    refreshDataFn: PropTypes.func, //刷新数据调用函数
    style: PropTypes.object, //样式
    isAll: PropTypes.bool, //是否展示全部按钮
    onGetAll: PropTypes.func, //获取全部数据调用函数
};
IPagination.defaultProps = {
    current: 1,
    pageSize: 10,
    // bottom: 5,
    isRefresh: false,
    showSizeChanger: true,
    showQuickJumper: true,
    refreshDataFn: () => {},
    style: {},
    isAll: false,
    onGetAll: () => {},
};
export default IPagination;
