import React,{useState} from 'react';
import {Modal,message} from 'antd'
import {attrProperty} from './../../../util/util'

const CodeViewXml = ({modeler},ref)=>{
    const [xml, setXml] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
  
    React.useImperativeHandle(ref, () => ({
        // 构造ref的获取数据方法
        showModal: async () => {
              setIsModalVisible(true);
              const element = modeler.get('elementRegistry')
                    // 网关处理
                    attrProperty(element,'bpmn:ExclusiveGateway','eq')
                    attrProperty(element,'bpmn:InclusiveGateway','contains')
              let result = await modeler.saveXML({ format: true });
              const { xml } = result;
              setXml(xml);
            },
      }));
  
    const handleCancel = () => {
      setIsModalVisible(false);
    };
  
    const handleCopy = () => {
      if (navigator) {
        navigator.clipboard
          .writeText(xml)
          .then((r) => message.info('已复制到剪贴板'))
          .catch(err=>console.log(err,"err"));
      }
    };

    return (
        <>
        <Modal
            width={1000}
            bodyStyle={{ maxHeight: '40%' }}
            title="正在预览"
            visible={isModalVisible}
            okText={'复制'}
            cancelText={'关闭'}
            onOk={handleCopy}
            onCancel={handleCancel}
        >
            {/* todo 此处可以设置字符串过长时显示 展开、收缩 按钮，以便查看 */}
            <div style={{ maxHeight: 370, overflowY: 'scroll' }}>
            <pre>{xml}</pre>
            </div>
        </Modal>
      </>
    )
}
export default React.forwardRef(CodeViewXml)