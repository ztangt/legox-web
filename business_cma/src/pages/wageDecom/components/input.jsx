import { Input } from 'antd';
import { useState } from 'react';
import styles from './input.less';
function ReInput(props) {
    const [isShowInput, setIsShowInput] = useState(false);
    return (
        <>
            {isShowInput ? (
                <Input
                    {...props}
                    onBlur={(e) => {
                        props?.onBlur?.(e);
                        setIsShowInput(false);
                    }}
                />
            ) : props.value ? (
                <a
                    onClick={() => {
                        setIsShowInput(true);
                    }}
                    className={styles.edit_span}
                >
                    {props.value}
                </a>
            ) : (
                <a
                    onClick={() => {
                        setIsShowInput(true);
                    }}
                    className={styles.edit_span}
                >
                    &nbsp;&nbsp;&nbsp;
                </a>
            )}
        </>
    );
}
export default ReInput;
