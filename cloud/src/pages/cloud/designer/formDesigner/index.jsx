import { MicroAppWithMemoHistory,history } from 'umi';
import { connect } from 'dva';
import { useMemo } from 'react'
import { parse } from 'query-string';
function Index ({formDesigner}){
  const { signConfig } = formDesigner
  const MicroApp = useMemo(() => {
    return (
      <MicroAppWithMemoHistory name="designable"url="/" location={{...history.location,query:parse(history.location.search)}} signConfig={signConfig}/>
      )
  }, [signConfig]);
  return (
    <div id="formShow_container">
      {MicroApp}
    </div>
    )
}
export default connect(({formDesigner})=>({
  formDesigner
}))(Index)
