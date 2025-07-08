/*
 * @Author: gaohy gaohy@suirui.com
 * @Date: 2022-04-28 17:41:06
 * @LastEditors: gaohy gaohy@suirui.com
 * @LastEditTime: 2022-06-17 17:28:27
 * @FilePath: \WPX\business_application\src\componments\informationlist\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

/**
 * @author gaoj
 * @description 资讯公告展示组件
 */

import { connect } from 'dva';
import { history } from 'umi';
import { List, Card, Image } from 'antd';
import { dataFormat } from '../../util/util';
import baseImage from '../../../public/assets/base_img.svg'
import styles from './index.less';

function InformationComponent({ dispatch, informationList, informationType, informationTypeId}) {
  const { start, limit, returnCount } = informationList;
  return (
    <div style={{ width: '100%', paddingBottom: '25px' }}>
      <List
        itemLayout="vertical"
        size="default"
        pagination={false}
        dataSource={informationType}
        renderItem={(item) => (
          <List.Item
            className={styles.listItem}
            onClick={() => {
              // 外部链接
              if(item.informationType == 2){
                dispatch({
                  type: 'informationList/getInformationComment',
                  payload: {
                    informationId: item.informationId
                  },
                  callback(){
                    dispatch({
                      type: 'informationList/getInformation',
                      payload: {
                        informationTypeId:informationTypeId||'',
                        start,
                        limit,
                        isOwn: false,
                        isRelease: 1
                      }
                    })
                  }
                })
                // 需要打开新页面
                window.open(item.linkUrl)
                return 
              }
              let information_id = item.informationId;
              const serializedState = JSON.stringify(information_id);
              localStorage.setItem('information_id', serializedState);
              historyPush({
                // pathname: `/informationlist/${information_id}`,
                pathname: `/informationList/detail`,
                query: {
                  title: '详情',
                  information_id
                },
              });
            }}
            key={item.informationId}
          >
            <div className={styles.left}>
              {item.fileStorageUrl ? (
                <Image
                  width={120}
                  height={90}
                  src={item.fileStorageUrl}
                  preview={false}
                />
              ) : (
                <div>
                  <Image 
                    width={120}
                    height={90}
                    src={baseImage}
                    preview={false}
                  />
                </div>
              )}
            </div>
            <div className={styles.right}>
              <div className={styles.rightTop}>
                <h2 className={styles.title}>{item.informationFileName}</h2>
                <div className={styles.desc}>{item.informationDesc}</div>
              </div>

              <div className={styles.rightDown}>
                <div>所属分组：{item.informationTypeName}</div>
                <div>
                  作者：{item.createUserName ? item.createUserName : ''}
                  {item.releaseDeptName ? `(${item.releaseDeptName})` : ''}
                </div>
                <div>浏览量：{item.viewNum}</div>
                <div>评论数量：{item.commentNum}</div>
                <div>
                  发布时间：{dataFormat(item.releaseTime, 'YYYY-MM-DD')}
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}

export default connect(({ informationList }) => ({
  informationList,
}))(InformationComponent);
