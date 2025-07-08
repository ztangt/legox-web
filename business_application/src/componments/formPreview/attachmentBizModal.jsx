
import { Form, Button, Upload, Modal, Input, message, Spin, Checkbox } from 'antd';
import { useDispatch, useSelector, useLocation } from 'umi';
import styles from './UploadFile.less';
import _ from 'lodash'
import IPagination from '../public/iPagination'
import { useState } from 'react';
import Table from '../columnDragTable/index'
import search_black from '../../../public/assets/search_black.svg'
import bj from '../../../public/assets/已办结.svg'
import zf from '../../../public/assets/已作废.svg'
import zb from '../../../public/assets/zb.png'
import df from '../../../public/assets/df.png'
import empty_bg from '../../../public/assets/empty_bg.svg'
import { Popup, FloatingBubble, Button as MobileButton, SearchBar } from 'antd-mobile/es'
import { COLOR, DYNAMIC_TYPE } from '../../service/constant';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PullToRefresh } from 'antd-mobile/es'
import { dataFormat } from '../../util/util'
const AttachmentBiz = (props) => {
  const { modalTableProps, getWorrkList, onSaveAttachmentBiz, onVisible, tableProps, state, targetKey, clickSelect, relBizInfoIds, bizListIds, goForm, relBizInfoList } = props
  const [limit, setLimit] = useState(window.location.href.includes('/mobile') ? 6 : 10);
  const [workSearchWord, setWorkSearchWord] = useState('');
  const { workCurrentPage, workReturnCount, workList } = state;
  function onChangeWord(e) {
    setWorkSearchWord(e.target.value);
  }
  //分页
  const changePage = (nextPage, size) => {
    debugger
    setLimit(size)
    getWorrkList(nextPage, size, workSearchWord)
  }
  //搜索
  const searchWordFn = (value) => {
    getWorrkList(1, limit, value)
  }
  function renderItemInfo(l) {
    return <>
      {
        DYNAMIC_TYPE['ALL'].map((item) => {
          let text = l[item.key]
          if (item.key?.includes('Time') || item.key?.includes('TIME')) {
            text = dataFormat(
              l[item.key],
              `YYYY年MM月DD日 HH:mm:ss`,
            )
          }
          if (item.title == '标题') {
            return <h1 className={styles.title}>
              <span className={styles['title_span']}>{text}</span>
            </h1>
          }
          return <p className={styles.info}>
            <i style={{ width: 'unset' }}>{item.title}：</i>
            <b>{text}</b>
          </p>
        })
      }
    </>
  }
  if (window.location.href.includes('mobile')) {
    return <Popup
      visible={true}
      onMaskClick={onVisible.bind(this, false)}
      onClose={onVisible.bind(this, false)}
      position="right"
      bodyStyle={{ height: '100vh', width: '100%' }}
    >
      <Spin spinning={false}>
        <FloatingBubble
          magnetic='x'
          style={{
            '--background': 'var(--ant-primary-color)',
            '--border-radius': '3.57rem 0 0 3.57rem',
            '--size': '2.79rem',
            '--initial-position-right': '0rem',
            '--initial-position-top': '3.43rem',
            '--height-size': '1.75rem',
          }}
          onClick={onVisible.bind(this, false)}
        >
          返回
        </FloatingBubble>
        <div className={styles.relbiz_container}>
          <div className={styles.search_header}>
            <SearchBar
              placeholder="请输入搜索内容(按标题搜索)"
              className={styles.search_input}
              onSearch={searchWordFn.bind(this)}
              onClear={searchWordFn.bind(this, '')}
            />
          </div>
          <Checkbox.Group
            value={relBizInfoIds}
            className={styles.tab_container}
            id="scrollableBizDiv"
          >
            {!workList || workList?.length == 0 ? (
              <div className={styles.empty}>
                <img src={empty_bg} />
                <h4>暂无数据</h4>
              </div>
            ) : (
              <PullToRefresh
                onRefresh={() => {
                  getWorrkList(1, limit, workSearchWord)
                }
                }
              >
                <InfiniteScroll
                  dataLength={workList?.length}
                  next={changePage.bind(this, Number(workCurrentPage) + 1, limit)}
                  hasMore={workList?.length < workReturnCount}
                  loader={<Spin className="spin_div" />}
                  endMessage={
                    workList?.length == 0 ? (
                      ''
                    ) : (
                      <span className="footer_more">没有更多啦</span>
                    )
                  }
                  scrollableTarget="scrollableBizDiv"
                >
                  <div className={styles.tab_list_container}>
                    {workList?.length != 0 &&
                      workList?.map((l, index) => {
                        return (
                          <Checkbox 
                            className={styles.tab_list_item} key={index} 
                            onClick={clickSelect.bind(this, l)} 
                            value={l.bizInfoId}
                            disabled={
                              relBizInfoList.filter((item) => {
                                return item.relBizInfoId == l.bizInfoId
                              }).length != 0
                            }>
                            <div
                              className={styles.tab_list_item_right}
                              onClick={goForm.bind(this, l)}
                              style={{
                                backgroundImage:
                                  l.bizStatus == '2'
                                    ? `url(${bj})` :
                                    l.bizStatus == '4' ? `url(${zf})` :
                                      l.bizStatus == '0' ? `url(${df})` :
                                        l.bizStatus == '1' ? `url(${zb})`
                                          : '',
                              }}
                            >
                              <p className={styles.type}>
                                <span>
                                  {l.bizSolName}{' '}
                                </span>
                                <a
                                  style={
                                    l.warning && {
                                      color: COLOR[l.warning],
                                    }
                                  }
                                >
                                  {l.actName}
                                </a>
                              </p>
                              {renderItemInfo(l)}
                            </div>
                          </Checkbox>

                        );
                      })}
                  </div>
                </InfiniteScroll>
              </PullToRefresh>

            )}
          </Checkbox.Group>

        </div>
        <div className={styles.footer}><MobileButton color={'primary'} onClick={onSaveAttachmentBiz.bind(this)}>确定</MobileButton></div>

      </Spin>
    </Popup>
  }


  return (
    <Modal
      width={'95%'}
      visible={true}
      title={'选择关联事项'}
      onCancel={onVisible.bind(this, false)}
      maskClosable={false}
      mask={false}
      bodyStyle={{ padding: '10px 0px 0px 0px', position: "relative", overflow: "hidden" }}
      onOk={onSaveAttachmentBiz.bind(this)}
      getContainer={() => {
        return document.getElementById(`formShow_container_${targetKey}`)
      }}
    >
      <Input.Search
        className={styles.search}
        placeholder={'请输入标题名称'}
        allowClear
        value={workSearchWord}
        onChange={onChangeWord.bind(this)}
        onSearch={searchWordFn.bind(this)}
        enterButton={<img src={search_black} style={{ marginRight: 8, marginTop: -3, marginLeft: 4 }} />}
      />
      <Table
        className={styles.atttable}
        {...tableProps}
        {...modalTableProps}
        dataSource={workList}
        scroll={{ y: 'calc(100% - 118px)' }}
        onRow={(record) => {
          return {
            onClick: (event) => {
              clickSelect(record)
            }, // 点击行
          }
        }}
      />
      <IPagination
        total={workReturnCount}
        current={workCurrentPage}
        pageSize={limit}
        onChange={changePage.bind(this)}
        style={{ borderTop: '1px solid rgb(235, 235, 235)', height: '38px' }}
      />
    </Modal>
  )
}
export default AttachmentBiz;
