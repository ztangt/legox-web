import {Pagination,Button} from 'antd';
import PropTypes from 'prop-types';
import styles from './iPagination.less'
import {useRef} from 'react'
const IPagination=(props)=>{
  const ref=useRef()
  const onChange=(nextPage,size)=>{
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
    console.log(props.pageSize, nextPage, size, '666666')
    if(props.pageSize!=size){
      props.onChange(1,size);//变到第一页
    }else{
      props.onChange(nextPage,size);
    }
  }
  if(props.total){
    return (
      <div
        style={{padding:'10px 16px 10px 0',height:"52px"}}
        className={styles.content}
        ref={ref}
      >
        <Pagination
          current={Number(props.current)}
          total={props.total}
          onChange={onChange}
          showTotal={total => `共${props.total}条`}
          pageSize={props.pageSize}
          showSizeChanger
          showQuickJumper
        />
        {props.isRefresh&&<Button type="primary" className={styles.iPagination_button} onClick={props.refreshDataFn}>刷新</Button>}
      </div>
    )
  }else{
    return null;
  }
}
IPagination.propTypes = {
  current:PropTypes.number,
  total:PropTypes.number.isRequired,
  onChange:PropTypes.func.isRequired,
  pageSize:PropTypes.number,
  isRefresh:PropTypes.bool,//是否显示刷新
  refreshDataFn:PropTypes.func,//刷新数据调用函数
}
IPagination.defaultProps = {
  current:1,
  pageSize:10,
  isRefresh:false,
  refreshDataFn:()=>{}
}
export default IPagination
