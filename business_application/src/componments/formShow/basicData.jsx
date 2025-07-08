import { Fragment, useState, useRef,useEffect} from 'react';
import { Input, Divider, Button, Select,Modal,message,Radio,Checkbox } from 'antd';
import { useDispatch, useSelector,useLocation, } from 'umi';
import styles from './basicData.less'
import _ from 'lodash'
import { dataFormat } from '../../../../main/src/util/util';
const basicData = (props)=>{
    const {digitalProgram,showStyle,choiceStyle,form,tableColCode,fieldValue,disabled,selectDefualtValue} = props
    const { stateObj} = useSelector(({formShow})=>({...formShow}));
    const bizSolId = useLocation().query.bizSolId;
    const bizInfoId = useLocation().query.bizInfoId;
    const currentTab = useLocation().query.currentTab;
    const dispatch = useDispatch();
    const [dictInfos,setDictInfos] = useState([]);

    const {signConfig,userInfo,formdata } = stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab]
    useEffect(()=>{
        if(digitalProgram){
            console.log('eeeeeee');
            dispatch({//获取码表方案下数据
                type: 'formShow/getDictType',
                payload: {
                    dictTypeCode: digitalProgram,
                    showType: 'ENABLE',
                    searchWord:'',
                    isTree:'1'
                },
                callback:(data)=>{
                    console.log('data3333333',data);
                    setDictInfos(data);
                }
            })
        }
    },[digitalProgram])

    useEffect(()=>{
        if(dictInfos.length!=0&&!fieldValue&&tableColCode&&selectDefualtValue=='FIRST'){
            form.setFieldsValue({[tableColCode]:dictInfos[0].dictInfoCode})
        }
    },[dictInfos])


    if(showStyle=='TILE'&&choiceStyle=='SINGLE'&&dictInfos&&dictInfos.length!=0){//平铺 单选
        return <Radio.Group  {...props} disabled={disabled} style={{background:disabled?'#f5f5f5':''}}>
                    {
                        dictInfos.map((dictInfo)=>{
                            return <Radio
                                value={dictInfo.dictInfoCode}
                                key={dictInfo.dictInfoCode}
                            >
                                {dictInfo.dictInfoName}
                            </Radio>
                        })
                    }

                </Radio.Group>
    }
    if(showStyle=='TILE'&&choiceStyle=='CHECK'&&dictInfos&&dictInfos.length!=0){//平铺 多选
        return <Checkbox.Group  {...props} disabled={disabled} style={{background:disabled?'#f5f5f5':''}}>
                    {
                        dictInfos.map((dictInfo)=>{
                            return <Checkbox
                                value={dictInfo.dictInfoCode}
                                key={dictInfo.dictInfoCode}

                            >
                                {dictInfo.dictInfoName}
                            </Checkbox>
                        })
                    }

                </Checkbox.Group>
    }
    if(showStyle=='DROP'&&dictInfos&&dictInfos.length!=0){//下拉
        return(
            <Select
                {...props}
                bordered={false}
                style={{width:'100%',height:'100%'}}
                mode={choiceStyle=='CHECK'?'multiple':''}
                disabled={disabled}
                className={styles.selector}
                style={{background:disabled?'#f5f5f5':'',height:'inherit'}}
             >
                {
                    dictInfos.map((dictInfo)=>{
                        return <Select.Option
                            value={dictInfo.dictInfoCode}
                            key={dictInfo.dictInfoCode}

                        >
                            {dictInfo.dictInfoName}
                        </Select.Option>
                    })
                }
            </Select>
        )
    }
    return <div></div>

}
export default basicData;
