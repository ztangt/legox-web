/*
 * @Author: gaohy gaohy@suirui.com
 * @Date: 2022-04-28 17:41:06
 * @LastEditors: gaohy gaohy@suirui.com
 * @LastEditTime: 2022-06-23 15:07:56
 * @FilePath: \WPX\business_application\src\pages\signDisk\componments\buttons\MyShareBtn.js
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
    myShareRowSelection,
    myShareStart,
    myShareLimit,
    myShareName,
    disabledAllButton,
  } = signDisk;
  const [searchValue,setSearchValue]=useState('')
  const onSearch = () => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        myShareName: searchValue,
        myShareStart: 1,
      },
    });
  };
  const changeValue=(e)=>{
    setSearchValue(e.target.value)
  }

  const cancelShare = () => {
    if (myShareRowSelection != 0) {
      dispatch({
        type: 'signDisk/delShareAll_SignDisk',
        payload: {
          ids: ids.join(','),
        },
        callback: () => {
          dispatch({
            type: 'signDisk/getMyShareList_SignDisk',
            payload: {
              start: myShareStart,
              limit: myShareLimit,
              name: myShareName,
            },
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
        </Button> */}
      </div>
      <div style={{ paddingTop: '8px' }}>
        <Button
          disabled={disabledAllButton}
          type="primary"
          onClick={cancelShare}
        >
          取消分享
        </Button>
      </div>
    </>
  );
}

export default connect(({ signDisk }) => ({
  signDisk,
}))(Buttons);
