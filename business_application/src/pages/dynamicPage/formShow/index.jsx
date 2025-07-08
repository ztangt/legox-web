import FormShow from '../../../componments/formPreview/index';
import {connect,history,useModel,useOutletContext} from 'umi';
// import VIEWFLOW from './componments/viewFlow';
function Index({location,dispatch,formShow,loading}){
  const search = history.location.search.includes('?') || !history.location.search ? history.location.search : `?${history.location.search}`
  // const pathname = history.location.query.bizInfoId?`/${history.location.pathname.split('/')[2]}/update`:`/${history.location.pathname.split('/')[2]}/add`;
  // console.log('pathname=',pathname);
  console.log(location,'222');

  if(window.location.href.includes('mobile')){
    return <FormShow location={useModel('@@qiankunStateFromMaster')?.location} isUpdataAuth={true}/>
  }
  return (
    <FormShow location={location|| useOutletContext()?.location} isUpdataAuth={true}/>
  )
}
export default Index;
