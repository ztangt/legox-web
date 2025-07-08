/**
 * @author gao
 * @description 资讯公告展示
 */

import { connect } from 'dva';
import { useState, useEffect,useRef } from 'react';
import { Tabs, Input, Card ,Button} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ShowModel from '../../../componments/informationlist';
import IPagination from '../../../componments/public/iPagination';
import highSearch from  '../../../../public/assets/high_search.svg'
import styles from './informationList.less';

function InformationList({ dispatch, informationList }) {
  const { informationTypeList, informationType, start, limit, returnCount } =
    informationList;

  const { TabPane } = Tabs;
  const inputRef = useRef('')
  const [informationTypeId, setInformationTypeId] = useState(''); //资讯公告分类id
  const [state, setState] = useState(false);
  const [listValue, setListValue] = useState(''); //搜索内容
  const [inputValue,setInputValue]=useState('')
  useEffect(() => {
    dispatch({
      type: 'informationList/getInformationType',
      payload: {},
      callback: (id, newData) => {
        dispatch({
          type: 'informationList/updateStates',
          payload: {
            informationTypeList: newData,
          },
        });
        setInformationTypeId(id);
        setState(true);
        dispatch({
          type: 'informationList/getInformation',
          payload: {
            informationTypeId: id,
            start: start,
            limit: limit,
            isOwn: false,
            isRelease: 1
          },
          callback: (list) => {},
        });
      },
    });
  }, []);

  // useEffect(() => {
  //   // if (state) {
  //   //   dispatch({
  //   //     type: 'informationList/getInformation',
  //   //     payload: {
  //   //       informationFileName: listValue,
  //   //       informationTypeId: informationTypeId,
  //   //       start: start,
  //   //       limit: limit,
  //   //       isOwn: false,
  //   //       isRelease: 1
  //   //     },
  //   //     callback: (msg) => {},
  //   //   });
  //   // }
  // }, [informationTypeId, listValue, start, limit]);
  const dispatchInformation=(key,start=1,limit=10)=>{
    dispatch({
      type: 'informationList/getInformation',
      payload: {
        informationFileName: inputRef.current,
        informationTypeId: key,
        start: start,
        limit: limit,
        isOwn: false,
        isRelease: 1
      },
      callback: (msg) => {},
    });
  }
  function changeCallback(key) {
    dispatch({
      type: 'informationList/updateStates',
      payload: {
        start: 1,
        limit: 10,
      },
    });
    setInformationTypeId(key);
    dispatchInformation(key)  
  }
  function onSearch(value) {
    setListValue(value);
    // 搜索从第一页开始
    dispatch({
      type: 'informationList/updateStates',
      payload: {
        start: 1
      }
    })
    dispatchInformation(informationTypeId,1,limit)
  }

  const EnterButton = ({ onClick }) => (
    <SearchOutlined
      onClick={onClick}
      style={{
        width: '25px',
        height: '16px',
        fontSize: '15px',
        color: '#505766',
      }}
    />
  );
const changeValue=(e)=>{
  setInputValue(e.target.value)
  inputRef.current = e.target.value
}
  return (
    <div className={styles.container}>
      <Input.Search
        className={styles.inputSearch}
        placeholder="请输入标题"
        size="middle"
        style={{ width: '258px',height:'46px'}}
        enterButton={
          <img
            src={highSearch}
            style={{ margin: '0 8px 2px 0' }}
          />
        }
        onChange={changeValue}
        onSearch={onSearch}
      />
      {informationTypeList.length != 0 ? (
        <Tabs
          // type="card"
          // tabBarExtraContent={
          //   <>
          //   </>
          // }
          activeKey={informationTypeId}
          defaultActiveKey={informationTypeList[0].informationTypeId}
          onChange={changeCallback}
        >
          {informationTypeList.map((item) => {
            return (
              <TabPane
                style={{
                  textOverflow: 'ellipsis',
                  height: 'calc(100vh - 270px)',
                  overflowY: 'auto',
                }}
                tab={item.informationTypeName}
                key={item.informationTypeId}
              >
                {informationType.length != 0 ? (
                  <ShowModel
                    informationList={informationList}
                    informationType={informationType}
                    informationTypeId={informationTypeId}
                  />
                ) : (
                  <></>
                )}
              </TabPane>
            );
          })}
        </Tabs>
      ) : (
        <></>
      )}
      <IPagination
        current={start}
        container='.ant-tabs-tabpane'
        total={returnCount}
        onChange={(page, pageSize) => {
          dispatch({
            type: 'informationList/updateStates',
            payload: {
              start: page,
              limit: pageSize,
            },
          });
          dispatchInformation(informationTypeId,page,pageSize)
        }}
        pageSize={limit}
        isRefresh={true}
        refreshDataFn={() => {
          dispatch({
            type: 'informationList/getInformationType',
            payload: {},
            callback: (id, newData) => {
              dispatch({
                type: 'informationList/updateStates',
                payload: {
                  informationTypeList: newData,
                  start: 1
                },
              });
              // setInformationTypeId(id);
              // setState(true);
              dispatchInformation(informationTypeId,1,limit)
              // dispatch({
              //   type: 'informationList/getInformation',
              //   payload: {
              //     informationFileName: listValue,
              //     informationTypeId: informationTypeId,
              //     start: 1,
              //     limit: limit,
              //     isOwn: false,
              //     isRelease: 1
              //   },
              //   callback: (list) => {
              //   },
              // });
            },
          });
        }}
      />
      {/* pagination={{
          total: returnCount,
          showQuickJumper:true,
          pageSize: limit,
          showSizeChanger: true,
          pageSizeOptions: ['10', "20", '50', '100'],
          showTotal: (total) => `共${total}条`,
          onChange: (page, pageSize) => {
            dispatch({
              type: 'informationList/updateStates',
              payload: {
                start: page,
                limit: pageSize,
              }
            })
          }
        }} */}
    </div>
  );
}

export default connect(({ informationList }) => ({
  informationList,
}))(InformationList);
