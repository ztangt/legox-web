import {history,useOutletContext} from 'umi';
import CirculateWork from "./componments/circulateWork";
function Index({location}){
  const search =
  history.location.search.includes('?')||!history.location.search
    ?history.location.search
    : `?${history.location.search}`;
  return (
      <CirculateWork location={location|| useOutletContext()?.location}/>
  )
}
export default Index;
