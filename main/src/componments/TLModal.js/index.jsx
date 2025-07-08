import {Modal} from 'antd';
import { useState,useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
function TLModal(props){
  const [height, setHeight] = useState(
    document.getElementById(props.containerId).offsetHeight * 0.8 - 87
  )
  const onResize = useCallback(() => {
    setHeight(
      Number(
        document.getElementById(props.containerId).offsetHeight * 0.8 - 87
      )
    )
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])
  return (
    <Modal
      {...props}
      width={'95%'}
      bodyStyle={{height:height,padding:'0px',...props.bodyStyle}}
    >
      {props.children}
    </Modal>
  )
}
TLModal.propTypes = {
  containerId: PropTypes.string.isRequired//容器的id
};
export default TLModal;
