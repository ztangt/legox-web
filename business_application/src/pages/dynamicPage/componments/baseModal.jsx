import { connect } from 'dva';
import { useEffect, useMemo } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Radio,
  Button,
  Row,
  Cascader
} from 'antd';
import Upload from './upload';
import GlobalModal from '../../../componments/GlobalModal';
import CopyBtn from '../../../componments/CopyBtn';
import moment from 'moment';
const { Group: CheckboxGroup } = Checkbox;
const { Group: RadioGroup } = Radio;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const componentMap = {
  Input,
  Select,
  DatePicker,
  RangePicker,
  TextArea,
  CheckboxGroup,
  RadioGroup,
  Upload,
  Cascader
};

function baseModal({
  location,
  isModalOpen,
  setIsModalOpen,
  title = '提示',
  width = 550,
  height = 300,
  onOk,
  onCancel,
  renderFooterList,
  renderChildList,
  miniName
}) {
  const listId = location?.query?.listId || 0;
  const bizSolId = location?.query?.bizSolId || 0;
  const formModelingName = `formModeling${bizSolId}${listId}`;
  const [form] = Form.useForm();

  const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

  useEffect(() => {
    if (miniName) {
      window.localStorage.setItem('miniName', miniName)
    }
  }, [miniName]);

  function resetMiniName() {
    window.localStorage.setItem('miniName', '')
  }
  const handleCancel = () => {
    resetMiniName();
    onCancel && onCancel();
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    // resetMiniName();
    onOk && onOk(values);
    setIsModalOpen(false);
  };

  const onValuesChange = (changedValues, allValues) => {
    console.log('onValuesChange:', changedValues, allValues);
  };

  const renderChild = useMemo(() => {
    if (renderChildList && renderChildList.length > 0) {
      return renderChildList.reduce((pre, cur) => {
        const Component = componentMap[cur.componentName];
        let props = cur.componentProps
        if(cur.componentName=='RangePicker'){
          props = {
            ...cur.componentProps,
            showTime:{
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
            }
          }
        }
        pre.push(
          <Form.Item
            label={cur.label}
            name={cur.key}
            rules={
              cur.formRules && cur.formRules.length > 0 ? cur.formRules : []
            }
          >
            {
              cur.componentName === 'CopyBtn' ?<CopyBtn {...cur.componentProps} /> :
                cur.componentName === 'Button' ?<Button {...cur.componentProps} >{cur.componentProps?.text||cur.label}</Button> :
                  <Component {...props} location={location}/>
            }
          </Form.Item>,
        );
        return pre;
      }, []);
    } else {
      return null;
    }
  }, [renderChildList]);

  const renderFooter = useMemo(() => {
    if (renderFooterList && renderFooterList.length > 0) {
      return renderFooterList.reduce((pre, cur, index) => {
        let btn = '';
        if (cur.key === 'submit') {
          // let btnEvent = () => {
          //   cur.onClick && cur.onClick(form.getFieldsValue());
          //   onFinish(form.getFieldsValue());
          // };
          btn = (
            <Button
              key={index}
              // onClick={btnEvent}
              onClick={()=>{form.submit()}}
              htmlType="submit"
              {...cur.btnProps}
              // style={{ marginRight: 10 }}
            >
              {cur.label}
            </Button>
          );
        }

        if (cur.key === 'cancel') {
          let btnEvent = () => {
            cur.onClick && cur.onClick();
            handleCancel();
          };
          btn = (
            <Button
              key={index}
              onClick={btnEvent}
              // style={{ marginRight: 10 }}
              {...cur.btnProps}
            >
              {cur.label}
            </Button>
          );
        }
        if (cur.key != 'cancel' && cur.key != 'submit') {
          btn = (
            <Button
              key={index}
              onClick={cur.onClick}
              // style={{ marginRight: 10 }}
              {...cur.btnProps}
            >
              {cur.label}
            </Button>
          );
        }
        pre.push(btn);
        return pre;
      }, []);
    } else {
      return null;
    }
  }, [renderFooterList]);

  return (
    <GlobalModal
      title={title}
      visible={isModalOpen}
      // width={width}
      widthType={1}
      incomingWidth={width}
      // bodyStyle={{ height: `${height}px` }}
      incomingHeight={height}
      onCancel={handleCancel}
      maskClosable={false}
      mask={false}
      footer={
        [
          renderFooter?renderFooter.map((item) => {
          return item;}):
          <> <Button type='cancel' onClick={handleCancel}>取消</Button>
            <Button type="primary" htmlType="submit" onClick={()=>form.submit()}>确定</Button>
          </>
        ]
      }
      getContainer={() => {
        return document.getElementById(formModelingName) || false;
      }}
    >
      <div style={{ position: 'relative', height: '100%' }}>
        <Form
          initialValues={{}}
          form={form}
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 20,
          }}
          onValuesChange={onValuesChange}
          onFinish={onFinish}
          autoComplete="off"
        >
          {renderChild}

          {/* {renderFooter ? (
            <Row
              style={{
                width: '100%',
                position: 'absolute',
                bottom: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {renderFooter.map((item) => {
                console.log(item,'item');
                return item;
              })}
            </Row>
          ) : (
            <Row
              style={{
                width: '100%',
                position: 'absolute',
                bottom: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button onClick={handleCancel} style={{ marginLeft: 10 }}>
                取消
              </Button>
            </Row>
          )} */}
        </Form>
      </div>
    </GlobalModal>
  );
}

export default connect(({ dynamicPage }) => ({
  dynamicPage,
}))(baseModal);
