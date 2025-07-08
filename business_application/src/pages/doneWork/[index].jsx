import {  history,useOutletContext } from 'umi';
import DoneWork from './componments/doneWork';
function Index({ location }) {
  const search =
    history.location.search.includes('?') || !history.location.search
      ? history.location.search
      : `?${history.location.search}`;
  const { pathname } = history.location;
  return (

      <DoneWork location={location|| useOutletContext()?.location} />
  );
}
export default Index;
