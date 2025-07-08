import { connect } from 'dva';
import { useEffect } from 'react';
import Buttons from '../buttons/TrashBtn';
import List from '../fileList/trashlist';
import styles from '../signDisk.less';

function TrashList({ dispatch, signDisk,selectTreeUrl,changeSelectTreeId }) {

  const {
    trashStart,
    trashLimit,
    trashName,
    selectedKeysValue
  } = signDisk;
  useEffect(() => {
    dispatch({
      type: 'signDisk/getPagingOrBinList_SignDisk_Listist_Trash',
      payload: {
        start: trashStart,
        limit: trashLimit,
        id: selectedKeysValue,
        name: trashName,
        delete: 'N',
        type: 'L'
      }
    })
  }, [trashStart, trashLimit, trashName]);

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
}))(TrashList);
