import { Modal } from 'antd';
import RelevanceModal from '../../../components/relevanceModal/relevanceModal';
import { connect } from 'umi';

function RangModal({ dispatch, contractUnstamped, orgUserType, onBack }) {
    const handelCancle = () => {
        dispatch({
            type: 'contractUnstamped/updateStates',
            payload: {
                selectVisible: false,
            },
        });
    };
    const onOk = () => {
        onBack();
        handelCancle();
    };
    return (
        <Modal
            open={true}
            onCancel={handelCancle}
            onOk={onOk}
            width={'85%'}
            centered
            mask={false}
            maskClosable={false}
            bodyStyle={{ overflow: 'hidden' }}
            getContainer={() => {
                return document.getElementById('contractUnstamped_id');
            }}
        >
            <RelevanceModal nameSpace="contractUnstamped" spaceInfo={contractUnstamped} orgUserType={orgUserType} />
        </Modal>
    );
}

export default connect(({ contractUnstamped }) => {
    return { contractUnstamped };
})(RangModal);
