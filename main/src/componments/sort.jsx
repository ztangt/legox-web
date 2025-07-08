// 单位 部门  用户 岗位 排序
import React, { useState,Component} from 'react';
import { Input,Button,message,Modal,Table,Dropdown,Menu,Form} from 'antd';
const EditableContext = React.createContext(null); 
class EditableRow extends Component {
  returnForm = React.createRef();
  render() {
    return (
      <Form ref={this.returnForm} component={false}>
        <EditableContext.Provider value={this.returnForm}>
          <tr {...this.props} />
        </EditableContext.Provider>
      </Form>
    );
  }
}

class EditableCell extends Component {
  state = {
      editing: false
  };

  toggleEdit = (e) => {
      e.stopPropagation();
      const editing = !this.state.editing;
      this.setState({ editing }, () => {
          if (editing) {
              this.input.focus();
          }
      });
  };

  save = (e) => {
      e.stopPropagation();
      const { record, handleSave } = this.props;
      let values = this.form.current.getFieldsValue();
      var reg = /^[1-9]\d{0,8}(\.\d{0,6})?$/;
      if(reg.test(values.sort)){
        this.toggleEdit(e);
        handleSave({ ...record, ...values });
      }
  };

  renderCell = (form) => {
      this.form = form;
      const { children, dataIndex, record, title } = this.props;
      const { editing } = this.state;
      let formParams = {
          one: {
          name: dataIndex,
          rules: [
            {
              pattern:  /^\d{1,9}$|^\d{1,9}[.]\d{1,6}$/ ,
              message: '最大支持9位整数，6位小数'
            },
          ],
          initialValue: record[dataIndex]
          }
    };
    return editing ? (
      <Form.Item {...formParams.one} style={{ margin: 0 }}>
        <Input
          ref={(node) => (this.input = node)}
          onPressEnter={this.save}
          onBlur={this.save}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}
export const components = {
  body: {
    row: EditableRow,
    cell: EditableCell
  }
};