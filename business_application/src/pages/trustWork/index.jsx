/**委托事项 */
import {history,useOutletContext} from 'umi';
import List from "./componments/list";
function Index({location}){
  const search =
  history.location.search.includes('?')||!history.location.search
    ?history.location.search
    : `?${history.location.search}`;
  return (
      <List location={location|| useOutletContext()?.location}/>
  )
}
export default Index;
