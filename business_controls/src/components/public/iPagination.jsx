import { Button, Pagination } from 'antd';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import styles from './iPagination.less';
const IPagination = (props) => {
  const ref = useRef();
  // const [pageSizeArr, setPageSizeArr] = useState([]);
  // useEffect(() => {
  //   // 保证pageSizeArr赋值时机
  //   if ((props.pageSize && pageSizeArr.length === 0) || props.sizeFlag) {
  //     setPageSizeArr([props.pageSize, props.pageSize * 2, props.pageSize * 5]);
  //     // 马上把sizeFlag置为F  以防pageSize数据错乱
  //     props.setFlagFn(false);
  //   }
  // }, [props.pageSize]);

  const onChange = (nextPage, size) => {
    setTimeout(() => {
      if (
        ref.current?.offsetParent?.getElementsByClassName('ant-table-body')?.[0]
      ) {
        ref.current.offsetParent
          .getElementsByClassName('ant-table-body')[0]
          .scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth', // 平滑滚动效果
          });
      } else {
        //有的分页又嵌套了一层div，所以需要在多向上走一层
        ref.current?.offsetParent?.offsetParent
          ?.getElementsByClassName('ant-table-body')?.[0]
          ?.scrollTo({
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
  if (props.total) {
    return (
      <div
        className={styles.container}
        style={props.style ? { ...props.style } : {}}
        ref={ref}
      >
        <Pagination
          current={props.current}
          total={props.total}
          onChange={onChange}
          showTotal={(total) => `共${total}条`}
          pageSize={props.pageSize}
          // pageSizeOptions={pageSizeArr}
          showSizeChanger
          showQuickJumper
          style={{ float: 'right' }}
          defaultCurrent={props.defaultCurrent}
        />
        {props.isRefresh && (
          <Button
            type="primary"
            className={styles.iPagination_button}
            onClick={props.refreshDataFn}
          >
            刷新
          </Button>
        )}
      </div>
    );
  } else {
    return null;
  }
};
IPagination.propTypes = {
  current: PropTypes.number,
  total: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  pageSize: PropTypes.number,
  isRefresh: PropTypes.bool, //是否显示刷新
  refreshDataFn: PropTypes.func, //刷新数据调用函数
  defaultCurrent: PropTypes.number, //默认选中页
  sizeFlag: PropTypes.bool, //是否更新pageSizeArr
  setFlagFn: PropTypes.func, //设置sizeFlag调用函数
};
IPagination.defaultProps = {
  current: 1,
  pageSize: 10,
  isRefresh: false,
  refreshDataFn: () => {},
  defaultCurrent: 1,
  sizeFlag: false,
  setFlagFn: () => {},
};
export default IPagination;
