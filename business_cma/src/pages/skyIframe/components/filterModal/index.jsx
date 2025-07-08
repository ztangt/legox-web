import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import { useState } from 'react';
import GlobalModal from '../../../../components/GlobalModal';
import { timeStamp } from '../../../../util/util';
import styles from '../skyIframe/index.less';
const { RangePicker } = DatePicker;

const FilterModal = ({ dispatch, onCancel }) => {
    const [pickDate, setPickDate] = useState([]);
    const confirm = () => {
        onCancel();
        if (pickDate.length > 0) {
            const startDate = timeStamp(pickDate[0]);
            const endDate = timeStamp(pickDate[1]);
            console.log('start-', startDate, endDate);
            dispatch({
                type: 'skyIframeCommonModel/selectiveDataByScreen',
                payload: {
                    startDate: '1676010118',
                    endDate: '1676010168',
                },
            });
        }
    };

    const onPickChange = (days, dateStrings) => {
        console.log('date', days);
        setPickDate(dateStrings);
    };
    const disabledDate = (current) => {
        return current && current > dayjs().endOf('day');
    };
    return (
        <div>
            <GlobalModal
                open={true}
                onCancel={onCancel}
                onOk={confirm}
                getContainer={() => {
                    return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                }}
                maskClosable={false}
                mask={false}
                modalSize="small"
            >
                <div className={styles.modal_content}>
                    选择筛选时间：
                    <RangePicker
                        format="YYYY-MM-DD HH:mm:ss"
                        showTime
                        disabledDate={disabledDate}
                        onChange={onPickChange}
                    ></RangePicker>
                </div>
            </GlobalModal>
        </div>
    );
};

export default connect(({ skyIframeCommonModel }) => ({
    skyIframeCommonModel,
}))(FilterModal);
