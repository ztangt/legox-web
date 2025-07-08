
import {  history,useModel } from 'umi';
import ApplyModelConfig from './componments/applyModelConfig'
import { parse } from 'query-string';
function BizSolConfig({location}){
  const query = parse(history.location.search);
  const bizSolId = query.bizSolId;
  // var search = history.location.search.includes('?') || !history.location.search ? history.location.search : `?${history.location.search}`
  if(window.location.href.includes('cloud/applyConfig')){
    // search = useModel('@@qiankunStateFromMaster')?.location.search.includes('?') || !useModel('@@qiankunStateFromMaster')?.location.search ? useModel('@@qiankunStateFromMaster')?.location.search : `?${useModel('@@qiankunStateFromMaster')?.location.search}`
    return (
      
      <ApplyModelConfig location={{...history.location,query:parse(history.location.search)}}/>
      // <ApplyModelConfig location={window.location.href.includes('cloud/applyConfig')?useModel('@@qiankunStateFromMaster')?.location:location}/>
      )
  }
  return (
      <ApplyModelConfig location={location}/>
  )
}
export default BizSolConfig;
