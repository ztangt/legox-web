import { Modal } from 'antd';
import RelevanceModal from '../../../components/relevanceModal/relevanceModal';
import { connect } from 'umi';

function RangModal({ dispatch, contractArchives, orgUserType, onBack }) {
    const handelCancle = () => {
        dispatch({
            type: 'contractArchives/updateStates',
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
                return document.getElementById('contractArchives_id');
            }}
        >
            <RelevanceModal nameSpace="contractArchives" spaceInfo={contractArchives} orgUserType={orgUserType} />
        </Modal>
    );
}

export default connect(({ contractArchives }) => {
    return { contractArchives };
})(RangModal);
