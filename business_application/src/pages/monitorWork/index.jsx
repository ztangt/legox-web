import {history,useOutletContext} from 'umi';
import MonitorWork from "./componments/list";
function Index({location}){
  const search =
  history.location.search.includes('?')||!history.location.search
    ?history.location.search
    : `?${history.location.search}`;
  return (
      <MonitorWork location={location|| useOutletContext()?.location}/>
  )
}
export default Index;
