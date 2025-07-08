import {useState,useEffect,useRef} from 'react';
import {Input,Button} from 'antd';
import ScriptEditor from '../../../componments/public/scriptEditor';
import GlobalModal from '../../../componments/GlobalModal';
import styles from './ruleSetFun.less';
const TextArea = Input.TextArea;
function SetFun({funData,id,setFunData,contion,title,bizSolId}){
  const [scriptModal,setScriptModal] = useState(false);
  const [content,setContent] = useState('');
  const scriptRef = useRef();
  console.log('funData==',funData);
  useEffect(()=>{
    //赋值
    let tmpInfos = funData.length?funData.filter(i=>i.id==id&&i.type==contion):[];
    if(tmpInfos.length){//存在的时候直接取
      setContent(tmpInfos[0]?.scriptContent);
    }else{//如果不存在则根据规则自定义函数
      let tmpContent = `
        // //获取主表字段xx的值(values['XX'])
        // //遍历获取浮动表A里边aa字段的值
        // let joinaa = '';
        // values['A'].map((item)=>{
        //   if(joinaa){
        //     joinaa=joinaa+','+item['aa'];
        //   }else{
        //     joinaa=item['aa'];
        //   }
        // })
        // //请求GET接口/demo，传入参数xx与A.aa
        // //注意:如果是请求接口的话需要加await，不能去掉
        // //请求中如果需要特定的headers在method后面加
        // await fetchAsync(\`form/listModelData?XX=\${values['XX']}&&aa=\${joinaa}\`,
        // {
        //   method: "get",
        // }).then((renturnData) => {//返回的数据
        //       //请求结果中check字段的值等于false的时候，标红主表字段xx与浮动表A里边aa字段
        //       //主表的标红
        //       errorsInfo.push({
        //         'tableCode': '',
        //         'index': 0,
        //         'key': 'XX'
        //       });
        //       //浮动表的字段标红
        //       errorsInfo.push({
        //         'tableCode': 'A',//浮动表A
        //         'index': 1,//浮动表第二行(0为第一行，1为第二行，以此类推)
        //         'key': 'aa'//浮动表的字段
        //       });
        //       //错误提示信息
                 //messageFn("输入a为2的时候，输入d不能")
        //     })
        //     .catch((err) => {//接口的错误提示信息
        //       messageFn(err);
        //     });
        // //请求POST接口/demo，传入参数xx与A.aa
        // //注意:如果是请求接口的话需要加await，不能去掉
        // //请求中如果需要特定的headers在method后面加
        // await fetchAsync(\`form/listModelData\`,
        // {
        //   method: "POST",
        //   body:{
        //      XX:XX,
        //      aa:A.aa
        //   }
        // }).then((renturnData) => {//返回的数据
        //       //请求结果中check字段的值等于false的时候，标红主表字段xx与浮动表A里边aa字段
        //       //主表的标红
        //       errorsInfo.push({
        //         'tableCode': '',
        //         'index': 0,
        //         'key': 'XX'
        //       });
        //       //浮动表的字段标红
        //       errorsInfo.push({
        //         'tableCode': 'A',//浮动表A
        //         'index': 1,//浮动表第二行(0为第一行，1为第二行，以此类推)
        //         'key': 'aa'//浮动表的字段
        //       });
        //       //错误提示信息
                 //messageFn("输入a为2的时候，输入d不能")
        //     })
        //     .catch((err) => {//接口的错误提示信息
        //       messageFn(err);
        //     });
        `;
      funData.push({
        id:id,
        scriptContent:tmpContent,
        type:contion
      })
      setContent(tmpContent)
    }
  },[])
  const onOk=()=>{
    let tmpContent = scriptRef?.current?.getValue();
    funData.map((item)=>{
      if(item.id==id&&item.type==contion){
        item.scriptContent = tmpContent;
      }
    })
    setFunData(JSON.parse(JSON.stringify(funData)));
    setContent(tmpContent)
    setScriptModal(false)
  }
  const changeModal=()=>{
    setScriptModal(true);
  }
  const onCancel=()=>{
    setScriptModal(false);
  }
  return (
    <div className={styles.set_fun}>
      <div>{title}</div>
      <div className={styles.info}>
        <Button onClick={changeModal}>修改</Button>
        <TextArea
          value={content}
          className={styles.content}
        />
      </div>
      {scriptModal&&
        <GlobalModal
          title="函数脚本信息"
          visible={true}
          widthType={2}
          bodyStyle={{padding:'0px'}}
          onCancel={onCancel}
          onOk={onOk}
          mask={false}
          maskClosable={false}
          getContainer={() =>{
            return document.getElementById(`code_modal_${bizSolId}`)||false
          }}
        >
          <ScriptEditor
            scriptValue={content}
            ref={scriptRef}
          />
        </GlobalModal>
      }
    </div>
  )
}
export default  SetFun;