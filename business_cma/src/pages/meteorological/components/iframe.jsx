import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'antd';
import '../index.less';
const IframeTest = () => {
    const [iframeHeight, setIframeHeight] = useState(0);
    const [url, setUrl] = useState('');
    const [open, setOpen] = useState(false);
    const [curHeight, setCurHeight] = useState(0); // 基础高度
    useEffect(() => {
        const baseUrl = 'http://10.20.105.21:8202/jmreport/list';
        setUrl(baseUrl);
        const height = window.outerHeight;
        setCurHeight(height);
        window.addEventListener('resize', onResize.bind(this));
        return () => {
            window.removeEventListener('resize', onResize.bind(this));
        };
    }, []);
    const onResize = () => {
        const resizeHeight = document.documentElement.clientHeight;
        const height = resizeHeight > 460 ? resizeHeight : 460;
        setCurHeight(height);
    };
    const clickButtonTest = () => {
        const baseUrl = 'http://10.20.105.21:8202/jmreport/list';
        setUrl(baseUrl);
    };
    const clickAll = () => {
        setOpen(true);
    };
    return (
        <div style={{ paddingBottom: 20 }}>
            <div onClick={clickButtonTest.bind(this)}>按钮1</div>
            <div onClick={clickAll.bind(this)}>查看</div>
            <div style={{ width: '100%', height: curHeight, paddingBottom: 10 }}>
                <iframe
                    id="frame"
                    src={url}
                    title="iframe"
                    width="100%"
                    height="100%"
                    scrolling="auto"
                    frameborder={0}
                ></iframe>
            </div>
        </div>
    );
};

export default IframeTest;
