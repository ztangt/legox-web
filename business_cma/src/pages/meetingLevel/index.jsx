import { connect } from 'dva';
import { useEffect, useState } from 'react';

//会见密级
const Container = ({ dispatch, meetingLevel }) => {
    const [level, setLevel] = useState('');

    useEffect(() => {
        dispatch({
            type: 'meetingLevel/getMeetingLevel',
            callback: (res) => {
                setLevel(res);
            },
        });
    }, []);

    return (
        <div className={'width_100 height_100 flex_center'}>
            <div className={'gPrimary f100 fb'}>{level}</div>
        </div>
    );
};

export default connect(({ meetingLevel }) => ({
    meetingLevel,
}))(Container);
