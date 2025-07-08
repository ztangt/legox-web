import React, {Component} from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import { Checkbox } from 'antd';

import arrayMove from 'array-move';
import { connect } from 'dva';
import { UnorderedListOutlined } from '@ant-design/icons'
import styles from './index.less'
const SortableItem = SortableElement(({value,flag,key,onChange,isCheck,checked}) => <li className={styles.sort_li}><UnorderedListOutlined />{isCheck&&<Checkbox onChange={(e)=>{onChange(flag,e)}} checked={checked}/>}{value}</li>);

const SortableList = SortableContainer(({items,onChange,isCheck}) => {
  return (
    <ul>
      {items.map((item, index) => (
        <SortableItem key={item.columnCode} index={index} value={item.columnName} onChange={onChange} isCheck={isCheck} flag={index} checked={item.checked}/>
      ))}
    </ul>
  );
});

class SortableComponent extends Component {

  onSortEnd = ({oldIndex, newIndex}) => {
    const { dispatch,tableColumns,sortList, formKey} = this.props

    dispatch({
        type: 'dataDriven/updateStates',
        payload: {
            sortList: arrayMove(sortList, oldIndex, newIndex),
            formKey: formKey+1,

        }
    })
  };

  onChange = (index,e) => {
      const { dispatch,sortList,formKey,dataDrive } = this.props
      sortList[index]['checked'] =  e.target.checked

    dispatch({
        type: 'dataDriven/updateStates',
        payload: {
            dataDrive,
            sortList,
            formKey: formKey+1,
        }
    })

  };
  render() {
    const {tableColumns,sortList} = this.props

    return <SortableList items={sortList} onSortEnd={this.onSortEnd} onChange={this.onChange} isCheck/>;
  }
}
export default connect(({dataDriven})=>({
    ...dataDriven
}))(SortableComponent);