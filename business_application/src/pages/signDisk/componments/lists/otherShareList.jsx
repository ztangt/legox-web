
import { connect } from 'dva';
import { useEffect } from 'react';
import Buttons from '../buttons/OtherShareBtn';
import List from '../fileList/otherSharelist';
import styles from '../signDisk.less';

function OtherShareList({ dispatch, signDisk,selectTreeUrl,changeSelectTreeId }) {

  const {
    otherShareStart,
    otherShareLimit,
    otherShareName
  } = signDisk;
  useEffect(() => {
    dispatch({
      type: 'signDisk/getOtherShareList_SignDisk',
      payload: {
        start: otherShareStart,
        limit: otherShareLimit,
        name: otherShareName
      },
    })
  }, [otherShareStart, otherShareLimit, otherShareName])

  return (
    <>
      <div className={styles.rightTop}>
        <Buttons selectTreeUrl={selectTreeUrl} changeSelectTreeId={changeSelectTreeId} />
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
}))(OtherShareList);
