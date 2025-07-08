/**
 * @author zhangww
 * @description 新增页modal
 */
import { connect } from 'dva';
import React,{useEffect,useState} from 'react';
import _ from "lodash";
import { Button, Form, Input, InputNumber, Select, Tag, Popover } from 'antd';
import IconFont from '../../../../../Icon_manage';
import iconData from '../../../../../public/icon_manage/iconfont.json';
import { HexColorPicker, HexColorInput } from "react-colorful";
import TableModal from "../tableModal";
import './index.css'
import GlobalModal from '../../../../componments/GlobalModal';

const { Option } = Select;
const defaultHeight = 400;

function Index({ dispatch, desktopLayout, editData }) {
  const {
    isTableModalVisible,
    paramsData,
  } = desktopLayout;

  const [form] = Form.useForm();
  const [color, setColor] = useState("");

  useEffect(() => {
    form.setFieldsValue({
      columnName: editData && editData.deskSectionName,
      columnIcon: editData && editData.deskSectionIcon,
      columnColor: editData && editData.deskSectionColor,
      columnType: editData && editData.sectionPresent,
      columnHeight: editData && editData.deskSectionHigh,
    });
    editData && setColor(editData.deskSectionColor)
    dispatch({
      type: 'desktopLayout/updateStates',
      payload: {
        paramsData: editData && JSON.parse(editData.sectionChildJson) || [],
      },
    });
  }, [editData]);

  function onHideModal() {
    dispatch({
      type: 'desktopLayout/updateStates',
      payload: {
        columnName: '',
        columnUrl: '',
        isAddTextModalVisible: false
      }
    })
  }

  const onFinish = (values) => {
    // columnType   columnZi  color
    const { columnName, columnIcon, columnHeight, columnType, columnZi } = values;

    let payload = {
      deskSectionName: columnName,
      sectionType: 2,
      deskSectionHigh: columnHeight || defaultHeight,
      deskSectionIcon: columnIcon,
      deskSectionColor: color,
      sectionChildJson: JSON.stringify(paramsData),
      sectionPresent: columnType || 1,
    }

    if (editData?.id) {
      payload.id = editData?.id
      dispatch({
        type: 'desktopLayout/updateColumn',
        payload,
        callback: ()=>{
          dispatch({
            type: 'desktopLayout/getColumnList',
            payload: {
              start: 1,
              limit: 100,
            },
          });
          onHideModal();
        }
      })
    } else {
      dispatch({
        type: 'desktopLayout/addColumn',
        payload,
        callback: ()=>{
          onHideModal()
          window.location.reload();
        }
      })
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const content = (
    <>
      <Button onClick={()=>setColor('')} style={{marginBottom: 5}}>跟随主题色</Button>
      <HexColorPicker color={color} onChange={setColor} />
      <HexColorInput className='colorinput' color={color} onChange={setColor} prefixed={true} />
    </>
  );

  return (
    <GlobalModal
      title={editData?.id ? "编辑文字栏目" : "新增文字栏目" }   
      open={true}
      onCancel={onHideModal}
      widthType={1}
      incomingWidth={500}
      incomingHeight={300}
      mask={false}
      maskClosable={false}
      getContainer={() => {
        return document.getElementById('desktop_wrapper') || false;
      }}
      footer={[
        <Button onClick={() => {
          onHideModal()
        }}>取消</Button>,
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: 100, height: 28 }}
          onClick={() => {
            form.submit();
          }}
        >
          确认
        </Button>,
      ]}
    >
      <Form
        name="basic"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          colon="false"
          label="栏目名称"
          name="columnName"
          rules={[
            {
              required: true,
              message: `请输入栏目名称`,
            },
            {
              pattern: /^[^\s]*$/,
              message: '禁止输入空格',
            },
          ]}
        >
          <Input placeholder="栏目名称" />
        </Form.Item>
        <Form.Item label="栏目图标" name="columnIcon">
          <Select
            // style={{ width: 160 }}
            // onChange={onChangeIcon}
            showSearch
            allowClear
          >
            {iconData.glyphs.map((item, index) => {
              return (
                <Option key={item + index} value={item.font_class}>
                  {<IconFont type={`icon-${item.font_class}`} />}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        {/* <Form.Item
          colon="false"
          label="栏目高度"
          name="columnHeight"
        >
          <InputNumber  min={0} max={1000} defaultValue={defaultHeight}/>
        </Form.Item> */}
        {/* <Form.Item
          label="栏目颜色"
          name="columnColor"
        >
          <>
          <Popover content={content} title="选择颜色">
            <Tag color={color}>{color || '跟随主题色'}</Tag>
          </Popover>
          </>
        </Form.Item> */}
        <Form.Item
          label="子栏目"
          name="columnZi"
        >
          <Input
            allowClear
            placeholder="可视化编辑JSON"
            // onChange={handleClear}
            onClick={() =>
              dispatch({
                type: `desktopLayout/updateStates`,
                payload: {
                  isTableModalVisible: true,
                },
              })
            }
          />
        </Form.Item>
        <Form.Item
          label="展示形式"
          name="columnType"
        >
          <Select
            defaultValue={1}
            options={[
              {
                value: 1,
                label: '文字模式',
              },
              {
                value: 2,
                label: '图文模式',
              }
            ]}
          />
        </Form.Item>
      </Form>
      {isTableModalVisible && <TableModal />}
    </GlobalModal>
  );
}

export default connect(({
  desktopLayout,
}) => ({
  desktopLayout,
}))(Index);