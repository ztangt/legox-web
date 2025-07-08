
import { connect } from 'dva'
import TableModal from './tableModal'
const Matter = ({location}) => {
    return <TableModal keyWords='MATTER' location={location}/>
}

export default connect(({ backlogo }) => ({
    backlogo
}))(Matter)
