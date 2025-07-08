import { Modal } from 'antd';
import RelevanceModal from '../../../components/relevanceModal/relevanceModal';
import { connect } from 'umi';

function RangModal({ dispatch, contractStamped, orgUserType, onBack }) {
    const handelCancle = () => {
        dispatch({
            type: 'contractStamped/updateStates',
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
                return document.getElementById('contractStamped_id');
            }}
        >
            <RelevanceModal nameSpace="contractStamped" spaceInfo={contractStamped} orgUserType={orgUserType} />
        </Modal>
    );
}

export default connect(({ contractStamped }) => {
    return { contractStamped };
})(RangModal);
