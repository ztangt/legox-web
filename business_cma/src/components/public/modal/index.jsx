import { Modal } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { superModelComputed } from '../../../util/util';
/**外部传参根据宽度尺寸判断
 * @widthType 宽度类型
 * @top 距离顶部高度
 * */
const Index = (props) => {
    const [height, setHeight] = useState(document.getElementById(props.getElementById).offsetHeight * 0.8 - 87);
    const onResize = useCallback(() => {
        setHeight(Number(document.getElementById(props.getElementById).offsetHeight * 0.8 - 87));
    }, []);

    useEffect(() => {
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);
    const type = {
        1: superModelComputed().width > 1280 ? '60%' : 600,
        2: superModelComputed().width > 1280 ? '70%' : 800,
        3: '97%',
        4: 400,
    };
    // const typeHeight = {
    //     1: superModelComputed().width>1280?superModelComputed().height*0.49:333,
    //     2: superModelComputed().width>1280?superModelComputed().height*0.63:453, //453
    //     3: height,
    //     4: 254
    // }
    return (
        <Modal {...props} width={type[props.widthType]} bodyStyle={{ ...props.bodyStyle, height: height }}>
            {props.children}
        </Modal>
    );
};

export default Index;
