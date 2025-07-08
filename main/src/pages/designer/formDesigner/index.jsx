import { MicroAppWithMemoHistory,history } from 'umi';
import { connect } from 'dva';
import { useMemo,useEffect } from 'react'
import { parse } from 'query-string';
function Index ({dispatch,formPreview}){
  const { signConfig } = formPreview
  const query = parse(history.location.search);
  useEffect(()=>{
      dispatch({
        type: 'formPreview/getTenantSign'
      })
  },[])
  const MicroApp = useMemo(() => {
    return (
      <MicroAppWithMemoHistory name="designable"url="/" location={{...history.location,query}} signConfig={signConfig}/>
      )
  }, [signConfig]);
  return (
    <div id="formShow_container">
      {MicroApp}
    </div>
    )
}
export default connect(({formPreview})=>({
  formPreview
}))(Index)
