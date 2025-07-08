import { connect } from 'dva';
import { useEffect } from 'react';
import Buttons from '../buttons/MyShareBtn';
import List from '../fileList/mySharelist';
import styles from '../signDisk.less';

function MyShareList({ dispatch, signDisk,selectTreeUrl,changeSelectTreeId }) {

  const {
    myShareStart,
    myShareLimit,
    myShareName
  } = signDisk;

  useEffect(() => {
    dispatch({
      type: 'signDisk/getMyShareList_SignDisk',
      payload: {
        start: myShareStart,
        limit: myShareLimit,
        name: myShareName
      }
    })
  }, [myShareStart, myShareLimit, myShareName]);

  return (
    <>
      <div className={styles.rightTop}>
        <Buttons selectTreeUrl={selectTreeUrl} changeSelectTreeId={changeSelectTreeId}/>
      </div>
      <div className={styles.rightDown}>
        <List />
      </div>
    </>
  )
};

export default connect(({
  signDisk
}) => ({
  signDisk
}))(MyShareList);
