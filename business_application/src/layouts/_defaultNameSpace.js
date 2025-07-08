import AllWork from '../pages/allWork'
import DoneWork from '../pages/doneWork'
import DynamicPage from '../pages/dynamicPage/index'
import DynamicPageFlowDetails from '../pages/dynamicPage/flowDetails'
import Index from '../pages/index'
import { Link, history } from 'umi';

export default{
  '/': <Index/>,
  '/allWork': <AllWork location={history.location}/>,
  '/doneWork': <DoneWork location={history.location}/>,
  '/dynamicPage': <DynamicPage location={history.location}/>,
  '/dynamicPage/flowDetails': <DynamicPageFlowDetails location={history.location}/>,
  // '/formShow': <FormShow location={history.location}/>
}





