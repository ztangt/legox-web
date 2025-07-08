import { Modal } from 'antd';
import { superModelComputed } from '../../util/util';
/**外部传参根据宽度尺寸判断
 * @widthType 宽度类型
 * @top 距离顶部高度
 * */
const GlobalModal = (props) => {
  const type = {
    1: superModelComputed().width > 1280 ? '60%' : 600,
    2: superModelComputed().width > 1280 ? '70%' : 800,
    3: '97%',
    4: 400,
  };
  const typeHeight = {
    1:
      superModelComputed().width > 1280
        ? superModelComputed().height * 0.53
        : 363,
    2:
      superModelComputed().width > 1280
        ? superModelComputed().height * 0.63
        : 453,
    3: superModelComputed().height - 305,
    4: 254,
  };
  return (
    <Modal
      style={{ top: props.top ? props.top : {} }}
      {...props}
      width={type[props.widthType]}
      bodyStyle={{ height: typeHeight[props.widthType] }}
    >
      {props.children}
    </Modal>
  );
};

export default GlobalModal;
