// 适用于左侧搜索  右侧新增/删除按钮样式
import {Input,Button} from 'antd'
import styles from './index.less'

const HeaderSearch = ({inputProps,list,children})=>{
    return (
        <div className={styles.header_cont}>
            <div className={styles.header_cont_left}>
                <Input.Search {...inputProps}></Input.Search>
            </div>
            <div className={styles.header_cont_right}>
                {
                    list.map((item,index)=>(
                        item.fileType&&<Button key={`0`+index} onClick={()=>item.onClick(item.value||'')} className={styles.button}>{item.fileName}</Button>
                    ))
                }
                {children}
            </div>
        </div>
    )
}

HeaderSearch.defaultProps = {
    inputProps: {
        placeholder: ''
    },
    list: []
};

export default HeaderSearch