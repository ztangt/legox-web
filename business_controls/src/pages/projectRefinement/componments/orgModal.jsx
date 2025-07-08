import { useSetState } from 'ahooks';
import { connect } from 'dva';
import GlobalModal from '../../../components/newGlobalModal';
import RelevanceModalState from '../../../components/relevanceModalState/relevanceModal';
const OrgModal = ({
  projectRefinement,
  dispatch,
  onOk,
  onCancel,
  modalInfo,
}) => {
  const [state, setState] = useSetState({
    selectedNodeId: '',
    selectedDataIds: [],
    treeData: [],
    currentNode: {},
    expandedKeys: [],
    treeSearchWord: '',
    selectedDatas: [],
    originalData: [],
    selectNodeType: '',
  });
  return (
    <GlobalModal
      open={true}
      widthType={3}
      title="选择单位"
      onOk={(e) => {
        console.log('ref===', state.selectedDatas);
        onOk(state.selectedDataIds, state.selectedDatas, modalInfo);
      }}
      onCancel={() => {
        onCancel();
      }}
      okText="确定"
      cancelText="取消"
      bodyStyle={{ padding: '0px' }}
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return document.getElementById(`projectRefinement`);
      }}
      containerId={'projectRefinement'}
    >
      <RelevanceModalState
        nameSpace={'projectRefinement'}
        spaceInfo={{ ...state }}
        orgUserType="ORG"
        selectButtonType="radio"
        updateState={setState}
      />
    </GlobalModal>
  );
};
export default connect(({ projectRefinement }) => ({
  projectRefinement,
}))(OrgModal);
