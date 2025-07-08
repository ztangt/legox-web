import ReactJson from 'react-json-view';
import GlobalModal from '../../../components/GlobalModal';
const OriginModal = ({ onCancel, detailCode }) => {
    // 确定
    const confirm = () => {
        onCancel();
    };
    return (
        <GlobalModal
            title="信息"
            open={true}
            onCancel={onCancel}
            onOk={confirm}
            getContainer={() => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            }}
            maskClosable={false}
            mask={false}
            modalSize="lager"
        >
            <div>
                <ReactJson name={false} src={JSON.parse(JSON.parse(detailCode))} />
            </div>
        </GlobalModal>
    );
};

export default OriginModal;
