import FormShow from '../../../componments/formPreview/index';
import {connect,history} from 'umi';
// import VIEWFLOW from './componments/viewFlow';
function Index({location,dispatch,formShow,loading}){
  const search = history.location.search.includes('?') || !history.location.search ? history.location.search : `?${history.location.search}`
  //const pathname = history.location.query.bizInfoId?`/${history.location.pathname.split('/')[2]}/update`:`${history.location.pathname.split('/')[2]}/add`;
  return (
    <FormShow location={location} isUpdataAuth={true}/>
  )
}
export default Index;
