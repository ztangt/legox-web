import { useEffect, useState, useMemo, useRef } from 'react';
import { history, MicroAppWithMemoHistory, connect } from 'umi';
import { useSetState } from 'ahooks';
import * as dd from 'dingtalk-jsapi';
import { parse } from 'query-string';
import styles from './index.less'
import {
 Tabs,
 TextArea,
 Button,
 Radio, 
 Space,
 Popup,
 FloatingBubble,
 Toast
} from 'antd-mobile/es';
import SignatureCanvas from 'react-signature-canvas'
import { Spin } from 'antd'
import MobileBackAct from '../../../componments/formPreview/mobileBackAct'
function IndexPage({ dispatch, approve,loading }) {
  const  {authList, currentColumnCode, signConfig, commentList,popularList } = approve
  const query = parse(history.location.search);
  const bizInfo = JSON.parse(localStorage.getItem('bizInfo') || '{}');
  const signRef = useRef(null)
  const [ signUrl, setSignUrl ] = useState('')
  const [ textValue, setTextValue ] = useState('')
  const [ popularVisible, setPopularVisible ] = useState(false)
  const [ popularText, setPopularText ] = useState('')
  const [ loadingType, setLoadingType ] = useState('')
  const [ backNodesData, setBackNodesData ] = useState({})
  console.log('popularText',popularText);
  useEffect(() => {
    if (dd.env.platform !== 'notInDingTalk') {
      dd.ready(function () {
        dd.biz.navigation.setTitle({
          title: '审批',
          onSuccess: function (res) {
            // 调用成功时回调
            console.log(res);
          },
          onFail: function (err) {
            // 调用失败时回调
            console.log(err);
          },
        });

      });
    }
    window.webUni && window.webUni.postMessage({data: {title: '审批'}});
  }, []);
  function onBack(){
    if (dd.env.platform !== 'notInDingTalk') {
      dd.ready(function () {
        dd.biz.navigation.goBack({
          onSuccess: function (result) {
            /*result结构
            {}
            */
          },
          onFail: function (err) { }
        })
      });
    }else{
      window.history.back();
    }
  }
  useEffect(()=>{
    dispatch({
      type: 'approve/updateStates',
      payload: {
        // commentList: JSON.parse(localStorage.getItem('commentJson') || '[]'),
        commentList: [],
        authList: [],
        signConfig: {},
        popularList: [],
      },
    });
    setLoadingType('approve/getTemporarySignList')
    dispatch({
      type:'approve/getTemporarySignList',
      payload:{
        bizInfoId: bizInfo.bizInfoId,
        bizTaskId: query?.bizTaskId,
      }
    })
    setLoadingType('approve/getAuthList')
    dispatch({
      type: 'approve/getAuthList',
      payload: {
        bizSolId: bizInfo.bizSolId,
        procDefId: bizInfo.procDefId,
        actId: bizInfo.actId,
        deployFormId: bizInfo.formDeployId,
        bizInfoId: bizInfo.bizInfoId,
        optType: 'HANDLER',
      },
      callback:(data)=>{
      }
    });
    dispatch({
      type: 'approve/getSignConfig',
      payload: {
      },
    });
  },[])
  useEffect(()=>{
    var flag = commentList?.findIndex((item)=>{return item.tableColCode == currentColumnCode})
    if(flag!=-1){
      setSignUrl(commentList[flag].messageImgUrl)   
      setTextValue(commentList[flag].messageText)
      setTimeout(() => {
        if (signRef.current) {
          var el = document.getElementById('sigCanvas')  
          signRef.current.fromDataURL(commentList[flag].messageImgUrl)
        }
      })  
    }else{
      setSignUrl('')    
      setTextValue('')    
      setTimeout(() => {
        if (signRef.current) {
          signRef.current.clear()
        }
      })
    }
  },[currentColumnCode,commentList])

  const clear = () => {
    //清除
    if (signRef.current) {
      signRef.current.clear()
    }
    setSignUrl('')
    setCommentJson(//先保存当前字段数据
      textValue,
      ''
    )
  }

  const setCommentJson = (messageText, messageImgUrl) => {
    const flag = commentList?.findIndex((item) => {
      return item.tableColCode == currentColumnCode
    })
    if (flag != -1) {
      //修改
      commentList[flag].messageText = messageText
      commentList[flag].messageImgUrl = messageImgUrl
    } else {
      const index = authList?.findIndex((item) => {
        return item.tableColCode == currentColumnCode
      })
      //新增
      commentList.push({
        tableColCode: currentColumnCode,
        tableColName: authList?.[index]?.[formColumnName],
        messageText,
        messageImgUrl,
        bizTaskId: query?.bizTaskId,
        bizInfoId: bizInfo?.bizInfoId,
      })
    }
    dispatch({
      type: 'approve/updateStates',
      payload: {
        commentList,
      },
    });
  }

  const onChangeTabs = (key) =>{
    // setCommentJson(//先保存当前字段数据
    //   textValue,
    //   signRef.current.toDataURL('image/png', 1)
    // )
    dispatch({
      type: 'approve/updateStates',
      payload: {
        currentColumnCode: key,
      },
    });
  }

  const onChangeText = (value) => {
    setTextValue(value)
    setCommentJson(//先保存当前字段数据
      value,
      signRef?.current?.toDataURL('image/png', 1)
    )
  }

  const importSign = () =>{
    dispatch({
      type: 'approve/getCurrentUserInfo',
      payload: {
      },
      callback:(data)=>{
        if (!data?.data?.signaturePath) {
          Toast.show({
            icon: 'fail',
            content: '暂无签名',
          });
          return;
        }
        window.URL = window.URL || window.webkitURL
        var xhr = new XMLHttpRequest()
        xhr.open('get', data?.data?.signaturePath, true)
        //使用xhr请求图片,并设置返回的文件类型为Blob对象
        xhr.responseType = 'blob'
        xhr.onload = function () {
          if (this.status == 200) {
            //得到一个blob对象
            var blob = this.response
            let oFileReader = new FileReader()
            oFileReader.onloadend = function (e) {
              // base64的图片了
              let base64 = e.target.result
              if (signRef.current) {
                  signRef.current.fromDataURL(base64)
              }
              setSignUrl(base64)
              setCommentJson(textValue, base64)
            }
            //使用FileReader 对象接收blob
            oFileReader.readAsDataURL(blob)
          }else{
            Toast.show({
              icon: 'fail',
              content: '签名请求出错啦!',
            });
          }
        }
        xhr.send()
      }
    });    
  }
  const saveTemporarySign = () => {
    let msg = ''
    if(query?.buttonType=='save'){
      authList.forEach(element => {
        if(msg){
          return
        }
        if(element.isRequierd){
          let obj = _.find(commentList, { tableColCode: element.formColumnCode })
          if(!obj||(!obj?.messageText&&!obj?.messageImgUrl)){
            msg = `${element.formColumnName}字段是必填字段`
          } 
        }
      });
      if(msg){
        Toast.show({
          icon: 'fail',
          content: msg,
        });
        return
      }
    }
    setLoadingType('approve/saveTemporarySign')
    dispatch({
      type: 'approve/saveTemporarySign',
      payload: JSON.stringify({
        bizInfoId:bizInfo.bizInfoId,
        bizTaskId:query?.bizTaskId,
        signs:commentList
      }),
      callback: (data) => {
        if(query?.buttonType=='reject'){//驳回
          if (query?.bizTaskId) {
            setLoadingType('formShow/backNodes')
            dispatch({
              type: 'formShow/backNodes',
              payload: {
                bizTaskId: query?.bizTaskId,
                headers:JSON.parse(localStorage.getItem('cutomHeaders'))
              },
              callback:(data)=>{
                setBackNodesData({
                  backNodes: data,
                })
              }
            });
          } else {
            message.error('当前环节不能驳回');
          }
        }else{
          if(query?.bizTaskId){
            window.location.href = `#/business_application/mobile/choiceUser?bizTaskId=${query?.bizTaskId}&workType=${query?.workType}&category=${query?.category}`
          }else{
            window.location.href = `#/business_application/mobile/choiceUser?bizInfoId=${query?.bizInfoId}&actId=${bizInfo.actId}&workType=${query?.workType}&category=${query?.category}`
          }
        }
        
      },
    });

  }

  const onCancelPopular = () => {
    setPopularVisible(false)
    setPopularText('')
  }
  const onOkPopular = ()=>{
    setPopularVisible(false)
    setTextValue(popularText)
  }
  const onPopular = () =>{
    setPopularVisible(true)
    setPopularText('')
    dispatch({
      type: 'approve/getPopularList',
      payload: {
        bizSolId: bizInfo.bizSolId,
      },
    });
  }
  const onChangePopular = (value) =>{
    setPopularText(value)
  }
  const onEndSign = () =>{
    setCommentJson(//先保存当前字段数据
      textValue,
      signRef?.current?.toDataURL('image/png', 1)
    )
  }
  const onBeginSign = () =>{
    document?.getElementById(`${currentColumnCode}_sign_text`)?.blur()
  }
  const suggestCustomStyle = {
    border: 'none',
    boxShadow: 'unset',
    color: signConfig?.suggestColor,
    fontSize: signConfig?.suggestFontSize,
    textDecoration: signConfig?.suggestIsUnderline == 1 ? 'underline' : '',
    fontStyle: signConfig?.suggestIsSlope == 1 ? 'italic' : '',
    fontWeight: signConfig?.suggestIsBold == 1 ? 'bold' : '',
  }
  const props ={
    workType: query.workType,
    setState: setBackNodesData,
    bizTaskId: query?.bizTaskId,
    actData: JSON.parse(localStorage.getItem('actData')),
    backNodes: backNodesData?.backNodes||[],
    commentList,
    dispatch,
    category: query.category
  }
  return <div className={styles.approve_container}>
          {<FloatingBubble
            magnetic='x'
            style={{
              '--background':'var(--ant-primary-color)',
              '--border-radius': '3.57rem 0 0 3.57rem',
              '--size': '2.79rem',
              '--initial-position-right': '0rem',
              '--initial-position-top': '0rem',
              '--height-size': '1.75rem',
            }}
            onClick={onBack}
          >
            返回
          </FloatingBubble>}
    <Spin spinning={loading.effects[loadingType]}>
    <Tabs
      className={styles.tabs_list}
      activeKey={currentColumnCode}
      onChange={onChangeTabs}
      activeLineMode={'fixed'}
      >
        {authList?.length != 0 &&
          authList?.map((item) => {
            return <Tabs.Tab title={<>{item.isRequierd?<i className={styles.isRequierd}>*</i>:''}{item.formColumnName}</>} key={item.formColumnCode	} />;
          })}
    </Tabs>
    {signConfig?.textEnable == 1&& <div className={styles.tabs_container} key={`${currentColumnCode}_text`}>
      <div className={styles.tabs_header}>
        文字审批
        <a onClick={onPopular}>常用语</a>
      </div>
      <TextArea value={textValue} className={styles.tabs_textarea} style={suggestCustomStyle} onChange={onChangeText} placeholder='请输入' id={`${currentColumnCode}_sign_text`}/>
    </div>}
   
    {signConfig?.handSignEnable == 1&& <div className={styles.tabs_container}  key={`${currentColumnCode}_url`}>
      <div className={styles.tabs_header}>
        手写签批
        <div>
          {signConfig?.pullSignEnable == 1&&<a onClick={importSign}>引入签名</a>}
          <a onClick={clear}>清除</a>
        </div>
      </div>
      
      <div className={styles.tabs_textarea}>
      <SignatureCanvas
        penColor="black"
        canvasProps={{
        className: 'sigCanvas',
        id: 'sigCanvas'
        }}
        ref={signRef}
        onEnd={onEndSign}
        onBegin={onBeginSign}
        clearOnResize={false}
      />
      </div>
    </div>}
   
    <div className={styles.footer}>
      <Button onClick={saveTemporarySign} type={'primary'}>
        确认审批
      </Button>
    </div>
    <Popup
      showCloseButton
      position="bottom"
      visible={popularVisible}
      onClose={onCancelPopular}
      onMaskClick={onCancelPopular}
      bodyStyle={{
        borderTopLeftRadius: '0.86rem',
        borderTopRightRadius: '0.86rem',
        height: '40%'
      }}
      className={styles.popup_container}
    >
      <h1 className={styles.popular_header}>常用语</h1>
      <Radio.Group onChange={onChangePopular} value={popularText}>
        <Space direction='vertical' block className={styles.popular_container}>
          {
            popularList.map((item,index)=>{return <Radio 
              className={styles.popular_item}
              key={index}
              value={item.signText}
              block
            >
              {item.signText}
            </Radio>
            })
          }
        </Space>
      </Radio.Group>
      <Button className={styles.popular_footer_button} onClick={onOkPopular}>确定</Button>
    </Popup>
    <MobileBackAct {...props}/>
    </Spin>
  </div>
}
export default connect(({ approve, loading }) => {
  return { approve, loading };
})(IndexPage);
