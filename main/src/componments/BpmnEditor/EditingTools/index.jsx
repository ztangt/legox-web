import React, {Component} from 'react';
import {
    CloseOutlined,
    SyncOutlined
  } from '@ant-design/icons';
  import saveAndUp from  '../../../../public/assets/icons/saveAndUp.svg'
  import save from '../../../../public/assets/icons/save.svg'
  import download from '../../../../public/assets/icons/download.svg'
  import zoomOut from '../../../../public/assets/icons/zoomOut.svg'
  import zoomIn from '../../../../public/assets/icons/zoomIn.svg'
  import redo from '../../../../public/assets/icons/redo.svg'
  import undo from '../../../../public/assets/icons/undo.svg'
  import open from '../../../../public/assets/icons/open.svg'
import styles from './index.less';

class EditingTools extends Component {
    handleOpen = () => {
        this.file.click();
    };

    render() {
        const {
            onOpenFIle,
            onZoomIn,
            onZoomOut,
            onZoomReset,
            onUndo,
            onRedo,
            onSave,
            onDownloadXml,
            onDownloadSvg,
            onPreview,
            onCodeView,
            onSaveAndUpload,
            onGoBack
        } = this.props;
        // 开发使用下属bpmn
        return (
            <div className={styles.editingTools}>
                <ul className={styles.controlList}>
                    {
                        process.env.NODE_ENV=='development'?
                        <li className={`${styles.control} ${styles.line}`}>
                            <input
                                ref={file => {
                                    this.file = file;
                                }}
                                className={styles.openFile}
                                type="file"
                                onChange={onOpenFIle}
                            />
                            <button type="button" title="打开BPMN文件" onClick={this.handleOpen}>
                                <i className={styles.open} style={{backgroundImage: 'url('+open +')'}}/>
                            </button>
                        </li>:''
                    }
                    

                    <li className={styles.control}>
                        <button type="button" title="撤销" onClick={onUndo}>
                            <i className={styles.undo} style={{backgroundImage: 'url('+undo +')'}}/>
                        </button>
                    </li>
                    <li className={`${styles.control} ${styles.line}`}>
                        <button type="button" title="恢复" onClick={onRedo}>
                            <i className={styles.redo} style={{backgroundImage: 'url('+redo +')'}}/>
                        </button>
                    </li>

                    <li className={styles.control}>
                        <button type="button" title="重置大小" onClick={onZoomReset}>
                            <SyncOutlined className={styles.refresh}/>
                            {/* <i className={styles.zoom} style={{backgroundImage: 'url('+require('../../../../public/assets/icons/zoom.svg') +')'}}/> */}
                        </button>
                    </li>
                    <li className={styles.control}>
                        <button type="button" title="放大" onClick={onZoomIn}>
                            <i className={styles.zoomIn} style={{backgroundImage: 'url('+zoomIn +')'}}/>
                        </button>
                    </li>
                    <li className={`${styles.control} ${styles.line}`}>
                        <button type="button" title="缩小" onClick={onZoomOut}>
                            <i className={styles.zoomOut} style={{backgroundImage: 'url('+zoomOut +')'}}/>
                        </button>
                    </li>
                    {
                        process.env.NODE_ENV=='development'?<li className={styles.control}>
                        <button type="button" title="下载BPMN文件" onClick={onDownloadXml}>
                            <i className={styles.download} style={{backgroundImage: 'url('+download +')'}}/>
                        </button>
                    </li>:''
                    }
                    
                    {/* <li className={styles.control}>
                        <button type="button" title="下载流程图片" onClick={onDownloadSvg}>
                            <i className={styles.image} style={{backgroundImage: 'url('+require('../../../../public/assets/icons/image.svg') +')'}}/>
                        </button>
                    </li> */}
                    {/* <li className={styles.control}>
                        <button type="button" title="预览流程图片" style={{backgroundImage: 'url('+require('../../../../public/assets/icons/preview.svg') +')'}} onClick={onPreview}>
                            <i className={styles.preview} />
                        </button>
                    </li> */}

                    {
                        process.env.NODE_ENV == 'development'?<li  className={styles.control}>
                        <button type="button" title="code" onClick={onCodeView}>
                            <i className={styles.code}>code</i>
                        </button>
                    </li>:''
                    }
                     <li className={styles.control}>
                        <button type="button" title="保存流程" onClick={onSave}>
                            <i className={styles.save} style={{background: 'url('+save+')'}}/>
                        </button>
                    </li>
                    <li className={styles.control}>
                        <button type="button" title="保存并发布" onClick={onSaveAndUpload}>
                            <svg className={styles.up} style={{backgroundImage: 'url('+saveAndUp +')'}}></svg>
                        </button>
                    </li>
                    <li className={styles.control}>
                        <button type="button" title="返回上一页" onClick={onGoBack}>
                            <CloseOutlined className={styles.back}/>
                        </button>
                    </li>
                </ul>
            </div>
        );
    }
}

export default EditingTools;
