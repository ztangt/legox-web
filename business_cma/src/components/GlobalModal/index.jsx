import { Modal } from 'antd';
import { connect } from 'dva';
import { superModelComputed } from '../../util/util';
/**外部传参根据宽度尺寸判断
 * @modalSize 宽度类型
 * @top 距离顶部高度
 * */
const GlobalModal = (props) => {
    const type = {
        smallBigger: superModelComputed().width > 1280 ? '60%' : 600,
        middle: superModelComputed().width > 1280 ? '70%' : 800,
        lager: '97%',
        small: 400,
        smallSmaller: 300,
    };
    let bodyStyle = {
        padding: '10px',
        height: props.modalSize == 'smallSmaller' ? 200 : props.modalSize == 'small' ? 300 : '',
        ...props.bodyStyle,
    };
    return (
        <Modal
            style={{ top: props.top ? props.top : {} }}
            {...props}
            centered={true}
            width={type[props.modalSize]}
            bodyStyle={bodyStyle}
        >
            {props.children}
        </Modal>
    );
};
export default connect(({ modalTable }) => ({
    modalTable,
}))(GlobalModal);
