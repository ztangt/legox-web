import { Pagination, Button } from 'antd'
import PropTypes from 'prop-types'
import styles from './iPagination.less'

const IPagination = (props) => {
  const onChange = (nextPage, size) => {
    if (props.pageSize != size) {
      props.onChange(1, size) //变到第一页
    } else {
      props.onChange(nextPage, size)
    }
  }
  if (props.total) {
    return (
      <div className={styles.warp} style={props.style}>
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
    )
  } else {
    return null
  }
}
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
}
IPagination.defaultProps = {
  current: 1,
  pageSize: 10,
  isRefresh: false,
  showSizeChanger: true,
  showQuickJumper: true,
  refreshDataFn: () => {},
  style: {},
}
export default IPagination
