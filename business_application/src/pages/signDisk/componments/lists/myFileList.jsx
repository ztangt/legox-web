import { connect } from 'dva';
import styles from '../signDisk.less';
import Buttons from '../buttons/MyFileBtn';
import List from '../fileList/myFilelist';

function MyFileList({ dispatch, signDisk ,location,changeSelectTreeId}) {

  const { } = signDisk;

  return (
    <>
      <div className={styles.rightTop}>
        <Buttons location={location} changeSelectTreeId={changeSelectTreeId} />
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
}))(MyFileList);
