import { Input } from 'antd';
import { connect } from 'dva';



function Demo({dispatch,value}){
  function onChange(e){
    dispatch({
      type: 'demo/updateStates',
      payload: {
        value: e.target.value
      }
    })
  }
  return (
    
    
    <div>
      <Input onChange={onChange.bind(this)} value={value}/>
      {value}
    </div>
  );
}

export default connect(({demo})=>({
    ...demo,
  }))(Demo);