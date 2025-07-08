import { Fragment, useState, useRef,useEffect} from 'react';
import { Input, Divider, Button, Popover,Modal,message } from 'antd';
import { useDispatch, useSelector,useLocation, } from 'umi';
import { dataFormat } from  '../../util/util'

import _ from 'lodash'
import styles from './writeSing.less'
import SignatureCanvas from 'react-signature-canvas'
const WriteSign = ({configInfo,values,setValues,tableColCode,disabled})=>{
    console.log('configInfo',configInfo);
    const { stateObj} = useSelector(({formShow})=>({...formShow}));
    const bizSolId = useLocation().query.bizSolId;
    const bizInfoId = useLocation().query.bizInfoId;
    const currentTab = useLocation().query.currentTab;
    const dispatch = useDispatch();
    const baseAdice = {
        'REJECT': '驳回',
        'READING': '圈阅',
        'AGREE': '同意',
        'NONE': ''
    }
    const {signConfig,userInfo,formdata,tableColumCodes,commentJson,bizInfo } = stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab]
    console.log('tableColumCodes',tableColumCodes);
    const [signVisible, setSignVisible] = useState(false);
    const [signUrl, setSignUrl] = useState('');
    const [textValue, setTextValue] = useState(configInfo&&baseAdice[configInfo.optionValue]);
    const [isImport,setIsImport] = useState(false)
    const signRef = useRef(null)
    const  currentConmmentIndex  = commentJson.findIndex((item)=>{return item.tableColCode==tableColCode})
    // const  currentSignedIndex  = tableColumCodes.length!=0?tableColumCodes.findIndex((item)=>{return item.columnCode==tableColCode}):-1
    // const currentConmment = commentJson[currentConmmentIndex]||{}
    console.log('tableColCode',tableColCode,commentJson,tableColumCodes);
    const returnPosition = (position) =>{
        let cPosition = 'flex-start'
        if(position=='RIGHT'){
            cPosition = 'flex-end'
        }else if(position=='MIDDLE'){
            cPosition = 'center'
        }
        return cPosition
    }

    useEffect(()=>{
        //获取手写签批配置
        dispatch({
            type:'formShow/getSignConfig',
            payload:{
            }
        })
        //获取手写签批配置
        dispatch({
            type:'formShow/getCurrentUserInfo',
            payload:{

            },
        })
        //获取手写签批列表
        dispatch({
            type:'formShow/getSignList',
            payload:{
                bizInfoId: bizInfoId||bizInfo.bizInfoId
            },
        })



    },[])


    const clear = () =>{//清除
        if(signRef.current){
            signRef.current.clear()
        }
        setSignUrl('')
        setCommentJson(textValue,'')
        setIsImport(false);

    }

    const onSignture = () =>{//手写签批
        setSignVisible(true)
        setTimeout(()=>{//由于初次加载加载不到ref 做延迟操作
            if(signRef.current&&isImport){//引入签名时需要修改签批地址
                signRef.current.fromDataURL(signUrl)

            }
        })

    }

    const returnPostOrg = (item) =>{
        //所属机构类型 ORG_POST部门/岗位 POST_ORG岗位/部门 ORG部门 POST岗位
        switch (signConfig.orgType) {
                case 'ORG_POST':
                    return `${item.signDeptName}/${item.signPostName}`
                break;
                case 'POST_ORG':
                    return `${item.signPostName}/${item.signDeptName}`
                break;
                case 'ORG':
                    return `${item.signDeptName}`

                break;
                case 'POST':
                    return `${item.signPostName}`
                break;
            default:
                break;
        }
    }

    const returnPersonName = (item) =>{
        //signConfig.personNameType   人名格式类型SYS_TEXT系统文字  SIGN_TEXT签名+文字 SIGN签名(获取上传的签名，无签名显示文字)
        switch (signConfig.personNameType) {
            case 'SYS_TEXT':
                return `${item.signUserName}`
            break;
            case 'SIGN_TEXT':
                return <>{`${item.signUserName}`}{item.signedImgUrl?<img src={item.signedImgUrl} style={{width:50,height: 50}}/>:''}</>
            break;
            case 'SIGN':
                if(item.signedImgUrl){
                    return <img src={item.signedImgUrl} style={{width:50,height: 50}}/>
                }else{
                    return `${item.signUserName}`
                }
            break;
        default:
            break;
        }
    }
    const returnSign = (item) =>{
        //时间格式
        let timeFormat = 'YYYY年MM月DD日'
        if(signConfig.timeFormat=='YMD_TMS'){
            timeFormat = 'YYYY年MM月DD日 HH:MM:ss'
        }
        let array = []
        array[signConfig.orgOrder] = returnPostOrg(item)
        array[signConfig.personNameOrder] = returnPersonName(item)
        array[signConfig.timeFormatOrder] = signConfig.timeEnable==1?dataFormat(item.signTime,timeFormat):''
        array.splice(0,1)//删除index为0的
        return array.map((item,index)=><span key={index} style={{marginLeft: 5}}>{item}</span>)
    }


    signConfig.personNameType

    //引入签名  转换签名为base64地址
    const importSign = () =>{
        window.URL = window.URL || window.webkitURL;
        var xhr = new XMLHttpRequest();
        xhr.open("get", userInfo.signatureUrl, true);
        //使用xhr请求图片,并设置返回的文件类型为Blob对象
        xhr.responseType = "blob";
        xhr.onload = function () {
            if (this.status == 200) {
                //得到一个blob对象
                var blob = this.response;
                let oFileReader = new FileReader();
                oFileReader.onloadend = function (e) {
                    // base64的图片了
                    let base64 = e.target.result;
                    setSignUrl(base64)
                    setCommentJson(textValue,base64)
                };
                //使用FileReader 对象接收blob
                oFileReader.readAsDataURL(blob);
            }
        }
        xhr.send();
        setIsImport(true);
    }
    //保存签批
    const onSaveSign = () =>{
        setSignUrl(signRef.current.getTrimmedCanvas().toDataURL('image/png',1));
        setCommentJson(textValue,signRef.current.getTrimmedCanvas().toDataURL('image/png',1))
        setSignVisible(false)
    }

    //设置签批json
    const setCommentJson = (messageText,messageImgUrl) =>{
        if(currentConmmentIndex!=-1){//修改
            commentJson[currentConmmentIndex].messageText = messageText
            commentJson[currentConmmentIndex].messageImgUrl = messageImgUrl
        }else{//新增
            commentJson.push({tableColCode,messageText,messageImgUrl})
        }
    }

    //修改文本框值
    const onChangeValue = (e)=>{
        if(e.target.value.length>=Number(configInfo.maxLength)){//校验文本框最大长度
            message.erorr(`最多输入${configInfo.maxLength}个字符`)
            return
        }
        setTextValue(e.target.value);
        setCommentJson(e.target.value,signUrl);

        // setValues({
        //     ...values,
        //     [configInfo.tableColCode]:value
        // })

        // formdata[0].data[0][configInfo.tableColCode] = value;
        // dispatch({
        //     type: 'formShow/updateStates',
        //     payload: {
        //         formdata
        //     }
        // })
    }



    const baseAdvices = ['同意','圈阅','驳回']//TODO: 获取常用语配置
    function compare(property){
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    }
    console.log('configInfo',configInfo);
    return(
        <div className={styles.box} style={disabled?{pointerEvents:'none',background:'#f5f5f5'}:{}}>
            <div className={styles.advice} style={{'flexDirection': signConfig.signLine==1?'column':'row'}}>
                {
                    <p className={styles.advice_area} >
                        {//意见富文本没有常用语
                        configInfo&&configInfo.optionType!='TEXTEARE'&&configInfo.optionType&&<Popover
                            content={<ul>
                            {baseAdvices.map((item,index)=><li onClick={()=>{setTextValue(item); setCommentJson(item,signUrl);}} key={index}>{item}</li>)}
                            </ul>}>
                            <a>常用语</a>
                        </Popover>}
                        {signConfig.textEnable==1&&<Input.TextArea
                            placeholder={configInfo&&configInfo.placeholder}
                            value={textValue}
                            onChange={onChangeValue}
                            style={{
                                border: 'none',
                                background: 'none',
                                height: '100%',
                                fontSize: signConfig.suggestFontSize,
                                color: signConfig.suggestColor,
                                textDecoration: signConfig.suggestIsUnderline==1?'underline':'',
                                fontStyle: signConfig.suggestIsSlope==1?'italic':'',
                                fontWeight: signConfig.suggestIsBold==1?'bold':'',
                         }}/>}
                    </p>
                }

                {
                    //意见类型为手写签批时展示手写签批组件
                    configInfo&&configInfo.optionType=='PICTURE'&&<div className={styles.advice_sing} >
                        <ul className={styles.operation}>
                            <li>
                                <Modal
                                    visible={signVisible}
                                    width={500}
                                    title='手写签批'
                                    bodyStyle={{height:'200px',padding: '0'}}
                                    onCancel={()=>{setSignVisible(false)}}
                                    mask={false}
                                    maskClosable={false}
                                    getContainer={() =>{
                                    return document.getElementById('formShow_container')
                                    }}
                                    footer={[
                                    <Button key="cancel" onClick={()=>{setSignVisible(false)}}>取消</Button>,
                                    <Button key="submit" type="primary" onClick={onSaveSign}>确定</Button>,
                                    ]}
                                >
                                    <SignatureCanvas
                                        penColor='black'
                                        canvasProps={{width: '500px', className: 'sigCanvas'}}
                                        ref={signRef}/>

                                </Modal>
                            {signConfig.handSignEnable==1&&<a  onClick={onSignture}>手写签批</a>}
                            </li>
                            <li onClick={clear}><a>清除</a></li>
                            {signConfig.pullSignEnable==1&&<li onClick={importSign}><a>引入签名</a></li>}
                            {signConfig.tabletEnable==1&&<li><a>手写板</a></li>}
                            {signConfig.affectFlowable=='YES'&&<Popover
                            content={'研发中。。。'}>
                            <li><a>同意</a></li>
                            </Popover>}
                            {signConfig.affectFlowable=='YES'&&<Popover
                            content={'研发中。。。'}>
                            <li><a>不同意</a></li>
                            </Popover>}
                        </ul>
                        {signUrl&&<img  src={signUrl} style={{width:'100px',height:'100px',display:'flex',justifyContent:returnPosition(signConfig.textPosition)}}/>}
                    </div>}
            </div>

            {/**历史数据 */}
            <ul >
                    {
                    tableColumCodes&&
                    tableColCode&&
                    tableColumCodes[tableColCode]&&
                    tableColumCodes[tableColCode].length!=0&&
                    tableColumCodes[tableColCode].sort(compare('signUserSort')).map((item,index)=><li key={index}>
                        <div style={{
                            display:'flex',
                            justifyContent:returnPosition(signConfig.textPosition),
                            color: signConfig.suggestColor,
                            fontSize: signConfig.suggestFontSize,
                            textDecoration:signConfig.suggestIsUnderline==1?'underline':'',
                            fontStyle: signConfig.suggestIsSlope==1?'italic':'',
                            fontWeight: signConfig.suggestIsBold==1?'bold':'',
                        }}>{item.messageText}</div>{/**意见区域 */}
                        <div style={{display:'flex',justifyContent:returnPosition(signConfig.signPosition)}}>{item.messageImgUrl?<img src={item.messageImgUrl}  style={{width:50,height: 50}}/>:''}</div>{/**签名区域 */}
                        {
                            signConfig.signedEnable==1&&<div style={{
                                display:'flex',
                                justifyContent:returnPosition(signConfig.signedPosition),
                                color: signConfig.signedColor,
                                fontSize: signConfig.signedFontSize,
                                textDecoration:signConfig.signedIsUnderline==1?'underline':'',
                                fontStyle: signConfig.signedIsSlope==1?'italic':'',
                                fontWeight: signConfig.signedIsBold==1?'bold':'',
                                }}>
                                    { returnSign(item)}
                        </div>}{/**落款区域 */}
                    </li>
                    )}
            </ul>

        </div>

    )
}
export default WriteSign
