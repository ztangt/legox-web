import {connect} from 'dva'
import GlobalModal from '../../../../componments/GlobalModal';
import RelevanceModal from '../../../../componments/relevanceModal/relevanceModal';

const UnionModalCom = ({dispatch,onCancel,onConfirm,sceneConfigSpace})=>{

    
    return (
        <GlobalModal
            title="关联岗位"
            visible={true}
            widthType={3}
            onCancel={onCancel}
            onOk={onConfirm}
            maskClosable={false}
            mask={false}
            centered
            getContainer={() =>{
                return document.getElementById('sceneAuthorization_container')||false;
            }}
        >
            <RelevanceModal
                nameSpace="sceneConfigSpace"
                spaceInfo={sceneConfigSpace}
                orgUserType={'POST'}
            />
        </GlobalModal>
    )
}

export default connect(({sceneConfigSpace})=>({sceneConfigSpace}))(UnionModalCom)