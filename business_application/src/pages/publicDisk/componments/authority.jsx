import { connect } from 'dva';
import { Modal, Radio, Card } from 'antd';
import { useEffect } from 'react';
import AuthControl from './authControl';
import GlobalModal from '../../../componments/GlobalModal';
import styles from './authority.less';

function moveOrCopy({ dispatch, publicDisk }) {
  const {
    showAuthority,
    authlist,
    radioSeeValue,
    radioDownloadValue,
    radioDetailValue,
    commentsRows,
    commentsRowsKeys,
    controlDisabled,
    selectedPublicKey,
  } = publicDisk;
  useEffect(() => {
    if (commentsRows.length != 0 && authlist.length != 0) {
      dispatch({
        type: 'publicDisk/updateStates',
        payload: {
          controlDisabled: false,
        },
      });
    } else {
      dispatch({
        type: 'publicDisk/updateStates',
        payload: {
          controlDisabled: true,
        },
      });
    }
  }, [commentsRows, commentsRowsKeys, authlist]);

  const authorityCancel = () => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        showAuthority: false,
        controlDisabled: true,
        radioSeeValue: 1,
        radioDownloadValue: 1,
        radioDetailValue: 1,
      },
    });
  };

  const authorityOk = () => {
    let ass = JSON.stringify(authlist);
    dispatch({
      type: 'publicDisk/postSetAuthority_CommonDisk',
      payload: {
        cloudDiskId: selectedPublicKey,
        dataJson: ass,
      },
      callback: () => {
        dispatch({
          type: 'publicDisk/updateStates',
          payload: {
            showAuthority: false,
            authlist: [],
            controlDisabled: true,
          },
        });
      },
    });
  };

  const getSingleId = (str) => {
    let strArr = str.split('-');

    return strArr[1] != 'undefined' ? strArr[1] : strArr[0];
  };

  const onSeeRadioChange = (e) => {
    let visual = e.target.value === 1 ? 1 : 0;

    let keyStr = getSingleId(commentsRowsKeys[0]);

    let newAcc = JSON.parse(JSON.stringify(authlist)).map((item, index) => {
      if (item.operation === 'ORG' && String(item.orgId) === keyStr) {
        item.visual = visual;
      }

      if (item.operation === 'USER' && String(item.authUserId) === keyStr) {
        item.visual = visual;
      }

      if (item.operation === 'EVERYONE' && String(index) === keyStr) {
        item.visual = visual;
      }

      return item;
    });

    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        authlist: newAcc,
        radioSeeValue: e.target.value,
      },
    });
  };
  const onDownloadRadioChange = (e) => {
    let download = e.target.value === 1 ? 1 : 0;

    let keyStr = getSingleId(commentsRowsKeys[0]);

    let newAcc = JSON.parse(JSON.stringify(authlist)).map((item, index) => {
      if (item.operation === 'ORG' && String(item.orgId) === keyStr) {
        item.download = download;
      }

      if (item.operation === 'USER' && String(item.authUserId) === keyStr) {
        item.download = download;
      }

      if (item.operation === 'EVERYONE' && String(index) === keyStr) {
        item.download = download;
      }

      return item;
    });

    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        authlist: newAcc,
        radioDownloadValue: e.target.value,
      },
    });
  };
  const onDetailRadioChange = (e) => {
    let see = e.target.value === 1 ? 1 : 0;

    let keyStr = getSingleId(commentsRowsKeys[0]);

    let newAcc = JSON.parse(JSON.stringify(authlist)).map((item, index) => {
      if (item.operation === 'ORG' && String(item.orgId) === keyStr) {
        item.see = see;
      }

      if (item.operation === 'USER' && String(item.authUserId) === keyStr) {
        item.see = see;
      }

      if (item.operation === 'EVERYONE' && String(index) === keyStr) {
        item.see = see;
      }

      return item;
    });

    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        authlist: newAcc,
        radioDetailValue: e.target.value,
      },
    });
  };
  console.log("222222222222",showAuthority)
  return (
    <>
      <GlobalModal
        className={styles.authorityControl}
        mask={false}
        visible={showAuthority}
        title="权限设置"
        widthType={2}
        onCancel={authorityCancel}
        onOk={authorityOk}
        bodyStyle={{padding:'16px 0px 0px 16px',overflow:'hidden'}}
        // width={790}
        getContainer={() => {
          return document.getElementById('container_public')||false;
        }}
      >
        <div className={styles.auth_box}>
          <div className={styles.auth_line}></div>
          <div className={styles.auth} style={{ display: 'flex', width: '100%' }}>
            <AuthControl></AuthControl>
          </div>
          <div className={styles.radios} title="拥有权限">
            <div>是否可查看</div>
            <Radio.Group
              onChange={onSeeRadioChange}
              value={radioSeeValue}
              disabled={controlDisabled}
            >
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
            <div>是否可下载</div>
            <Radio.Group
              onChange={onDownloadRadioChange}
              value={radioDownloadValue}
              disabled={controlDisabled}
            >
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
            <div>是否可查看详情</div>
            <Radio.Group
              onChange={onDetailRadioChange}
              value={radioDetailValue}
              disabled={controlDisabled}
            >
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </div>
        </div>
      </GlobalModal>
    </>
  );
}

export default connect(({ publicDisk }) => ({
  publicDisk,
}))(moveOrCopy);
