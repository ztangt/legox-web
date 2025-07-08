import {Pagination } from 'antd';
import PropTypes from 'prop-types';
import styles from './iPagination.less';
import {useRef} from 'react';
import {Button} from '@/componments/TLAntd';
const IPagination = (props) => {
  const ref = useRef();
  const onChange = (nextPage, size) => {
    setTimeout(()=>{
      if(ref.current?.offsetParent?.getElementsByClassName('ant-table-body')?.[0]){
        ref.current.offsetParent.getElementsByClassName('ant-table-body')[0].scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth' // 平滑滚动效果
        });
      }else{
        //有的分页又嵌套了一层div，所以需要在多向上走一层
        ref.current?.offsetParent?.offsetParent?.getElementsByClassName('ant-table-body')?.[0]?.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth' // 平滑滚动效果
        });
      }
    },1)
    if (props.isScrollTop) {
      document.querySelector(
        props.container || '.ant-table-body',
      ).scrollTop = 0;
    }
    if (props.pageSize != size) {
      props.onChange(1, size); //变到第一页
    } else {
      props.onChange(nextPage, size);
    }
  };
  
  // 2023.04.11  页面没有数据的时候，右下角也需要显示分页器   您说了算
  // 2023.05.15  页面没有数据的时候，右下角不需要显示分页器   还是您说了算
  // 2023.11.08  页面没有数据的时候，右下角也需要显示分页器   还是还是您说了算
  return (
    <div className={styles.warp} style={props.style} ref={ref}>
      <Pagination
        current={parseInt(props.current)}
        total={props.total}
        onChange={onChange}
        showTotal={(total) => `共${props.total}条`}
        pageSize={props.pageSize}
        showSizeChanger={props.showSizeChanger}
        showQuickJumper={props.showQuickJumper}
        className={styles.pagination}
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
};
IPagination.propTypes = {
  current: PropTypes.number,
  total: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  pageSize: PropTypes.number,
  isRefresh: PropTypes.bool, //是否显示刷新
  showSizeChanger: PropTypes.bool,
  showQuickJumper: PropTypes.bool,
  refreshDataFn: PropTypes.func, //刷新数据调用函数
  style: PropTypes.object,
  isScrollTop: PropTypes.bool, //是否跟随滚动
};
IPagination.defaultProps = {
  current: 1,
  pageSize: 10,
  isRefresh: false,
  showSizeChanger: true,
  showQuickJumper: true,
  refreshDataFn: () => {},
  style: {},
  isScrollTop: true,
};
export default IPagination;
