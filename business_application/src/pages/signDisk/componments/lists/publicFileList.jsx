import { connect } from 'dva';
import styles from '../signDisk.less';
import List from '../fileList/publicFilelist';
import Buttons from '../buttons/publicBtn';
import { useEffect } from 'react';

function PublicDisk({ signDisk, dispatch,selectTreeUrl,changeSelectTreeId  }) {
  const {
  } = signDisk;

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
}))(PublicDisk);
