import {history,useOutletContext} from 'umi';
import TraceWork from "./componments/list";
function Index({location}){
  const search =
  history.location.search.includes('?')||!history.location.search
    ?history.location.search
    : `?${history.location.search}`;
  return (
      <TraceWork location={location|| useOutletContext()?.location}/>
  )
}
export default Index;
