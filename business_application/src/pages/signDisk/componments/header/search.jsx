import react,{useState} from 'react'
import { connect } from 'dva';
import {Input,Button} from 'antd'
import styles from '../signDisk.less'

const SearchComponent = ({dispatch,selectedKeysValue,info})=>{
    const [searchValue,setSearchValue]=useState('')
    console.log("selectedKeysValue",selectedKeysValue)
    const onSearch = () => {
        if(info == 'public'){
            selectedKeysValue = 1
        }
        if(info == 'person'&&selectedKeysValue != 0 &&
        selectedKeysValue != 2 &&
        selectedKeysValue != 3 &&
        selectedKeysValue != 4 &&
        selectedKeysValue != 5 &&
        info == 'person'){
            selectedKeysValue = 0
        }
        const obj = {
            0:()=>{
                dispatch({
                    type: 'signDisk/updateStates',
                    payload: {
                      search: searchValue,
                      myFileStart: 1,
                      searchValue
                    },
                  });
            },
            1:()=>{
                dispatch({
                    type: 'signDisk/updateStates',
                    payload: {
                      publicSearch: searchValue,
                      publicStart: 1,
                      searchValue,
                    },
                });   
            },
            3:()=>{
                dispatch({
                type: 'signDisk/updateStates',
                payload: {
                    otherShareName: searchValue,
                    otherShareStart: 1,
                    searchValue
                },
                });     
            },
            4:()=>{
                dispatch({
                    type: 'signDisk/updateStates',
                    payload: {
                        myShareName: searchValue,
                        myShareStart: 1,
                        searchValue
                    },
                });
            },
            5:()=>{
                  dispatch({
                        type: 'signDisk/updateStates',
                        payload: {
                            trashName: searchValue,
                            trashStart: 1,
                            searchValue
                        },
                    });
            }
        }
        obj[selectedKeysValue]()
    };
    const changeValue=(e)=>{
        setSearchValue(e.target.value)
    }
    return (
        <div className={styles.input_search}>
           <Input
            placeholder="请输入文件名"
            // allowClear
            size="middle"
            // onSearch={onSearch}
            className={styles.searchInput}
            // enterButton={
            //   <img
            //     src={require('../../../../../public/assets/high_search.svg')}
            //     style={{ margin: '0 8px 2px 0' }}
            //   />
            // }
            style={{ width: '226px', height: '32px' }}
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