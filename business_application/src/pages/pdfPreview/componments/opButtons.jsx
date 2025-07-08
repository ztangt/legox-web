import {Button,Input,InputNumber} from 'antd';
import IconFont from '../../../Icon_manage';
import styles from './opButtons.less';
import {CloseOutlined} from '@ant-design/icons';
import * as dd from 'dingtalk-jsapi';
function OpButtons({
  isMobile,controlDisable,totalPage,changeSketch,larger,smaller,toTop,
  toPageChange,toThisPage
}){
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
  return (
    <>
    {!isMobile?
    <div className={styles.web_buttons}>
      <Button disabled={controlDisable} onClick={changeSketch}>展开或收起略缩图</Button>
      <Button disabled={controlDisable} onClick={larger}>放大</Button>
      <Button disabled={controlDisable} onClick={smaller}>缩小</Button>
      <Button disabled={controlDisable} onClick={toTop}>返回顶部</Button>
      <span>跳转至</span>
      <InputNumber
        disabled={controlDisable}
        onChange={toPageChange}
        min={1}
        max={totalPage}
        onPressEnter={toThisPage}
        style={{width:"80px"}}
      />
    </div>:
    <div className={styles.mobile_buttons}>
      <span className={styles.icon} onClick={larger}><IconFont type="icon-fangda"/></span>
      <span className={styles.icon} onClick={smaller}><IconFont type="icon-suoxiao"/></span>
      <span className={styles.icon} onClick={toTop}><IconFont type="icon-fanhuidingbu"/></span>
      <span style={{marginRight:"8px"}}>跳转至</span>
      <InputNumber
        disabled={controlDisable}
        onChange={toPageChange}
        min={1}
        max={totalPage}
        onPressEnter={toThisPage}
        style={{width:"60px"}}
      />
      <CloseOutlined 
        style={{float:'right',fontSize:'32px',marginRight:'12px'}}
        onClick={onBack}
      />
    </div>
    }
    </>
  )
}
export default OpButtons;