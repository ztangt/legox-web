import { Button, Form, Input, message, Radio, Table ,Row,Col,Select,DatePicker} from 'antd';
import { connect } from 'dva';
import { parse } from 'query-string';
import { useEffect, useRef, useState } from 'react';
import SparkMD5 from 'spark-md5';
import { history } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import ReactQuill from '../../../componments/public/ReactQuill';
import Wangeditor from '../../../componments/public/Wangeditor'
import RelevanceModal from '../../../componments/relevanceModal/relevanceModal';
import { dataFormat } from '../../../util/util';
import AccessoryModal from '../../notification/componments/accessoryModal';
import { tableProps } from '../../notification/componments/viewColumns';
import styles from '../index.less';
import {useSetState} from 'ahooks'
import axios from 'axios';
import GlobalModal from '../../../componments/GlobalModal';
import {NOTICETYPE,NOTICERANGE} from '../../../service/constant'
import ColumnDragTable from '../../../componments/columnDragTable';
import FilePreview from '../../../componments/filePreview'
import moment from 'moment';
function NoticePage({ dispatch, notification, location }) {
  const {
    selectedDatas,
    type,
    fileExistsFu,
    // noticeHtmlValue,
    htmlFileStorageId,
    selectedDataIds,
    getFileMD5Message,
    md5FileId,
    fileData,
    unUploadList,
    uploadList,
    // searchResult,
    viewData,
    noticeTypeData,
    filePath,
    noticeTypeList,
    currentNoticeTypeItem,
    saveButtonLoading
  } = notification;
  const [state,setState]=useSetState({
    searchResult:{},
    noticeHtmlValue:''
  })
  console.log(noticeTypeData,'noticeTypeData');
  const {searchResult,noticeHtmlValue}=state
  console.log(selectedDatas,'selectedDatas');
  const [saveType, setSaveType] = useState('');
  const [radioVal, setRadioVal] = useState(1); //公告范围
  const [value, setNoticeText] = useState(noticeHtmlValue || ''); //富文本描述
  const [flag, changeFlag] = useState(false);
  const [isModalVisibles, setIsModalVisibles] = useState(false);
  const [isViews, setIsView] = useState(false);
  const [isStyle,setStyle]=useState(false)
  const layout = { labelCol: {span: 2 }, wrapperCol: { span: 22 } };

  const [nameId, setNameId] = useState([]); //存放上传文件返回的id 和name
  const [form] = Form.useForm();
  let ChildRef = useRef();
  const currentDate=moment()
  // const location = useLocation();
  let viewTimes = viewData.filter((item) => item.viewState == 1).length;
  const userName = JSON.parse(
    JSON.stringify(window.localStorage.getItem('userName')),
  );
  const query = parse(history.location.search);
console.log(selectedDataIds,'selectedDataIds');
  // 门户下的query
  const locations = location?.query || query;
  console.log(tableProps,'tableProps');
  useEffect(() => {
    // 门户下的
    if (
      (location?.pathname === '/noticePage' && locations?.id) ||
      locations?.sys === 'portal'
    ) {
      dispatch({
        type: 'notification/getNotice',
        payload: {
          noticeId: locations.id,
        },
        extraParams:{
          setState:setState,
          state:state
      },
        callBack: (data) => {
          if (data.noticeRange === 2) {
            dispatch({
              type: 'notification/getNoticeView',
              payload: {
                noticeId: data.noticeId,
              },
            });
          }
          // 根据返回的链接获取富文本内容
          if (data.noticeHtmlUrl) {
            axios
              .get(data.noticeHtmlUrl)
              .then(function (res) {
                if (res.status == 200) {
                  console.log(res.data.value, 'noticeHtmlUrl==');
                  setState({
                    noticeHtmlValue: res.data.value,
                  })
                  // dispatch({
                  //   type: 'notification/updateStates',
                  //   payload: {
                  //     noticeHtmlValue: res.data.value,
                  //   },
                  // });
                }
              })
              .catch(function (error) {});
          }
        },
      });
    }
  }, []);
  useEffect(() => {
    changeFlag(searchResult.noticeRange == 2 ? true : false);
    form.setFieldsValue({...searchResult,releaseTime: searchResult.releaseTime ? moment(dataFormat(searchResult.releaseTime, 'YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss') : '',});
    let str =
      (searchResult.fileStorageAttachment &&
        JSON.parse(searchResult.fileStorageAttachment)) ||
      {};
      if(str.length){
        str?.forEach((item)=>{
          item.fileName=item.name
          item.fileId=item.uid
        })
        console.log(str,'str');
      }
      
    setNameId([].concat(str));

  }, [searchResult]);
  const showModal = () => {
    if (locations.title !== '查看') {
      setIsModalVisibles(true);
    }
  };
  const handleOks = () => {
    form.setFields([
      {
        name:['appointId'],
        value:selectedDatas.map((item) => {return item.id}).join(',')
      },
      {
        name:['appointName'],
        value:selectedDatas.map((item) => {return item.userName}).join(',')
      },
    ]);
      if(selectedDatas[0]?.userName){
        handleCancels()
      }
      else{
        message.warning('请选择人员')
      }
  };
  const handleCancels = () => {
    setIsModalVisibles(false);
  };

  useEffect(() => {
    setNameId(nameId.concat(fileData));
  }, [fileData]);
  useEffect(() => {
    fileData.forEach((item, index) => {
      uploadList.forEach((val, ind) => {
        if (
          val.fileFullPath
            .replace(/.*\/(.*?)\.\w+$/, '$1')
            .includes(item.name.replace(/\.[^\.]+$/, ''))
        ) {
          item.uid = val.fileId;
        }
      });
    });
    fileData.forEach((item, index) => {
      unUploadList.forEach((val, ind) => {
        if (
          val.fileFullPath
            .replace(/.*\/(.*?)\.\w+$/, '$1')
            .includes(item.name.replace(/\.[^\.]+$/, ''))
        ) {
          item.uid = val.fileStorageId;
        }
      });
    });
    setNameId(Array.from(new Set(nameId.concat(fileData))));
  }, [unUploadList, uploadList]);
  useEffect(() => {
    // 如果文件存在于minio
    if (fileExistsFu) {
      dispatch({
        type: 'notification/getDownFileUrl',
        payload: {
          fileStorageId: md5FileId,
        },
        callback: () => {
          dispatch({
            type: 'notification/updateStates',
            payload: {
              fileExistsFu: '',
              htmlFileStorageId: md5FileId,
            },
          });
        },
      });
    } else if (fileExistsFu === false) {
      // 如果文件不存在于minio
      dispatch({
        type: 'notification/getDownFileUrl',
        payload: {
          fileStorageId: htmlFileStorageId,
        },
        callback: () => {
          dispatch({
            type: 'notification/updateStates',
            payload: {
              fileExistsFu: '',
              htmlFileStorageId: htmlFileStorageId,
            },
          });
        },
      });
    }
  }, [fileExistsFu]);
  useEffect(() => {
    if(locations.title !== '查看'){
      form.resetFields();
      // ChildRef.current.emptyValue();
    }
  }, []);
  const text = document.querySelector('.text_people');
  const container = document.querySelector('.container');
  const expandBtn = document.querySelector('.expandBtn');
   useEffect(()=>{
    if(locations.title == '查看'&&text?.offsetWidth>container?.offsetWidth){
      expandBtn.style.display = 'inline-block'; // 显示展开按钮
      expandBtn.style.position = 'absolute'; 
      expandBtn.style.right = '0px'; 
      expandBtn.style.top = '0px'; 
      expandBtn.style.color='#198fff'
      container.style.width='calc(100% - 60px)'
    }
   },[text?.offsetWidth])
  const changeStyle=(flag)=>{
    setStyle(flag)
    container.style.whiteSpace = flag?'normal':'nowrap'; // 取消限制文本不换行
    container.style.overflow = flag?'visible':'hidden'; // 取消隐藏溢出部分
    expandBtn.style.display = flag?'none':'block'; // 隐藏展开按钮
    text.style.lineHeight=flag?1.6:1
    container.style.width=flag?'100%':'calc(100% - 60px)'
  }

  const getRadioValue = (e) => {
    setRadioVal(e.target.value);
    changeFlag(e.target.value == 2 ? true : false);
    if(e.target.value!== 2){
      dispatch({
        type: 'notification/updateStates',
        payload: {
          selectedDatas: [],
          selectedDataIds: [],
        },
      });
    }
  };
  console.log(searchResult,'searchResult');
  // 返回首页
  const gotoNotice = () => {
    // 门户下的
    if (locations?.sys === 'portal') {
      window.location.href = `#/business_application/notificationList?sys=portal&portalTitle=通知公告`;
    } else {
      const index=GETTABS().findIndex(item=>item.key==location.query.path)
      historyPush(
        {
          pathname: index>0?location.query.path:'/',
        },
        `${location.pathname}/${location.query?.id}/${location.query?.title}`,
      );
      setState({
        noticeHtmlValue: '',
      })
    }
  };
  //保存 && 保存发布按钮
  const saveFn = () => {
    if (!nameId) {
      setNameId([]);
    }
    if (nameId.length > 15) {
      return message.error('文件最多可上传15个文件！');
    }
    let values = form.getFieldsValue();
    if (values.noticeTitle == undefined || values.noticeTitle == '') {
      return message.warning('标题或范围不能为空');
    }
    // 保存按钮状态
    // setSaveType(type);
    // 富文本上传min
    if (value) {
      richTextToMio(saveType);
      // saveNotice(type)
    } else {
      saveNotice(saveType);
    }
  };

  // 富文本转换MD5
  const richTextToMio = (type) => {
     
    // 字符内容转blod再转file
    const data = JSON.stringify({ value }, undefined, 4);
    const blob = new Blob([data], { type: 'text/json' });
    const file = new File([blob], uuidv4(), { type: 'text/plain' });
    const link = `${location.pathname.slice(1)}/${dataFormat(
      String(new Date().getTime()).slice(0, 10),
      'YYYY-MM-DD',
    )}/${file.name}.json`
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) => {
      const richTextMD5 = SparkMD5.hashBinary(e.target.result);
      dispatch({
        type: 'notification/updateStates',
        payload: {
          isFu: true,
          fileChunkedList: [file],
          md5: richTextMD5,
          fileName: `${file.name}.json`,
          fileSize: file.size,
          saveButtonLoading: true,
        },
      });
      // 上传mio
      dispatch({
        type: 'uploadfile/getFileMD5',
        payload: {
          namespace: 'notification',
          isPresigned: 1,
          fileEncryption: richTextMD5,
          filePath: `${location.pathname.slice(1)}/${dataFormat(
            String(new Date().getTime()).slice(0, 10),
            'YYYY-MM-DD',
          )}/${file.name}.json`,
        },
        hisLocation: location,
        uploadSuccess: (val, fileId) => {
          // setNoticeText(val);
          console.log('dddddd', val);
          dispatch({
            type: 'notification/updateStates',
            payload: {
              htmlFileStorageId: fileId,
            },
          });
          if (fileId) {
            let values = form.getFieldsValue();
            delete values.describe
            const newData=noticeTypeList.find(item=>item.key==values.noticeTypeId)
            values.noticeTypeName=newData?.title
            values.releaseTime=values['releaseTime']?values['releaseTime'].unix().toString():''
            if (locations.title === '修改') {
              dispatch({
                type: 'notification/updateNotice',
                payload: {
                  noticeId: searchResult.noticeId,
                  ...values,
                  appointId:selectedDatas.length > 0? selectedDataIds.join(','):values.appointName?searchResult.appointId:'',
                  appointName:values.appointName?values.appointName:'',
                  fileStorageAttachment: JSON.stringify(nameId),
                  htmlFileStorageId: fileId,
                  isRelease: type == 'saveAndPublish' ? '1' : '0',
                },
              });
              gotoNotice();
            } else if (locations.title === '新增') {
              dispatch({
                type: 'notification/addNotice',
                payload: {
                  ...values,
                  appointId: selectedDataIds.join(','),
                  fileStorageAttachment: JSON.stringify(nameId),
                  htmlFileStorageId: fileId,
                  isRelease: type == 'saveAndPublish' ? '1' : '0',
                },
              });
              gotoNotice();
            }
          }
        },
      });
    };
  };
  const saveNotice = (type) => {
    console.log(type, 'type==');
    let values = form.getFieldsValue();
    values.releaseTime=values['releaseTime']?values['releaseTime'].unix().toString():''
    delete values.describe
    const newData=noticeTypeList.find(item=>item.key==values.noticeTypeId)
    values.noticeTypeName=newData?.title
    if (locations.title === '修改') {
      dispatch({
        type: 'notification/updateNotice',
        payload: {
          noticeId: searchResult.noticeId,
          ...values,
          appointId:selectedDatas.length > 0? selectedDataIds.join(','): values.appointName?searchResult.appointId:'',
          appointName:values.appointName?values.appointName:'',
          fileStorageAttachment: JSON.stringify(nameId),
          htmlFileStorageId,
          isRelease: type == 'saveAndPublish' ? '1' : '0',
        },
      });
      gotoNotice();
    } else if (locations.title === '新增') {
      dispatch({
        type: 'notification/addNotice',
        payload: {
          ...values,
          appointId: selectedDataIds.join(','),
          fileStorageAttachment: JSON.stringify(nameId),
          htmlFileStorageId: value ? htmlFileStorageId : '',
          isRelease: type == 'saveAndPublish' ? '1' : '0',
        },
      });
      gotoNotice();
    }
  };

  const openViews = () => {
    setIsView(!isViews);
    if (searchResult.noticeRange != 2) {
      setIsView(false);
    }
  };
  function getTitleByKey(type,key) {
    if(type=='noticeRange'&&key!==2){
      const notice = NOTICERANGE.find(item => item.key === key);
      return notice ? notice.title : '';
    } 
  }
  return (
    locations.title == '查看'?<div className={styles.viewDetail_container}>
      {/* <Wangeditor/> */}
      <p>{searchResult.noticeTitle}</p>
      <p>公告类型：{searchResult.noticeTypeName}&nbsp;&nbsp;{dataFormat(searchResult.releaseTime, 'YYYY-MM-DD')}</p>
      <div className={styles.range_content}>  <p class='container'>公告范围：{getTitleByKey('noticeRange',searchResult.noticeRange)}<span style={{width:'100%'}} className='text_people' >{searchResult.appointName}</span>&nbsp;&nbsp;{isStyle&&<span style={{color:'#198fff'}} onClick={changeStyle.bind(this,false)}>收起</span>}</p><span className='expandBtn'  onClick={changeStyle.bind(this,true)}>全部</span></div>
     
      <div dangerouslySetInnerHTML ={{ __html :noticeHtmlValue }} className={styles.richText}/>
        <p className={styles.attachment}><span>附件:</span>
          {
            <FilePreview layout="inline"
            dataSource={nameId}  style={{display:'inline'}}/>
          }
        </p>
          <p onClick={openViews} className={styles.viewTimes}>
          浏览次数：<span>
          {searchResult.noticeRange &&
      searchResult.appointName?.split(',').includes(userName)
        ? `${searchResult.noticeViews + 1}`
        : searchResult.noticeRange &&
          !searchResult.appointName?.split(',').includes(userName)
        ? `${searchResult.noticeViews}`
        : `${searchResult.noticeViews + 1}`}
          </span>
        </p> 
      <div>
      {isViews && searchResult.noticeRange == 2 && (
            <>
              <p className={styles.view}>
                阅读情况(总人数{`${viewData.length}`}人,已阅读{`${viewTimes}`}
                人,未阅读{`${viewData.length - viewTimes}`}人)
              </p>
              <ColumnDragTable
                style={{
                  paddingBottom: 16,
                }}
                taskType="MONITOR" modulesName="notification"
                {...tableProps}
                dataSource={viewData}
                pagination={false}
              />
            </>
          )}
      </div>
    </div>:
    <div
    id={`addNotice_id_${locations?.title}_${locations?.id}`}
    className={
      locations.title == '查看' ? styles.describe : styles.addNotice_Modal
    }
  >
        <div className={styles.top_button}>
          <div className={styles.notice_button}>
            {locations.title !== '查看' && [
              <Button
                type="primary"
                key="submit"
                loading={saveButtonLoading}
                onClick={() => {
                  // saveFn('save');
                  form.submit()
                  setSaveType('save');
                }}
              >
                保存
              </Button>,
              // <Button
              //   type="primary"
              //   key="publish"
              //   onClick={() => {
              //     // saveFn('saveAndPublish');
              //     form.submit()
              //     setSaveType('saveAndPublish');
              //   }}
              // >
              //   保存并发布
              // </Button>,
            ]}
            <Button
              type="primary"
              className={styles.goBack}
              onClick={() => {
                gotoNotice();
              }}
            >
              返回
            </Button>
          </div>
        </div>
        <div className={styles.view_content}>
        <Form
            // labelCol={{ span: 2 }}
            // wrapperCol={{ span: 20 }}
            form={form}
            initialValues={{
              noticeRange: 0,
              noticeTypeId:noticeTypeList.length?(currentNoticeTypeItem.key==''||!currentNoticeTypeItem.key)?noticeTypeList[0].key:currentNoticeTypeItem.key:'',//未选择类别默认是第一项
              releaseTime:currentDate
            }}
            labelAlign={'left'}
            onFinish={saveFn}
          >
            <Row gutter={0}>
              <Col span={12}>
                <Form.Item
                // {...layout}
                label="标题"
                name="noticeTitle"
                colon={locations.title == '查看' ? true : false}
                disabled
                style={{marginLeft:locations.title == '查看'?'40px':'28px'}}
                rules={[
                  {
                    required: locations.title == '查看' ? false : true,
                    message: '',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject(new Error('请输入标题'));
                      }
                      if (value.replace(/^\s*|(\s*$)/g, '').length <= 0) {
                        return Promise.reject(new Error('请输入标题'));
                      }
                      if (value.length > 200) {
                        return Promise.reject(
                          new Error('标题长度不能超过200！'),
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input
                  placeholder="请输入标题"
                  style={{ width: '30%',marginLeft:'-28px' }}
                  disabled={locations.title == '查看' ? true : false}
                />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='公告类型' name={'noticeTypeId'} colon={locations.title == '查看' ? true : false}>
                 {locations.title == '查看' ? <span>{searchResult.noticeTypeName}</span>:
                 <Select style={{width:200}}>
                    { noticeTypeList.map((item,index)=>{
                      return <Select.Option key={item.key} value={item.key}>{item.title}</Select.Option>
                    })}
                  </Select>}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={0}>
              <Col span={12}>
                <Form.Item
                // {...layout}
                style={{marginLeft:locations.title == '查看'?'12px':'0px'}}
                colon={locations.title == '查看' ? true : false}
                label="公告范围"
                name="noticeRange"
                rules={[
                  {
                    required: locations.title == '查看' ? false : true,
                    message: '请选择公告范围!',
                  },
                ]}
              >
                {locations.title == '查看' ?<span>
                {getTitleByKey('noticeRange',searchResult.noticeRange)}
                </span>
                 : (
                  <Radio.Group value={radioVal} onChange={getRadioValue}>
                    {NOTICERANGE.map((item)=>{
                      return <Radio key={item.key} value={item.key}>{item.title}</Radio>
                    })}
                  </Radio.Group>
                )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='发布日期' name={'releaseTime'} colon={locations.title == '查看' ? true : false}>
                   {locations.title == '查看' ?<span>{dataFormat(searchResult.releaseTime, 'YYYY-MM-DD')}</span>:<DatePicker style={{ width: 200 }} />}
                </Form.Item>
             
              </Col>
            </Row>

            {flag && (
              <Form.Item
                // {...layout}
                label="选择人员"
                colon={locations.title == '查看' ? true : false}
                name="appointName"
                style={{marginLeft:'12px'}}
                rules={[
                  {
                    required: locations.title == '查看' ? false : true,
                    message: '请选择人员',
                  }
                ]}
              >
                {locations.title == '查看' ?<span>{searchResult.appointName}</span>:<Input readOnly style={{ width: '220px' }} onClick={showModal} />} 
              </Form.Item>
            )}
            <AccessoryModal
              nameId={nameId}
              setNameId={setNameId}
              location={location || { query: locations }}
              setState={setState}
              state={state}
            />
            <Form.Item
              // {...layout}
              label="描述"
              style={{marginLeft:'40px'}}
              colon={locations.title == '查看' ? true : false}
              name="describe"
            >
              {
                // <ReactQuill
                //   setNoticeText={setNoticeText}
                //   text={
                //     noticeHtmlValue
                //       ? locations.title == '新增'
                //         ? ''
                //         : noticeHtmlValue
                //       : ''
                //   }
                //   onRef={ChildRef}
                //   editflag={locations.title == '查看' ? true : false}
                //   location={location || { query: locations }}
                ///>
              }
              {
                <Wangeditor
                   setNoticeText={setNoticeText}
                  text={
                    noticeHtmlValue
                      ? locations.title == '新增'
                        ? ''
                        : noticeHtmlValue
                      : ''
                  }
                  location={location || { query: locations }}
                />
              }
            </Form.Item>
          </Form>

          {locations.title == '查看' && (
            <div
              style={{ height: isViews && searchResult.appointId ? 30 : 60 }}
            >
              <Button className={styles.openView} onClick={openViews}>
                浏览次数(
                {searchResult.noticeRange &&
                searchResult.appointName?.split(',').includes(userName)
                  ? `${searchResult.noticeViews + 1}`
                  : searchResult.noticeRange &&
                    !searchResult.appointName?.split(',').includes(userName)
                  ? `${searchResult.noticeViews}`
                  : `${searchResult.noticeViews + 1}`}
                )
              </Button>
            </div>
          )}
          {isViews && searchResult.noticeRange == 2 && (
            <>
              <p className={styles.view}>
                阅读情况(总人数{`${viewData.length}`}人,已阅读{`${viewTimes}`}
                人,未阅读{`${viewData.length - viewTimes}`}人)
              </p>
              <Table
                style={{
                  paddingBottom: 30,
                  height: 100 + 55 * viewData.length,
                }}
                {...tableProps}
                dataSource={viewData.map((item, index) => {
                  item.number = index + 1;
                  return item;
                })}
                pagination={false}
              />
            </>
          )}
        </div>

    {isModalVisibles && (
      <GlobalModal
        title="关联用户"
        visible={true}
        onOk={handleOks}
        onCancel={handleCancels}
        // width={'95%'}
        widthType={3}
        maskClosable={false}
        // bodyStyle={{ height: 'calc(100vh - 300px)', overflow: 'visible' }}
        forceRender
        mask={false}
        getContainer={() => {
          return document.getElementById('addNotice_id') || false;
        }}
      >
        <RelevanceModal
          nameSpace="notification"
          spaceInfo={notification}
          orgUserType="USER"
          selectButtonType="checkBox"
          treeType={'DEPT'}
          type={'INCLUDESUB'}
          nodeIds={''}
        />
      </GlobalModal>
    )}
  </div>

  );
}

export default connect(
  ({ notification, notificationList, informationModal }) => ({
    notification,
    notificationList,
    informationModal,
  }),
)(NoticePage);
