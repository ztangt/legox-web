/*
 * @Author: gaohy gaohy@suirui.com
 * @Date: 2022-05-24 15:54:19
 * @LastEditors: gaohy gaohy@suirui.com
 * @LastEditTime: 2022-06-12 19:09:03
 * @FilePath: \WPX\business_application\src\pages\informationList\[informationId].js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @author gaoj
 * @description 资讯公告详情
 */
import { connect } from 'dva';
import { useEffect,useRef } from 'react';
import { Card } from 'antd';
import Comments from '../componments/comments';
import { REQUEST_SUCCESS } from '../../../service/constant';
import axios from 'axios'
import { dataFormat } from '../../../util/util';
import styles from './informationId.less';

function InformationList({ dispatch, informationList, user }) {
  const informationTextRef = useRef('')
  // const id = pathname.split('/')[2];
  const { informationDetail, commentList, informationId } = informationList;
  // console.log(informationId, 'id==========================');
  const serializedState = localStorage.getItem('information_id');
  const detailId = JSON.parse(serializedState);
  // console.log(detailId, 'detailID-----------------');
  const { curUserInfo,informationOldText } = informationList;

  useEffect(() => {
    dispatch({
      type: 'informationList/updateStates',
      payload: {
        commentList: [],
      },
    });
    dispatch({
      type: 'informationList/getInformationComment',
      payload: {
        informationId: detailId,
      },
      callback: async(code,information) => {
        if (code == REQUEST_SUCCESS) {
          dispatch({
            type: 'informationList/getCurrentUserInfo',
          });
          if(information&&information.informationHtmlUrl){
            const res = await axios.get(information.informationHtmlUrl)
            if(res.status == 200){
              informationTextRef.current = res.data.value
            }
          }
        }
      },
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const doc = document.getElementsByClassName('ql-align-center');

      if (doc.length > 0) {
        for (let elm of doc) {
          elm.setAttribute('style', 'text-align: center');
        }
      }
    }, 1000);
  }, []);

  return (
    <div className={styles.container}>
      <Card>
        <h2
          title={informationDetail.informationFileName}
          className={styles.title}
        >
          {informationDetail.informationFileName}
        </h2>
        <div className={styles.writer}>
          作者：{informationDetail.createUserName}&emsp; 发布时间：
          {dataFormat(informationDetail.releaseTime, 'YYYY-MM-DD HH:mm:ss')}
        </div>
        <div
          style={{ marginTop: '22px' }}
          className={styles.QuillEdit}
          dangerouslySetInnerHTML={{
            __html: informationTextRef.current||informationOldText,
          }}
        ></div>
      </Card>
      <Comments
        userId={curUserInfo.userId}
        userAccount={curUserInfo.userAccount}
        informationId={detailId}
        informationDetail={informationDetail}
        commentList={commentList}
        key={commentList}
      ></Comments>
    </div>
  );
}

export default connect(({ informationList, user }) => ({
  informationList,
  user,
}))(InformationList);
