import { Modal } from 'antd';
import RelevanceModal from '../../../components/relevanceModal/relevanceModal';
import { connect } from 'umi';

function RelevanceRangModal({ dispatch, chargeReport, orgUserType, form }) {
  const { selectedDatas, selectedDataIds, formType } = chargeReport;

  const handelCancle = () => {
    dispatch({
      type: 'chargeReport/updateStates',
      payload: {
        isShowReleveModal: false,
      },
    });
    // 重置form的prev值
    // setFromListValue(buttonList);
  };
  const onOk = () => {
    let nameValue = [];
    selectedDatas.map((item) => {
      nameValue.push(item.nodeName);
    });
    console.log(nameValue, formType);
    form.setFieldsValue({ [`${formType}id`]: selectedDataIds.join(',') });
    form.setFieldsValue({
      [`${formType}`]: nameValue.join(',') ? nameValue.join(',') : '',
    });
    dispatch({
      type: 'chargeReport/updateStates',
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
        return document.getElementById('chargeReport_id');
      }}
    >
      <RelevanceModal
        nameSpace="chargeReport"
        spaceInfo={chargeReport}
        orgUserType={orgUserType}
      />
    </Modal>
  );
}
export default connect(({ chargeReport }) => {
  return { chargeReport };
})(RelevanceRangModal);
