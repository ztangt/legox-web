import { connect,history } from "umi";
import styles from './index.less';
import {Form,Button,Modal,Dropdown,Menu} from 'antd';
import {DownOutlined,QuestionCircleOutlined} from '@ant-design/icons';
const {confirm} = Modal;
function ButtonList({location,dispatch,formShow,loading,form,formSubmit,dropScopeTab,viewFlow}){
  const bizSolId = location.query.bizSolId;
  const bizInfoId = location.query.bizInfoId;
  const currentTab = location.query.currentTab;
  const {stateObj} = formShow;
  const {buttonList,isShowRule} = stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab];

  //是否置灰
  const isDisabledFn=(isShow)=>{
    return isShow=='NONE'?true:false;
  }
  //返回列表
  const backList=()=>{
    dropScopeTab()
  }
  //撤销
  const revokeBiz=()=>{
    confirm({
      title: '',
      content: '确认撤销吗？',
      onOk() {
        dispatch({
          type:'formShow/revokeBiz',
          payload:{
            bizInfoId:bizInfoId
          }
        })
      },
      onCancel() {
      },
    });
  }
  const buttonMenu=(group)=>{
    return (
      <Menu>
        {group.map((item)=>{
          if(item.buttonCode=='revoke'){
            return (
              <Menu.Item onClick={revokeBiz.bind(this)} disabled={isDisabledFn(item.isShow)}>
                <span>
                  {item.buttonName}
                </span>
              </Menu.Item>
            )
          }else if(item.buttonCode=='back_list'){
            return (
              <Menu.Item onClick={backList} disabled={isDisabledFn(item.isShow)}>
                <span>
                  {item.buttonName}
                </span>
              </Menu.Item>
            )
          }else if(item.buttonCode=='flowGuide'){
            return (
              <Menu.Item onClick={viewFlow} disabled={isDisabledFn(item.isShow)}>
                <span>
                  {item.buttonName}
                </span>
              </Menu.Item>
            )
          }else{
            return (
              <Menu.Item onClick={formSubmit.bind(this,item.buttonCode)} disabled={isDisabledFn(item.isShow)}>
                <span>
                  {item.buttonName}
                </span>
              </Menu.Item>
            )
          }
        })}
      </Menu>
    )
  }
  const isShowRuleFn = ()=>{
    dispatch({
      type:"formShow/updateStates",
      payload:{
        isShowRule:!isShowRule
      }
    })
  }
  return (
    <div className={styles.heard}>
    <div className={styles.button_list}>
      {buttonList&&Object.keys(buttonList).map((key)=>{
        if(!key||key=='null'){
          return (buttonList[key].map((item)=>{
            if(item.buttonCode=='revoke'){
              return <Button type="primary" onClick={revokeBiz.bind(this)} disabled={isDisabledFn(item.isShow)} key={item.buttonId}>{item.buttonName}</Button>
            }else if(item.buttonCode=='back_list'){
              return <Button type="primary" onClick={backList} disabled={isDisabledFn(item.isShow)} key={item.buttonId}>{item.buttonName}</Button>
            }else if(item.buttonCode=='flowGuide'){
              return <Button type="primary" onClick={viewFlow} disabled={isDisabledFn(item.isShow)} key={item.buttonId}>{item.buttonName}</Button>
            }else{
              return (
                <Button type="primary" htmlType={"submit"} onClick={formSubmit.bind(this,item.buttonCode)} key={item.buttonId} disabled={isDisabledFn(item.isShow)}>{item.buttonName}</Button>
              )
            }
          }))
        }else{
          return (
            <Dropdown overlay={buttonMenu(buttonList[key])} placement="bottomCenter">
              <Button>{key}<DownOutlined/></Button>
            </Dropdown>
          )
        }
      })}
    </div>
    <div className={styles.rule_button}><QuestionCircleOutlined onClick={isShowRuleFn}/></div>
    </div>

  )
}
export default connect(({formShow,loading})=>{return {formShow,loading}})(ButtonList);
