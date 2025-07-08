import { Fragment, useState, useRef} from 'react';
import { Input, Divider, Button, Popover } from 'antd';
import { useDispatch, useSelector } from 'umi';
import _ from 'lodash'
import styles from './writeSing.less'
import SignatureCanvas from 'react-signature-canvas'

const WriteSign = ({})=>{
    const { signConfig} = useSelector(({designer})=>({...designer}));

    const [signVisible, setSignVisible] = useState(false);
    const [signUrl, setSignUrl] = useState('');
    const returnPosition = (position) =>{
        let cPosition = 'flex-start'
        if(position=='RIGHT'){
            cPosition = 'flex-end'
        }else if(position=='MIDDLE'){
            cPosition = 'center'
        }
        return cPosition
    }
    
    var signRef; 
    const signature = () =>{
        setSignVisible(!signVisible)
        console.log('signRef',signRef);
        if(signRef){
            setSignUrl(signRef.getTrimmedCanvas().toDataURL('image/png'));
        }
    }

    const clear = () =>{
        if(signRef){
            setSignUrl(signRef.clear());
        }
    }
    return(
        <div className={styles.box} can>
            <ul className={styles.operation}>
                <li><a>常用语</a></li>
                <li>
                    {/**<Popover 
                        visible={signVisible} 
                        content={<SignatureCanvas 
                            penColor='black' 
                            canvasProps={{width: 500, height: 200, className: 'sigCanvas'}} 
                            ref={ref => {
                                signRef = ref;
                            }}/>} 
                            title="手写签批">
                        <a onClick={signature}>手写签批</a>
                        </Popover>*/}
                    <a onClick={signature}>手写签批</a>
                </li>
                <li onClick={clear}><a>清除</a></li>
                {signConfig.pullSignEnable==1&&<li><a>引入签名</a></li>}
            </ul>
            <div className={styles.advice} >
                {
                    signConfig.textEnable==1&&<p className={styles.advice_area} style={{}}>
                        <Input.TextArea 
                            placeholder='意见区域' 
                            style={{
                                border: 'none',
                                background: 'none',
                                height: '100%',
                                fontSize: signConfig.suggestFontSize,
                                color: signConfig.suggestColor,
                                textDecoration: signConfig.suggestIsUnderline==1?'underline':'',
                                fontStyle: signConfig.suggestIsSlope==1?'italic':'',
                                fontWeight: signConfig.signedIsBold==1?'bold':'',
                         }}/>
                    </p>
                }
                
                {signConfig.handSignEnable==1&&<div className={styles.advice_sing} ><img  src={signUrl} style={{width:'50%',height:'100%'}}/></div>}
            </div>
            {/**历史数据 */}
            {signConfig.signedEnable==1&&<ul >
                    <li>
                        <div style={{
                                display:'flex',
                                justifyContent:returnPosition(signConfig.textPosition),
                                color: signConfig.suggestColor,
                                fontSize: signConfig.suggestFontSize,
                                textDecoration:signConfig.suggestIsUnderline==1?'underline':'',
                                fontStyle: signConfig.suggestIsSlope==1?'italic':'',
                                fontWeight: signConfig.signedIsBold==1?'bold':'',
                            }}></div>{/**意见区域 */}
                        <div style={{display:'flex',justifyContent:returnPosition(signConfig.signPosition)}}></div>{/**签名区域 */}
                        <div style={{display:'flex',justifyContent:returnPosition(signConfig.signedPosition),color: signConfig.signedColor,fontSize: signConfig.signedFontSize}}></div>{/**落款区域 */}
                    </li>
                </ul>}
           
        </div>

    )
}
export default WriteSign