import { MicroAppWithMemoHistory,history } from 'umi';
import { connect } from 'dva';
import { useMemo } from 'react'
import { parse } from 'query-string';
function Index ({}){
  const query = parse(history.location.search);
  const MicroApp = useMemo(() => {
    return (
      <MicroAppWithMemoHistory name="designable"url="/chartSetting" location={{...history.location,query}} />
      )
  }, []);
  return (
    <div id="chart_container">
      {MicroApp}
    </div>
    )
}
export default Index
// export default connect(({})=>({
// }))(Index)
