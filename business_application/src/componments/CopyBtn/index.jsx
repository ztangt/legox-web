import React, {useCallback} from 'react';
import {message} from 'antd';
import Clipboard from 'clipboard';
import {Button} from '@/componments/TLAntd';


const Index = (props) => {
  const {buttonContent = '复制', copyText} = props;
  const onCopy = useCallback(() => {
    const copy = new Clipboard('.copyBtn');
    copy.on('success', function (e) {
      message.success('复制成功');
      copy.destroy();
    });
    copy.on('error', function (e) {
      message.error('复制失败');
      copy.destroy();
    });
  }, [])

  return <Button data-clipboard-text={ copyText } className={ 'copyBtn' } onClick={ onCopy }>{ buttonContent }</Button>;
};

export default Index;
