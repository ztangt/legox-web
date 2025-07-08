import { Fragment, useState, useRef,useEffect} from 'react';
import { Table,Form,Button,Upload, Modal,message,Input } from 'antd';
import { useDispatch, useSelector, useLocation} from 'umi';
import { DownloadOutlined,ArrowUpOutlined,ArrowDownOutlined,CloseOutlined,EditOutlined } from '@ant-design/icons';
import  styles  from './UploadFile.less';
// import {fetch} from 'dva'
import _ from 'lodash'
import { dataFormat } from '../../util/util';

const UploadForm = (props)=>{
    console.log('33props',props);
    const { tableColCode,fileSizeMax,attachType,limitNumber,relType,disabled,placeholder } = props
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { stateObj } = useSelector(({formShow})=>({...formShow}));
    const bizSolId = useLocation().query.bizSolId;
    const bizInfoId = useLocation().query.bizInfoId;
    const currentTab = useLocation().query.currentTab;
    const { bizInfo,attachmentFormList,attachmentList,reNameVisible,currentTarget,newName,currentTargetIndex } = stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab];
    const [loading,setLoading] = useState({});
    // const [currentTarget,setCurrentTarget] = useState({});
    // const [newName,setNewName] = useState('');
    const fileList = relType=='FORM'?(tableColCode&&attachmentFormList[tableColCode]&&attachmentFormList[tableColCode]||[]):attachmentList
    console.log('attachmentFormList',attachmentFormList,fileList);
    useEffect(()=>{
        if(bizInfoId){
            if(relType=='FORM'){
                if(Object.keys(attachmentFormList).length==0){
                    dispatch({
                        type: 'formShow/getFormAttachmentList',
                        payload:{
                            bizInfoId: bizInfoId,
                        }
                    })
                }
            }else{
                dispatch({
                    type: 'formShow/getAttachmentList',
                    payload:{
                        bizInfoId: bizInfoId,
                        relType: 'ATT'
                    }
                })
            }
        }
        
        
        
    },[])
    //上传校验)
    function beforeUpload(file) {
        try {
            const isMax = limitNumber?fileList.length<limitNumber:true
            if(!isMax){
                message.error(`最多只能上传${limitNumber}个文件`);
            }
            let isFileType = true//默认不管控类型
            let type = ''
            console.log('file',file.type);
            let fileTypeList = file.name.split('.')
            let fileType = fileTypeList[fileTypeList.length-1]
            if(attachType=='DOC'){
                // isFileType= file.type === 'application/word' || file.type === 'application/excel';
                isFileType = fileType === 'docx' || fileType === 'doc' || fileType === 'xls' || fileType === 'xlsx'
                type='WORD/EXCEL'
            }else if(attachType=='PIC'){
                isFileType= file.type === 'image/png' || file.type === 'image/jpeg'|| file.type === 'image/jpg'||file.type === 'image/gif';
                type='JPG/PNG/GIF'
            }else if(attachType=='NULL'){
                isFileType = true
            }
    
            if (!isFileType) {
                message.error(`上传的文件不是${type}格式`);
            }
            
            const isSize = fileSizeMax?file.size / 1024 / 1024 < fileSizeMax:true;
            if (!isSize) {
                message.error(`上传的文件不能大于${fileSizeMax}MB!`);
            }
            return isFileType && isSize && isMax;
        } catch (error) {
            console.log('error',error);
        }
       
    }


    
//上传
function doImgUpload(options){
    const { onSuccess, onError, file, onProgress } = options;
    console.log('file',file);
    dispatch({
        type: 'formShow/presignedUploadUrl',
        payload:{
            filePath:`BizAttachment/${new Date().getTime()}/${file.name}`
        },
        callback:function(url){
            fetch(url, {
                method: 'PUT',
                body: file
            }).then(() => {
                console.log('relType',relType);
                let fileObject = {fileName: file.name,fileSize: file.size,sort: fileList.length+1,filePath:`BizAttachment/${new Date().getTime()}/${file.name}`}
                if(relType=='FORM'){
                    if(!attachmentFormList[tableColCode]){
                        attachmentFormList[tableColCode] = []
                    }
                    attachmentFormList[tableColCode].push(fileObject);

                }else{
                    attachmentList.push(fileObject)
                }
                console.log('attachmentFormList',attachmentFormList);
                dispatch({
                    type: 'formShow/updateStates',
                    payload:{
                        attachmentList,
                        attachmentFormList,
                        attachmentTarget: true,
                    }
                })
                
                // saveAttachment([{fileName: file.name,fileSize: file.size,sort: fileList.length+1,filePath:`BizAttachment/${bizInfoId}/${file.name}`}])
            }).catch((e) => {
                console.error(e);
            });
        }
    })  
     
};
// //保存附件
// function saveAttachment(files){
//     dispatch({
//         type: 'formShow/saveAttachment',
//         payload:{
//             bizInfoId: bizInfoId,
//             columnCode: tableColCode,
//             files: JSON.stringify(files),
//             bizSolId,
//             relType,
//         },
//     }) 
// }

function onDelete(fileIds,index){//删除附件
    
    Modal.confirm({
        title: '确认删除此附件?',
        content: '',
        okText: '删除',
        cancelText: '取消',
        onOk: async () => {
            // if(fileIds){
            //     dispatch({
            //         type: 'formShow/deleteAttachment',
            //         payload:{
            //             bizInfoId: bizInfoId,
            //             columnCode: tableColCode,
            //             fileIds,
            //             relType,
            //         },
            //     })
            // }else{
                if(relType=='FORM'){
                    attachmentFormList[tableColCode].splice(index,1)
                }else{
                    attachmentList.splice(index,1)

                }
                dispatch({
                    type: 'formShow/updateStates',
                    payload:{
                        attachmentList,
                        attachmentFormList,
                        attachmentTarget: true,
                    }
                })
            // }
             
        },
      });
    
}


// function onUPDOWN(currentKey,option){//上移/下移
//     let preIndex = option=='UP'?currentKey-2:currentKey+1
//     let nextIndex = option=='UP'?currentKey-1:currentKey+2
//     let preId = fileList[preIndex]&&fileList[preIndex].id
//     let nextId = fileList[nextIndex]&&fileList[nextIndex].id
//     let targetId = fileList[currentKey].id
//    dispatch({
//         type: 'formShow/updateAttachment',
//         payload:{
//             preId,
//             nextId,
//             targetId,
//         },
//         relType,
//         updateType:'UPLOAD'
//     }) 

// }


function arraymove(fromIndex, toIndex){ 
    if(relType=='FORM'){
        var element = attachmentFormList[tableColCode][fromIndex];     
        attachmentFormList[tableColCode].splice(fromIndex, 1);     
        attachmentFormList[tableColCode].splice(toIndex, 0, element);
    }else{
        var element = attachmentList[fromIndex];     
        attachmentList.splice(fromIndex, 1);     
        attachmentList.splice(toIndex, 0, element);
    }
    dispatch({
        type: 'formShow/updateStates',
        payload:{
            attachmentList,
            attachmentFormList,
            attachmentTarget: true,
        }
    })
  }

function onReName(){//重命名
    // if(currentTarget.id){
    //     dispatch({
    //         type: 'formShow/updateAttachment',
    //         payload:{
    //             targetId: currentTarget.id,
    //             newName
    //         },
    //         relType,
    //         updateType:'UPLOAD'
    //     }) 
    // }else{
        if(relType=='FORM'){
            attachmentFormList[tableColCode][currentTargetIndex].fileName =   newName  
        }else{
            attachmentList[currentTargetIndex].fileName = newName
        }
        dispatch({
            type: 'formShow/updateStates',
            payload:{
                attachmentList,
                attachmentFormList,
                attachmentTarget: true,
            }
        })
        onVisible(false);

    // }
}
function onReNameFile(record,index){
    dispatch({
        type: 'formShow/updateStates',
        payload:{
            newName: record.fileName,
            currentTarget: record,
            currentTargetIndex: index,
        }
    })
    onVisible(true);    
}

function download(src,filename) {
    if(!src){
        message.error('暂未生成下载地址,请保存后再进行该操作！')
        return
    }
    fetch(src).then((res) => {
        res.blob().then((blob) => {
          const blobUrl = window.URL.createObjectURL(blob);
          // 这里的文件名根据实际情况从响应头或者url里获取
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = filename;;
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        });
      });
    }

const tableProps = {
    key: fileList,
    locale:{ emptyText: placeholder?placeholder:'暂无数据'},
    columns: [
    {
        title: '序号',
        dataIndex: 'key',
        render: (text,record,index)=><div >{index+1}</div>,
        width: '60px',
    },
    {
        title: '操作',
        dataIndex: 'ey',
        render: (text,record,index)=><div >
            {console.log(record,'record====')}
            <DownloadOutlined onClick={download.bind(this,record.fileUrl,record.fileName)}/>
            <CloseOutlined  onClick={onDelete.bind(this,record.fileId,index)}/>
            <EditOutlined onClick={onReNameFile.bind(this,record,index)}/>
            {index==0?'':<ArrowUpOutlined onClick={arraymove.bind(this,index,index-1)}/>}
            {(index==0&&index==fileList.length-1)||index==fileList.length-1?'':<ArrowDownOutlined onClick={arraymove.bind(this,index,index+1)}/>}
            </div>
    },
    {
        title: '附件名称',
        dataIndex: 'fileName',
    },
    {
        title: '附件类型',
        dataIndex: 'fileType',
        render: (text,record,index)=><div >{record.fileId?`${text.split('.')[text.split('.').length-1]}`:record.fileName.split('.')[record.fileName.split('.').length-1]}</div>
    },
    {
        title: '附件大小',
        dataIndex: 'fileSize',
        render: (text,record,index)=><div >{`${(text/ 1024/ 1024).toFixed(2)}MB`}</div>

    },
    {
        title: '上传人',
        dataIndex: 'createUserName',
        render: (text,record,index)=><div >{record.fileId?text:window.localStorage.getItem('userName')}</div>

    },
    {
        title: '上传时间',
        dataIndex: 'createTime',
        render: (text,record,index)=><div >{record.fileId?dataFormat(text,'YYYY-MM-DD'):dataFormat(record.filePath.split('/')[1]/1000,'YYYY-MM-DD')}</div>
    }],
    dataSource: _.cloneDeep(fileList),
    rowKey:'fileId',
    pagination: false,
}

    

    function onVisible(visible){
        dispatch({
            type: 'formShow/updateStates',
            payload:{
                reNameVisible: visible
            }
        })
    }

    function onChangeName(e){
        dispatch({
            type: 'formShow/updateStates',
            payload:{
                newName: e.target.value
            }
        })
    }
    function returnType(attachType){
        if(attachType=='DOC'){
            return '.docx,.doc,.xls,.xlsx'
        }else if(attachType=='PIC'){
            return  '.png,.jpeg,.gif,.jpg'

        }else if(attachType=='NULL'){
            return   ''
        }
        
    }
    
    return(
        <div className={styles.container} style={{'pointer-events':disabled?'none':'',background:disabled?'#f5f5f5':''}}>
            <div className={styles.bt_container}>
                <Upload
                    name={relType=='FORM'?tableColCode:'relType'}
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    customRequest={doImgUpload.bind(this)}
                    maxCount={fileSizeMax}
                    listType='text'
                    accept={returnType(attachType)}
                >
                    <Button className={styles.bt} >上传附件</Button>
                </Upload>
            </div>  
            <Table {...tableProps} className={styles.atttable}/>
            {reNameVisible&&<Modal
              visible={true}
              title={'重命名'}
              onCancel={onVisible.bind(this,false)}
              maskClosable={false}
              mask={false}
              onOk={onReName.bind(this)}
              getContainer={() =>{
                  return document.getElementById('formShow_container')
              }}
              >
                  <Input onChange={onChangeName.bind(this)} value={newName}/>
            </Modal>}
        </div>
    )
}
export default UploadForm