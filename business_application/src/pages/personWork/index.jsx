/**已发事项 */
import {history,useOutletContext} from 'umi';
import PersonWork from "./componments/personWork";
function Index({location}){
  const search =
  history.location.search.includes('?')||!history.location.search
    ?history.location.search
    : `?${history.location.search}`;
  return (
      <PersonWork location={location|| useOutletContext()?.location}/>
  )
}
export default Index;
