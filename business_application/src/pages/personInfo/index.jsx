/**已发事项 */
import PersonInfo from "./componments/personInfo";
import {useOutletContext} from 'umi'
function Index({location}){
  return (
      <PersonInfo location={location|| useOutletContext()?.location}/>
  )
}
export default Index;
