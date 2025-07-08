import {useEffect} from 'react'
import { Button, Upload } from 'antd';
import { connect } from 'umi';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import IUpload from '../../../componments/Upload/uploadModal';
import styles from '../index.less';

function UploadPlugin({ value, onChange, dispatch, fileStorageId,isUploading,needfilepath }) {
  useEffect(() => {
      if(!value&&fileStorageId){
        onChange && onChange(needfilepath);
        dispatch({
          type: 'pluginManage/updateStates',
          payload: {
            fileStorageId: fileStorageId,
            isUploading: false,
          },
        });
      }
  }, [fileStorageId]);

  const uploadSuccess = (...val) => {
    onChange && onChange(val[0]);
    dispatch({
      type: 'pluginManage/updateStates',
      payload: {
        fileStorageId: val[2],
        isUploading: false,
      },
    });
  };

  const onDeleteFile = () => {
    onChange && onChange('');
  };

  const fileList = fileName => {
    let fileArr = fileName.split('/')[fileName.split('/').length - 1];
    return (
      <div className={styles.fileList}>
        <div>{fileArr}</div>
        <div className={styles.deleIcon} onClick={onDeleteFile}>
          <DeleteOutlined />
        </div>
      </div>
    );
  };

  return (
    <div>
      <div>
        {value ? (
          fileList(value)
        ) : (
          <IUpload
            typeName={new Date().getTime()}
            nameSpace="pluginManage"
            requireFileSize={1024}
            // uploadSuccess={uploadSuccess}
            buttonContent={<Button icon={<UploadOutlined />} disabled={isUploading} loading={isUploading}>选择文件</Button>}
          />
        )}
      </div>
    </div>
  );
}

export default connect(({ pluginManage }) => {
  return { ...pluginManage };
})(UploadPlugin);
