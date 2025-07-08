import react,{useState} from 'react'
import { connect } from 'dva';
import {Input,Button} from 'antd'
import styles from '../buttons.less'

const SearchComponent = ({dispatch})=>{
    const [searchValue,setSearchValue]=useState('')
    const onSearch = () => {
        dispatch({
            type: 'publicDisk/updateStates',
            payload: {
              search: searchValue,
              start: 1,
            },
          });
    };
    const changeValue=(e)=>{
        setSearchValue(e.target.value)
    }
    return (
        <div className={styles.search}>
           <Input
          className={styles.searchInput}
          placeholder="请输入文件名"
          // allowClear
          size="middle"
          style={{  width:226}}
          // onSearch={onSearch}
          // enterButton={
          //   <img
          //     src={require('../../../../public/assets/high_search.svg')}
          //     style={{ margin: '0 8px 2px 0' }}
          //   />
          // }
          onChange={changeValue}
        />
        <Button
          type="primary"
          style={{ margin: '0 8px' }}
          onClick={onSearch}
          className={styles.button_width}
        >
          查询
        </Button>
        </div>
    )

}

export default connect(({signDisk})=>({signDisk}))(SearchComponent)