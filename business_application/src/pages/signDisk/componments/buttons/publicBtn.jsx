import { connect } from 'dva';
import { message, Input, Button } from 'antd';
import { CHUNK_SIZE } from '../../../../service/constant';
import styles from '../signDisk.less';
import {useState} from 'react'
import Breadcrumb from '../header/breadcrumb';
function Buttons({ dispatch, signDisk,selectTreeUrl,changeSelectTreeId }) {
  const { pubRowSelectionKey, pubRowSelection, ids, disabledAllButton } =
    signDisk;
    const [searchValue,setSearchValue]=useState('')
  const onSearch = () => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        publicSearch: searchValue,
        publicStart: 1,
      },
    });
  };
  const changeValue=(e)=>{
    setSearchValue(e.target.value)
  }

  function getContentLength(url) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', url);
      xhr.onload = function () {
        resolve(xhr.getResponseHeader('content-length') || 0);
      };
      xhr.send();
    });
  }

  let fileData = [];
  function partDownload(
    downName,
    url,
    start,
    end,
    contentLength,
    partLength = CHUNK_SIZE,
  ) {
    let xhr = new XMLHttpRequest();
    let getDate = new Date().toUTCString();
    xhr.open('GET', url);
    xhr.responseType = 'arraybuffer';
    xhr.setRequestHeader('Range', `bytes=${start}-${end}`);
    xhr.setRequestHeader('If-Range', `${getDate}`);
    xhr.onload = function () {
      if (xhr.status === 206 && start + CHUNK_SIZE < contentLength) {
        let endLength = end + partLength;
        if (endLength > contentLength) {
          endLength = contentLength;
        }
        fileData.push(new Blob([xhr.response]));
        partDownload(downName, url, end + 1, endLength, contentLength);
      } else {
        fileData.push(new Blob([xhr.response]));
        const blob = new Blob(fileData, {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = downName;
        link.click();
        window.URL.revokeObjectURL(link.href);
        message.success('下载成功!');
      }
    };
    xhr.onerror = function () {
      message.error('下载失败！');
    };
    xhr.send();
  }

  const downloads = () => {
    if (
      pubRowSelectionKey.length == 1 &&
      pubRowSelection[0].cloudDiskType != '文件夹'
    ) {
      dispatch({
        type: 'signDisk/getFileLengthURL',
        payload: {
          id: ids,
        },
        callback: (url) => {
          dispatch({
            type: 'signDisk/putDownLoad_SignDisk',
            payload: {
              id: ids,
              menuPosition: 'MINE',
            },
            callback: (downUrl, downName) => {
              getContentLength(url).then((length) => {
                partDownload(downName, downUrl, 0, CHUNK_SIZE, length);
              });
            },
          });
        },
      });
    } else if (pubRowSelectionKey.length === 0) {
      return message.warning('还没有选择条目');
    } else if (pubRowSelectionKey.length > 1) {
      return message.warning('每次只能下载单条数据');
    } else if (pubRowSelection[0].cloudDiskType == '文件夹') {
      return message.warning('暂不支持下载文件夹！');
    }
  };

  return (
    <>
      <div style={{ paddingTop: '8px', marginLeft: '8px' }}>
        <Breadcrumb selectTreeUrl={selectTreeUrl} changeSelectTreeId={changeSelectTreeId}/>
        {/* <Input
          placeholder="请输入文件名"
          // allowClear
          size="middle"
          // onSearch={onSearch}
          className={styles.searchInput}
          // enterButton={
          //   <img
          //     src={require('../../../../../public/assets/high_search.svg')}
          //     style={{ margin: '0 8px 2px 0' }}
          //   />
          // }
          style={{ width: '226px', height: '32px' }}
          onChange={changeValue}
        />
        <Button
          type="primary"
          style={{ margin: '0 8px' }}
          onClick={onSearch}
          className={styles.button_width}
        >
          查询
        </Button> */}
      </div>
      <div style={{ paddingTop: '8px' }}>
        <Button disabled={disabledAllButton} className={styles.button_width} type="primary" onClick={downloads}>
          下载
        </Button>
      </div>
    </>
  );
}

export default connect(({ signDisk }) => ({
  signDisk,
}))(Buttons);
