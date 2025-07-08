import { Modal } from 'antd';
import { connect } from 'umi';
import RelevanceModal from '../../../components/relevanceModal/relevanceModal';

function RelevanceRangModal({ dispatch, budgetTarget, orgUserType, form }) {
  const { selectedDatas, selectedDataIds, formType } = budgetTarget;

  const handelCancle = () => {
    dispatch({
      type: 'budgetTarget/updateStates',
      payload: {
        isShowReleveModal: false,
      },
    });
    // 重置form的prev值
    // setFromListValue(buttonList);
  };
  const onOk = () => {
    let nameValue = [];
    if (formType === 'registerIdentityId') {
      selectedDatas.map((item) => {
        nameValue.push(item.userName);
      });
    } else {
      selectedDatas.map((item) => {
        nameValue.push(item.nodeName);
      });
    }

    console.log('123321:', nameValue, formType, selectedDataIds, selectedDatas);
    form.setFieldsValue({ [`${formType}id`]: selectedDataIds.join(',') });
    form.setFieldsValue({
      [`${formType}`]: nameValue.join(',') ? nameValue.join(',') : '',
    });
    dispatch({
      type: 'budgetTarget/updateStates',
      payload: {
        isShowReleveModal: false,
        // selectedDatas: [],
        // selectedDataIds: '',
      },
    });
  };
  return (
    <Modal
      visible={true}
      onCancel={handelCancle}
      onOk={onOk}
      width={'85%'}
      centered
      mask={false}
      maskClosable={false}
      bodyStyle={{ overflow: 'hidden' }}
      getContainer={() => {
        return document.getElementById('budgetTarget_id') || false;
      }}
    >
      <RelevanceModal
        nameSpace="budgetTarget"
        spaceInfo={budgetTarget}
        orgUserType={orgUserType}
      />
    </Modal>
  );
}
export default connect(({ budgetTarget }) => {
  return { budgetTarget };
})(RelevanceRangModal);
