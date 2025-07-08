import { Button } from 'antd';
import { connect } from 'umi';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import IUpload from '../../../componments/Upload/uploadModal';
import styles from './upload.less';

function Upload({ value, onChange, location, dispatch }) {
  const onDeleteFile = () => {
    onChange && onChange('');
  };

  const uploadSuccess = (val) => {
    onChange && onChange(val);
  };

  const fileList = (fileName) => {
    return (
      <div className={styles.fileList}>
        <div>{fileName}</div>
        <div className={styles.deleIcon} onClick={onDeleteFile}>
          <DeleteOutlined />
        </div>
      </div>
    );
  };

  return (
    <div>
      {value ? (
        fileList(value)
      ) : (
        <IUpload
          location={location}
          typeName={new Date().getTime()}
          nameSpace="dynamicPage"
          requireFileSize={1024}
          uploadSuccess={uploadSuccess}
          buttonContent={<Button icon={<UploadOutlined />}>选择文件</Button>}
        />
      )}
    </div>
  );
}

export default connect(({ pluginManage }) => {
  return { ...pluginManage };
})(Upload);
