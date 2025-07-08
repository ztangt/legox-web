/**
 * 业务方案表单信息
 */
import {useEffect,useState} from 'react';
import {Button,message,Dropdown,Menu,Radio,Checkbox,Select,Modal} from 'antd';
import styles from './formInfo.less';
import {connect,history} from "umi";
import ModalButton from './modalButton';
import ModalForm from './modalForm';
import ModalList from './modalList';
import { DownOutlined } from '@ant-design/icons';
import ModalPageConfig from './modalPageConfig';
import ModalBindCode from './modalBindCode';
import ModalTitle from './modalTitle';
import ApplyModelFormAuth from './applyModelFormAuth';
import CodeModal from './modalChose';
import IUpload from '../../../componments/Upload/uploadModal'
import Table from '../../../componments/columnDragTable';
import ModalFileMoudle from './modalFileMoudle';
function FormInfo({query,dispatch,applyModelConfig,parentState,setParentState}){
  const bizSolId = query.bizSolId;
  const ctlgId = query.ctlgId;
  let {isShowFormModal,isShowListModal,isShowButtonModal,bizFromInfo,isShowPageModal,bizSolInfo,
    isShowBindCodeModel,oldBizFromInfo,isShowTitleModal,procDefId,isShowAuthModal,tableData,
    buttonList,isShowChoseModal,isActionButton,versionList,selectVersionId,oldSelectVersionId,
    submitting,isSaveTitle,titleList,oldButtonList,fileMoudleList,isShowFileMoudle
  }=parentState;
  const [buttonType,setButtonType] = useState('')
  const {getFileMD5Message,fileExists,md5FileId,md5FilePath,fileStorageId,fileName,formNewData,bizFormType,designItem,fileSize}=applyModelConfig
  // useEffect(() => {
  //   // 如果文件存在于minio
  //   if (fileExists) {
  //       dispatch({
  //         type: 'applyModelConfig/getDownFileUrl',
  //         payload: {
  //           fileStorageId: md5FileId
  //         },
  //         callback: () => {
  //           dispatch({
  //             type: 'applyModelConfig/updateStatesGlobal',
  //             payload: {
  //               fileExists: '',
  //               fileStorageId: md5FileId
  //             }
  //           });
  //         }
  //       });
  //   } else if (fileExists === false) {
  //     // 如果文件不存在于minio
  //       dispatch({
  //         type: 'applyModelConfig/getDownFileUrl',
  //         payload: {
  //           fileStorageId: fileStorageId
  //         },
  //         callback: () => {
  //           dispatch({
  //             type: 'applyModelConfig/updateStatesGlobal',
  //             payload: {
  //               fileExists: '',
  //               fileStorageId: fileStorageId
  //             }
  //           });
  //         }
  //       });
  //   }
  // }, [fileExists, getFileMD5Message])
  useEffect(()=>{
    tableData[5].name=fileName
                  setParentState({
                    tableData
                  })
  },[fileName])
  useEffect(()=>{
    // if(bizFromInfo.importTemplateFilePath){
    //   let str = bizFromInfo.importTemplateFilePath;
    //    let index = str .lastIndexOf ("\/");
    //    str = str .substring (index + 1, str .length);
    //   tableData[5].name=str
    // }
    dispatch({
      type: 'applyModelConfig/updateStatesGlobal',
      payload: {
        fileName: '',
      }
    });
    // if(bizFromInfo.importTemplateFileName){
      tableData[5].name=bizFromInfo.importTemplateFileName?bizFromInfo.importTemplateFileName:''
      setParentState({
        tableData
      })
    // }
    //获取业务应用标题设计
    dispatch({
      type:'applyModelConfig/getBizSolList',
      payload:{
        bizSolId,
        procDefId:procDefId,
        formDeployId:bizFromInfo.formDeployId
      },
      callback:(data)=>{
        setParentState({
          isActionButton:false,
          tableData,
          ...data
        })
      }
    })
  },[])
  useEffect(()=>{
    if(selectVersionId&&selectVersionId!='edit'){
      //重新获取版本信息
      dispatch({
        type:"applyModelConfig/getBussinessFormByBizFormId",
        payload:{
          bizSolFormId:selectVersionId
        },
        extraParams:{
          setState:setParentState,
          state:parentState
        },
        callback:(newBizFromInfo)=>{
          //切换版本重新获取按钮配置
          dispatch({
            type:"applyModelConfig/getButtonAuth",
            payload:{
              bizSolId,
              procDefId:newBizFromInfo.procDefId,
              actId:'0',
              buttonGroupId:newBizFromInfo.buttonGroupId,
              isRefresh:0,
              deployFormId:newBizFromInfo.formDeployId
            },
            callback:(data)=>{
              setParentState({
                ...data
              })
            }
          })
        }
      })
    }
  },[selectVersionId])
  //如果procDefId改变则重新获取配置信息
  useEffect(() => {
    console.log(procDefId,'procDefIdprocDefId=======');
    if(procDefId&&procDefId!="0"&&bizFromInfo.formDeployId){
      //获取业务应用表单配置信息
      dispatch({
        type:'applyModelConfig/getBizSolFormConfigProDef',
        payload:{
          bizSolId:bizSolId,
          procDefId,
          formDeployId:bizFromInfo.formDeployId
        },
        extraParams:{
          setState:setParentState,
          state:parentState
        }
      })
        //获取业务应用标题设计
        dispatch({
          type:'applyModelConfig/getBizSolList',
          payload:{
            bizSolId,
            procDefId:procDefId,
            formDeployId:bizFromInfo.formDeployId
          },
          callback:(data)=>{
            setParentState({
              ...data
            })
          }
        })
      //用于判断改流程下表单授权是否已经保存，获取数据是用procDefId还是bizFromInfo
      //用于判断改流程下表单是否已经保存，获取数据是用procDefId还是bizFromInfo
      // dispatch({
      //   type:'applyModelConfig/updateStates',
      //   payload:{
      //     isSaveFormAuth:false,//流程改变保存状态为false,获取数据用bizFromInfo。procDefId
      //     isSaveTitle:false,//流程改变保存状态为false,获取数据用bizFromInfo。procDefId
      //   }
      // })
    }
  },[procDefId]);
  // useEffect(()=>{
  //   dispatch({
  //     type:'applyModelConfig/getBusinessForm',
  //     payload:{
  //       ctlgId:bizSolInfo.ctlgId,
  //       start:1,
  //       limit:10000,
  //       type:'1,3'
  //     },
  //     callback:(data)=>{
  //       const formData=loopFormData(data)
  //       dispatch({
  //         type:'applyModelConfig/updateStatesGlobal',
  //         payload:{
  //           formNewData:[...formData],
  //         }
  //       })
  //     }
  //   })
  // },[bizFromInfo.formBizFormCode])
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width:60
    },
    {
      title: '作用域',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title:'操作',
      dataIndex: 'key',
      key: 'key',
      render:(text,record)=><div className="table_operation">{oprationRender(record,text)}</div>
    }
  ];
  const loopFormData=(data)=>{
    data.forEach((item,index)=>{
      if(item.isChildVersion==1){
        dispatch({
          type:"applyModelConfig/getFormOtherVersions",
          payload:{
            formId:item.formId
          },
          extraParams:{
            setState:setParentState,
            state:parentState
          }
        })
      }
      if(item.children&&item.children[0].id){
        loopFormData(item.children)
      }
    })
    return data
  }
  const flatTree=(tree)=> {
    let arr = []
    tree.forEach(item => {
        arr.push(item)
        if (item.children&&item.children[0].id) {
            arr = arr.concat(flatTree(item.children))
        }
    })
    return arr
}
  const onEdit = () => {
    let res=[]
    //获取业务表单数据
    if(designItem.length>0){
      res=designItem
    }else{
    //   const newData=flatTree(formNewData)
    //   res=newData.filter((item,index)=>{
    //   if((item.bizFormCode==bizFromInfo.formBizFormCode)&&(item.formVersion==bizFromInfo.deployFormVersion)){
    //     return item
    //   }
    // })
    res.push({formId:bizFromInfo.formId,formVersion:bizFromInfo.deployFormVersion})
    }
    if(res.length){
      if(window.location.href.includes('/cloud/applyConfig')){
        let path = `/cloud/designer/formDesigner?formId=${res[0].formId}&version=${res[0].formVersion}&tenantId=${query.tenantId}`;
         window.open(`#${path}`, '_blank');
         return
      }
      let path = `/support/designer/formDesigner?formId=${res[0].formId}&version=${res[0].formVersion}`;
      window.open(`#${path}`, '_blank');
    }


  };
  const oprationRender=(record,text)=>{
    console.log('record',record);
    if(text=='list'){
      return <span onClick={showFormModalFn.bind(this,text)}>选择</span>
    }else if(text=='button'){
      return (
        <>
        <span onClick={showFormModalFn.bind(this,text)}>选择</span>
        {/* <span onClick={pageConfigModalFn}>分页</span> */}
        </>
      )
    }else if(record.type=='表单数据拉取方案'){
      return <span onClick={showChose.bind(this)}>选择</span>
    }else if(record.type=='表单分页设置'){
      return <>
            <Checkbox.Group onChange={onChangeTemplate} value={bizFromInfo?.template?.split(',')}>
              <Checkbox
                value={'WORD'}
              >
                WORD
              </Checkbox>
              <Checkbox
                value={'PDF'}
              >
                PDF
              </Checkbox>
              <Checkbox
                value={'ANNEX'}
              >
                关联文档
              </Checkbox>
            </Checkbox.Group>
            <span onClick={goFormAuth.bind(this,'att')}>授权</span>
          </>
    }else if(record.type=='导入模版配置'){
      return <>
                <IUpload
                nameSpace="applyModelConfig"
                requireFileSize={50}
                mustFileType={'xlsx,xls'}
                uploadSuccess={(filePath,fileUrl)=>{
                  bizFromInfo.importTemplateFilePath=filePath
                  bizFromInfo.importTemplateFullFilePath=fileUrl
                  // let str = filePath;
                  // let index = str .lastIndexOf ("\/");
                  // str = str .substring (index + 1, str .length);
                  // tableData[5].name=fileName
                  setParentState({
                    bizFromInfo:bizFromInfo,
                    // tableData
                  })
                  // dispatch({
                  //   type:'applyModelConfig/updateStatesGlobal',
                  //   payload:{
                  //     bizFromInfo,
                  //     tableData,
                  //   }
                  // })
                }}
                buttonContent={
                  <span className={styles.upload} >上传</span>
                }
              /><span onClick={clearFile}>清空</span><span onClick={downLoadFile}>下载</span>
              </>
    }else if(record.type=='模块下载配置'){
      return <>
                <span onClick={showFormModalFn.bind(this,text)}>选择</span>
              </>
    }else{
      return (
        <>
          <span onClick={showFormModalFn.bind(this,text)}>选择</span>
          <span onClick={showTitleModalFn}>标题</span>
          <span onClick={goFormAuth.bind(this,'form')}>授权</span>
          {!bizSolInfo.bpmFlag&&<span onClick={bindCode}>编号</span>}
          {tableData[2].code&&<span onClick={()=>{onEdit()}}>设计</span>}
        </>
      )
    }
  }
  const clearFile=()=>{
    bizFromInfo.importTemplateFilePath=''
    bizFromInfo.importTemplateFullFilePath=''
    bizFromInfo.importTemplateFileName=''
    tableData[5].name=''
    setParentState({
      bizFromInfo,
      tableData
    })
  }
  const downloadFiles = (url,name) => {
    const fileUrl = url;
    const fileName = name;
  
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
      });
  };


  //下载文件
  const downLoadFile=()=>{
    if (bizFromInfo.importTemplateFullFilePath&&bizFromInfo.importTemplateFileName) {
      downloadFiles(bizFromInfo.importTemplateFullFilePath,bizFromInfo.importTemplateFileName)

    }else{
      downloadFiles(bizFromInfo.importTemplateFullFilePath,fileName)
    }
  }

  const onChangeTemplate = (value) =>{
    bizFromInfo.template = value.toString();
    setParentState({
      bizFromInfo:bizFromInfo
    })
  }
  //分页弹框
  const pageConfigModalFn=()=>{
    setParentState({
      isShowPageModal:true
    })
  }
  //跳转到授权页面
  const goFormAuth=(type)=>{
    if(!bizFromInfo.formDeployId){
      message.error('请先选择表单');
      return;
    }
    if(type=='att'){
      if(!bizFromInfo?.template?.includes('ANNEX')){
        message.error('请先关联文档');
        return;
      }
    }
    setParentState({
      isShowAuthModal:true,
      authTabValue:type
    })
  }
  //编码弹框
  const bindCode=()=>{
    //接口请求放到弹框页面中
    if(!bizFromInfo.formDeployId){
      message.error('请先选择表单');
      return;
    }
    setParentState({
      isShowBindCodeModel:true
    })
  }
  //显示标题
  const showTitleModalFn=()=>{
    if(!bizFromInfo.formDeployId){
      message.error('请先选择表单');
      return;
    }
    //console.log('isSaveTitle==',isSaveTitle);
    //获取选中的表单的关联的字段列表
    dispatch({
      type:"applyModelConfig/getTableColumnsFormId",
      payload:{
        deployFormId:bizFromInfo.formDeployId,
        type:'NO'
      },
      callback:(fromCols)=>{
        setParentState({
          fromCols
        })
      }
    })
    //获取业务应用标题设计
    dispatch({
      type:'applyModelConfig/getBizSolList',
      payload:{
        bizSolId,
        procDefId:procDefId,
        formDeployId:bizFromInfo.formDeployId
      },
      callback:(data)=>{
        setParentState({
          ...data
        })
      }
    })
    setParentState({
      isShowTitleModal:true
    })
  }
  //显示列表弹框
  const showFormModalFn=(type)=>{
    switch(type){
      case 'list'://列表
        setParentState({
          isShowListModal:true
        })
        break;
      case 'button'://按钮
        //保存selectButtonGroupInfo的信息，用于弹框中的显示
        let selectButtonGroupInfo={
          groupId:bizFromInfo.buttonGroupId,
          groupName:bizFromInfo.buttonGroupName,
          groupCode:bizFromInfo.buttonGroupCode,
        }
        setParentState({
          isActionButton:true,//是否请求了按钮弹框接口，是的话点击保存的时候保存按钮，没点击过不保存
          isShowButtonModal:true,
          selectButtonGroupInfo:selectButtonGroupInfo
        })
        break;
      case 'form'://表单
        setParentState({
          isShowFormModal:true
        })
        break;
      case 'file'://模块下载配置
        setParentState({
          isShowFileMoudle:true
        })
        break;
    }
  }
  const saveBussionFromInfo=async ()=>{
    console.log('bizFromInfo=',bizFromInfo);
    if(bizSolInfo.bpmFlag&&procDefId=='0'){
      message.error('请先进行流程设计');
      return;
    }
    if(typeof bizFromInfo.listBizFormId=='undefined'||!bizFromInfo.listBizFormId){//必选项
      message.error('请选择列表信息');
      return;
    }
    if(typeof bizFromInfo.formBizFormId=='undefined'||!bizFromInfo.formBizFormId){//必选项
      message.error('请选择表单信息');
      return;
    }
    if(typeof bizFromInfo.buttonGroupId=='undefined'||!bizFromInfo.buttonGroupId){//必选项
      message.error('请选择按钮信息');
      return;
    }
    if(typeof bizFromInfo.template=='undefined'||!bizFromInfo.template){
      bizFromInfo.template="0"
    }
    if(titleList.length<=0){
      message.error('请选择标题信息');
      return;
    }
    //保存按钮方案设置
    let buttonJson=[];
    buttonList.map((item)=>{
      buttonJson.push({
        ...item,
        //authSource:'ALL',
      })
    })
    //if(isActionButton){//点开过按钮弹框才保存
    //if(buttonJson.length){
      await dispatch({
        type:"applyModelConfig/submitButtonAuth",
        payload:{
          bizSolId:bizSolId,
          procDefId,
          actId:0,
          buttonGroupId:bizFromInfo.buttonGroupId,
          buttonJson:JSON.stringify(buttonJson),
          deployFormId:bizFromInfo.formDeployId
        },
        extraParams:{
          setState:setParentState,
          state:parentState
        }
      })
    //}
    //}
    //保存业务应用表单配置信息
    await dispatch({
      type:'applyModelConfig/saveBussionFromInfo',
      payload:{
        bizSolId:bizSolId,
        procDefId,
        listBizFormId:bizFromInfo.listBizFormId,
        listId:bizFromInfo.listId,
        formBizFormId:bizFromInfo.formBizFormId,
        formDeployId:bizFromInfo.formDeployId,
        buttonGroupId:bizFromInfo.buttonGroupId,
        viewButtonGroupId:bizFromInfo.viewButtonGroupId,
        template:bizFromInfo.template,
        title:bizFromInfo.title,
        usedFlag:bizFromInfo.usedFlag,
        deployFormVersion:bizFromInfo.deployFormVersion,
        listModelVersion:bizFromInfo.listModelVersion,
        importTemplateFilePath:bizFromInfo.importTemplateFilePath,
        importTemplateFileName:tableData[5].name,
        formId:bizFromInfo.formId,
        mainVersion:bizFromInfo.mainVersion,
        isDeploy:bizFromInfo.isDeploy,
      },
      callback:(data)=>{
        setParentState({
          ...data
        })
      }
    })
    bizFromInfo.procDefId=procDefId;
    setParentState({
      isClickOk:false,
      oldBizFromInfo:bizFromInfo,
      isActionButton:false
    })
    return true;
  }
  //重置
  const resetForm=()=>{
    console.log('oldBizFromInfo==',oldBizFromInfo);
    tableData[0].name = oldBizFromInfo.listBizFormName;
    tableData[1].name = oldBizFromInfo.buttonGroupName;
    tableData[2].name = oldBizFromInfo.formBizFormName;
    tableData[0].code = oldBizFromInfo.listBizFormCode;
    tableData[1].code = oldBizFromInfo.buttonGroupCode;
    tableData[2].code = oldBizFromInfo.formBizFormCode;
    let str = oldBizFromInfo.importTemplateFilePath;
    if(str){
      let index = str .lastIndexOf ("\/");
      str = str .substring (index + 1, str .length);
    }
    tableData[5].name=str
    if(selectVersionId=='edit'){
      setParentState({
        selectVersionId:oldSelectVersionId,
        bizFromInfo:{...oldBizFromInfo},
        tableData:tableData,
        isActionButton:false,
        buttonList:[]
      })
    }else{
      setParentState({
        bizFromInfo:{...oldBizFromInfo},
        tableData:tableData,
        isActionButton:false,
        buttonList:_.cloneDeep(oldButtonList)
      })
    }
  }
  //切换启用停用
  const onChangeUsedFlag=(e)=>{
    bizFromInfo.usedFlag=e.target.value;
    setParentState({
      bizFromInfo:bizFromInfo
    })
  }

  const showChose = () =>{
    if(bizFromInfo.formDeployId){
      setParentState({
        isShowChoseModal: true
      })
      dispatch({
        type: 'applyModelConfig/getPushInfoBind',
        payload:{
          deployFormId: bizFromInfo.formDeployId,
          bizSolId,
          procDefId
        },
        extraParams:{
          setState:setParentState,
          state:parentState
        }
      })
      dispatch({
        type: 'applyModelConfig/getFormDataDrive',
        payload:{
          start: 0,
          limit: 10000,
          ctlgId: bizSolId,
          driveType: 'PULL',
          planName:'',
        },
        extraParams:{
          setState:setParentState,
          state:parentState
        }
      })
    }else{
      message.error('请先选择表单')
    }

  }
  //重新获取版本信息
  const getBussinessFormByBizFormId =async (value)=>{
     await dispatch({
      type:"applyModelConfig/getBussinessFormByBizFormId",
      payload:{
        bizSolFormId:value
      },
      extraParams:{
        setState:setParentState,
        state:parentState
      }
    })
    return true;
  }
  //切换版本
  const changeBizSolFormId=async (value)=>{
    if(selectVersionId=='edit'){
      Modal.confirm({
        title: '',
        content: '是否保存当前应用编辑信息并生成新版本',
        okText: '确认',
        cancelText: '取消',
        async onOk() {
          await saveBussionFromInfo();
          await setParentState({
            selectVersionId:value,
          })
          //重新获取版本信息
          await getBussinessFormByBizFormId(value)
        },
        async onCancel(){
          //重新获取版本信息
          await getBussinessFormByBizFormId(value)
          //去掉编辑中的信息
          let tmpVersionList = [];
          versionList.map((item)=>{
            if(item.bizSolFormId!='edit'){
              tmpVersionList.push(item);
            }
          })
          setParentState({
            selectVersionId:value,
            versionList:tmpVersionList
          })
        },
        getContainer:() =>{
          return document.getElementById('code_modal')
        },
        mask:false,
      })
    }else{
      //重新获取版本信息
      await getBussinessFormByBizFormId(value);
      setParentState({
        selectVersionId:value,
      })
    }
  }
  console.log('tableData=',tableData);
  return (
    <div className={styles.formInfo_warp} id={`form_modal_${bizSolId}`}>
      <Table
        columns={columns}
        dataSource={JSON.parse(JSON.stringify(tableData))}
        rowKey={'index'}
        pagination={false}
        taskType='MONITOR'
      />
      <div className={styles.footer}>
        <span style={{float:'left'}}>版本号:</span>
        <Select
          style={{float:"left",width:'100px',marginTop:'18px'}}
          value={selectVersionId}
          onChange={changeBizSolFormId}
        >
          {versionList.map((item)=>{
            return (
              <Select.Option value={item.bizSolFormId}>{item.version}</Select.Option>
            )
          })}
        </Select>
        <Radio.Group onChange={onChangeUsedFlag} value={bizFromInfo.usedFlag}>
          <Radio value={1}>启用</Radio>
          <Radio value={0}>停用</Radio>
        </Radio.Group>
        <Button onClick={resetForm.bind(this)} style={{marginRight:'10px'}}>重置</Button>
        <Button
          type="primary"
          onClick={saveBussionFromInfo}
          loading={submitting}
        >
          保存
        </Button>
      </div>
      {isShowListModal&&<ModalList query={query} parentState={parentState} setParentState={setParentState}/>}
      {isShowButtonModal&&<ModalButton query={query} actId={0} parentState={parentState} setParentState={setParentState}/>}
      {isShowFormModal&&<ModalForm query={query} parentState={parentState} setParentState={setParentState}/>}
      {isShowPageModal&&<ModalPageConfig query={query} bizFromInfo={bizFromInfo} setParentState={setParentState}/>}
      {isShowBindCodeModel&&<ModalBindCode isNode={false} query={query} parentState={parentState} setParentState={setParentState}/>}
      {isShowTitleModal&&<ModalTitle query={query} parentState={parentState} setParentState={setParentState}/>}
      {isShowAuthModal&&<ApplyModelFormAuth query={query} actId={0} eleId="form_modal" isAction={true} parentState={parentState} setParentState={setParentState}/>}
      {isShowChoseModal&&<CodeModal query={query} parentState={parentState} setParentState={setParentState}/>}
      {isShowFileMoudle&&<ModalFileMoudle query={query} parentState={parentState} setParentState={setParentState} fileMoudleList={fileMoudleList} downloadFiles={downloadFiles} procDefId={procDefId} bizFromInfo={bizFromInfo}/>}
    </div>
  )
}
export default connect(({loading,layoutG,applyModelConfig})=>{
  return {
    loading,
    layoutG,
    applyModelConfig,
    submitting: loading.effects['applyModelConfig/submitButtonAuth'],
  }
})(FormInfo);
