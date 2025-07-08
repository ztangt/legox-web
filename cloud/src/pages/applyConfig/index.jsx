import { MicroAppWithMemoHistory,history } from 'umi';

function Index (){
console.log('history===',history);
  return (
    <MicroAppWithMemoHistory name="main" url={`/applyModelConfig${history.location.search}`} location={history.location}/>
    )
}
export default Index;
