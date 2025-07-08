/**
 * @author gaoj
 * @description 评论
 */
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { Comment, Avatar, Form, Button, List, Input, Card } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import { REQUEST_SUCCESS } from '../../../service/constant';
import { dataFormat } from '../../../util/util';
import styles from './comments.less';
import head_img from '../../../public/assets/user_header.jpg'
const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea
        rows={4}
        onChange={onChange}
        value={value}
        placeholder="请输入评价内容"
      />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
        className={styles.comments}
      >
        评论
      </Button>
    </Form.Item>
  </>
);

const CommentChild = ({ comments }) => {
  return comments.map((item,index) => {
    return (
      <div className={styles.commmentChild} key={index+item.datetime}>
        <div className={styles.childContent}>
          {item.author} : {item.content}
        </div>
        <div className={styles.childAction}>
          {item.actions.map((i) => {
            return i;
          })}
        </div>
      </div>
    );
  });
};

const CommentList = ({ comments }) => {
  return (
    <>
      <div className={styles.title}>{`全部评论（${comments.length}条）`}</div>
      {comments.map((item,index) => {
        return (
          <>
            <div className={styles.commentWarp} key={index}>
              <Avatar src={item.avatar} alt="Han Solo" />
              <div className={styles.commentContent}>
                <div className={styles.author}>
                  <div>{item.author}</div>
                  <div>{item.datetime}</div>
                </div>
                <div className={styles.content}>{item.content}</div>
                <CommentChild comments={item.children} key={index}/>
                <div className={styles.action}>
                  {item.actions.map((i) => {
                    return i;
                  })}
                </div>
              </div>
            </div>
          </>
        );
      })}
    </>
  );
};

// <List
//   dataSource={comments}
//   header={`全部评论（${comments.length}条）`}
//   itemLayout="horizontal"
//   renderItem={(props) => {
//     console.log('dddddddd', props);
//     return <Comment {...props} />;
//   }}
// />

function Comments({ dispatch, commentList, informationId }) {
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const [commentId, setCommentId] = useState('');
  const [like, setLike] = useState(false);
  const imgUrl =
    localStorage.getItem('userInfo') &&
    JSON.parse(localStorage.getItem('userInfo')).picturePath;

  useEffect(() => {
    if (commentList && commentList.length > 0) {
      comments.length = 0;
      // for (let i = 0; i < commentList.length; i++) {
      //   comments.push({
      //     author: commentList[i].commentUserName,
      //     avatar: commentList[i].commentUserPic
      //       ? commentList[i].commentUserPic
      //       : head_img,
      //     content: commentList[i].commentContent.replace(/<[^>]+>/g, ''),
      //     datetime: dataFormat(
      //       commentList[i].commentTime,
      //       'YYYY-MM-DD HH:mm:ss',
      //     ),
      //     actions: [
      //       <span
      //         key={commentList[i].commentId}
      //         onClick={() => {
      //           addComments(
      //             commentList[i].commentUserName,
      //             commentList[i].commentId,
      //           );
      //         }}
      //       >
      //         回复
      //       </span>,
      //       <span
      //         key={commentList[i].commentId}
      //         onClick={() => {
      //           likes(commentList[i].commentId);
      //         }}
      //       >
      //         <LikeOutlined />
      //         点赞：{commentList[i].likes}
      //       </span>,
      //     ],
      //   });
      // }
      const getCommentList = (list) => {
        return list.reduce((pre, cur) => {
          pre.push({
            author: cur.commentUserName,
            avatar: cur.commentUserPic ? cur.commentUserPic : head_img,
            content: cur.commentContent.replace(/<[^>]+>/g, ''),
            datetime: dataFormat(cur.commentTime, 'YYYY-MM-DD HH:mm:ss'),
            children:
              cur.children && cur.children.length > 0
                ? getCommentList(cur.children)
                : [],
            actions: [
              <span
                // key={Date.now()}
                onClick={() => {
                  addComments(cur.commentUserName, cur.commentId);
                }}
              >
                回复
              </span>,
              <span
                key={cur.commentId}
                onClick={() => {
                  likes(cur.commentId);
                }}
              >
                <LikeOutlined />
                点赞：{cur.likes}
              </span>,
            ],
          });
          return pre;
        }, []);
      };

      setComments(_.cloneDeep(getCommentList(commentList)));
    }
  }, [commentList]);

  const handleChange = (e) => {
    setValue(e.target.value);
    if (value == '') {
      setCommentId('');
    }
  };

  const handleSubmit = () => {
    if (!value) {
      return;
    }

    dispatch({
      type: 'informationList/addInformationComment',
      payload: {
        informationId: informationId,
        commentContent: `<p>${value}</p>`,
        commentId: commentId,
      },
      callback: (code) => {
        if (code == REQUEST_SUCCESS) {
          setSubmitting(false);
          setValue('');
          dispatch({
            type: 'informationList/getInformationComment',
            payload: {
              informationId: informationId,
            },
          });
        }
      },
    });
  };

  const addComments = (commentUserName, commentId) => {
    setValue(`回复@${commentUserName}：`);
    setCommentId(commentId);
  };

  const likes = (id) => {
    setLike(true);
    dispatch({
      type: 'informationList/putInformationLikes',
      payload: {
        commentId: id,
      },
      callback: () => {
        dispatch({
          type: 'informationList/getInformationComment',
          payload: {
            informationId: informationId,
          }
        });
      },
    });
  };
  console.log("informationId",informationId,"comments",comments)
  return (
    <Card>
      <Comment
        avatar={<Avatar src={imgUrl || head_img} alt="Han Solo" />}
        content={
          <Editor
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={value}
          />
        }
      />
      {comments.length > 0 && <CommentList comments={comments} key={informationId}/>}
    </Card>
  );
}

export default connect(({ informationList }) => ({
  informationList,
}))(Comments);
