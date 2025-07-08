import { MicroAppWithMemoHistory,history } from 'umi';
import { parse } from 'query-string';
function Index (){
console.log('history===',history);
  return (
    <MicroAppWithMemoHistory name="main" url={`/applyModelConfig${history.location.search}`} location={{...history.location,query:parse(history.location.search)}}/>
    )
}
export default Index;
