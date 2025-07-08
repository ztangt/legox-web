
import { connect } from 'dva'
import TableModal from './tableModal'
const All = ({location}) => {
   return <TableModal keyWords='' location={location}/>
}

export default connect(({ backlogo }) => ({
    backlogo
}))(All)
