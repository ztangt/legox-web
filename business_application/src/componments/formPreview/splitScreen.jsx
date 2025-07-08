import { useState } from 'react'
import WpsFile from '../../componments/WpsFile'
import RuleConfig from './ruleConfig'
import { SwapOutlined, FullscreenOutlined, CopyOutlined } from '@ant-design/icons'
import styles from './index.less'
const SplitScreen = ({ leftChildren, setState, fileType = 'word', state, isShowButton, targetKey, location, textFillScreen, isShowRule, isSplit }) => {
    console.log('isSplit',isSplit)
    const [isChange, setIsChange] = useState(false)

    function wpsFn() {
        return <WpsFile
            setState={setState} state={state} location={location} isNeedFit={true} isShowButton={isShowButton} targetKey={targetKey} fileType={fileType}
        />
    }
    //分屏互换
    function splitChange() {
        setIsChange(!isChange)
    }
    //分屏1屏
    function returnClassName(){
        if(isSplit){
            if(isShowRule){//展示数据规则
                return styles.screen_rules
            }else{//展示1屏
                return styles.screen_one
            }
        }else{//全屏
            return styles.screen_all
        }

    }
    //分屏2屏
    function returnClassNameTwo(){
        if(isSplit){
            if(isShowRule){//展示数据规则
                return styles.screen_rules
            }else{//展示2屏
                return styles.screen_two
            }
        }else{//全屏
            return styles.screen_all
        }
    }
    //退出全屏
    function onFillScreen(type){
        //退出全屏
        textFillScreen(type)
        //取消分屏互换
        setIsChange(false)
    }
    return (
        <div className={styles.screen}>
            <div className={returnClassName() }>{isChange ? wpsFn() : leftChildren()}</div>
            {isSplit ? <>
                <div className={styles.screen_button}>
                    <div className={styles.screen_form} title="单据全屏" onClick={onFillScreen.bind(this,'FORM')}>
                        <CopyOutlined />
                    </div>
                    <div className={styles.allFill} title="正文全屏" onClick={onFillScreen.bind(this,'WORD')}>
                        <FullscreenOutlined />
                    </div>
                    <div className={styles.screen_change} onClick={splitChange} title="正文表单对换">
                        <SwapOutlined />
                    </div>
                </div>
                <div className={returnClassNameTwo()}>{isChange ? leftChildren() : wpsFn()}</div>
                {isShowRule ? <div className={styles.rule_config}>
                    <RuleConfig state={state} setState={setState} />
                </div> : ''}
            </> : ''}

        </div>
    )
}

export default SplitScreen