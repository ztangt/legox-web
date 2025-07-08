
import { connect } from 'dva'
import TableModal from './tableModal'
const System = ({location}) => {
    return <TableModal keyWords='SYS' location={location}/>
}

export default connect(({ backlogo }) => ({
    backlogo
}))(System)
