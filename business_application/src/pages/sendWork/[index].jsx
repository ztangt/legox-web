/**已发事项 */
import {history,useOutletContext} from 'umi';
import SendWork from "./componments/sendWork";
function Index({location}){
  const search =
  history.location.search.includes('?')||!history.location.search
    ?history.location.search
    : `?${history.location.search}`;
    const { pathname } = history.location

  return (
      <SendWork location={location|| useOutletContext()?.location}/>
  )
}
export default Index;
