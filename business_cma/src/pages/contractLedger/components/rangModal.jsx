import { Modal } from 'antd';
import { connect } from 'umi';
import RelevanceModal from '../../../components/relevanceModal/relevanceModal';

function RangModal({ dispatch, contractLedger, orgUserType, onBack }) {
    const handelCancle = () => {
        dispatch({
            type: 'contractLedger/updateStates',
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
                return document.getElementById('contractLedger_id') || false;
            }}
        >
            <RelevanceModal nameSpace="contractLedger" spaceInfo={contractLedger} orgUserType={orgUserType} />
        </Modal>
    );
}

export default connect(({ contractLedger }) => {
    return { contractLedger };
})(RangModal);
