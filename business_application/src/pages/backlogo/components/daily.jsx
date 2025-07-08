
import { connect } from 'dva'
import TableModal from './tableModal'
const Daily = ({ dispatch, backlogo ,location}) => {
    return <TableModal keyWords='DAILY' location={location}/>
}

export default connect(({ backlogo }) => ({
    backlogo
}))(Daily)
