/*
 * @Author: gaohy gaohy@suirui.com
 * @Date: 2022-04-28 17:41:06
 * @LastEditors: gaohy gaohy@suirui.com
 * @LastEditTime: 2022-06-23 15:09:12
 * @FilePath: \WPX\business_application\src\pages\signDisk\componments\buttons\TrashBtn.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { connect } from 'dva';
import { message, Input, Button } from 'antd';
import styles from '../signDisk.less';
import {useState} from 'react'
import Breadcrumb from '../header/breadcrumb';

function Buttons({ dispatch, signDisk,selectTreeUrl,changeSelectTreeId }) {
  const {
    ids,
    trashRowSelection,
    disabledAllButton,
    trashName,
    selectedKeysValue,
    trashLimit,
    trashStart,
    trashList
  } = signDisk;
  // const [searchValue,setSearchValue]=useState('')
  // const onSearch = () => {
  //   dispatch({
  //     type: 'signDisk/updateStates',
  //     payload: {
  //       trashName: searchValue,
  //       trashStart: 1,
  //     },
  //   });
  // };
  // const changeValue=(e)=>{
  //   setSearchValue(e.target.value)
  // }

  const back = () => {
    if (trashRowSelection != 0) {
      dispatch({
        type: 'signDisk/putRecover',
        payload: {
          ids: ids.join(','),
        },
        callback(){
          dispatch({
            type: 'signDisk/getPagingOrBinList_SignDisk_Listist_Trash',
            payload: {
              start: trashStart,
              limit: trashLimit,
              id: selectedKeysValue,
              name: trashName,
              delete: 'N',
              type: 'L',
            },
          })
        }
      });
    } else {
      message.warning('还没有选择条目');
    }
  };

  const del = () => {
    if (trashRowSelection != 0) {
      dispatch({
        type: 'signDisk/delDelete_SignDisk',
        payload: {
          ids: ids.join(','),
          delete: 'W',
        },
        callback: () => {
          dispatch({
            type: 'signDisk/getPagingOrBinList_SignDisk_Listist_Trash',
            payload: {
              start: trashStart,
              limit: trashLimit,
              id: selectedKeysValue,
              name: trashName,
              delete: 'N',
              type: 'L',
            },
            callback(data){
              if(data.length==0){
                dispatch({
                  type: 'signDisk/updateStates',
                  payload: {
                    trashRowSelection:[]
                  }
                })
              }
            }
          });
        },
      });
    } else {
      message.warning('还没有选择条目');
    }
  };

  return (
    <>
      <div style={{ paddingTop: '8px', marginLeft: '8px' }}>
        <Breadcrumb selectTreeUrl={selectTreeUrl} changeSelectTreeId={changeSelectTreeId}/>
        {/* <Input
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
          onChange={changeValue}
          style={{ width: '226px', height: '32px' }}
        />
         <Button
          type="primary"
          style={{ margin: '0 8px' }}
          onClick={onSearch}
          className={styles.button_width}
        >
          查询
        </Button> */}
      </div>
      <div style={{ paddingTop: '8px' }}>
        <Button
          disabled={disabledAllButton}
          className={styles.back}
          type="primary"
          onClick={back}
        >
          恢复
        </Button>
        <Button disabled={disabledAllButton} className={styles.button_width} type="primary" onClick={del}>
          删除
        </Button>
      </div>
    </>
  );
}

export default connect(({ signDisk }) => ({
  signDisk,
}))(Buttons);
