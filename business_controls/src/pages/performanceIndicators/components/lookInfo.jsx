import { useModel } from '@umijs/max';
import { Descriptions } from 'antd';
import { connect } from 'dva';
import { useEffect } from 'react';
import Modal from '../../../components/newGlobalModal';
function LookInfo({ performanceIndicators, dispatch }) {
  const { listSelectedRows, performanceInfo } = performanceIndicators;
  const { targetKey } = useModel('@@qiankunStateFromMaster');
  useEffect(() => {
    //获取信息
    dispatch({
      type: 'performanceIndicators/getPerformanceInfo',
      payload: {
        id: listSelectedRows?.[0].performanceCode || '',
      },
    });
  }, []);
  return (
    <Modal
      open={true}
      widthType={3}
      bodyStyle={{ padding: '0px' }}
      maskClosable={false}
      mask={false}
      onOk={() => {
        dispatch({
          type: 'performanceIndicators/updateStates',
          payload: {
            isShowLookInfo: false,
          },
        });
      }}
      onCancel={() => {
        dispatch({
          type: 'performanceIndicators/updateStates',
          payload: {
            isShowLookInfo: false,
          },
        });
      }}
      getContainer={() => {
        return (
          document.getElementById(`formShow_container_${targetKey}`) ||
          document.getElementById(`formShow_container`)
        );
      }}
    >
      <Descriptions bordered>
        <Descriptions.Item label="行业领域">
          {performanceInfo.INDUSTRY_FIELD_NAME}
        </Descriptions.Item>
        <Descriptions.Item label="行业类型">
          {performanceInfo.INDUSTRY_CATEGORY_NAME}
        </Descriptions.Item>
        <Descriptions.Item label="资金用途">
          {performanceInfo.USE_OF_FUNDS_NAME}
        </Descriptions.Item>
        <Descriptions.Item label="一级指标名称">
          {performanceInfo.ONE_PERFORMANCE_NAME}
        </Descriptions.Item>
        <Descriptions.Item label="二级指标名称">
          {performanceInfo.TWO_PERFORMANCE_NAME}
        </Descriptions.Item>
        <Descriptions.Item label="三级指标名称">
          {performanceInfo.THREE_PERFORMANCE_NAME}
        </Descriptions.Item>
        <Descriptions.Item label="指标类型">
          {performanceInfo.PERFORMANCE_TYPE_TLDT_}
        </Descriptions.Item>
        <Descriptions.Item label="指标方向">
          {performanceInfo.PERFORMANCE_DIRECT_TLDT_}
        </Descriptions.Item>
        <Descriptions.Item label="计量单位">
          {performanceInfo.UNIT_OF_MEASUREMENT}
        </Descriptions.Item>
        <Descriptions.Item label="指标解释" span={3}>
          {performanceInfo.PERFORMANCE_MEMO}
        </Descriptions.Item>
        <Descriptions.Item label="计算公式">
          {performanceInfo.CALCULAT_FORMULA}
        </Descriptions.Item>
        <Descriptions.Item label="取值方式">
          {performanceInfo.VALUE_METHOD}
        </Descriptions.Item>
        <Descriptions.Item label="指标重要性">
          {performanceInfo.PERFORMANCE_IMPORTANT_TLDT_}
        </Descriptions.Item>
        <Descriptions.Item label="密级">
          {performanceInfo.SECURITY_LEVEL_TLDT_}
        </Descriptions.Item>
        <Descriptions.Item label="指标使用范围">
          {performanceInfo.USE_SCOPE_TLDT_}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}
export default connect(({ performanceIndicators, loading }) => ({
  performanceIndicators,
  loading,
}))(LookInfo);
