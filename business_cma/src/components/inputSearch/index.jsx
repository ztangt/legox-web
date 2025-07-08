import { Input } from 'antd';
import { useRef } from 'react';
import searchIcon from '../../public/assets/search_black.svg';
import styles from './index.less';

const { Search } = Input;

const InputSearch = (props) => {
    const parentRef = useRef(null);
    const onFocus = (e) => {
        const searchBtn = parentRef.current.querySelector('.ant-input-wrapper');
        searchBtn.style.borderColor = '#505766';
    };

    const onBlur = (e) => {
        const searchBtn = parentRef.current.querySelector('.ant-input-wrapper');
        searchBtn.style.borderColor = '#d9d9d9';
    };

    const onMouseOver = (e) => {
        const searchBtn = parentRef.current.querySelector('.ant-input-wrapper');
        searchBtn.style.borderColor = '#505766';
    };

    return (
        <div ref={parentRef} onFocus={onFocus} onBlur={onBlur} className={styles.InputSearch} onMouseOver={onMouseOver}>
            <Search {...props} allowClear={false} enterButton={<img src={searchIcon} />} />
        </div>
    );
};

export default InputSearch;
