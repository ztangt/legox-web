import GlobalModal from '../GlobalModal';
import RelevanceModal from '../relevanceModal/relevanceModal';
/**
 * nameSpace:命名空间
 * spaceInfo:空间信息object
 * containerId:容器id 必须传
 * onOk:点击确定的回调
 * onCancel:点击取消的回调
 * **/

function RangModal({ nameSpace, spaceInfo, containerId, onOk, onCancel }) {
    return (
        <GlobalModal
            open={true}
            onCancel={onCancel}
            onOk={onOk}
            modalSize="lager"
            // centered
            mask={false}
            maskClosable={false}
            // bodyStyle={{ overflow: 'hidden' }}
            getContainer={() => {
                return document.getElementById(containerId) || false;
            }}
            // getContainer={() => {
            //     return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            // }}
        >
            <RelevanceModal nameSpace={nameSpace} spaceInfo={spaceInfo} orgUserType={spaceInfo.rangType} />
        </GlobalModal>
    );
}

export default RangModal;
