/**
 * @author gaoj
 * @description 资讯公告评论管理
 */
import { connect } from 'dva';
import { Modal, Button, Table, message,Input } from 'antd';
import { REQUEST_SUCCESS, PAGESIZE } from '../../../service/constant';
import { commentcolumns } from './columns';
import IPagination from '../../../componments/public/iPagination';
import GlobalModal from '../../../componments/GlobalModal';
import styles from './commentsControl.less';

const { Search } = Input;
function CommentsControl({ dispatch, information, setSearchCont,searchCont }) {
  const {
    commentReturnCount,
    commentsCurrent,
    isDelCommentVisible,
    isCommentModalVisible,
    commentStart,
    commentLimit,
    commentListIds,
    commentListes,
    commentLists,
  } = information;

  const handleCommentOk = () => {
    dispatch({
      type: 'information/updateStates',
      payload: {
        isCommentModalVisible: false,
        commentLists:[]
      },
    });
  };

  const handleCommentCancel = () => {
    dispatch({
      type: 'information/updateStates',
      payload: {
        isCommentModalVisible: false,
        commentLists:[]
      },
    });
  };

  const delcommentList = () => {
    if (commentListes.length > 0) {
      dispatch({
        type: 'information/updateStates',
        payload: {
          isDelCommentVisible: true,
        },
      });
    } else {
      message.warning('还没有选择条目');
    }
  };

  const commentDelOk = () => {
    dispatch({
      type: 'information/delInformationCommentList',
      payload: {
        commentIds: commentListIds.join(','),
      },
      callback: (code, msg) => {
        if (code == REQUEST_SUCCESS) {
          dispatch({
            type: 'information/getInformationCommentList',
            payload: {
              start: commentStart,
              limit: commentLimit,
              searchWord: searchCont
            },
          });
        }
      },
    });
    dispatch({
      type: 'information/updateStates',
      payload: {
        isDelCommentVisible: false,
      },
    });
  };
  const commentDelCancel = () => {
    dispatch({
      type: 'information/updateStates',
      payload: {
        isDelCommentVisible: false,
      },
    });
  };

  const commentRowSelection = {
    onChange: (rowKeys, rows) => {
      dispatch({
        type: 'information/updateStates',
        payload: {
          commentListIds: rowKeys,
          commentListes: rows,
        },
      });
    },
  };
  // 搜索
  const searchContent = (value)=>{
    setSearchCont(value)
    dispatch({
      type: 'information/getInformationCommentList',
      payload: {
        start: 1,
        limit: commentLimit,
        searchWord: value,
      },
    });
  }
  const getRowClassName = (record, index) => {
    let className = '';
    className = index % 2 === 0 ? 'oddRow' : 'evenRow';
    return className;
  };

console.log("commentsCurrent",commentsCurrent)
  return (
    <GlobalModal
      maskStyle={{ backgroundColor: 'rgba(0,0,0,.1)' }}
      widthType={2}
      // height={'calc(100vh - 258px)'}
      // top={'4%'}
      className={styles.warpModel}
      title="评论管理"
      visible={true}
      onOk={handleCommentOk}
      onCancel={handleCommentCancel}
      destroyOnClose={true}
      mask={false}
      getContainer={() => {
        return document.getElementById('information_id')||false;
      }}
      footer={
        [
          <Button key={'close'} className={styles.button_width} onClick={handleCommentOk}>关闭</Button>
        ]
      }
    >
      <div className={styles.content_modal}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Search 
            placeholder="请输入标题"
            onSearch={searchContent}
            style={{width: 200}}
          />
          <div>
          <Button
            type="primary"
            onClick={delcommentList}
            style={{ marginRight: '10px' }}
            className={styles.button_width} 
          >
            删除
          </Button>
          <Button
            onClick={() => {
              dispatch({
                type: 'information/getInformationCommentList',
                payload: {
                  start: 1,
                  limit: commentLimit,
                  searchWord:searchCont
                },
                callback: (code, msg, returnCount, list) => {
                  if (code == REQUEST_SUCCESS) {
                    message.success('刷新成功');
                  }
                },
              });
            }}
            className={styles.button_width} 
          >
            刷新
          </Button>
          </div>
        </div> 
        <div className={styles.warp_table}>
          <Table
            rowKey="id"
            columns={commentcolumns}
            rowSelection={{ ...commentRowSelection }}
            dataSource={commentLists}
            pagination={false}
            rowClassName={getRowClassName}
            scroll={{ y: '100%' }}
            style={{ marginTop: '8px',paddingBottom: 95 }}
          />
          {/* <div className={styles.page}> */}
            <IPagination
              current={Number(commentsCurrent)}
              total={Number(commentReturnCount)}
              style={{bottom:0}}
              onChange={(page, pageSize) => {
                
                dispatch({
                  type: 'information/updateStates',
                  payload: {
                    commentStart: page,
                    commentLimit: pageSize,
                    start: page,
                    limit: pageSize,
                    commentsCurrent: page,
                  },
                });

                dispatch({
                  type: 'information/getInformationCommentList',
                  payload: {
                    start: page,
                    limit: pageSize,
                    searchWord:searchCont
                  }})
              }}
              pageSize={commentLimit}
              isRefresh={true}
              refreshDataFn={() => {
                dispatch({
                  type: 'information/getInformationCommentList',
                  payload: {
                    start: 1,
                    limit: commentLimit,
                    searchWord:searchCont
                  },
                });
                dispatch({
                  type: 'information/updateStates',
                  payload: {
                    commentStart:1,
                    commentLimit,
                    start: 1,
                    commentsCurrent:1,
                    limit: commentLimit
                  }
                })
              }}
            />
          {/* </div> */}
        </div>
        <GlobalModal
          maskStyle={{ backgroundColor: 'rgba(0,0,0,.1)' }}
          title="删除数据"
          widthType={4}
          visible={isDelCommentVisible}
          onOk={commentDelOk}
          onCancel={commentDelCancel}
          mask={false}
          getContainer={() => {
            return document.getElementById('information_id')||false;
          }}
        >
          <div>确定要删除所选数据吗？</div>
        </GlobalModal>
      </div>
    </GlobalModal>
  );
}

export default connect(({ information }) => ({
  information,
}))(CommentsControl);
