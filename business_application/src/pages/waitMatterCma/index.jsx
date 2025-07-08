import {history,useOutletContext} from 'umi';
import WaitMatter from "./componments/waitMatter";
function Index({location}){
  const search =
  history.location.search.includes('?')||!history.location.search
    ?history.location.search
    : `?${history.location.search}`;
  const { pathname } = history.location



  return (
      <WaitMatter location={location|| useOutletContext()?.location}/>
  )
}
export default Index;
