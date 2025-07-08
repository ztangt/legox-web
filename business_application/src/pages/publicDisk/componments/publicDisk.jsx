/*
 * @Author: gaohy gaohy@suirui.com
 * @Date: 2022-04-28 17:41:06
 * @LastEditors: gaohy gaohy@suirui.com
 * @LastEditTime: 2022-06-22 17:32:08
 * @FilePath: \WPX\business_application\src\pages\publicDisk\componments\publicDisk.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @author gaoj
 * @description 公共云盘
 */

import { connect } from 'dva';
import styles from './publicDisk.less';
import Disk from './disk';
import List from './list';
import Buttons from './buttons';
import { useEffect } from 'react';
import { Card, Breadcrumb } from 'antd';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import IPagination from '../../../componments/public/iPagination';
import SearchInput from './header/search'

function publicDisk({ dispatch, publicDisk ,location}) {
  const {
    id,
    search,
    start,
    limit,
    treeId,
    selectTreeUrl,
    detailStart,
    detailLimit,
    listReturnCount,
    listCurrentPage,
    selectedKeysValue,
  } = publicDisk;
  useEffect(()=>{
    // dispatch({
    //   type: 'publicDisk/getPagingList_CommonDisk_Tree',
    //   payload: {
    //     start: 1,
    //     limit: 200,
    //     id: 0,
    //     name: '',
    //     type: 'T',
    //   },
    // });
    dispatch({
      type: 'updateStates',
      payload: {
        selectedKeysValue: 0,
        selectTreeUrl: [{ key: 0, title: '公共文件' }],
      }
    })
  },[])

  useEffect(() => {
    dispatch({
      type: 'publicDisk/getPagingList_CommonDisk_List',
      payload: {
        start: start,
        limit: limit,
        id: selectedKeysValue,
        name: search,
        type: 'L',
      },
    });
  }, [search, treeId, selectedKeysValue]);

  const changeSelectTreeId = (item, index) => {
    let newSelectTreeUrl = [];
    let newTypeName = [];
    selectTreeUrl.map((item, i) => {
      if (i <= index) {
        newSelectTreeUrl.push(item);
        newTypeName.push(item.title);
      }
    });
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        selectedKeysValue: item.key,
        selectTreeUrl: newSelectTreeUrl,
        typeName: newTypeName.join('/'),
      },
    });
  };
  return (
    <div className={styles.container} id="container_public">
      <ReSizeLeftRight
        isShowRight={true}
        leftChildren={
          <div className={styles.left_home}>
            <Disk />
          </div>
        }
        rightChildren={
          <div className={styles.right}>
            {/* <div className={styles.breadcrumb}>
              <span>位置：</span>
              <Breadcrumb separator=">" style={{ display: 'inline-block' }}>
                {selectTreeUrl?.map((item, index) => {
                  return (
                    <Breadcrumb.Item
                      onClick={changeSelectTreeId.bind(this, item, index)}
                    >
                      {item.title}
                    </Breadcrumb.Item>
                  );
                })}
              </Breadcrumb>
            </div> */}
            <div>
              <SearchInput/>
            </div>
            <div className={styles.rightTop}>
              <Buttons location={location} selectTreeUrl={selectTreeUrl} changeSelectTreeId={changeSelectTreeId}/>
            </div>
            <div className={styles.rightDown}>
              <List />
            </div>
            <div className={styles.page}>
              <IPagination
                current={start}
                total={listReturnCount}
                // style={{ bottom: 8 }}
                onChange={(page, pageSize) => {

                  dispatch({
                    type: 'publicDisk/getPagingList_CommonDisk_List',
                    payload: {
                      start: page,
                      limit: pageSize,
                      id: selectedKeysValue,
                      name: search,
                      type: 'L',
                    },
                  });
                  dispatch({
                    type: 'publicDisk/updateStates',
                    payload: {
                      start: page,
                      limit: pageSize,
                    },
                  });
                }}
                pageSize={limit}
                isRefresh={true}
                refreshDataFn={() => {
                  dispatch({
                    type: 'publicDisk/getPagingList_CommonDisk_List',
                    payload: {
                      start: 1,
                      limit: limit,
                      id: selectedKeysValue,
                      name: search,
                      type: 'L',
                    },
                  });
                  // dispatch({
                  //   type: 'publicDisk/updateStates',
                  //   payload: {
                  //     start: 1
                  //   }
                  // })
                }}
              />
            </div>
          </div>
        }
      />
    </div>
  );
}

export default connect(({ publicDisk }) => ({
  publicDisk,
}))(publicDisk);
