import { Button as AntdButton } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import React, { useState } from 'react';
const Button: React.FC = (props: ButtonProps) => {
    const [loadings, setLoadings] = useState<boolean>();

    const enterLoading = () => {
        setLoadings(true);
        setTimeout(() => {
            setLoadings(false);
        }, 1000);
    };

    return (
        <AntdButton
            {...props}
            loading={loadings}
            onClick={(e) => {
                enterLoading();
                props?.onClick?.(e);
            }}
        />
    );
};

export default Button;
